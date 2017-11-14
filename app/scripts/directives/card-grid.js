/**
 * Created by egmfilho on 16/02/17.
 */

'use strict';

angular.module('alabama.directives')
	.directive('cardGrid', [function() {

		return {
			restrict: 'E',
			templateUrl: 'partials/directives/card-grid.html',
			scope: {
				cardGridArray: '=cards',
				cardGridName: '@name',
				cardGridTarget: '@target'
			}
		}

	}]);