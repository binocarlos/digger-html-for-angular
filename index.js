/*

  we are in private scope (component.io)
  
*/

var template = require('./template');

angular
  .module('digger.html', [
    
  ])

  .directive('diggerHtml', function ($compile) {
    return {
      restrict: 'E',
      terminal: true,
      scope:{
        container:'=',
      },
      link: function (scope, element, attrs) {

        $scope.model = container.get(0);

        //var newElement = angular.element(template);
        //$compile(newElement)(scope);
        //element.replaceWith(newElement);
      }
    }
  });
