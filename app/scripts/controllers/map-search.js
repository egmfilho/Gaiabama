
(function() {

	'use strict';

	angular.module('alabama.controllers')
		.controller('MapSearchCtrl', MapSearchCtrl);

	MapSearchCtrl.$inject = [ '$scope', '$filter', '$location', '$window', '$timeout', 'Filters', 'ImmobileManager', 'MapTheme' ];

	function MapSearchCtrl($scope, $filter, $location, $window, $timeout, Filters, ImmobileManager, MapTheme) {

		var self = this,
			_isLoading = 0;

		jQuery('#golimar').modal({
			backdrop: 'static',
			keyboard: false
		}).on('shown.bs.modal', function(e) {
			jQuery('.modal-backdrop').css('z-index', 3);
		}).modal('show');

		$scope.$on('$viewContentLoaded', function() {		
			recalcFiltersPosition();
			
			$timeout(function() {
				recalcInnerHeight();

				jQuery('.dropdown-menu').click(function(e) {
					e.stopPropagation();
				});

			}, 100);

			$timeout(function() {
				self.map.isReady = true;
			}, 500);
			
			jQuery('.dropdown[name="slider"]').on('shown.bs.dropdown', function () {
				$scope.$broadcast('reCalcViewDimensions');
			});
		});

		$scope.$on('$locationChangeStart', function() {
			jQuery('body').removeClass('modal-open').removeAttr('style');
			jQuery('.modal-backdrop').remove();
		});

		self.loadAll = function() {
			_isLoading++;
			self.array = [];
			self.cards = [];
			self.clearSearch();
			ImmobileManager.loadMap(null, { cidade: self.search.cidade, order: self.search.order }).then(function(success) {
				
				self.array = success.data;

				var bounds = applyFilters();

				self.map.bounds = {
					northeast: { 
						latitude: bounds.getNorthEast().lat(),
						longitude: bounds.getNorthEast().lng()
					},
					southwest: {
						latitude: bounds.getSouthWest().lat(),
						longitude: bounds.getSouthWest().lng()
					}
				};
				
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

		self.map = {
			isReady: false,
			center: { latitude: -22.5, longitude: -43 },
			bounds: { },
			zoom: 9,
			options: {
				clickableIcons: false,
				maxZoom: 20,
				styles: MapTheme.styles
			},
			control: { },
			markers: [ ],
			markersControl: { },
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
				idle: function(map) {
					updateCards();
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
			cluster: {
				options: {
					styles:[{
						url: "../images/cluster.png",
							width: 58,
							height: 58,
							textSize: 15,
							textColor:"white",
						}
					]
				},
				events: {
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
			}
		};

		this.isLoading = function() {
			return _isLoading > 0;
		};

		this.array = [];
		this.cards = [];

		this.search = { };

		this.clearSearch = function() {
			this.search = angular.extend({ }, { 
				cidade: [ ],
				codigo: null,
				categoria: 0,
				tipo: [ ],
				minArea: self.filters.area.min,
				maxArea: self.filters.area.max,
				minValue: self.filters.value.min,
				maxValue: self.filters.value.max,
				dormitorio: [ ],
				banheiro: [ ],
				suite: -1,
				garagem: -1,
				order: self.filters.order
			}, {
				cidade: this.search.cidade
			});
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
	
			self.clearSearch();

			$scope.$watch(function() {
				return self.search;
			}, function(newVal, oldVal) {
				if (newVal.cidade != oldVal.cidade) {
					self.loadAll();
					return;
				}

				applyFilters();
				updateCards();

			}, true);
		});

		function updateCards() {
			if (!self.map.control || !self.map.control.getGMap)
				return;

			var bounds = self.map.control.getGMap().getBounds();
			
			self.cards = [ ];
			angular.forEach(self.map.markers, function(value, key) {
				if (bounds.contains({ "lat": value.latitude, "lng": value.longitude })) {
					self.cards.push(value.card);
				}
			});
		}
		
		function applyFilters() {
			var bounds = new google.maps.LatLngBounds();

			self.map.markers = self.array.reduce(function(array, item) {
				if (!((self.search.minValue           && item.immobile_value       < self.search.minValue)                       || 
					  (self.search.maxValue           && item.immobile_value       > self.search.maxValue)                       ||
					  (self.search.minArea            && item.immobile_area_total  < self.search.minArea)                        || 
					  (self.search.maxArea            && item.immobile_area_total  > self.search.maxArea)                        ||
					  (self.search.categoria          && self.search.categoria    != item.immobile_type)                         || 
					  (self.search.suite >= 0         && self.search.suite        != Math.min(item.immobile_suite, 1))           ||
					  (self.search.garagem >= 0       && self.search.garagem      != Math.min(item.immobile_parking_spot, 1))    ||
					  (self.search.tipo.length        && self.search.tipo.indexOf(item.immobile_category_id)                < 0) || 
					  (self.search.dormitorio.length  && self.search.dormitorio.indexOf(Math.min(item.immobile_bedroom, 4)) < 0) ||
					  (self.search.banheiro.length    && self.search.banheiro.indexOf(Math.min(item.immobile_bathroom, 4))  < 0)) ) {

					self.cards.push(item.convertToCardInfo());
					array.push(item.convertToMapMarker());
					bounds.extend(new google.maps.LatLng(item.immobile_latitude, item.immobile_longitude));
				}
				
				return array;
			}, [ ]);

			return bounds;
		}

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

		this.cardEnter = function(id) {
			var manager = self.map.markersControl.getManager();
			
			if (manager && manager.propMapGMarkers && manager.propMapGMarkers.get(id).map == null) {
				var marker = manager.propMapGMarkers.get(id);

				manager.clusterer.clusters_.find(function(c) {
					return c.isMarkerInClusterBounds(marker);
				}).clusterIcon_.div_.firstChild.src = '../images/cluster2.png';

				// manager.draw();
			} else {
				self.map.markers.find(function(n) {
					return n.id == id;
				}).options.animation = google.maps.Animation.BOUNCE;
			}
		};

		this.cardLeave = function(id) {
			var manager = self.map.markersControl.getManager();
			
			if (manager.propMapGMarkers.get(id).map == null) {
				var marker = manager.propMapGMarkers.get(id);

				manager.clusterer.clusters_.find(function(c) {
					return c.isMarkerInClusterBounds(marker);
				}).clusterIcon_.div_.firstChild.src = '../images/cluster.png';

				// manager.draw();
			} else {
				self.map.markers.find(function(n) {
					return n.id == id;
				}).options.animation = google.maps.Animation.Uo;
			}
		};

	}

}());