
(function() {

	'use strict';

	angular.module('alabama.controllers')
		.controller('MapSearchCtrl', MapSearchCtrl);

	MapSearchCtrl.$inject = [ '$scope', '$filter', '$window', '$timeout', 'NgMap', 'Filters' ];

	function MapSearchCtrl($scope, $filter, $window, $timeout, NgMap, Filters) {

		var self = this,
			clusterUrl = "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m",
			_isLoading = 0;

		$scope.isMapLoading = function() {
			return _isLoading > 0;
		};

		self.positions = [
			{ 
				code: '0001',
				position: [54.779951, 9.334164], 
				message: 'Marmelada 1',
				pic: 'https://i.pinimg.com/736x/eb/09/d2/eb09d237751d55ab82a4acf0023f643a--craftsman-house-plans-butler-pantry.jpg' 
			},
			{ 
				code: '0002',
				position: [47.209613, 15.991539],
				message: 'Marmelada 2',
				pic: 'https://i.pinimg.com/736x/a4/8c/d6/a48cd68cb85fa6a82beb7085dd9fc085--open-floor-house-plans-dream-house-plans.jpg'
			},
			{ 
				code: '0003',
				position: [51.975343, 7.596731], 
				message: 'Marmelada 3',
				pic: 'https://i.pinimg.com/736x/7f/be/50/7fbe50ec634c65709d7fe6ac267c4e6f--large-garage-plans-house-plans-large-family.jpg'
			},
			{ 
				code: '0004',
				position: [51.97539, 7.596962], 
				message: 'Marmelada 4',
				pic: 'http://www.dreamhomesource.com/house-plans/media/catalog/product/cache/3/image/820x615/9df78eab33525d08d6e5fb8d27136e95/F/B/FBA409-FR-PH-CO-LG.JPG'
			},
			{ 
				code: '0005',
				position: [47.414847, 8.23485], 
				message: 'Marmelada 5',
				pic: 'http://i4.au.reastatic.net/home-ideas/raw/b1dc4fa0d44752f312095dba25458380114b5cdf226126092f8dcf7d22aaefa0/facades.jpg'
			},
			{ 
				code: '0006',
				position: [47.658028, 9.159596],
				message: 'Marmelada 6',
				pic: 'http://i1.au.reastatic.net/home-ideas/raw/40c03f8475fa388edc1ff3428743a2bd8c1fd416d18ac613eb4cff50db56fdb4/facades.jpg'
			},
			{ 
				code: '0007',
				position: [47.525927, 7.68761], 
				message: 'Marmelada 7',
				pic: 'http://i2.au.reastatic.net/home-ideas/raw/10c83c02aa931c8b91bdfb8e1c554f673fbc41dfea24d288b8870fc5d36cc2c2/facades.jpg'
			},
			{ 
				code: '0008',
				position: [50.85558, 9.704403],
				message: 'Marmelada 8',
				pic: 'http://i2.au.reastatic.net/home-ideas/raw/db70602fd2a660ed8abc8d360a11de895678e49a2b9cc51e9ab50a88bdcedda3/facades.jpg'
			},
			{ 
				code: '0009',
				position: [54.320664, 10.285977], 
				message: 'Marmelada 9',
				pic: 'http://www.dreamhomesource.com/house-plans/media/catalog/product/cache/3/image/820x615/9df78eab33525d08d6e5fb8d27136e95/B/F/BFA025-FR-PH-CO-LG.JPG'
			},
			{ 
				code: '0010',
				position: [49.214374, 6.97506],
				message: 'Marmelada 10',
				pic: 'https://i.pinimg.com/736x/cd/e2/25/cde225a6ee6d2636d1b2b0adad73b433--dark-blue-houses-dark-house.jpg'
			},
			{ 
				code: '0011',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 11',
				pic: 'http://i4.au.reastatic.net/home-ideas/raw/f9644ed896cc6cf7c87a528a38e8ecc1c88eb2f931a3838ff6cbdbc42bae2f8a/facades.jpg'
			},
			{ 
				code: '0012',
				position: [52.975556, 7.596811],
				message: 'Marmelada 12',
				pic: 'https://cdnimages.familyhomeplans.com/plans/42495/42495-b600.jpg'
			},
			{ 
				code: '0013',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 13',
				pic: 'http://www.wesleyan.edu/reslife/images/Malcolm%20X%20House.jpg'
			},
			{ 
				code: '0014',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 14',
				pic: 'http://24.media.tumblr.com/tumblr_m6vqf0AywR1qc4y9to1_500.jpg'
			},
			{ 
				code: '0015',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 15',
				pic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/S.R._Thompson_House.jpg/1280px-S.R._Thompson_House.jpg'
			},
			{ 
				code: '0016',
				position: [52.975556, 7.596811],
				message: 'Marmelada 16',
				pic: 'http://www.discoverydreamhomes.com/wp-content/uploads/Model-Features-Copper-House.jpg'
			},
			{ 
				code: '0017',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 17',
				pic: 'http://realamericandreamhomes.com/wp-content/uploads/2016/06/Model-Features-Ravenwood.jpg'
			},
			{ 
				code: '0018',
				position: [52.975556, 7.596811],
				message: 'Marmelada 18',
				pic: 'http://hbu.h-cdn.co/assets/cm/16/14/980x653/gallery-54c4956d156f2-01-hbx-blue-house-exterior-0513-xln-42436446.jpg'
			},
			{ 
				code: '0019',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 19',
				pic: 'http://www.eplans.com/house-plans/media/catalog/product/cache/2/image/820x615/9df78eab33525d08d6e5fb8d27136e95/T/W/TWR008-FR-PH-CO-LG.JPG'
			},
			{ 
				code: '0020',
				position: [52.975556, 7.596811],
				message: 'Marmelada 20',
				pic: 'http://biteinto.info/wp-content/uploads/2016/02/new-house-painting-with-new-home-designs-latest-modern-house-exterior-front-designs-ideas-14.jpg'
			}
		];

		this.search = { };

		this.sliderPrice = {
			options: {
				disabled: false,
				floor: 1,
				ceil: 2000000,
				hideLimitLabels: true,
				// logScale: true,
	
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
			options: {
				floor: 1,
				ceil: 5000,
				hideLimitLabels: true,
				showTicks: false,
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
			self.search.minValue = self.search.minValue ? self.search.minValue : parseFloat(self.filters.value.min);
			self.search.maxValue = self.search.maxValue ? self.search.maxValue : parseFloat(self.filters.value.max);
			self.sliderPrice.options.floor = parseFloat(self.filters.value.min);
			self.sliderPrice.options.ceil = parseFloat(self.filters.value.max);
			self.sliderPrice.options.hidePointerLabels = true;
			self.sliderPrice.options.hideLimitLabels = true;
	
			self.search.minArea = self.search.minArea ? self.search.minArea : parseFloat(self.filters.area.min);
			self.search.maxArea = self.search.maxArea ? self.search.maxArea : parseFloat(self.filters.area.max);
			self.sliderArea.options.floor = parseFloat(self.filters.area.min);		
			self.sliderArea.options.ceil = parseFloat(self.filters.area.max);
			self.sliderArea.options.hidePointerLabels = true;
			self.sliderArea.options.hideLimitLabels = true;
	
			self.search.order = self.filters.order;
		});

		function recalcFiltersPosition() {
			$scope.innerWidth = $window.innerWidth;
			
			$timeout(function() {
				var elems = jQuery('.navbar .navbar-collapse ul.nav li.dropdown'),
					width = (100 / elems.length) + '%';

				elems.css('width', width);
			});
		}

		$window.addEventListener('resize', recalcFiltersPosition);

		$scope.$on('$viewContentLoaded', function() {
			recalcFiltersPosition();
			$scope.innerHeight = $window.innerHeight - jQuery('#header').height() - jQuery('#filters-menu').height();
			
			jQuery('.dropdown[name="slider"]').on('shown.bs.dropdown', function () {
				$scope.$broadcast('reCalcViewDimensions');
			});

			jQuery('.dropdown-menu').click(function(e) {
				e.stopPropagation();
			});
		});

		self.dynMarkers = [];
		NgMap.getMap().then(function(map) {
			var bounds = new google.maps.LatLngBounds();

			for (var k in map.customMarkers) {
				var cm = map.customMarkers[k];
				self.dynMarkers.push(cm);
				bounds.extend(cm.getPosition());
			}

			self.markerClusterer = new MarkerClusterer(map, self.dynMarkers, { imagePath: clusterUrl });
			map.setCenter(bounds.getCenter());
			map.fitBounds(bounds);

			self.map = map;
		});

		self.showInfo = function(event, id) {
			self.selected = self.positions.find(function(item) {
				return item.code == id.split('-')[1];
			});
			self.selected.area = 20000;
			self.selected.bed = 21;
			self.selected.suite = 11;
			self.selected.bath = 31;
			self.selected.parking = 12;
			
			self.map.showInfoWindow("search-info-window", id);
		};

	}

}());