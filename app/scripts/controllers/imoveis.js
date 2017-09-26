'use strict';

angular.module('alabama.controllers')
	.controller('ImoveisCtrl', ImoveisCtrl);

ImoveisCtrl.$inject = ['$rootScope', '$scope', '$location', '$timeout', '$window', 'ImmobileManager', 'SearchFilters'];

function ImoveisCtrl($rootScope, $scope, $location, $timeout, $window, ImmobileManager, SearchFilters) {

	var self = this, filtros = { }, _isLoading;

	(function getParams() {
		if (angular.equals($location.search(), { })) {
			if (SearchFilters.get()) {
				filtros = SearchFilters.get();
			}

			search();
			return;
		}

		var order = {
			column: $location.search().order ? $location.search().order.split('-')[0] : 3,
			order: $location.search().order ? $location.search().order.split('-')[1] : 1
		};

		filtros = $location.search();
		filtros.order = order;

		if (!filtros.page)
			filtros.page = 1;		
		
		SearchFilters.set(filtros);

		$timeout(function() {
			$scope.$broadcast('updateFilters', filtros);
			self.pagination.setPage(filtros.page - 1);
		}, 500);
	}());

	this.isLoading = function() {
		return _isLoading;
	};

	this.getFiltros = function() {
		return filtros;
	};

	this.cardList = [];	
	this.resumo = [];
	this.pagination = {
		index: 0,
		totalItems: 0,
		itemsPerPage: 12,
		getLabelResultado: function() {
			if (this.totalItems == 0) {
				return 'Nenhum imóvel encontrado';
			} else if (this.totalItems == 1) {
				return '1 imóvel encontrado';
			} else {
				return this.totalItems + ' imóveis encontrados';
			}
		},
		getPageAmount: function() {
			return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
		},
		goTo: function(page) {
			if (page < 0 || page >= self.pagination.getPageAmount())
				return;
				
			filtros.page = page + 1;
			search();
		},
		setPage: function(page) {
			this.index = page;
			getCardList(this.itemsPerPage * this.index + ',' + this.itemsPerPage, filtros);
		}, 
		hidePage: function(page) {
			if (this.index <= 2) {
				return page > 4;
			} else if (this.index > 2 && this.index < this.getPageAmount() - 2) {
				return page < this.index - 2 || page  > this.index + 2;
			} else if (this.index >= this.getPageAmount() - 2) {
				return page < (this.getPageAmount() - 1) - 4;
			}
		}
	};

	$scope.$on('$viewContentLoaded', function() {
		if ($window.innerWidth < 768)
			$timeout(function() { $scope.$broadcast('minimizeSearchbar', null); }, 500);
	});

	$scope.$on('search', function(event, filters) {
		angular.extend(filtros, filters);
		self.pagination.goTo(0);
	});

	function getCardList(limit, filters) {
		self.cardList = [];
		_isLoading = true;
		ImmobileManager.loadAllImmobiles(limit, filters).then(function(success) {
			angular.forEach(success.data, function(item) {
				self.cardList.push(item.convertToCardInfo());
			});
			self.pagination.totalItems = success.info.summary ? success.info.summary.quantity : 0;
			self.resumo = success.info.summary ? success.info.summary.features : { };
			$rootScope.scrollTop(300, 1);
			setOnCollapseFilters();
			_isLoading = false;
		}, function(error) {
			console.log(error);
			_isLoading = false;
		});
	}

	// Fixa o menu lateral de filtros quando o usuario dá scroll na tela
	$scope.$watch(function(scope) {
		return $rootScope.scrollY;
	}, updateSideMenu);

	// Para evitar que o menu fique por cima do footer ao descer recolhido e abrir depois
	function setOnCollapseFilters() {
		$timeout(function() {
			jQuery('.container-doido .collapse')
				.unbind('shown.bs.collapse')
				.unbind('hidden.bs.collapse')
				.on('shown.bs.collapse', updateSideMenu)
				.on('hidden.bs.collapse', updateSideMenu);
		});
	}

	function updateSideMenu() {
		var containerFilters = new function() {
			this.elem = jQuery('.filters > .container-doido');

			if (!this.elem.length) return;

			this.originalWidth = this.elem.css('width');
			this.height =  parseInt(this.elem.css('height'));
			this.filters = new function() {
				this.elem = jQuery('.filters');
				this.top = this.elem.position().top + 75;
			};
		};

		if (!containerFilters.elem.length) return;

		var y = $rootScope.scrollY,
			marginBottom = 20, 
			pageBottom = jQuery('.footer').position().top - (y + marginBottom) - containerFilters.height, 
			cardListHeight = parseInt(jQuery('div[name="card-list"]').css('height'));

		// Se o menu lateral for maior que os resultados, retira a classe floating e nao age no menu.
		if (cardListHeight <= containerFilters.height) {
			containerFilters.elem.removeClass('floating').css('width', '100%').css('margin-top', 15);
			return;
		}

		if (containerFilters.filters.top - y <= 0) {
			containerFilters.elem.addClass('floating').css('width', containerFilters.originalWidth).css('margin-top', 15);

			// Aqui empurra o menu pra cima quando bate no fim da pagina (15px antes do fim)
			if (pageBottom < 15) {
				containerFilters.elem.css('margin-top', pageBottom);
			}
		} else {
			containerFilters.elem.removeClass('floating').css('width', '100%').css('margin-top', 15);
		}
	}

	this.setFiltro = function(filter, value) {

		switch (filter) {
			case 'order':
				filtros.order = value;
				break;
			case 'bedroom': 
				if (filtros.dormitorios == value)
					filtros.dormitorios = null;
				else
					filtros.dormitorios = value
				break;

			case 'bathroom': 
				if (filtros.banheiros == value)
					filtros.banheiros = null;
				else
					filtros.banheiros = value;
				break;

			case 'suite': 
				if (filtros.suite == value)
					filtros.suite = null;
				else
					filtros.suite = value;
				break;

			case 'parking_spot': 
				if (filtros.garagem == value)
					filtros.garagem = null;
				else
					filtros.garagem = value;
				break;
		}

		this.pagination.goTo(0);
	};

	function search() {
		var temp = angular.extend({}, filtros, {
			order: filtros.order ? filtros.order.column + '-' + filtros.order.order : '3-1'
		});

		SearchFilters.set(filtros);

		$location.path('/imoveis').search(temp);
	}
}