/* global angular */

(function() {
  'use strict';
  angular.module('pf.charts')
    .config(chartsConfig)
    .config(configuration);

  chartsConfig.$inject = ['ChartJsProvider'];
  function chartsConfig(ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: [
        '#97BBCD', // blue
        '#F7464A', // red
        '#46BFBD', // green
        '#FDB45C', // yellow
      ],
    });
  }

  configuration.$inject = ['$stateProvider', '$urlRouterProvider'];
  function configuration($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('tabs.charts', {
        url: '/charts',

        views: {
          'tab-charts': {
            templateUrl: 'templates/charts.html',
            controller: 'ChartsCtrl as charts',
          },
        },
        resolve: {
          user: _userResolver,
          categories: _categoriesResolver,
        },
      });

    $urlRouterProvider.otherwise('/charts');

    _categoriesResolver.$inject = ['$stateParams', 'categoriesDatacontext'];
    function _categoriesResolver($stateParams, categoriesDatacontext) {
      return categoriesDatacontext.list();
    }

    _userResolver.$inject = ['Auth'];
    function _userResolver(Auth) {
      return Auth.resolveUser();
    }
  }
})();
