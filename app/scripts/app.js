'use strict';
var app = angular.module('vietteltv', [
    'ngSanitize',
    'caph.ui',
    'ui.router',
    'ngResource',
    'caph.media',
    'http-auth-interceptor',
    'toaster',
    'LocalStorageModule'
]).config(['focusControllerProvider', function(focusControllerProvider) {
    focusControllerProvider.setInitialDepth(1);
    focusControllerProvider.setInitialGroupOfDepth(3, 'SIDEBAR_CATEGORY');
}]);

app.value('SETTINGS', {
    guest_access_token: '00536aefb1f78bca51f8b3fde6f643c5',
    access_token: '00536aefb1f78bca51f8b3fde6f643c5',
    refresh_token_expiration_date: '',
    expiration_date: '',
    login_access_token: '',
    token_secret: '',
    client_id: 'viettelSdpClient2',
    app_secret: 'viettelSdpUserprofile1'
});

app.run(['SETTINGS', 'localStorageService', 'Auth', '$rootScope',


    function(SETTINGS, localStorageService, Auth, $rootScope) {
        localStorageService.clearAll();
        Auth.authorize(true, function() {
            console.log("authorize finish ......");
            if (localStorageService.get('token')) { //already login
                var token = localStorageService.get('token')
                console.log("access_token 12343453", localStorageService.get('token'));
                SETTINGS.access_token = token.access_token;
                SETTINGS.token_secret = token.token_secret;
                SETTINGS.login_access_token = token.login_access_token;
                SETTINGS.refresh_token = token.refresh_token;
                SETTINGS.expiration_date = token.expiration_date;
                SETTINGS.refresh_token_expiration_date = token.refresh_token_expiration_date;
                $rootScope.isAppLoadedAfterLogin = true;
            } else {
                SETTINGS.access_token = '00536aefb1f78bca51f8b3fde6f643c5';
                SETTINGS.token_secret = '';
                $rootScope.isAppLoadedAfterLogin = false;
            }
        });



        //get fingerprint for the device
        if (!localStorageService.get('deviceUdid')) {
            new Fingerprint2().get(function(result, components) {
                localStorageService.set('deviceUdid', result);
                console.log(result); //a hash, representing your device fingerprint
                console.log(components); // an array of FP components
            });
        }



    }
]);

app.config(function($httpProvider) {

    $httpProvider.interceptors.push(function($q, $timeout, $injector) {
        return {
            'response': function(response) {

                // same as above
                if (response === null || response.data === null) { //connection reset
                    console.error('http error response interceptors start ... status = 0');
                    return $timeout(function() {
                        var $http = $injector.get('$http');
                        return $http(response.config);
                    }, 5000);
                } else {
                    // console.info('http response interceptors no error ...');
                    return response;
                }

            }
        };
    });

    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push('tokenExpiredInterceptor');
});


//global variable
var isLoginOK = false;
var removeKeyboardListenerFunc;

// /**
//  * Handle input from remote
//  */
// function registerKeyHandler() {
//     document.addEventListener('keydown', function(e) {
//         switch (e.keyCode) {
//             //key 0
//             case 48:
//                 break;
//                 //key 1
//             case 427:
//                 break;
//             case 428: //key 2
//             case 65385:
//                 document.getElementById('username').blur();
//                 document.getElementById('password').blur();
//                 break;
//             case 65376:
//                 document.getElementById('username').blur();
//                 document.getElementById('password').blur();

//                 break;
//                 //key return
//             case 10009:
//                 //make sure we don't exit the application with IME shown!
//                 // tizen.application.getCurrentApplication().exit();
//                 break;
//         }
//     });
// }

// /**
//  * Register keys used in this application
//  */
// function registerKeys() {
//     var usedKeys = ['0', 'ChannelUp', 'ChannelDown'];

//     usedKeys.forEach(
//         function(keyName) {
//             tizen.tvinputdevice.registerKey(keyName);
//         }
//     );
// }

// $(document).ready(function() {
//     if (window.tizen === undefined) {
//         console.log('This application needs to be run on Tizen device');
//         return;
//     }

//     registerKeys();
//     registerKeyHandler();

//     $("#username").bind("focus", function(e) {
//         console.log("The INPUT element is focused and ready to get user’s input");
//     });

//     $("#password").bind("focus", function(e) {
//         console.log("The INPUT element is focused and ready to get user’s input");
//     });

//     // $("#playerPanel").hide();

// });