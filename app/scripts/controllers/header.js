/**
 * Created by egmfilho on 20/01/17.
 */

'use strict';

angular.module('alabama.controllers')
	.controller('HeaderCtrl', HeaderCtrl);

HeaderCtrl.$inject = [ '$scope', '$filter', 'ImmobileManager' ];

function HeaderCtrl($scope, $filter, ImmobileManager) {

	$scope.featuredList = [];

	jQuery('.header5 #carousel-showcase').carousel({
		pause: null,
		interval: 8000
	});

	this.toggleHeader5Mobile = function() {
		if (jQuery('.header5-mobile').css('display') == 'none') {
			this.showHeader5Mobile();
		} else {
			this.hideHeader5Mobile();
		}
	};

	this.showHeader5Mobile = function() {
		jQuery('.header5-mobile').fadeIn(250);
	};

	this.hideHeader5Mobile = function() {
		jQuery('.header5-mobile').fadeOut(250);
	};

	jQuery('.header5-mobile').bind('touchmove mousewheel DOMMouseScroll', function(e) {
		e.preventDefault();
	});

}