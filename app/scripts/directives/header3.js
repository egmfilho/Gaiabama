
(function() {

	'use strict';

	angular.module('alabama.directives')
		.directive('header3', ['$rootScope', function($rootScope) {

			function controller($scope, $filter, $location, $timeout, ImmobileManager, SearchFilters) {

				var self = this;

				$scope.$on('search', function(event, filters) {
					var temp = angular.extend({}, filters, {
						order: filters.order ? filters.order.column + '-' + filters.order.order : '3-1'
					});
			
					SearchFilters.set(filters);
			
					$location.path('/imoveis').search(temp);
				});

				jQuery('.header3 #carousel-showcase').carousel({
					pause: null,
					interval: 5000
				});
			
				this.toggleHeader3Mobile = function() {
					if (jQuery('.header3-mobile').css('display') == 'none') {
						this.showHeader3Mobile();
					} else {
						this.showHeader3Mobile();
					}
				};
			
				this.showHeader3Mobile = function() {
					jQuery('.header3-mobile').fadeIn(250);
				};
			
				this.hideHeader3Mobile = function() {
					jQuery('.header3-mobile').fadeOut(250);
				};
			
				jQuery('.header3-mobile').bind('touchmove mousewheel DOMMouseScroll', function(e) {
					e.preventDefault();
				});
			
				this.getCurrentPath = function() {
					return $rootScope.currentPath;
				};

				(function getDestaques() {
					self.featuredList = [ ];
					ImmobileManager.loadAllFeatured().then(function(success) {
						angular.forEach(success, function(item) {
							self.featuredList.push(item.convertToCardInfo());
						});
						$timeout(function() {
							self.currentPic = self.featuredList[0].pictureLg;
							jQuery('#carousel-showcase').on('slid.bs.carousel', function(e) {
								var immobile = self.featuredList[jQuery(this).find('.active').index()];
								$timeout(function() { self.currentPic = immobile.pictureLg; });
							});
						}, 1000);
					}, function(error) {
						console.warn(error);
					});
				}());
			}

			controller.$inject = [ '$scope', '$filter', '$location', '$timeout', 'ImmobileManager', 'SearchFilters' ];

			return {
				restrict: 'E',
				templateUrl: 'partials/directives/header3.html',
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