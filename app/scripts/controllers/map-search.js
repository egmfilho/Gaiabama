
(function() {

	'use strict';

	angular.module('alabama.controllers')
		.controller('MapSearchCtrl', MapSearchCtrl);

	MapSearchCtrl.$inject = [ '$scope', '$filter', '$location', '$window', '$timeout', 'Filters', 'ImmobileManager' ];

	function MapSearchCtrl($scope, $filter, $location, $window, $timeout, Filters, ImmobileManager) {

		var self = this,
			clusterUrl = "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m",
			_map = null,
			_markerClusterer = null,
			_clusterClickListener = null,
			_isLoading = 0;

		self.map = {
			center: { latitude: 0, longitude: 0},
			bounds: { },
			zoom: 4,
			options: {
				maxZoom: 20
			},
			control: { },
			markers: [ ],
			window: {
				coords: { latitude: 0, longitude: 0 },
				selected: { },
				show: false,
				options: {
					pixelOffset: { width: 0, height: 0 }
				}
			},
			events: {
				idle: function() {
					var bounds = self.map.control.getGMap().getBounds();
	
					self.cards = [ ];
					angular.forEach(self.map.markers, function(value, key) {
						if (bounds.contains({ "lat": parseFloat(value.latitude), "lng": parseFloat(value.longitude) }) === true) {
							self.cards.push(value.card);
						}
					});
				}
			},
			markerEvents: {
				click: function(marker, eventName, model, args) {
					self.map.window.selected = [ model ];
					self.map.window.coords = model;
					self.map.window.show = true;
				}
			},
			clusterEvents: {
				click: function(cluster, clusterModels) {
					console.log(cluster);
					if (self.map.control.getGMap().getZoom() >= 20) {
						self.map.window.selected = clusterModels.map(function(n) { return n.card });
						self.map.window.coords = cluster.center;
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

		this.search = { };

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

			$scope.$watch(function() {
				return self.search;
			}, function(newVal, oldVal) {
				self.loadAll();
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
			clearMap();
			ImmobileManager.loadMap(null, self.search).then(function(success) {
				self.array = success.data;
				self.cards = self.array.map(function(n) {
					return n.convertToCardInfo();
				});

				self.map.markers = self.array.map(function(n) {
					return {
						latitude: n.immobile_latitude,
						longitude: n.immobile_longitude,
						id: n.immobile_id,
						card: n.convertToCardInfo()
					}
				});

				if (!_map) {
					// console.log('Iniciando o mapa...');
					
					// _map = NgMap.initMap('map-search');
					
					// google.maps.event.addListener(_map, 'idle', showVisibleMarkers);
				}

				$timeout(function() {
					updateMap();
					_isLoading = Math.max(_isLoading - 1, 0);
				}, 500);
			}, function(error) {
				console.log(error);
				_isLoading = Math.max(_isLoading - 1, 0);
			});
		}

		self.getImmobileByCode = function(code) {
			if (!code) return;

			console.log('get by code', code);
		};

		function clearMap() {
			if (_markerClusterer) {
				_markerClusterer.clearMarkers();
				_markerClusterer.map.customMarkers = { };
				console.log(_markerClusterer);
			}
		}

		function updateMap() {
			return;

			self.dynMarkers = [];
			NgMap.getMap().then(function(map) {
				var bounds = new google.maps.LatLngBounds();
	
				for (var k in map.customMarkers) {
					var cm = map.customMarkers[k];
					self.dynMarkers.push(cm);
					bounds.extend(cm.getPosition());
				}
	
				_markerClusterer = new MarkerClusterer(map, self.dynMarkers, { imagePath: clusterUrl });

				map.setCenter(bounds.getCenter());
				map.fitBounds(bounds);

				if (!_clusterClickListener) {
					_clusterClickListener = google.maps.event.addListener(_markerClusterer, 'clusterclick', function (cluster) {
						if (_map.getZoom() >= 20) {
							var ids = cluster.getMarkers().map(function(n) { return n.id });
							console.log(ids);
							self.showInfo(null, ids, cluster);
						}
					});
				}
			});
		}

		self.showInfo = function(event, id, cluster) {
			var infoWindow = $scope.map.infoWindows["search-info-window"],
				target;

			if (Array.isArray(id)) {
				target = cluster;
				infoWindow.setPosition(target.getCenter());
			} else {
				target = id.toString();				
			}

			self.selected = self.array.reduce(function(a, b) {
				if (Array.isArray(id)) {
					if (id.indexOf(b.immobile_id) >= 0)
						a.push(b.convertToCardInfo());
				} else {
					if (b.immobile_id == id)
						a.push(b.convertToCardInfo());
				}

				return a;
			}, [ ]);

			_map.showInfoWindow("search-info-window", target);
		};

		function showVisibleMarkers() {
			console.log('updating markers');
			var bounds = _map.getBounds(),
				markers = [];

			angular.forEach(_map.customMarkers, function(value, key) {
				if (bounds.contains(value.getPosition()) === true) {
					markers.push(key);
					value.setVisible(true);
				} else {
					value.setVisible(false);
				}
			});

			$timeout(function() {
				self.cards = self.array.reduce(function(a, b) {
					if (markers.indexOf(b.immobile_id.toString()) >= 0)
						a.push(b.convertToCardInfo());
	
					return a;
				}, [ ]);
			});
		}

	}

}());