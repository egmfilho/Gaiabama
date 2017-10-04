'use strict';

angular.module('alabama.services')
	.factory('Immobile', ['$http', '$q', 'URLS', function($http, $q, URLS) {  

		var related = [ ];

		function Immobile(immobileData) {
			if (immobileData) {
				this.setData(immobileData);
				setPictures(this);
			}
			// Some other initializations related to Immobile
		}

		function setPictures(scope) {

			if (!scope.gallery) {
				return;
			}

			angular.forEach(scope.gallery, function(item, index) {
				item.url = URLS.root + 'files/immobile/' + item.immobile_id + '/' + item.gallery_image_id + '_large.jpg';
				item.thumb = URLS.root + 'files/immobile/' + item.immobile_id + '/' + item.gallery_image_id + '_small.jpg';
			});
		}

		function setRelated(array) {
			angular.forEach(array, function(item, index) {
				related.push(new Immobile(item));
			});
		}

		Immobile.prototype = {
			setData: function(immobileData) {
				angular.extend(this, immobileData);
				this.immobile_date = immobileData.immobile_date ? new Date(immobileData.immobile_date.replace(' ', 'T')) : null; // formata a data
				this.immobile_value = parseInt(this.immobile_value); // para corrigir o preço de string pra int
				this.immobile_value_condominium = parseInt(this.immobile_value_condominium); // para corrigir o preço de string pra int
				this.immobile_value_iptu = parseInt(this.immobile_value_iptu); // para corrigir o preço de string pra int
			},
			get: function(code) {
				var scope = this, 
					deferred = $q.defer();

				$http({
					method: 'POST',
					url: URLS.root + 'api/immobile.php?action=get',
					crossDomain: true,
					data: {
						immobile_code: code,
						get_address: true,
						get_address_district: true,
						get_address_city: true,
						get_address_uf: true,
						get_immobile_gallery: true,
						get_immobile_category: true,
						group_feature: true
					}
				}).then(function(immobileData) {
					scope.setData(immobileData.data.data);					
					setPictures(scope);
					if (immobileData.data.info.related) 
						setRelated(immobileData.data.info.related);					
					deferred.resolve();
				}, function(error) {
					console.log('deu erro: ' + error);
					deferred.reject(error);
				});

				return deferred.promise;
			},
			getMainPictureUrl: function() {
				if (!this.gallery) {
					return;
				}

				for (var i = 0; i < this.gallery.length; i++) {
					if (this.gallery[i].gallery_image_main == 'Y') {
						return this.gallery[i].url;
					}
				}

				return '';
			},
			getMainThumbUrl: function() {
				if (!this.gallery) {
					return '';
				}

				for (var i = 0; i < this.gallery.length; i++) {
					if (this.gallery[i].gallery_image_main == 'Y') {
						return this.gallery[i].thumb;
					}
				}

				return '';
			},
			getThumbUrlArray: function() {
				if (!!this.gallery && this.gallery.length) {
					var array = this.gallery.map(function(item) {
						return item.thumb;
					});
	
					return array;
				}

				return null;
			},
			getUrl: function() {
				var subtitle = this.address ? this.address.district.city.city_name + ' ' + this.address.district.district_name : '';
				return '/imovel?codigo=' + this.immobile_code + '&nome=' + (this.immobile_name + ' ' + subtitle).replace(/( - | +)/g, '-');
			},
			convertToCardInfo: function() {
				return {
					code: this.immobile_code,
					picture: this.getMainThumbUrl(),
					pictureLg: this.getMainPictureUrl(),
					title: this.immobile_name,
					parsedName: this.immobile_name.replace(/ /g, '-'),
					subtitle: this.address ? this.address.district.city.city_name + ' - ' + this.address.district.district_name : '',
					description: this.immobile_description || '',
					category: this.immobile_type == 1 ? 'Venda' : 'Aluguel',
					area: parseInt(this.immobile_area_total),
					price: parseInt(this.immobile_value),
					url: this.getUrl(),
					bed: this.immobile_bedroom,
					suite: this.immobile_suite,
					bath: this.immobile_bathroom,
					parking: this.immobile_parking_spot,
					labelText: '',
					labelColor: '',
					thumbs: this.getThumbUrlArray(),
					dummy: false
				};
			},
			convertToMapMarker: function() {
				return {
					latitude: parseFloat(this.immobile_latitude),
					longitude: parseFloat(this.immobile_longitude),
					id: this.immobile_id,
					icon: '../images/marker.png',
					card: this.convertToCardInfo(),
					options: {
						animation: google.maps.Animation.DROP,
						visible: true
					}
				}
			},
			getRelated: function() {
				return related;
			}
		};

		return Immobile;
	}]);