'use strict';

angular.module('alabama.services')
	.factory('Filters', ['$http', '$q', 'URLS', function($http, $q, URLS) {

		function Filters(filtersData) {
			this.loaded = false;
			
			if (filtersData) {
				this.setData(filtersData);
			}
		}

		Filters.prototype = {
			setData: function(filtersData) {
				angular.extend(this, filtersData, { loaded: true });
			},
			setDistricts: function(data) {
				this.districts = { };
				angular.extend(this.districts, data);
			},
			load: function() {
				var deferred = $q.defer(),
					scope = this;
				
				$http({
					method: 'GET',
					url: URLS.root + 'api/filter.php?action=getAll',
					crossDomain: true
				}).then(function(response) {
					scope.setData(response.data.data);
					deferred.resolve();
				}, function(error) {
					console.log('deu erro: ' + error);
					deferred.reject();
				});

				return deferred.promise;
			},
			loadDistrictsFromCity: function(city_id) {
				var deferred = $q.defer(),
					scope = this;

				if (!city_id || city_id == 0) {
					deferred.resolve();
					scope.setDistricts([]);
					return deferred.promise;
				}

				$http({
					method: 'POST',
					url: URLS.root + 'api/filter.php?action=getDistricts',
					crossDomain: true,
					data: {
						city_id: city_id
					}
				}).then(function(response) {
					scope.setDistricts(response.data.data);
					deferred.resolve();
				}, function(error) {
					console.log('deu erro: ' + error);
					deferred.reject();
				});

				return deferred.promise;
			}
		}

		return Filters;

	}]);