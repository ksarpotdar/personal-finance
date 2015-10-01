(function () {
  "use strict";

  angular.module('pf.account')
    .controller('AccountCtrl', function ($scope) { })
    .controller('LoginCtrl', loginCtrl)
    .controller('LogoutCtrl', logoutCtrl)
    .controller('NewAccountCtrl', newAccountCtrl);

  logoutCtrl.$inject = ['$state', '$ionicHistory', 'Auth'];
  function logoutCtrl($state, $ionicHistory, Auth) {
    activate();

    function activate() {
      Auth.logout();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('account.login');
    }
  }

  loginCtrl.$inject = ['$state', '$timeout', '$location', '$ionicHistory', 'Auth', 'user'];
  function loginCtrl($state, $timeout, $location, $ionicHistory, Auth, user) {
    var self = this;
    this.username = '';
    this.password = '';
    this.loading = false;

    this.submit = login;

    activate();

    function activate() {
      //$ionicHistory.clearHistory();
      if (Auth.signedIn()) {
        _toDashboard();
      }
    }

    function login() {
      self.loading = true;
      self.password = 'asdf';
      Auth.login(self.username, self.password).then(function () {
        self.loading = false;
        _toDashboard();
      }).catch(function (err) {
        self.errorMessage = err;
      });
      self.loading = true;
    }

    function _toDashboard() {
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
      $state.go('tabs.dashboard', {}, { location: "replace", reload: true });
    }

  }


  newAccountCtrl.$inject = ['$state', '$ionicHistory', 'Auth', 'user'];
  function newAccountCtrl($state, $ionicHistory, Auth, user) {
    var self = this;
    this.errorMessage = '';
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

    function createAccount() {
      self.errorMessage = '';
      self.loading = true;

      Auth.register(self.username, self.password).then(function () {
        return Auth.login(self.username, self.password).then(function (result) {
          return Auth.createProfile(result).then(function () {
            self.loading = false;
            _toDashboard();
          });
        });
      }).catch(function (err) {
        self.errorMessage = err;
      });
      self.loading = true;
    }

    function _toDashboard() {
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
      $state.go('tabs.dashboard', {}, { location: "replace", reload: true });
    }
  }

})();