'use strict';

angular.module('alabama.services')
	.factory('ImmobileManager', ['$http', '$q', 'URLS', 'Immobile', function($http, $q, URLS, Immobile) {  

		return {

			loadAllImmobiles: function(limit, filtros) {
				var deferred = $q.defer(),
					filters, data;

				filters = !filtros ? {} : {
					immobile_code: filtros.codigo,
					immobile_type: filtros.categoria,
					immobile_address: {
						city_id: filtros.cidade || 0,
						district_id: filtros.bairro || 0
					},
					immobile_category_id: filtros.tipo,
					immobile_area_total: {
						min: filtros.minArea,
						max: filtros.maxArea
					},
					immobile_value: {
						min: filtros.minValue,
						max: filtros.maxValue
					},
					immobile_bedroom: filtros.dormitorios || null,
					immobile_bathroom: filtros.banheiros || null,
					immobile_suite: filtros.suite || null,
					immobile_parking_spot: filtros.garagem || null,
					order: filtros.order
				};

				data = {
					get_immobile_address: true,
					get_address_district: true,
					get_address_city: true,
					get_address_uf: true,
					get_immobile_gallery: true,
					limit: limit
				};
				
				$http({
					method: 'POST',
					url: URLS.root + 'api/immobile.php?action=getList',
					crossDomain: true,
					data: Object.assign(data, filters)
				}).then(function(immobileData) {
					var array = [ ];						
					
					angular.forEach(immobileData.data.data, function(item) {
						array.push(new Immobile(item));
					});

					deferred.resolve({info: immobileData.data.info, data: array});
				}, function(error) {
					console.error('deu erro', error);
					deferred.reject();
				});

				return deferred.promise;
			},

			loadAllFeatured: function() {
				var deferred = $q.defer();
				
				$http({
					method: 'POST',
					url: URLS.root + 'api/immobile.php?action=getListFeatured',
					crossDomain: true,
					data: {
						get_immobile_address: true,
						get_address_district: true,
						get_address_city: true,
						get_address_uf: true,
						get_immobile_gallery: true
					}
				}).then(function(immobileData) {
					var array = [ ];
					
					angular.forEach(immobileData.data.data, function(item) {
						array.push(new Immobile(item));
					});

					deferred.resolve(array);
				}, function(error) {
					console.error('deu erro', error);
					deferred.reject();
				});

				return deferred.promise;
			},

			loadLastOnes: function() {
				var deferred = $q.defer();
				
				$http({
					method: 'POST',
					url: URLS.root + 'api/immobile.php?action=getListNews',
					crossDomain: true,
					data: {
						get_immobile_address: true,
						get_address_district: true,
						get_address_city: true,
						get_address_uf: true,
						get_immobile_gallery: true
					}
				}).then(function(immobileData) {
					var array = [ ];						
					
					angular.forEach(immobileData.data.data, function(item) {
						array.push(new Immobile(item));
					});

					deferred.resolve(array);
				}, function(error) {
					console.error('deu erro', error);
					deferred.reject();
				});

				return deferred.promise;
			},

			loadMostVisited: function() {
				var deferred = $q.defer();
				
				$http({
					method: 'POST',
					url: URLS.root + 'api/immobile.php?action=getMostVisited',
					crossDomain: true,
					data: {
						get_immobile_address: true,
						get_address_district: true,
						get_address_city: true,
						get_address_uf: true,
						get_immobile_gallery: true
					}
				}).then(function(immobileData) {
					var array = [ ];						
					
					angular.forEach(immobileData.data.data, function(item) {
						array.push(new Immobile(item));
					});

					deferred.resolve(array);
				}, function(error) {
					console.error('deu erro', error);
					deferred.reject();
				});

				return deferred.promise;
			},

			loadMap: function(limit, filtros) {
				var deferred = $q.defer(),
					filters, data;

				filters = !filtros ? {} : {
					immobile_code: filtros.codigo,
					immobile_type: filtros.categoria,
					immobile_address: {
						city_id: filtros.cidade || [],
						district_id: filtros.bairro || []
					},
					immobile_category_id: filtros.tipo || [],
					immobile_area_total: {
						min: filtros.minArea,
						max: filtros.maxArea
					},
					immobile_value: {
						min: filtros.minValue,
						max: filtros.maxValue
					},
					immobile_bedroom: filtros.dormitorios || [],
					immobile_bathroom: filtros.banheiros || [],
					immobile_suite: filtros.suite || null,
					immobile_parking_spot: filtros.garagem || null,
					order: filtros.order
				};

				data = {
					get_immobile_address: true,
					get_address_district: true,
					get_address_city: true,
					get_address_uf: true,
					limit: limit
				};

				$http({
					method: 'POST',
					url: URLS.root + 'api/map.php?getList',
					crossDomain: true,
					data: Object.assign(data, filters)
				}).then(function(immobileData) {
					var array = [ ];						
					
					array = immobileData.data.data.map(function(i) {
						return new Immobile(i);
					});

					deferred.resolve({ info: immobileData.data.info, data: array });
				}, function(error) {
					console.error('deu erro', error);
					deferred.reject();
				});

				return deferred.promise;
			}
		}

	}]);