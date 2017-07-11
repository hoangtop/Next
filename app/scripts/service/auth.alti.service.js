(function() {
    'use strict';

    app.factory('AuthServerProvider', AuthServerProvider);

    AuthServerProvider.$inject = ['$http', 'localStorageService', '$q', 'SETTINGS', 'CONSTANT'];

    function AuthServerProvider($http, localStorageService, $q, SETTINGS, CONSTANT) {
        var service = {
            getToken: getToken,
            hasValidToken: hasValidToken,
            login: login,
            logout: logout,
            renewToken: renewToken
        };

        return service;

        function renewToken() {
            console.log("renewToken .... abc");
            var token = localStorageService.get('token');
            var param = {
                "refresh_token": token.refresh_token,
                "client_id": SETTINGS.client_id,
                "hash": CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(token.refresh_token + SETTINGS.client_id, SETTINGS.app_secret))
            };
            var requestUrl = CONSTANT.API_HOST + '/ott/accounts/delegation';

            $http.defaults.headers.post["Content-Type"] = "application/json";
            var def = $q.defer();
            $http.post(
                    requestUrl,
                    param)
                .then(function(response) {
                    console.log("renew token response..");
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
                        logout();
                    }

                    def.resolve(response);

                }, function() {
                    def.reject("Failed to get renewToken");
                });

            return def.promise;

        };

        function getToken() {
            return localStorageService.get('accessToken');
        }

        function hasValidToken() {
            var token = this.getToken();
            return token && token.expires && token.expires > new Date().getTime();
        }

        function login(credentials) {

            var requestObj = {};

            requestObj.client_id = SETTINGS.client_id;
            requestObj.id = credentials.username;
            requestObj.password = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(requestObj.id + credentials.password, credentials.password));

            var deviceObject = {};

            if (!localStorageService.get('deviceUdid')) {
                new Fingerprint2().get(function(result, components) {
                    localStorageService.set('deviceUdid', result);
                    console.log(result); //a hash, representing your device fingerprint
                    console.log(components); // an array of FP components
                    deviceObject.id = localStorageService.get('deviceUdid');
                    deviceObject.model = 'SMARTTV';
                    deviceObject.model_no = 'SMARTTV';
                    deviceObject.type = 'others';

                    requestObj.device = deviceObject;
                    var url = CONSTANT.API_HOST + '/ott/accounts/login';

                    return $http.post(url, requestObj, {
                        headers: {
                            "Accept": "application/json"
                        }
                    }).then(authenticateSuccess, function(error) {
                        return error;
                    });
                });
            } else {
                deviceObject.id = localStorageService.get('deviceUdid');
                deviceObject.model = 'SMARTTV';
                deviceObject.model_no = 'SMARTTV';
                deviceObject.type = 'others';

                requestObj.device = deviceObject;
                var url = CONSTANT.API_HOST + '/ott/accounts/login';

                return $http.post(url, requestObj, {
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(authenticateSuccess, function(error) {
                    return error;
                });
            }





            function authenticateSuccess(response) {
                console.log('authenticateSuccess', response);
                if (response.data.error) {
                    var def = $q.defer();
                    def.reject('Loi Dang nhap');
                } else {
                    var token = {
                        'access_token': response.data.access_token,
                        'token_secret': response.data.token_secret,
                        'login_access_token': response.data.access_token,
                        'refresh_token': response.data.refresh_token,
                        'expiration_date': response.data.expiration_date,
                        'refresh_token_expiration_date': response.data.refresh_token_expiration_date,
                        'temp_password': response.data.temp_password
                    };
                    console.log("authenticate success token ....", token);

                    localStorageService.set('token', token);
                }

                return response;
            }

        }


        function logout() {
            localStorageService.clearAll();
        }
    }
})();