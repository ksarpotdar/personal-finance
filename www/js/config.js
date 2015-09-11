/* global angular */

(function () {
  angular.module('pf')
    .config(function ($stateProvider, $urlRouterProvider) {

      $stateProvider

        .state('account', {
          url: '/account',
          abstract: true,
          template: '<ion-nav-view></ion-nav-view>',
          resolve: {
            user: ['Auth', function (Auth) {
              return Auth.resolveUser();
            }]
          }
        })
        .state('account.login', {
          url: '/login',
          controller: 'LoginCtrl as login',
          templateUrl: 'templates/account/login.html',
          data: {
            anonymous: true
          }
        })
        .state('account.logout', {
          url: '/logout',
          controller: 'LogoutCtrl as logout',
          data: {
            anonymous: true
          }
        })
        .state('account.new', {
          url: '/new',
          controller: 'NewAccountCtrl as new',
          templateUrl: 'templates/account/new.html',
          data: {
            anonymous: true
          }
        })

        .state('dashboard', {
          url: '/dashboard',
          controller: 'DashboardCtrl as dash',
          templateUrl: 'templates/dashboard.html'
        })

        .state('transaction', {
          url: '/transaction',
          template: '<ion-nav-view></ion-nav-view>',
          abstract: true,
          resolve: {
            user: ['Auth', function (Auth) {
              return Auth.resolveUser();
            }]
          }
        })
        .state('transaction.add', {
          url: '/add/:transactionType',
          controller: 'TransactionCtrl as tran',
          templateUrl: 'templates/transaction.html',
          resolve: {
            transaction: function ($stateParams) {
              return {
                amount: 0,
                category: '',
                currency: '$',
                date: moment(),
                type: $stateParams.transactionType
              };
            }
          }
        })
        .state('transaction.edit', {
          url: '/edit/:id',
          controller: 'TransactionCtrl as tran',
          templateUrl: 'templates/transaction.html',
          resolve: {
            transaction: function ($stateParams, transactionDatacontext) {
              var transactionId = $stateParams.id;
              return transactionDatacontext.single(transactionId);
            }
          }
        });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/account/login');

    });
})();
