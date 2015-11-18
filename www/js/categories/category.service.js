/* global _, moment, angular */

(function() {
  'use strict';

  angular.module('pf.categories')
    .factory('CategoryService', categoriesService);

  categoriesService.$inject = ['$state', '$q', 'CONST', 'categoriesDatacontext', 'errors', 'logging'];
  function categoriesService($state, $q, CONST, categoriesDatacontext, errors, logging) {
    logging.debug('entering categories service');

    /*jshint validthis: true */
    var _this = this;
    this.categories = [];

    _activate();

    return {
      add: _add,
      update: _update,
      delete: _delete,
    };

    function _activate() {
      categoriesDatacontext.list().then(function(result) {
        _this.categories = result;
      });
      logging.debug('activated categories service');
    }

    function _add(name, type, user) {
      var deferred = $q.defer();

      if (_categoryExists(name)) {
        deferred.reject(new errors.DuplicateCategoryNameError('Category with this name already exists.'));
      } else {
        var newCategory = {user_id: user.uid, type: type, name: name}; // jshint ignore:line
        return _this.categories.$add(newCategory);
      }

      return deferred.promise;
    }

    function _update(categ) {
      return categoriesDatacontext.get(categ.$id).then(function(category) {
        if (_categoryExists(categ.name, categ.$id)) {
          throw new errors.DuplicateCategoryNameError('Category with this name already exists.');
        } else {
          category.name = categ.name;
          category.type = categ.type;
          return _this.categories.$save(category);
        }
      });
    }

    function _delete(categ) {
      return categoriesDatacontext.get(categ.$id).then(function(category) {
        category.deleted = moment().unix();
        return _this.categories.$save(category);
      });
    }

    function _categoryExists(name, excludedId) {
      if (!_this.categories.length) {
        return false;
      }

      if (excludedId) {
        var cat = _getByName(name);
        return cat && cat.$id !== excludedId;
      }
      return !!_getByName(name);
    }

    function _getByName(name) {
      var lowerName = name.toLowerCase();
      var category = _.find(_this.categories, function(c) {
        return c.name.toLowerCase() === lowerName;
      });
      return category;
    }

  }
})();
