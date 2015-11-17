(function() {
  'use strict';

  angular.module('pf.account')
    .controller('LoginCtrl', loginCtrl)
    .controller('LogoutCtrl', logoutCtrl)
    .controller('NewAccountCtrl', newAccountCtrl);

  logoutCtrl.$inject = ['$state', '$ionicHistory', 'Auth', 'recurrenceRunnerService'];
  function logoutCtrl($state, $ionicHistory, Auth, recurrenceRunnerService) {
    activate();

    function activate() {
      recurrenceRunnerService.stop();
      Auth.logout();
      $ionicHistory.nextViewOptions({
        disableBack: true,
      });
      $state.go('account.login');
    }
  }

  loginCtrl.$inject = ['$state', '$ionicHistory', 'Auth', 'logging'];
  function loginCtrl($state, $ionicHistory, Auth, logging) {
    var _this = this;
    this.username = '';
    this.password = '';
    this.loading = false;

    this.submit = login;

    activate();

    function activate() {
      if (Auth.signedIn()) {
        debugger;
        _toDashboard();
      }
    }

    function login(form) {
      if (form.$invalid) {
        return;
      }

      _this.loading = true;
      _this.errorMessage = '';

      Auth.login(_this.username, _this.password).then(function() {
        _toDashboard();
      }).catch(function(err) {
        var errMessages = ['INVALID_EMAIL', 'INVALID_PASSWORD'];
        if (errMessages.indexOf(err.code) > -1) {
          _this.errorMessage = 'Invalid email or password';
        } else {
          logging.error('Unknown error code on login: ', err);
        }

      }).finally(function() {
        _this.loading = false;
      });
    }

    function _toDashboard() {
      $ionicHistory.nextViewOptions({
        historyRoot: true,
      });
      $state.go('tabs.dashboard');
    }
  }

  newAccountCtrl.$inject = ['$state', '$ionicHistory', 'Auth'];
  function newAccountCtrl($state, $ionicHistory, Auth) {
    var _this = this;
    this.username = '';
    this.password = '';
    this.loading = false;

    this.submit = createAccount;

    activate();

    function activate() {
      if (Auth.signedIn()) {
        _toDashboard();
      }
    }

    function createAccount(form) {
      if (form.$invalid) {
        return;
      }

      _this.errorMessage = '';
      _this.loading = true;

      Auth.register(_this.username, _this.password).then(function() {
        return Auth.login(_this.username, _this.password).then(function(result) {
          return Auth.createProfile(result).then(function() {
            _toDashboard();
          });
        });
      }).catch(function(err) {
        _this.errorMessage = err;
      }).finally(function() {
        _this.loading = false;
      });
    }

    function _toDashboard() {
      $ionicHistory.nextViewOptions({
        historyRoot: true,
      });
      $state.go('tabs.dashboard', {}, {location: 'replace', reload: true});
    }
  }

})();
