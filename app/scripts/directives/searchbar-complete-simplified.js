

(function() {

	'use strict';

	angular.module('alabama.directives')
		.directive('searchbarCompleteSimplified', [function() {

			return {
				restrict: 'E',
				templateUrl: 'partials/directives/searchbar-complete-simplified.html',
				controller: 'SearchbarCompleteCtrl',
				controllerAs: 'searchbar'
			}

		}]);

}());