'use strict';

angular.module('alabama.controllers')
.controller('HomeCtrl', ['$rootScope', '$scope', '$window', 'ImmobileManager', function ($rootScope, $scope, $window, ImmobileManager) {

	var self = this;

	self.featuredList = [
		{
			dummy: true
		},
		{
			dummy: true
		},
		{
			dummy: true
		}
	];

	self.lastOnes = [
		{
			dummy: true
		},
		{
			dummy: true
		},
		{
			dummy: true
		},
		{
			dummy: true
		},
		{
			dummy: true
		},
		{
			dummy: true
		}
	];

	function getDestaques() {
		$rootScope.loading.load();
		ImmobileManager.loadAllFeatured().then(function(success) {
			self.featuredList = [ ];
			angular.forEach(success, function(item) {			
				self.featuredList.push(item.convertToCardInfo());
			});
			$scope.$broadcast('update-cardCarousel');
			$rootScope.loading.unload();
		}, function(error) {
			$rootScope.loading.unload();
		});
	}

	function getUltimos() {
		$rootScope.loading.load();
		ImmobileManager.loadLastOnes().then(function(success) {
			self.lastOnes = [];
			angular.forEach(success, function(item) {			
				self.lastOnes.push(item.convertToCardInfo());
			});
			$rootScope.loading.unload();
		}, function(error) {
			$rootScope.loading.unload();
		});	
	}

	$scope.$on('$viewContentLoaded', function() {
		getDestaques();
		getUltimos();
	});
	
}]);
