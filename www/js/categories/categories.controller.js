/* global _, moment, angular */

(function () {
  "use strict";

  angular.module('pf.categories')
    .controller('CategoriesCtrl', CategoriesCtrl);


  CategoriesCtrl.$inject = ['$state', 'CONST', 'categoriesDatacontext']
  function CategoriesCtrl($state, CONST, categoriesDatacontext) {
    var self = this;
    this.categories = [];

    this.edit = _edit;

    activate();
    function activate() {
      categoriesDatacontext.list().then(function (result) {
        self.categories = result;
      });
    }

    function _edit(category) {
      $state.go('category.edit', { id: category.$id });
    }
  }
})();