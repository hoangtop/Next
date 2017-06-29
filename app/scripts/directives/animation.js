app.directive('animateOnChange', function($timeout) {
  return function(scope, element, attr) {
    scope.$watch(attr.animateOnChange, function(nv,ov) {
      if (nv!=ov) {
          console.log('change ....');
        element.addClass('changed');
        $timeout(function() {
          element.removeClass('changed');
        }, 0); // Could be enhanced to take duration as a parameter
      }
    });
  };
});