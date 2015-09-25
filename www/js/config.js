/* global angular */

(function () {
  angular.module('pf')
    .config(['$provide', function ($provide) {
      $provide.decorator('$locale', ['$delegate', function ($delegate) {
        if ($delegate.id == 'en-us') {
          $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
          $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
        }
        return $delegate;
      }]);
    }])
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
            }],
            categories: function ($stateParams, categoriesDatacontext) {
              return categoriesDatacontext.list();
            }
          }
        })
        .state('transaction.add', {
          url: '/add/:transactionType',
          controller: 'TransactionCtrl as tran',
          templateUrl: 'templates/transactions/edit.html',
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
          templateUrl: 'templates/transactions/edit.html',
          resolve: {
            transaction: function ($stateParams, transactionsDatacontext) {
              var transactionId = $stateParams.id;
              return transactionsDatacontext.single(transactionId);
            }
          }
        });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/account/login');

    });
})();
