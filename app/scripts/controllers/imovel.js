/**
 * Created by egmfilho on 18/01/17.
 */

'use strict';

angular.module('alabama.controllers')
	.controller('ImovelCtrl', ImovelCtrl);

ImovelCtrl.$inject = [ '$rootScope', '$scope', '$location', '$window', '$http', '$timeout', 'Immobile', 'Lightbox', 'SearchFilters', 'MapTheme', 'URLS'];

function ImovelCtrl($rootScope, $scope, $location, $window, $http, $timeout, Immobile, Lightbox, SearchFilters, MapTheme, URLS) {

	var self = this;

	this.related = [ ];
	this.enviando = false;

	self.interest = {
		immobile_id: null,
		immobile_code: null,
		immobile_name: null,
		nome: null,
		telefone: null,
		email: null,
		mensagem: null
	};

	self.map = {
		center: { latitude: 0, longitude: 0 },
		zoom: 14,
		options: {
			clickableIcons: false,
			maxZoom: 20,
			styles: MapTheme.styles
		},
		marker: { 
			coords: { latitude: 0, longitude: 0 },
			options: {
				icon: '../images/marker.png',
				click: function() {
					self.map.window.show = !self.map.window.show;
				}
			}
		},
		window: {
			options: {
				show: false,
			},
			closeClick: function() {
				self.map.window.show = false;
			}
		},
		streetView: {
			coords: { },
			radius: 50,
			ctrl: { },
			options: {
				addressControl: true,                
				linksControl: true,
				zoomControl: true
			},
			forceDraw: function() {
				$timeout(function() {
					google.maps.event.trigger(self.map.streetView.ctrl.getGPano(), 'resize');
				}, 500);
			}
		}
	};

	$scope.$on('$viewContentLoaded', function () {
		$timeout(function() {
			$scope.$broadcast('updateFilters', SearchFilters.get());
		}, 200);

		if ($window.innerWidth < 768)
			$timeout(function() { $scope.$broadcast('minimizeSearchbar', null); }, 500);

		self.currentSlide = 0;

		self.isXS = $window.innerWidth < 768;

		$scope.immobile = new Immobile();
		if ($location.search()['codigo']) {
			$rootScope.loading.load();
			$scope.immobile.get($location.search()['codigo']).then(function(success) {
				self.map.marker.coords.latitude = $scope.immobile.immobile_latitude;
				self.map.marker.coords.longitude = $scope.immobile.immobile_longitude;
				self.map.center = { latitude: self.map.marker.coords.latitude, longitude: self.map.marker.coords.longitude };
				self.map.streetView.coords = { latitude: parseFloat($scope.immobile.immobile_latitude).toFixed(7), longitude: parseFloat($scope.immobile.immobile_longitude).toFixed(7) };
				console.log(self.map.streetView.coords);
				
				self.related = $scope.immobile.getRelated().map(function(n) {
					return n.convertToCardInfo();
				});
				
				self.interest.immobile_id = $scope.immobile.immobile_id;
				self.interest.immobile_code = $scope.immobile.immobile_code;
				self.interest.immobile_name = $scope.immobile.immobile_name;
				self.interest.mensagem = 'Tenho interesse no imóvel (' + $scope.immobile.immobile_code + ') ' + $scope.immobile.immobile_name + ' em ' + $scope.immobile.address.district.city.city_name;
				$rootScope.loading.unload();

				self.ready = true;
			});
		}
	});

	$scope.openLightbox = function(index) {
		self.currentSlide = index || 0;

		var images = [];
		angular.forEach($scope.immobile.gallery, function(item) {
			images.push({
				url: item.url,
				label: item.gallery_image_title + ' ' + item.gallery_image_text
			});
		});
		Lightbox.openModal(images, self.currentSlide || 0);
	};

	this.responsive1 = [
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 3
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 3
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2
			}
		}
		// You can unslick at a given breakpoint now by adding:
		// settings: "unslick"
		// instead of a settings object
	];

	this.responsive2 = [
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 7
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 5
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 3
			}
		}
		// You can unslick at a given breakpoint now by adding:
		// settings: "unslick"
		// instead of a settings object
	];

	$scope.submitForm = function() {
		$timeout(function() { this.enviando = true; });
		$http({
			url: URLS.root + 'api/mail.php?action=interest',
			method: 'POST',
			data: self.interest
		}).then(function(success) {
			$timeout(function() { this.enviando = false; });
			self.modal = {
				title: 'Sucesso',
				message: 'Sua mensagem foi enviada! Entraremos em contato assim que possível.'
			};
			jQuery('.modal.fade').modal('show');
		}, function(error) {
			$timeout(function() { this.enviando = false; });
			self.modal = {
				title: 'Erro',
				message: 'Infelizmente não foi possível enviar sua mensagem. Tente novamente mais tarde.'
			};
			jQuery('.modal.fade').modal('show');
		});
	};

	$scope.carouselPrev = function() {
		jQuery('#immobile-pictures-xs').carousel('prev');
	};

	$scope.carouselNext = function() {
		jQuery('#immobile-pictures-xs').carousel('next');
	};

	$scope.$on('search', function(event, filters) {
		var temp = angular.extend({}, filters, {
			order: filters.order ? filters.order.column + '-' + filters.order.order : '3-1'
		});

		SearchFilters.set(filters);

		$location.path('/imoveis').search(temp);
	});
}
