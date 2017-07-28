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
                if (response.data === null) { // response null load again
                    console.log(response);
                } else if (response.data.error.code === "C0201" || response.data.error.code === "C0202" || response.data.error.code === "C0203") {
                    console.error("responseError becuase of token expired..............................................", response);
                    var deferred = $q.defer();
                    if (!inFlightAuthRequest) {
                        var Auth = $injector.get('Auth');
                        inFlightAuthRequest = Auth.renewToken();
                    }


                    if (count > 4) {
                        Auth.logout();
                        return $q.reject('');
                    }

                    // count++;
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
                } else if (response.data.error.code === "U0124") {
                    // device has kicked.
                    console.error("device has kicked.");
                    Auth.logout();

                }
                return response || $q.when(response);
            }
        };
    });