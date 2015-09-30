/* global angular */

(function () {
  angular.module('pf', ['ionic', 'ionic-datepicker', 'pf.dashboard', 'pf.account', 'pf.datacontext', 'pf.categories', 'pf.transactions', 'pf.common-directives', 'pf.constants', 'pf.filters'])
    .run(function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleLightContent();
        }
      });
    })
    .run(function ($rootScope, $state, Auth) {
      $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
        if (!Auth.signedIn()) {
          // all controllers need authentication unless otherwise specified
          if (!next.data || !next.data.anonymous) {
            event.preventDefault();
            $state.go('account.login');
          }
        }
      });

      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        console.error('$stateChangeError: ', error);
        console.log(arguments);
      });
    });
})();
