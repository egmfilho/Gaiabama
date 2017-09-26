

(function() {

	'use strict';

	angular.module('alabama.directives')
		.directive('searchbarComplete', [function() {

			return {
				restrict: 'E',
				templateUrl: 'partials/directives/searchbar-complete.html',
				controller: 'SearchbarCompleteCtrl',
				controllerAs: 'searchbar'
			}

		}]);

}());