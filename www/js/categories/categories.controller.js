(function () {
  'use strict';

  angular.module('pf.categories')
    .controller('CategoriesCtrl', CategoriesCtrl);


  CategoriesCtrl.$inject = ['$state', 'CONST', 'categoriesDatacontext', 'logging', 'searchProvider'];
  function CategoriesCtrl($state, CONST, categoriesDatacontext, logging, searchProvider) {
    logging.logDebug('entering CategoriesCtrl');
    
    var self = this;
    this.categories = [];

    this.edit = _edit;

    activate();
    function activate() {
      searchProvider.query(
        { a: 'b' },
        function (data) {
          console.log(data);
        });

      categoriesDatacontext.list().then(function (result) {
        self.categories = result;
      });
    }

    function _edit(category) {
      logging.logDebug('Clicked on edit Category.', category);
      $state.go('category.edit', { id: category.$id });
    }
  }
})();