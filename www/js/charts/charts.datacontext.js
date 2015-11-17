/* global moment */
/* global angular */
(function() {
  'use strict';

  angular.module('pf.charts').factory('chartsDatacontext', chartsDatacontext);

  chartsDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', '$firebaseUtils', 'pfFirebaseArray', 'categoriesDatacontext', 'Auth', 'CONST', 'errors'];
  function chartsDatacontext($q, $timeout, $window, $firebaseArray, $firebaseUtils, pfFirebaseArray, categoriesDatacontext, Auth, CONST, errors) {
    var user = null,
      ref = new $window.Firebase(CONST.FirebaseUrl);

    _activate();

    return {
      getSumByCategory: getSumByCategory,
    };

    function _activate(user) {
      user = Auth.resolveUser();
    }

    function getSumByCategory(start, end) {
      _ensureUser();

      var transactionRef = ref.child('profile').child(user.uid).child('transactions')
        .orderByChild('date')
        .startAt(start.unix()).endAt(end.unix()),
        transactionsFirebaseArray = _createTransactionsFirebaseArray(),
        transactions = transactionsFirebaseArray(transactionRef);

      return categoriesDatacontext.list().then(function(categories) {
        return transactions.$loaded().then(function(data) {
          return _(data).groupBy(function(tr) {
            return tr.category;
          }).map(function(group, key) {
            var categ = _.find(categories, function(c) {
              return c.$id === key;
            });

            return {
              key: categ.name,
              sum: _(group).reduce(function(sum, tr) {
                return sum + tr.amount;
              }, 0),
            };
          }).value();
        });
      });
    }

    function _createTransactionsFirebaseArray() {
      return pfFirebaseArray({
        $$added: function(snap) {
          var rec = $firebaseArray.prototype.$$added.call(this, snap);
          rec.amountSigned = rec.type === CONST.TransactionType.Expense ? -rec.amount : rec.amount;
          rec.date = moment.unix(rec.date);
          return rec;
        },
      });
    }

    function _ensureUser() {
      if (!user) {
        user = Auth.resolveUser();
      }
    }
  }

})();
