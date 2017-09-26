
(function() {

	'use strict';

	angular.module('alabama.controllers')
		.controller('MapSearchCtrl', MapSearchCtrl);

	MapSearchCtrl.$inject = [ '$scope', 'NgMap' ];

	function MapSearchCtrl($scope, NgMap) {

		var self = this,
			clusterUrl = "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m";

		self.positions = [
			{ 
				code: '0001',
				position: [54.779951, 9.334164], 
				message: 'Marmelada 1'
			},
			{ 
				code: '0002',
				position: [47.209613, 15.991539],
				message: 'Marmelada 2'
			},
			{ 
				code: '0003',
				position: [51.975343, 7.596731], 
				message: 'Marmelada 3'
			},
			{ 
				code: '0004',
				position: [51.97539, 7.596962], 
				message: 'Marmelada 4'
			},
			{ 
				code: '0005',
				position: [47.414847, 8.23485], 
				message: 'Marmelada 5'
			},
			{ 
				code: '0006',
				position: [47.658028, 9.159596],
				message: 'Marmelada 6'
			},
			{ 
				code: '0007',
				position: [47.525927, 7.68761], 
				message: 'Marmelada 7'
			},
			{ 
				code: '0008',
				position: [50.85558, 9.704403],
				message: 'Marmelada 8'
			},
			{ 
				code: '0009',
				position: [54.320664, 10.285977], 
				message: 'Marmelada 9'
			},
			{ 
				code: '0010',
				position: [49.214374, 6.97506],
				message: 'Marmelada 10'
			},
			{ 
				code: '0011',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 11'
			},
			{ 
				code: '0012',
				position: [52.975556, 7.596811],
				message: 'Marmelada 12'
			},
			{ 
				code: '0013',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 13'
			},
			{ 
				code: '0014',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 14'
			},
			{ 
				code: '0015',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 15'
			},
			{ 
				code: '0016',
				position: [52.975556, 7.596811],
				message: 'Marmelada 16'
			},
			{ 
				code: '0017',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 17'
			},
			{ 
				code: '0018',
				position: [52.975556, 7.596811],
				message: 'Marmelada 18'
			},
			{ 
				code: '0019',
				position: [52.975556, 7.596811], 
				message: 'Marmelada 19'
			},
			{ 
				code: '0020',
				position: [52.975556, 7.596811],
				message: 'Marmelada 20'
			}
		];

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