'use strict';

angular.module('alabama.directives')
	.directive('googleMaps', function() {

		function link(scope, elem, attrs) {
			console.log('appending maps');
			var scriptGMaps = angular.element(document.createElement('script'));
			scriptGMaps.attr('charset', 'utf-8');
			scriptGMaps.attr('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDhX6wLPc0Dq0dtsGhnAE5Fjhcd_d5YR5g&callback=initMap');
			elem.append(scriptGMaps);
		}

		return {
			restrict: 'E',
			scope: {
				apiKey: '='
			},
			link: link
		}

	});