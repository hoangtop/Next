(function() {
    'use strict';

    angular
        .module('vietteltv')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['focusController', '$timeout'];

    function LoginService(focusController, $timeout) {
        var service = {
            openLoginPage: openLoginPage,
            closeLoginPage: closeLoginPage
        };

        return service;

        function openLoginPage(callback) {
            var cb = callback || angular.noop;
            $('#login-page').addClass('login-page-show');
            $timeout(function() { //display spotlight background image
                $('#username').click();
            }, 1000);

            return cb();

        }

        function closeLoginPage(callback) {
            var cb = callback || angular.noop;
            $('#login-page').removeClass('login-page-show');

            return cb();

        }
    }
})();