
(function() {

	'use strict';

	angular.module('alabama.controllers')
		.controller('MapSearchCtrl', MapSearchCtrl);

	MapSearchCtrl.$inject = [ '$scope', '$filter', '$location', '$window', '$timeout', 'Filters', 'ImmobileManager' ];

	function MapSearchCtrl($scope, $filter, $location, $window, $timeout, Filters, ImmobileManager) {

		var self = this,
			_isLoading = 0;

		self.map = {
			isReady: false,
			center: { latitude: -22.2864705, longitude: -42.9383006 },
			bounds: { },
			zoom: 9,
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
			control: { },
			markers: [ ],
			icon: '../images/marker.png', // vai dentro de cada marker
			window: {
				coords: { latitude: 0, longitude: 0 },
				selected: { },
				show: false,
				options: {
					pixelOffset: { width: 0, height: 0 }
				},
				closeClick: function() {
					self.map.window.show = false;
				}
			},
			events: {
				idle: function() {
					var bounds = self.map.control.getGMap().getBounds();
	
					self.cards = [ ];
					angular.forEach(self.map.markers, function(value, key) {
						if (bounds.contains({ "lat": value.latitude, "lng": value.longitude })) {
							self.cards.push(value.card);
						}
					});
				}
			},
			markerEvents: {
				click: function(marker, eventName, model, args) {
					self.map.window.selected = { 
						array: [ model.card ] 
					};
					self.map.window.coords = model;
					self.map.window.show = true;
				}
			},
			clusterEvents: {
				click: function(cluster, clusterModels) {
					if (self.map.control.getGMap().getZoom() >= 20) {
						var coords = cluster.getCenter().toJSON();

						self.map.window.selected = {
							array: clusterModels.map(function(n) { return n.card })
						};
						self.map.window.coords =  { latitude: coords.lat, longitude: coords.lng };
						self.map.window.show = true;
					}
				}
			}
		};

		this.isLoading = function() {
			return _isLoading > 0;
		};

		this.array = [];
		this.cards = [];

		this.search = { 
			codigo: null,
			categoria: null,
			cidade: [],
			tipo: [],
			minArea: null,
			maxArea: null,
			minValue: null,
			maxValue: null,
			dormitorio: [],
			banheiro: [],
			suite: null,
			garagem: null
		};

		this.toggleCheckbox = function(key, value) {
			if (!self.search[key] || !self.search[key].length) {
				self.search[key] = [ value ];
			} else {
				var index = self.search[key].indexOf(value);
				
				if (index < 0) {
					self.search[key].push(value);
				} else {
					self.search[key].splice(index, 1);
				}
			}
		};

		this.updateSliderValues = function() {
			self.search.minValue = self.sliderPrice.min;
			self.search.maxValue = self.sliderPrice.max;

			self.search.minArea = self.sliderArea.min;
			self.search.maxArea = self.sliderArea.max;
		};

		this.sliderPrice = {
			min: 0,
			max: 1,
			options: {
				disabled: false,
				floor: 1,
				ceil: 2000000,
				hidePointerLabels: true,
				hideLimitLabels: true,
				onEnd: self.updateSliderValues,
	
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
					var v = $filter('currency')(value, undefined, 0);
	
					switch (label) {
						// case 'model':
						//   return '<b>Min.</b> ' + v;
						// case 'high':
						//   return '<b>Max.</b> ' + v;
						default:
							return v;
					}
				}
			}
		};
	
		this.sliderArea = {
			min: 0,
			max: 1,
			options: {
				floor: 1,
				ceil: 5000,
				hidePointerLabels: true,
				hideLimitLabels: true,
				showTicks: false,
				onEnd: self.updateSliderValues,
				translate: function(value, sliderId, label) {
	
					switch (label) {
						case 'model':
							return value + 'm<sup>2</sup>';
						case 'high':
							return value + 'm<sup>2</sup>';
						default:
							return value;
					}
				}
			}
		};

		this.filters = new Filters();
		this.filters.load().then(function(res) {
			self.sliderPrice.min = parseFloat(self.filters.value.min);
			self.sliderPrice.max = parseFloat(self.filters.value.max);
			self.sliderPrice.options.floor = parseFloat(self.filters.value.min);
			self.sliderPrice.options.ceil = parseFloat(self.filters.value.max);
	
			self.sliderArea.min = parseFloat(self.filters.area.min);
			self.sliderArea.max = parseFloat(self.filters.area.max);
			self.sliderArea.options.floor = parseFloat(self.filters.area.min);		
			self.sliderArea.options.ceil = parseFloat(self.filters.area.max);
	
			self.search.order = self.filters.order;

			self.search.cidade = self.filters.city.map(function(n) {
				return n.city_id;
			});

			self.search.tipo = self.filters.category.map(function(n) {
				return n.immobile_category_id;
			});

			self.loadAll();
			$scope.$watch(function() {
				return self.search;
			}, function(newVal, oldVal) {
				console.log(newVal);
				self.cards = [ ];
				self.map.markers = self.array.reduce(function(array, item) {
					if ( !((newVal.minValue && item.immobile_value < newVal.minValue) || 
						  (newVal.maxValue && item.immobile_value > newVal.maxValue) ||
						  (newVal.minArea && item.immobile_area_total < newVal.minArea) || 
						  (newVal.maxArea && item.immobile_area_total > newVal.maxArea) ||
						  (newVal.tipo.length && newVal.tipo.indexOf(item.immobile_category_id) < 0) || 
						  (newVal.categoria && newVal.categoria != item.immobile_type)) ) {

						self.cards.push(item.convertToCardInfo());
						array.push(item.convertToMapMarker());
					}
					
					return array;
				}, [ ]);

				console.log(self.map.markers);

			}, true);
		});

		function recalcFiltersPosition() {
			$scope.innerWidth = $window.innerWidth;
			
			$timeout(function() {
				var elems = jQuery('.navbar .navbar-collapse ul.nav li.dropdown'),
					width = (100 / elems.length) + '%';

				elems.css('width', width);
			});
		}

		function recalcInnerHeight() {
			$scope.innerHeight = $window.innerHeight - jQuery('#header').height() - jQuery('#filters-menu').height();
		}

		$window.addEventListener('resize', function() {
			$timeout(function() {
				recalcFiltersPosition();
				recalcInnerHeight();
			});
		});

		$scope.$on('$viewContentLoaded', function() {		
			recalcFiltersPosition();
			
			$timeout(function() {
				recalcInnerHeight();

				jQuery('.dropdown-menu').click(function(e) {
					e.stopPropagation();
				});
			}, 100);
			
			jQuery('.dropdown[name="slider"]').on('shown.bs.dropdown', function () {
				$scope.$broadcast('reCalcViewDimensions');
			});
		});

		self.loadAll = function() {
			_isLoading++;
			self.array = [];
			self.cards = [];
			ImmobileManager.loadMap(null, self.search).then(function(success) {
				self.array = success.data;
				self.map.markers = success.data.map(function(n) {
					self.cards.push(n.convertToCardInfo());
					return n.convertToMapMarker();
				});
				self.map.isReady = true;
				_isLoading = Math.max(_isLoading - 1, 0);
			}, function(error) {
				console.log(error);
				_isLoading = Math.max(_isLoading - 1, 0);
			});
		}

		self.getImmobileByCode = function(code) {
			if (!code) return;

			console.log('get by code', code);
		};

	}

}());