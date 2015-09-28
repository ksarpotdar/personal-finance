/* global _, moment, angular */

/// <reference path="category.service.js" />
(function () {
  "use strict";

  angular.module('pf.categories')
    .controller('CategoryCtrl', CategoryCtrl);


  CategoryCtrl.$inject = ['$state', '$ionicHistory', 'CONST', 'CategoriesService', 'category', 'user']
  function CategoryCtrl($state, $ionicHistory, CONST, categoriesService, category, user) {
    var self = this;
    this.category = angular.copy(category);

    this.categoryTypes = [{
      name: 'Income',
      id: CONST.TransactionType.Income
    }, {
        name: 'Expense',
        id: CONST.TransactionType.Expense
      }];


    this.execute = execute;
    this.delete = _delete;

    activate();
    function activate() { }

    function execute(categoryFrm) {
      if (!categoryFrm.$valid) {
        return;
      }

      if (self.category.$id) {
        _updateCategory();
      } else {
        _addCategory()
      }
    }

    function _addCategory() {
      categoriesService.addCategory(self.category.name, self.category.type, user).then(function (result) {
        console.log('wohooo', result);
      }).catch(function (result) {
        console.log('oooops', result);
      });
    }

    function _updateCategory() {
      categoriesService.addCategory(self.category).then(function (result) {
        console.log('wohooo', result);
      }).catch(function (result) {
        console.log('oooops', result);
      });
    }

    function _delete() {
      //TODO: show warning message
      //TODO: delete all associations from the transactions linked with this category
      // we could just mark the category as deleted and simply not show it in the dropdown when editing a category or when showing the  list of categories 
    }
        
    function _goBack() {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $state.go('categories.list');
      }
    }
  }
})();