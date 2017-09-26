
(function() {

	'use strict';

	angular.module('alabama.directives')
		.directive('disableRclick', ['$parse', function($parse) {

			return function (scope, elem, attrs) {
				elem.bind('contextmenu', function(event) {
					event.preventDefault();
				});
			}

		}]);

}());