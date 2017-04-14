(function() {
    'use strict';

    angular
        .module('vietteltv')
        .factory('Account', Account);

    // Account.$inject = ['$resource'];

    function Account() {
        var service = {
            getAccount: getAccount
        }

        return service;

        function getAccount() {
            return '';
        }

    }
})();