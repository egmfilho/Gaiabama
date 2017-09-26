
(function() {

	'use strict';

	angular.module('alabama.directives')
		.directive('header6', ['$rootScope', function($rootScope) {

			function controller($scope, $filter) {
			
				$scope.currentPath = function() {
					return $rootScope.currentPath;
				};

				jQuery('.header6 #carousel-showcase').carousel({
					pause: null,
					interval: 5000
				});
			
				this.toggleHeader6Mobile = function() {
					if (jQuery('.header6-mobile').css('display') == 'none') {
						this.showHeader6Mobile();
					} else {
						this.showHeader6Mobile();
					}
				};
			
				this.showHeader6Mobile = function() {
					jQuery('.header6-mobile').fadeIn(250);
				};
			
				this.hideHeader6Mobile = function() {
					jQuery('.header6-mobile').fadeOut(250);
				};
			
				jQuery('.header6-mobile').bind('touchmove mousewheel DOMMouseScroll', function(e) {
					e.preventDefault();
				});
			
			}

			controller.$inject = [ '$scope', '$filter' ];

			return {
				restrict: 'E',
				templateUrl: 'partials/directives/header6.html',
				scope: {
					navigation: '@',
					whatsapp: '@',
					tel: '@',
					email: '@',
					title: '@',
					subtitle: '@',
					message: '@',
					btnLabel: '@'
				},
				link: function(scope, elem, attrs) {
					scope.navButtons = JSON.parse(scope.navigation);
				},
				controller: controller,
				controllerAs: 'header',
			}

		}]);

}());