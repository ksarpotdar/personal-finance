/* global angular */

(function() {
  'use strict';
  angular.module('pf.categories')
    .config(configuration);

  configuration.$inject = ['$stateProvider', '$urlRouterProvider', 'CONST'];
  function configuration($stateProvider, $urlRouterProvider, CONST) {

     //
     //views: {
     //     'tab-charts': {
     //       templateUrl: 'templates/charts.html',
     //       controller: 'ChartsCtrl as charts',
     //     },
     //   },

    $stateProvider
      .state('tabs.category', {
        url: '/category',
        views:{
          'tab-settings':{
            template:'<ion-nav-view></ion-nav-view>',
          },
        },
        abstract: true,
        resolve: {
          user: _userResolver,
          categories: _categoriesResolver,
        },
      })
      .state('tabs.category.list', {
        url: '/list',
        controller: 'CategoriesCtrl as catCtrl',
        templateUrl: 'templates/categories/list.html',
      })
      .state('tabs.category.add', {
        url: '/add',
        controller: 'CategoryCtrl as catCtrl',
        templateUrl: 'templates/categories/edit.html',
        resolve: {
          category: _addCategoryResolver,
        },
      })
      .state('tabs.category.edit', {
        url: '/edit/:id',
        controller: 'CategoryCtrl as catCtrl',
        templateUrl: 'templates/categories/edit.html',
        resolve: {
          category: _editCategoryResolver,
        },
      });

    $urlRouterProvider.otherwise('/category/list');

    _categoriesResolver.$inject = ['$stateParams', 'categoriesDatacontext'];
    function _categoriesResolver($stateParams, categoriesDatacontext) {
      return categoriesDatacontext.list();
    }

    _userResolver.$inject = ['Auth'];
    function _userResolver(Auth) {
      return Auth.resolveUser();
    }

    function _addCategoryResolver() {
      return {
        name: '',
        type: CONST.TransactionType.Expense,
      };
    }

    _editCategoryResolver.$inject = ['$stateParams', 'categoriesDatacontext'];
    function _editCategoryResolver($stateParams, categoriesDatacontext) {
      var transactionId = $stateParams.id;
      return categoriesDatacontext.get(transactionId);
    }
  }
})();
