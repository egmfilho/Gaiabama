'use script';

angular.module('alabama.controllers')
	.controller('ContatoCtrl', ['$rootScope', '$scope', '$timeout', 'NgMap', 'ImmobileManager', 'URLS', function($rootScope, $scope, $timeout, NgMap, ImmobileManager, URLS) {

		var self = this;

		self.enviando = false;

		NgMap.getMap().then(function(map) {
			self.map = map;
		});

		this.mapInfo = {
			title: 'Gaia',
			address: 'Endereço',
			contact: '(21) 2222-3333'
		};

		self.array = [];
		$rootScope.loading.load();
		ImmobileManager.loadMostVisited().then(function(success) {
			angular.forEach(success, function(item) {			
				self.array.push(item.convertToCardInfo());
			});
			$rootScope.loading.unload();
		}, function(error) {
			$rootScope.loading.unload();
		});

		function successMessage() {
			self.enviando = false;
			self.modal = {
				title: 'Sucesso',
				message: 'A mensagem foi enviada com sucesso! Agradecemos pelo contato.'
			};
			jQuery('.modal.fade').modal('show');
			$scope.$apply();
		}

		function errorMessage() {
			self.enviando = false;
			self.modal = {
				title: 'Erro',
				message: 'Infelizmente não foi possível enviar sua mensagem. Tente novamente mais tarde.'
			};
			jQuery('.modal.fade').modal('show');
			$scope.$apply();
		}

		jQuery('form').on('submit', function(e) {
			e.stopPropagation();
			e.preventDefault();
			
			self.enviando = true;
			// $scope.$apply();
			$rootScope.loading.load();
			jQuery.ajax({
				url: URLS.root + 'api/mail.php?action=contact',
				method: 'POST',
				dataType: 'json',
				data: jQuery('form').serialize(),
				success: function(data) {
					$rootScope.loading.unload();					
					successMessage();
				},
				error: function(data) {
					$rootScope.loading.unload();
					errorMessage();
				}
			});
		});

}]);