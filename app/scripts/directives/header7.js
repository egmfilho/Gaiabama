
(function() {
	
	'use strict';
	
	angular.module('alabama.directives')
	.directive('header7', ['$rootScope', function($rootScope) {
		
		function controller($scope, $filter, $timeout, $location, Filters) {
			
			var self = this;
			
			$scope.currentPath = function() {
				return $rootScope.currentPath;
			};
			
			jQuery('.header7 #carousel-showcase').carousel({
				pause: null,
				interval: 5000
			});
			
			this.toggleHeader7Mobile = function() {
				if (jQuery('.header7-mobile').css('display') == 'none') {
					this.showHeader7Mobile();
				} else {
					this.showHeader7Mobile();
				}
			};
			
			this.showHeader7Mobile = function() {
				jQuery('.header7-mobile').fadeIn(250);
			};
			
			this.hideHeader7Mobile = function() {
				jQuery('.header7-mobile').fadeOut(250);
			};
			
			jQuery('.header7-mobile').bind('touchmove mousewheel DOMMouseScroll', function(e) {
				e.preventDefault();
			});
			
			this.sliderPrice = {
				options: {
					disabled: false,
					floor: 1,
					ceil: 2000000,
					hideLimitLabels: true,
					
					customValueToPosition: function(val, minVal, maxVal) {
						val = Math.sqrt(val);
						minVal = Math.sqrt(minVal);
						maxVal = Math.sqrt(maxVal);
						var range = maxVal - minVal;
						return (val - minVal) / range;
					},
					customPositionToValue: function(percent, minVal, maxVal) {
						minVal = Math.sqrt(minVal);
						maxVal = Math.sqrt(maxVal);
						var value = percent * (maxVal - minVal) + minVal;
						return Math.pow(value, 2);
					},
					
					showTicks: false,
					translate: function(value, sliderId, label) {
						var v = $filter('currency')(value, 'R$ ', 0);
						
						switch (label) {
							default:
							return v;
						}
					}
				}
			};
			
			this.search = {
				codigo: null,
				categoria: '0',
				tipo: '0',
				cidade: '0',
				minValue: 0,
				maxValue: 0
			};
			
			this.filters = new Filters();
			this.filters.load().then(function(res) {
				
				self.search.minValue = self.search.minValue ? self.search.minValue : parseFloat(self.filters.value.min);
				self.search.maxValue = self.search.maxValue ? self.search.maxValue : parseFloat(self.filters.value.max);
				self.sliderPrice.options.floor = parseFloat(self.filters.value.min);
				self.sliderPrice.options.ceil = parseFloat(self.filters.value.max);
				
				updateFilters();
				self.isReady = true;
			});
			
			function updateFilters(value) {
				angular.extend(self.search, value);
				$timeout(function() { 
					$rootScope.startBootstrapSelect();
					jQuery('.selectpicker').selectpicker('refresh'); 
					$scope.$broadcast('reCalcViewDimensions');
				});
			}
			
			$scope.$on('update-header', function(event, value) {
				updateFilters(value);
			});

			this.redirect = function() {
				$location.path('/imoveis').search(self.search);
			};
			
		}
		
		controller.$inject = [ '$scope', '$filter', '$timeout', '$location', 'Filters' ];
		
		return {
			restrict: 'E',
			templateUrl: 'partials/directives/header7.html',
			scope: {
				navigation: '@',
				whatsapp: '@',
				tel: '@',
				email: '@',
				title: '@',
				message: '@',
				btnLabel: '@',
				btnUrl: '@'
			},
			link: function(scope, elem, attrs) {
				scope.navButtons = JSON.parse(scope.navigation);
			},
			controller: controller,
			controllerAs: 'header',
		}
		
	}]);
	
}());