'use script';

angular.module('alabama.controllers')
	.controller('ContatoCtrl', ['$rootScope', '$scope', '$timeout', 'ImmobileManager', 'MapTheme', 'URLS', function($rootScope, $scope, $timeout, ImmobileManager, MapTheme, URLS) {

		var self = this;

		self.enviando = false;

		self.map = {
			center: { latitude: -22.5, longitude: -43 },
			zoom: 14,
			options: {
				clickableIcons: false,
				maxZoom: 20,
				styles: MapTheme.styles,
			},
			marker: { 
				coords: { latitude: -22.5, longitude: -43 },
				title: 'Gaia',
				address: 'Endereco',
				contact: '(21) 2222-3333',
				options: {
					icon: '../images/marker.png',
					click: function() {
						self.map.window.show = !self.map.window.show;
					}
				}
			},
			window: {
				options: {
					show: false,
				},
				closeClick: function() {
					self.map.window.show = false;
				}
			},
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