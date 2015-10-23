(function () {
  'use strict';

  angular.module('pf.categories')
    .controller('CategoriesCtrl', CategoriesCtrl);


  CategoriesCtrl.$inject = ['$state', 'CONST', 'categoriesDatacontext', 'logging'];
  function CategoriesCtrl($state, CONST, categoriesDatacontext, logging) {
    logging.debug('entering CategoriesCtrl');
    
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
      logging.debug('Clicked on edit Category.', category);
      $state.go('category.edit', { id: category.$id });
    }
  }
})();