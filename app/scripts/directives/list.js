'use strict';


var linkFn = function($scope, $element, $attr) {
    $scope.title = $attr.title;
    $scope.id = $attr.id * 1;
    $scope.listCategory = $attr.id * 1;
    // console.log("$scope.listCategory " + $attr.id, $scope.listCategory);


    // $scope.$watch($attr.categoryNameList, function() {
    //     console.log('change ----------------------------------------------------------------------------');
    //     if (typeof $attr.categoryNameList !== 'undefined') {
    //         var cateList = JSON.parse($attr.categoryNameList);

    //         if (cateList[$attr.id - 1]) {
    //             $scope.title = cateList[$attr.id - 1].name;
    //         }
    //     }
    // });



    $attr.focusOption ? ($scope.focusable = $scope.$eval($attr.focusOption)) : ($scope.focusable = {
        depth: 1,
        group: $attr.id
    });
};

app.directive('playList', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/playlist.html',
        scope: true,
        link: linkFn

    };
});
app.directive('categoryMenuList', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/categoryMenuList.html',
        scope: true,
        link: function($scope, $element, $attr) {
            $scope.title = $attr.title;

            $attr.focusOption ? ($scope.focusable = $scope.$eval($attr.focusOption)) : ($scope.focusable = {
                depth: 1,
                group: $attr.id
            });
        }
    };
});
app.directive('channelList', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/channelList.html',
        scope: true,
        link: linkFn
    };
});
app.directive('playListSm', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/playlistSm.html',
        scope: true,
        link: linkFn
    };
}).directive('relatedPlayList', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/relatedPlaylist.html',
        scope: true
    };
}).directive('episodePlayList', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/episodePlaylist.html',
        scope: true
    };
});