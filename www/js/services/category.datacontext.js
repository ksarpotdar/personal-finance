/* global moment */
/* global angular */
(function() {
  'use strict';

  angular.module('pf.datacontext').factory('categoriesDatacontext', categoriesDatacontext);

  categoriesDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', '$firebaseUtils', 'Auth', 'CONST', 'errors'];
  function categoriesDatacontext($q, $timeout, $window, $firebaseArray, $firebaseUtils, Auth, CONST, errors) {
    var user = null,
      categoryRef = null,
      categoriesArr = null,
      _categoriesLoaded = false,
      ref = new $window.Firebase(CONST.FirebaseUrl),
      _this = this;

    _activate();

    var api = {
      list: getCategories,
      sumByCategory: sumByCategory,
      get: _getById,
      addTransactionToCategory: addTransactionToCategory,
      categoryRef: categoryRef,
    };

    return _wrapApi(api);

    function _activate() {
      user = Auth.resolveUser();

      if (!user) {
        return;
      }

      categoryRef = ref.child('profile').child(user.uid).child('categories');
      categoriesArr = _createCategoryFirebaseArray()(categoryRef);

      categoriesArr
        .$loaded()
        .then(function() {
          _categoriesLoaded = true;
        });
    }

    function sumByCategory() {
      for (var i = 0; i < categoriesArr.length; i++) {
        var category = categoriesArr[i];
        category.refreshSum();
      }

      $timeout(function() {
        var r = categoriesArr[0];
        console.log(r);
      }, 1000);
    }

    function getCategories() {
      return categoriesArr.$loaded();
    }

    //link the category with a transaction
    function addTransactionToCategory(category, transactionKey, transaction) {
      var categoryTransactionRef = categoryRef.child(category.$id).child('transactions');
      categoryTransactionRef.child(transactionKey)
        .setWithPriority({
          amount: transaction.amount,
          date: transaction.date,
        }, transaction.date);
    }

    function _getById(id) {
      var deferred = $q.defer();
      if (_categoriesLoaded) {
        var category = _.findWhere(categoriesArr, {$id: id});
        if (category) {
          deferred.resolve(category);
        } else {
          deferred.reject(new errors.NotFoundError('Category not found'));
        }
      } else {
        categoriesArr.$loaded().then(function() {
          var category = _.findWhere(categoriesArr, {$id: id});
          if (category) {
            deferred.resolve(category);
          } else {
            deferred.reject(new errors.NotFoundError('Category not found'));
          }
        });
      }

      return deferred.promise;
    }

    function _createCategoryFirebaseArray() {
      return $firebaseArray.$extend({
        $$added: function(snap) {
          var rec = $firebaseArray.prototype.$$added.call(this, snap);

          rec.refreshSum = function(start, end) {
            start = start || moment().add(-10, 'days').unix();
            end = end || moment().unix();

            rec.sum = 0;

            var categSumRef = categoryRef.child(rec.$id).child('transactions').orderByChild('date').startAt(start).endAt(end);
            categSumRef.on('child_added', function(snapshot) {
              console.log(snapshot.key());
              var data = snapshot.val();
              rec.sum += data.amount;
            });
          };

          return rec;
        },

        // https://gist.github.com/katowulf/d0c230f1a7f6b5806a29
        $save: function(indexOrItem, listOfFields) {
          listOfFields = listOfFields || ['name', 'type', 'deleted'];
          if (!listOfFields) {
            // do a normal save if no list of fields is provided
            return $firebaseArray.prototype.$save.apply(this, arguments);
          }

          var _this = this,
            item = _this._resolveItem(indexOrItem),
            key = _this.$keyAt(item);

          if (key !== null) {
            var ref = _this.$ref().ref().child(key),
              updateFields = _pickFields(item, listOfFields),
              data = $firebaseUtils.toJSON(updateFields);

            return $firebaseUtils.doSet(ref, data).then(function() {
              _this.$$notify('child_changed', key);
              return ref;
            });
          } else {
            return $firebaseUtils.reject('Invalid record; could determine key for ' + indexOrItem);
          }
        },
      });

      function _pickFields(data, fields) {
        var out = {};
        angular.forEach(fields, function(k) {
          out[k] = data.hasOwnProperty(k) ? data[k] : null;
        });

        return out;
      }
    }

    function _wrapApi(obj) {
      for (var prop in obj) {
        if (api.hasOwnProperty(prop)) {
          obj[prop] = _ensureInitialized(api[prop]);
        }
      }

      return obj;
    }

    function _ensureInitialized(func) {
      return function() {
        if (!user) {
          user = Auth.resolveUser();
          _activate();
        }

        return func.apply(_this, arguments);
      };
    }
  }
})();
