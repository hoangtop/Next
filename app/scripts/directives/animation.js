app.directive('animateOnChange', function($timeout) {
    return function(scope, element, attr) {
        scope.$watch(attr.animateOnChange, function(nv, ov) {
            if (nv != ov) {
                // console.log('change ....');

                // if (scope.currentDepthZone !== scope.DEPTH_ZONE.INDEX.SPOTLIGHT) {
                element.addClass('changed');
                $timeout(function() {
                    element.removeClass('changed');
                }, 0); // Could be enhanced to take duration as a parameter
                // }

            }
        });
    };
});


var imgChangeTimer;
app.directive('imgChange', function($timeout) {
    return function(scope, element, attr) {
        scope.$watch(attr.imgChange, function(nv, ov) {
            if (nv != ov) {
                imgChangeTimer = $timeout(function() {
                    // console.log('imgChange ....', nv, ov);
                    if (!element.find('.bk-img-top').attr('src') && !element.find('.bk-img-bottom').attr('src')) {
                        element.find('.bk-img-top').attr('src', nv);
                        element.find('.bk-img-bottom').attr('src', nv);
                        return;
                    }

                    if (element.find('.bk-img-top').css('opacity') === '0') {
                        element.find('.bk-img-top').attr('src', nv);
                        element.find(".bk-img-top").removeClass("transparent");

                    } else {
                        element.find('.bk-img-bottom').attr('src', nv);
                        element.find(".bk-img-top").addClass("transparent");

                    }

                }, 0); // Could be enhanced to take duration as a parameter

            } else {
                return;
            }
        });
    };
});

app.directive('fadeIn', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element, attrs) {
            $element.addClass("ng-hide-remove");
            $element.removeClass("ng-hide-add");
            $element.on('load', function() {
                console.log('lpad ....');
                $element.removeClass("ng-hide-remove");
                $element.addClass("ng-hide-add");
            });
        }
    };
})


// Directive that tracks playback progress. Usage in the player:
// <track-progress-bar
//   cur-val='{{playPosition}}'
//   max-val='{{playDuration}}'></track-progress-bar>
// adapted from http://codepen.io/marknalepka/pen/Ewzxc
app.directive('trackProgressBar', [function() {

    return {
        restrict: 'E', // element
        scope: {
            curVal: '@', // bound to 'cur-val' attribute, playback progress
            maxVal: '@' // bound to 'max-val' attribute, track duration
        },
        template: '<div class="progress-bar-bkgd"><div class="progress-bar-marker"></div></div>',

        link: function($scope, element, attrs) {
            // grab element references outside the update handler
            var progressBarBkgdElement = angular.element(element[0].querySelector('.progress-bar-bkgd')),
                progressBarMarkerElement = angular.element(element[0].querySelector('.progress-bar-marker'));

            // set the progress-bar-marker width when called
            function updateProgress() {
                var progress = 0,
                    currentValue = $scope.curVal,
                    maxValue = $scope.maxVal,


                    // recompute overall progress bar width inside the handler to adapt to viewport changes
                    progressBarWidth = progressBarBkgdElement.width();

                // if ($scope.maxVal) {
                // determine the current progress marker's width in pixels
                progress = Math.min(currentValue, maxValue) / maxValue * progressBarWidth;
                // }
                // set the marker's width
                progressBarMarkerElement.css('width', progress + 'px');
            }


            // updateProgress();
            // curVal changes constantly, maxVal only when a new track is loaded
            $scope.$watch('curVal', updateProgress);
            $scope.$watch('maxVal', updateProgress);
        }
    };
}]);

app.directive('videoTrackProgressBar', [function() {

    return {
        restrict: 'E', // element
        scope: {
            curVal: '@', // bound to 'cur-val' attribute, playback progress
            maxVal: '@', // bound to 'max-val' attribute, track duration,
            playPos: '@', // bound to 'cur-val' attribute, playback progress
            endPos: '@' // bound to 'max-val' attribute, track duration
        },
        template: '<div class="video-progress-bar-wrapper"><div class="play-position"></div><div class="progress-bar-bkgd video"><div class="progress-bar-marker video"></div></div><div class="end-position"></div></div>',

        link: function($scope, element, attrs) {
            // grab element references outside the update handler
            var progressBarBkgdElement = angular.element(element[0].querySelector('.progress-bar-bkgd')),
                progressBarMarkerElement = angular.element(element[0].querySelector('.progress-bar-marker')),
                playPosElement = angular.element(element[0].querySelector('.play-position')),
                endPosElement = angular.element(element[0].querySelector('.end-position'));

            // set the progress-bar-marker width when called
            function updateProgress() {
                var progress = 0,
                    currentValue = $scope.curVal,
                    maxValue = $scope.maxVal,


                    // recompute overall progress bar width inside the handler to adapt to viewport changes
                    progressBarWidth = progressBarBkgdElement.width();

                // if ($scope.maxVal) {
                // determine the current progress marker's width in pixels
                progress = Math.min(currentValue, maxValue) / maxValue * progressBarWidth;
                // }
                // set the marker's width
                progressBarMarkerElement.css('width', progress + 'px');
            }

            function updateDisplayPosition() {
                var playPos = $scope.playPos,
                    endPos = $scope.endPos;

                playPosElement.html(playPos);
                endPosElement.html(endPos);

            }

            // updateProgress();
            // curVal changes constantly, maxVal only when a new track is loaded
            $scope.$watch('curVal', updateProgress);
            $scope.$watch('maxVal', updateProgress);
            $scope.$watch('playPos', updateDisplayPosition);
            $scope.$watch('endPos', updateDisplayPosition);
        }
    };
}]);