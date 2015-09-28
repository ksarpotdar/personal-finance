/* global _, moment, angular */

(function () {
  "use strict";

  angular.module('pf.categories')
    .factory('CategoriesService', categoriesService);


  categoriesService.$inject = ['$state', '$q', 'CONST', 'categoriesDatacontext']
  function categoriesService($state, $q, CONST, categoriesDatacontext) {
    var self = this;
    this.categories = [];


    _activate();

    return {
      addCategory: _addCategory,
    };

    function _activate() {
      categoriesDatacontext.list().then(function (result) {
        self.categories = result;
      });
    }

    /**
    * Adds a new category, returns a $q promise
    */
    function _addCategory(name, type, user) {
      var deferred = $q.defer();

      if (_categoryExists(name)) {
        deferred.reject({
          error: CONST.Errors.Category.DUPLICATE_CATEGORY_NAME,
          message: 'Category with this name already exists.'
        });
      } else {
        var newCategory = { user_id: user.uid, type, name: name };

        self.categories.$add(newCategory).then(function (result) {
          deferred.resolve(result);
        }).catch(function (err) {
          deferred.reject(err);
        });
      }

      return deferred.promise;
    }    
    

    /**
    * update the category, returns a $q promise
    */
    function _updateCategory(categ) {

      var deferred = $q.defer();

      var category = categoriesDatacontext.get(categ.$id);
      if (!category) {
        deferred.reject({
          error: CONST.Errors.Category.DUPLICATE_NAME,
          message: 'Category with this name already exists.'
        });
      } else {
        
        if (_categoryExists(categ.name)) {
          deferred.reject({
            error: CONST.Errors.Category.NOT_FOUND,
            message: 'Category not found.'
          });
        } else {          
          category.name = categ.name;
          category.type = categ.type;

          self.categories.$save(category).then(function (result) {
            deferred.resolve(category);
          }).catch(function (err) {
            deferred.reject(err);
          });
        }
      }

      return deferred.promise;
    }

    function _categoryExists(name) {
      if (!self.categories.length) { return false; }
      return !!_getByName(name);
    }

    function _getByName(name) {
      var lowerName = name.toLowerCase();
      var category = _.find(self.categories, function (c) { return c.name.toLowerCase() === lowerName; });
      return category;
    }
  }
})();