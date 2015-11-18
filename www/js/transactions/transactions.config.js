/* global angular */

(function() {
  'use strict';

  angular.module('pf.transactions')
    .config(configuration);

  configuration.$inject = ['$stateProvider', '$urlRouterProvider', 'CONST'];
  function configuration($stateProvider, $urlRouterProvider, CONST) {

    $stateProvider
      .state('tabs.transaction', {

        url: '/transaction',
        views:{
          'tab-dashboard':{
            template:'<ion-nav-view></ion-nav-view>',
          },
        },

        abstract: true,
        resolve: {
          user: _userResolver,
          categories: _categoriesResolver,
        },
      })
      .state('tabs.transaction.add', {
        url: '/add/:transactionType',
        controller: 'TransactionCtrl as tran',
        templateUrl: 'templates/transactions/edit.html',
        resolve: {
          transaction: _addTransactionResolver,
        },
      })
      .state('tabs.transaction.edit', {
        url: '/edit/:id',
        controller: 'TransactionCtrl as tran',
        templateUrl: 'templates/transactions/edit.html',
        resolve: {
          transaction: _editTransactionResolver,
        },
      });

    $urlRouterProvider.otherwise('/dashboard');

    _categoriesResolver.$inject = ['$stateParams', 'categoriesDatacontext'];
    function _categoriesResolver($stateParams, categoriesDatacontext) {
      return categoriesDatacontext.list().then(function(categories) {
        return _.filter(categories, function(c) { return !c.deleted; });
      });
    }

    _userResolver.$inject = ['Auth'];
    function _userResolver(Auth) {
      return Auth.resolveUser();
    }

    _addTransactionResolver.$inject = ['$stateParams'];
    function _addTransactionResolver($stateParams) {
      return {
        amount: null,
        category: '',
        currency: '$',
        date: moment(),
        type: $stateParams.transactionType,
      };
    }

    _editTransactionResolver.$inject = ['$stateParams', 'transactionsDatacontext'];
    function _editTransactionResolver($stateParams, transactionsDatacontext) {
      var transactionId = $stateParams.id;
      return transactionsDatacontext.single(transactionId);
    }
  }
})();
