app
    .factory('authInterceptor', function ($rootScope, $q, $location, $injector, localStorageService, SETTINGS, CONSTANT,httpBuffer) {
        var inFlightAuthRequest = null;
        var loginAgainKickRequest = null;
        var renewErrorRequest = null;
        var responseNullRequest = null;
        var count = 0;

        function dateFromISO8601(isostr) {
            var parts = isostr.match(/\d+/g);
            return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
        }

        return {
            // Add authorization token to headers
            request: function (config) {
                config.headers = config.headers || {};
                var token = localStorageService.get('token');
                $rootScope.token = token;

                if (token) {
                    // console.log("token 1:", token);
                    // console.log("token 2:", token.expiration_date);
                    // console.log("token 3:", new Date(token.expiration_date));
                    // console.log("token 3iso:", dateFromISO8601(token.expiration_date));
                    // console.log("token 3:", new Date(token.expiration_date) >= new Date());
                    // console.log("config.url:", config.url.indexOf('watches\/fvod\/prepare'));
                    // config.headers.Authorization = "Bearer " + token.access_token;

                    if (config.url.indexOf('watches\/fvod\/prepare') < 0) {
                        config.headers.Authorization = "Bearer " + token.access_token;
                    }
                    // config.params.access_token = token.access_token;
                    return config;

                } else {
                    // console.log("request with guest token .................................................");
                    config.headers.Authorization = "Bearer " + SETTINGS.guest_access_token;
                    // config.params.access_token = SETTINGS.guest_access_token;
                    return config;
                }


            },


            responseError: function (response) {
                var deferred = $q.defer();
               
                console.log("responseError with guest token .................................................", response);
                var token = localStorageService.get('token');

                // token has expired
                if (response.data === null) { // response null load again
                    console.log(response);

                    var Auth = $injector.get('Auth');
                    if (!responseNullRequest) {
                        responseNullRequest = Auth.login({
                            username: token.user_id,
                            password: token.password
                        })
                    }

                    responseNullRequest.then(
                        function success(r) {
                            console.log("responseNullRequest >>>>>>>>>>>",r);
                            responseNullRequest = null;
                            httpBuffer.append(response.config, deferred);
                            // window.location.reload(false);
                            $injector.get("$http")(response.config).then(function (resp) {
                                deferred.resolve(resp);
                            }, function (resp) {
                                deferred.reject();
                            });

                        },
                        function error(r) {
                            responseNullRequest = null;
                            deferred.reject();
                            return;
                        });


                    return response || $q.when(response);
                } else if (response.data.error.code === "C0201" || response.data.error.code === "C0202" || response.data.error.code === "C0203") {
                    console.log("inFlightAuthRequest ............. ");

                    if (token !== null && token.refresh_token === null) {
                        if (!inFlightAuthRequest) {
                            var Auth = $injector.get('Auth');
                            inFlightAuthRequest = Auth.login({
                                username: token.user_id,
                                password: token.password
                            })
                        }
                    }
                    console.error("responseError becuase of token expired..............................................", response);
                    if (token !== null && token.refresh_token !== null) {
                        if (!inFlightAuthRequest) {
                            var Auth = $injector.get('Auth');
                            inFlightAuthRequest = Auth.renewToken();
                        }
                    }


                    // if (count > 4) {
                    //     Auth.logout();
                    //     return $q.reject('');
                    // }

                    // count++;
                    //  authService.loginConfirmed();   
                    inFlightAuthRequest.then(
                        function success(r) {
                            inFlightAuthRequest = null;
                            console.log("refresh otken OK    *****...............");
                            httpBuffer.append(response.config, deferred);
                            $injector.get("$http")(response.config).then(function (resp) {
                                deferred.resolve(resp);
                            }, function (resp) {
                                deferred.reject();
                            });

                        },
                        function error(r) {
                            console.error("inFlightAuthRequest errro ...");
                            if (!renewErrorRequest) {
                                var Auth = $injector.get('Auth');
                                renewErrorRequest = Auth.login({
                                    username: token.user_id,
                                    password: token.password
                                })
                            }

                            renewErrorRequest.then(
                                function success(r) {
                                    console.log("login again OKKKKK11111");
                                    renewErrorRequest = null;

                                    $injector.get("$http")(response.config).then(function (resp) {
                                        deferred.resolve(resp);
                                    }, function (resp) {
                                        deferred.reject();
                                    });

                                },
                                function error(r) {
                                    renewErrorRequest = null;
                                    deferred.reject();
                                    return;
                                });
                            return;
                        });
                    return deferred.promise;
                } else if (response.data.error.code === "U0124") {
                    // device has kicked.
                    console.error("device has kicked.11111111");

                    var Auth = $injector.get('Auth');
                    if (!loginAgainKickRequest) {
                        loginAgainKickRequest = Auth.login({
                            username: token.user_id,
                            password: token.password
                        })
                    }

                    loginAgainKickRequest.then(
                        function success(r) {
                            loginAgainKickRequest = null;
                            console.log("login again OK 222222222 nclose",r.data);
                            // window.location.reload(false);
                            // tizen.application.getCurrentApplication().exit();
                            deferred.reject();
                            httpBuffer.retryAll();
                            return;

                        },
                        function error(r) {
                            loginAgainKickRequest = null;
                            deferred.reject();
                            return;
                        });

                    return deferred.promise;

                }
                return response || $q.when(response);
            }
        };
    });