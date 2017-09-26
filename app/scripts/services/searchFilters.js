
(function() {

	'use strict';

	angular.module('alabama.services')
		.factory('SearchFilters', [function() {

			var _filters = null;

			return {
				set: function(filters) {
					_filters = JSON.stringify(filters);
				},

				get: function() {
					if (!_filters) return;

					return JSON.parse(_filters);
				}
			}

		}]);

}());