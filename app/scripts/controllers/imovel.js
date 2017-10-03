/**
 * Created by egmfilho on 18/01/17.
 */

'use strict';

angular.module('alabama.controllers')
	.controller('ImovelCtrl', ImovelCtrl);

ImovelCtrl.$inject = [ '$rootScope', '$scope', '$location', '$window', '$http', '$timeout', 'Immobile', 'Lightbox', 'SearchFilters', 'URLS'];

function ImovelCtrl($rootScope, $scope, $location, $window, $http, $timeout, Immobile, Lightbox, SearchFilters, URLS) {

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
			styles: [
				{
					"featureType": "landscape",
					"elementType": "geometry",
					"stylers": [
						{
							"saturation": "-100"
						},
						{
							"lightness": "-1"
						},
						{
							"color": "#ddd4cc"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "all",
					"stylers": [
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "geometry",
					"stylers": [
						{
							"visibility": "simplified"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "labels",
					"stylers": [
						{
							"visibility": "on"
						},
						{
							"lightness": "0"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "poi.park",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#adcab2"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "labels.text",
					"stylers": [
						{
							"color": "#545454"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"saturation": "-87"
						},
						{
							"lightness": "-40"
						},
						{
							"color": "#ffffff"
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "road.highway.controlled_access",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"color": "#f0f0f0"
						},
						{
							"saturation": "-22"
						},
						{
							"lightness": "-16"
						}
					]
				},
				{
					"featureType": "road.highway.controlled_access",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "road.highway.controlled_access",
					"elementType": "labels.icon",
					"stylers": [
						{
							"visibility": "on"
						}
					]
				},
				{
					"featureType": "road.arterial",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "road.local",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"saturation": "-63"
						},
						{
							"hue": "#00e4ff"
						},
						{
							"lightness": "-10"
						}
					]
				}
			]
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
				
				self.ready = true;
				
				self.related = $scope.immobile.getRelated().map(function(n) {
					return n.convertToCardInfo();
				});
				
				self.interest.immobile_id = $scope.immobile.immobile_id;
				self.interest.immobile_code = $scope.immobile.immobile_code;
				self.interest.immobile_name = $scope.immobile.immobile_name;
				self.interest.mensagem = 'Tenho interesse no imóvel (' + $scope.immobile.immobile_code + ') ' + $scope.immobile.immobile_name + ' em ' + $scope.immobile.address.district.city.city_name;
				$rootScope.loading.unload();
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
