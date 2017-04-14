(function() {
    'use strict';

    app.factory('Auth', Auth);

    Auth.$inject = ['$rootScope', 'localStorageService', '$q', 'Principal', 'AuthServerProvider', 'Account', 'LoginService'];

    function Auth($rootScope, localStorageService, $q, Principal, AuthServerProvider, Account, LoginService) {
        var service = {
            authorize: authorize,
            login: login,
            logout: logout,
            renewToken: renewToken
        };

        return service;

        function authorize(force, callback) {
            var cb = callback || angular.noop;
            var authReturn = Principal.identity(force).then(authThen);

            return authReturn;

            function authThen() {
                var isAuthenticated = Principal.isAuthenticated();
                return cb();
            }
        }

        function login(credentials, callback) {
            var cb = callback || angular.noop;
            var deferred = $q.defer();

            AuthServerProvider.login(credentials)
                .then(loginThen)
                .catch(function(err) {
                    this.logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));

            function loginThen(data) {
                Principal.identity(true).then(function(account) {
                    deferred.resolve(data);
                });
                return cb();
            }

            return deferred.promise;
        }

        function renewToken(credentials, callback) {
            console.log("renewToken auth ________________________--");
            var cb = callback || angular.noop;
            var deferred = $q.defer();

            AuthServerProvider.renewToken()
                .then(renewTokenThen)
                .catch(function(err) {
                    this.logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));

            function renewTokenThen(data) {
                deferred.resolve(data);
                return cb();
            }

            return deferred.promise;
        }

        function logout() {
            AuthServerProvider.logout();
            Principal.authenticate(null);
        }

    }
})();