(function() {
  'use strict';

  angular.module('pf.categories')
    .controller('CategoriesCtrl', CategoriesCtrl);

  CategoriesCtrl.$inject = ['$state', '$ionicListDelegate', 'categoriesDatacontext', 'logging'];
  function CategoriesCtrl($state, $ionicListDelegate, categoriesDatacontext, logging) {
    var _this = this;
    this.categories = [];

    this.edit = _edit;

    activate();
    function activate() {
      categoriesDatacontext.list().then(function(result) {
        _this.categories = result;
      });
    }

    function _edit(category) {
      $state.go('tabs.category.edit', {id: category.$id});
      $ionicListDelegate.closeOptionButtons();
    }
  }
})();
