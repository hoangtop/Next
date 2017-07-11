app.directive('animateOnChange', function($timeout) {
    return function(scope, element, attr) {
        scope.$watch(attr.animateOnChange, function(nv, ov) {
            if (nv != ov) {
                console.log('change ....');

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
                // if (imgChangeTimer) {
                //     $timeout.cancel(imgChangeTimer);
                // } else {

                // }

                imgChangeTimer = $timeout(function() {
                    console.log('imgChange ....', nv, ov);
                    if (!element.find('.bk-img-top').attr('src') && !element.find('.bk-img-bottom').attr('src')) {
                        console.log('imgChange start ....', nv);
                        element.find('.bk-img-top').attr('src', nv);
                        element.find('.bk-img-bottom').attr('src', nv);
                        return;
                        // element.find(".bk-img-top").removeClass("transparent");
                    }

                    if (element.find('.bk-img-top').css('opacity') === '0') {
                        console.log('top  ....', element.find('.bk-img-top'));
                        element.find('.bk-img-top').attr('src', nv);
                        // $timeout(function() {
                        //     element.find(".bk-img-top").removeClass("transparent");
                        // }, 1000);

                        element.find(".bk-img-top").removeClass("transparent");

                    } else {
                        console.log('bottom  ....', element.find('.bk-img-bottom'));

                        element.find('.bk-img-bottom').attr('src', nv);
                        // $timeout(function() {
                        //     element.find('.bk-img-bottom').attr('src', nv);
                        //     element.find(".bk-img-top").addClass("transparent");
                        // }, 1000);

                        // element.find('.bk-img-bottom').attr('src', nv);
                        element.find(".bk-img-top").addClass("transparent");

                    }

                    // if (scope.currentDepthZone !== scope.DEPTH_ZONE.INDEX.SPOTLIGHT) {
                    // $(".vod-img-top").toggleClass("transparent");
                    // if ($('.vod-img-top').css('opacity') === '0') {
                    //     $('.vod-img-top').attr('src', nv);
                    // }
                    // }

                }, 0); // Could be enhanced to take duration as a parameter
                // }


                // $timeout(function() {
                //     $('.vod-img-top').attr('src', nv);
                // }, 2000);

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