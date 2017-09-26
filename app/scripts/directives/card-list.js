/**
 * Created by egmfilho on 16/02/17.
 */

'use strict';

angular.module('alabama.directives')
	.directive('cardList', ['$window', function($window) {

		function link(scope, element, attrs) {			
			$window.addEventListener('resize', onWindowResize);
			function onWindowResize() {
				var width = $window.innerWidth;

				// if (!scope.listHorizontal) {
				// 	scope.listHorizontal = true;
				// }

				if (scope.listHorizontal) {
					if (width < 768) {
						scope.listHorizontal = false;
					}
				} else {
					if (width >= 768) {
						scope.listHorizontal = true;
					}
				}

			}
			onWindowResize();
		}

		return {
			restrict: 'E',
			templateUrl: 'partials/directives/card-list.html',
			scope: {
				cardListArray: '=cards',
				cardListName: '@name',
				cardListHideControls: '=hideControls',
				cardListIsGrid: '&isGrid'
			},
			link: link,
			controller: ['$scope', function($scope) {
				$scope.setCardListHorizontal = function(value) {
					$scope.listHorizontal = value;
				};

				// $scope.setCardListHorizontal(!$scope.cardListIsGrid);
			}]
		}

	}]);