'use strict';

app
    .factory('authInterceptor', function($rootScope, $q, $location, $injector, localStorageService, SETTINGS, CONSTANT) {
        var inFlightAuthRequest = null;
        var count = 0;

        function dateFromISO8601(isostr) {
            var parts = isostr.match(/\d+/g);
            return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
        }

        return {
            // Add authorization token to headers
            request: function(config) {
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


            responseError: function(response) {
                console.log("responseError with guest token .................................................", response);
                // token has expired
                if (response.status === 401 && (response.data.error.code == 'C0202')) {
                    console.error("responseError becuase of token expired..............................................", response);
                    var deferred = $q.defer();
                    if (!inFlightAuthRequest) {
                        var Auth = $injector.get('Auth');
                        inFlightAuthRequest = Auth.renewToken();
                    }

                    // if (count > 8) {
                    //     return $q.reject('');
                    // }
                    //  authService.loginConfirmed();   
                    inFlightAuthRequest.then(
                        function success(r) {
                            inFlightAuthRequest = null;

                            $injector.get("$http")(response.config).then(function(resp) {
                                deferred.resolve(resp);
                            }, function(resp) {
                                deferred.reject();
                            });

                        },
                        function error(response) {
                            inflightAuthRequest = null;
                            deferred.reject();
                            return;
                        });
                    return deferred.promise;
                }
                return response || $q.when(response);
            }
        };
    });


app
    .factory('tokenExpiredInterceptor', function($rootScope, $q, $location, $injector, localStorageService, SETTINGS, CONSTANT) {
        var inFlightAuthRequest = null;
        var count = 0;

        function dateFromISO8601(isostr) {
            var parts = isostr.match(/\d+/g);
            return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
        }

        return {
            // Add authorization token to headers

            requestError: function(reject) {
                console.error(" requestError token::::: ", reject);
                console.info(" renew token");
                var Auth = $injector.get('Auth');
                count++;
                console.info(" renew count: " + count);
                if (count > 8) {
                    return $q.reject('');
                }

                var token = localStorageService.get('token');
                var param = {
                    "refresh_token": token.refresh_token,
                    "client_id": SETTINGS.client_id,
                    "hash": CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(token.refresh_token + SETTINGS.client_id, SETTINGS.app_secret))
                };
                var requestUrl = CONSTANT.API_HOST + '/ott/accounts/delegation';
                console.error(" param token::::: ", param);
                console.error(" $http token::::: ", $injector.get("$http"));

                $injector.get("$http").post(
                        requestUrl, {
                            data: param,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    .then(function(response) {
                        console.log("renew token response..", response);
                        console.log(response);
                        if (typeof response.access_token !== "undefined" && typeof response.expiration_date !== "undefined" && typeof response.refresh_token !== "undefined" && typeof response.refresh_token_expiration_date !== "undefined") {
                            var token = {
                                'access_token': response.access_token,
                                'token_secret': response.token_secret,
                                'login_access_token': response.access_token,
                                'refresh_token': response.refresh_token,
                                'expiration_date': response.expiration_date,
                                'refresh_token_expiration_date': response.refresh_token_expiration_date,
                                'temp_password': response.temp_password
                            };
                            console.log("renew token OK ....", token);

                            localStorageService.set('token', token);
                        } else {
                            console.error("Lỗi trong qua trình xác renew token");
                            // logout();
                        }

                        // def.resolve(response);

                    }, function(response) {
                        console.error("renew token error.ddddddddddđ.", response);
                        // def.reject("Failed to get renewToken");
                    });

                // Auth.renewToken().then(
                //     function success(response) {
                //         token = localStorageService.get('token');
                //         console.info(" renew token ok::::: ", token);
                //         config.headers.Authorization = "Bearer " + token.access_token;

                //         $injector.get("$http")(reject.config).then(function(resp) {
                //             deferred.resolve(resp);
                //         }, function(resp) {
                //             deferred.reject();
                //         });

                //         deferred.resolve(config);
                //     },
                //     function error(response) {
                //         console.error("error when renew token", response);
                //         deferred.reject();
                //     });
                // config.headers['x-auth-token'] = SETTINGS.guest_access_token;



            }
        };
    });