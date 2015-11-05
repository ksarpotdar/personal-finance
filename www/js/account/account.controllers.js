(function() {
  'use strict';

  angular.module('pf.account')
    .controller('AccountCtrl', function() { })
    .controller('LoginCtrl', loginCtrl)
    .controller('LogoutCtrl', logoutCtrl)
    .controller('NewAccountCtrl', newAccountCtrl);

  logoutCtrl.$inject = ['$state', '$ionicHistory', 'Auth'];
  function logoutCtrl($state, $ionicHistory, Auth) {
    activate();

    function activate() {
      Auth.logout();
      $ionicHistory.nextViewOptions({
        disableBack: true,
      });
      $state.go('account.login');
    }
  }

  loginCtrl.$inject = ['$state', '$ionicHistory', 'Auth'];
  function loginCtrl($state, $ionicHistory, Auth) {
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

    function login() {
      _this.loading = true;
      _this.password = 'asdf';

      Auth.login(_this.username, _this.password).then(function() {
        _this.loading = false;
        _toDashboard();
      }).catch(function(err) {
        _this.errorMessage = err;
      });

      _this.loading = true;
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
      if(form.$invalid){
        return;
      }
      
      _this.errorMessage = '';
      _this.loading = true;

      Auth.register(_this.username, _this.password).then(function() {
        return Auth.login(_this.username, _this.password).then(function(result) {
          return Auth.createProfile(result).then(function() {
            _this.loading = false;
            _toDashboard();
          });
        });
      }).catch(function(err) {
        _this.errorMessage = err;
      });

      _this.loading = true;
    }

    function _toDashboard() {
      $ionicHistory.nextViewOptions({
        historyRoot: true,
      });
      debugger;
      $state.go('tabs.dashboard', {}, { location: 'replace', reload: true });
    }
  }

})();
