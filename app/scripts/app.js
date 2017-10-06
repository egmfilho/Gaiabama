'use strict';

angular.module('alabama.constants', [ ]);
angular.module('alabama.controllers', [ ]);
angular.module('alabama.filters', [ ]);
angular.module('alabama.directives', [ ]);
angular.module('alabama.services', [ ]);

angular.module('alabama', [
		'alabama.constants',
		'alabama.controllers',
		'alabama.filters',
		'alabama.directives',
		'alabama.services',
		'ngAnimate',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'egmfilho.inputFilters',
		'slick',
		'rzModule',
		'bootstrapLightbox',
		'uiGmapgoogle-maps'
	])
	.config(['$locationProvider', '$httpProvider', function($locationProvider, $httpProvider) {
		$httpProvider.interceptors.push('HttpInterceptor');
		$locationProvider.hashPrefix('');
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	}])
	.config(['LightboxProvider', function(LightboxProvider) {
		LightboxProvider.fullScreenMode = true;
		LightboxProvider.templateUrl = 'partials/lightbox.html';
		
		LightboxProvider.getImageUrl = function(image) {
			return image.url;
		};

		LightboxProvider.getImageCaption = function(image) {
			return image.label;
		};
	}])
	.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
		uiGmapGoogleMapApiProvider.configure({
			v: '3.26',
			libraries: 'weather, geometry, visualization'
		});
	}])
	.config(['$routeProvider', function($routeProvider) {

		var genericController = ['$rootScope', '$scope', 'ImmobileManager', function ($rootScope, $scope, ImmobileManager) {
			var self = this;
			self.array = [ { dummy: true }, { dummy: true }, { dummy: true } ];
			$rootScope.loading.load();
			ImmobileManager.loadMostVisited().then(function(success) {
				self.array = [ ];
				angular.forEach(success, function(item) {			
					self.array.push(item.convertToCardInfo());
				});
				$scope.$broadcast('update-cardCarousel');
				$rootScope.loading.unload();
			}, function(error) {
				$rootScope.loading.unload();
			});	
		}];

		$routeProvider
		.when('/', {
			name: 'Home',
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl',
			controllerAs: 'home'
		})
		.when('/sobre', {
			name: 'Sobre',
			templateUrl: 'views/sobre.html',
			controller: genericController,
			controllerAs: 'sobre'
		})
		.when('/imoveis', {
			name: 'Imóveis',
			templateUrl: 'views/imoveis.html',
			controller: 'ImoveisCtrl',
			controllerAs: 'imoveis'
		})
		.when('/imovel', {			
			templateUrl: 'views/imovel.html',
			controller: 'ImovelCtrl',
			controllerAs: 'imovel'
		})
		.when('/equipe', {
			name: 'Equipe',
			templateUrl: 'views/equipe.html',
			controller: genericController,
			controllerAs: 'equipe'
		})
		.when('/contato', {
			name: 'Contato',
			templateUrl: 'views/contato.html',
			controller: 'ContatoCtrl',
			controllerAs: 'contato'
		})
		.when('/mapa', {
			name: 'Mapa',
			templateUrl: 'views/map-search.html',
			controller: 'MapSearchCtrl',
			controllerAs: 'mapSearch'
		})
		.otherwise({
			redirectTo: '/'
		});

	}])
	.run(['$rootScope', '$location', '$window', '$timeout', function($rootScope, $location, $window, $timeout) {

		$rootScope.loading = {
			count: 0,
			isLoading: function() { return this.count > 0 },
			load: function() { this.count++; },
			unload: function() { this.count--; this.count < 0 ? this.count = 0 : null }
		};

		// Prevent scroll while loading screen is on
		jQuery('#loading').bind('touchmove mousewheel DOMMouseScroll', function(e) {
			e.preventDefault();
		});

		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			$rootScope.currentPath = $location.path();
			jQuery('.bootstrap-select.open button').dropdown('toggle');
		});

		$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
			var header = jQuery('#header');

			if (!previous || !previous.name) {
				jQuery(header).find('ul.nav li').removeClass('active');
			} else {
				jQuery(header).find('ul.nav li[name="' + previous.name + '"]').removeClass('active');
			}
			jQuery(header).find('ul.nav li[name="' + current.name + '"]').addClass('active');

			$timeout(function() {jQuery('.selectpicker').selectpicker('refresh'); });
		});

		$rootScope.startBootstrapSelect = function() {
			jQuery('select').selectpicker();
		};

		$rootScope.setCarouselInterval = function(selector, interval) {
			jQuery(selector).carousel({
				interval: interval
			});
		};

		$rootScope.getNumber = function(num) {
			return new Array(Math.max(0, Math.ceil(num)));
		};

		$window.onscroll = function() {
			$rootScope.scrollY = $window.scrollY;
			$rootScope.$apply();
		};

		$rootScope.scrollTop = function(y, delay) {
			if ($rootScope.scrollY >= 100) {
				jQuery('body').animate({ scrollTop: (y || 0) }, delay || 500);
			}
		}

	}]);