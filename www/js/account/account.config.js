/* global angular */

(function () {
  angular.module('pf.account')
    .config(configuration);

  configuration.$inject = ['$stateProvider', '$urlRouterProvider'];
  function configuration($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('account', {
        url: '/account',
        abstract: true,
        template: '<ion-nav-view></ion-nav-view>',
        resolve: {
          user: _userResolver
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
        template: '',
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
      });

    $urlRouterProvider.otherwise('/account/login');

    _userResolver.$inject = ['Auth'];
    function _userResolver(Auth) {
      return Auth.resolveUser();
    };
  }
})();
