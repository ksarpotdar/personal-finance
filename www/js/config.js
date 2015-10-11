/* global angular */

(function () {
  'use strict';
  angular.module('pf')
    .config(['$provide', function ($provide) { 
      $provide.decorator('$locale', ['$delegate', function ($delegate) {
        if ($delegate.id === 'en-us') {
          $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
          $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
        }
        return $delegate;
      }]);
    }])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

      $stateProvider
 
        .state('tabs', {
          url: '',
          abstract: true,
          templateUrl: 'templates/tabs.html',
          resolve: {
            user: ['Auth', function (Auth) {
              return Auth.resolveUser();
            }]
          }
        })
        .state('tabs.dashboard', {
          url: '/dashboard',
          views: {
            'tab-dashboard': {
              controller: 'DashboardCtrl as dash',
              templateUrl: 'templates/dashboard.html'
            }
          }
        })
        .state('tabs.settings', {
          url: '/settings',
          views: {
            'tab-settings': {
              templateUrl: 'templates/settings.html'
            }
          }
        });

      $urlRouterProvider.otherwise('/dashboard');

    }]);
})();
