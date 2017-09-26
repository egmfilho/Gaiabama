/**
 * Created by egmfilho on 08/08/16.
 */

'use strict';

angular.module('alabama.filters')
	.filter('truncate', function() {
		return function(value, max, tail) {

			if (!value)
				return '';

			max = parseInt(max, 10);
			if (!max)
				return value;

			if (value.length <= max)
				return value;

			value = value.substring(0, max);

			var lastSpace = value.lastIndexOf(' ');

			if (lastSpace != -1) {
				if (value.charAt(lastSpace - 1) == ',' || value.charAt(lastSpace - 1) == '.') {
					lastSpace = lastSpace - 1;
				}
			}

			return value.substring(0, lastSpace) + (tail || '…');
		}
	});

