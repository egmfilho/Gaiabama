/**
 * Created by egmfilho on 08/07/16.
 */

'use strict';

angular.module('alabama.services')
	.factory('HttpInterceptor', [
		'$q',
		'$httpParamSerializerJQLike',
		function($q, $httpParamSerializerJQLike) {

			return {

				'request': function(req) {

					req.headers['Content-Type'] = 'application/x-www-form-urlencoded';
					req.data = $httpParamSerializerJQLike(req.data);

					return req;

				},

				'response': function(res) {

					return res;
				},

				'responseError': function(rejection) {

					return $q.reject(rejection);
				}

			};

	}]);
