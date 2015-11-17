(function() {
  'use strict';

  angular.module('pf.transactions').factory('transactionsDatacontext', transactionsDatacontext);

  transactionsDatacontext.$inject = ['$q', '$window', 'categoriesDatacontext', 'recurrenceDatacontext', '$firebaseArray', '$firebaseObject', '$firebaseUtils', 'pfFirebaseArray', 'pfFirebaseObject', 'Auth', 'CONST'];
  function transactionsDatacontext($q, $window, categoriesDatacontext, recurrenceDatacontext, $firebaseArray, $firebaseObject, $firebaseUtils, pfFirebaseArray, pfFirebaseObject, Auth, CONST) {
    var ref = new $window.Firebase(CONST.FirebaseUrl),
      user = Auth.resolveUser(),
      _transactionsLoaded = false,
      transactions = null;

    return {
      list: getTransactions,
      listByCategory: getByCategory,
      single: _getById,
      add: add,
      update: update,
      remove: remove,
    };

    function getTransactions(start, end) {
      _ensureUser();
      var transactionRef = ref.child('profile').child(user.uid).child('transactions')
        .orderByChild('date')
        .startAt(start.unix()).endAt(end.unix()),
        transactionsFirebaseArray = _createTransactionsFirebaseArray();

      transactions = transactionsFirebaseArray(transactionRef);

      return transactions.$loaded().then(function(data) {
        _transactionsLoaded = true;
        return data;
      });
    }

    function getByCategory(categoryId, start, end) {
      _ensureUser();
      var categoryRef = categoriesDatacontext.categoryRef;
      categoryRef.child(categoryId).child('transactions').once('value', function(trSnap) {
        debugger;
      });
    }

    function add(transaction) {
      var newTransaction = {
        type: transaction.type,
        amount: transaction.amount || 0,
        note: transaction.note || '',
        category: transaction.category.$id,
        date: transaction.date.unix(),
        dateFormatted: transaction.date.format(),
        rootTransactionId: transaction.rootTransactionId,
        recurrenceId: transaction.recurrenceId,
      };

      _removeUndefined(newTransaction);

      return transactions.$add(newTransaction).then(function(result) {
        categoriesDatacontext.addTransactionToCategory(transaction.category, result.key(), newTransaction);
        var newTranIdx = transactions.$indexFor(result.key());
        return transactions[newTranIdx];
      });
    }

    function update(updatedTransaction) {
      _ensureUser();
      var updateableFields = ['amount', 'note', 'date', 'dateFormatted',
        'type', 'category', 'recurrenceId',
        'rootTransactionId', ];

      prepareForSave(updatedTransaction);
      return saveTransaction(updatedTransaction);

      function prepareForSave(tran) {
        tran.date = tran.date.unix();
        tran.category = tran.category.$id;
      }

      function saveTransaction(tran) {
        return tran.$save(updateableFields).then(function() {
          return _inflateTransaction(updatedTransaction);
        });
      }
    }

    function remove(transaction) {
      _ensureUser();
      return _getById(transaction.$id).then(function(tr) {
        if (tr) {
          return tr.$remove(tr);
        } else {
          return null;
        }
      });
    }

    function _getById(id) {
      var singleTransactionRef = ref.child('profile')
        .child(user.uid).child('transactions')
        .child(id),
        transactionObject = _createFirebaseObject();

      return transactionObject(singleTransactionRef).$loaded(_inflateTransaction);
    }

    function _inflateTransaction(tran) {
      if (!moment.isMoment(tran.date)) {
        tran.date = moment.unix(tran.date);
      }

      var promises = [];
      if (tran.recurrenceId) {
        var recPromise = recurrenceDatacontext.getById(tran.recurrenceId).then(function(rec) {
          tran.recurrence = rec;
        });

        promises.push(recPromise);
      }

      var categPromise = categoriesDatacontext.get(tran.category).then(function(category) {
        tran.category = category;
        return tran;
      });

      promises.push(categPromise);

      return $q.all(promises).then(function() {
        return tran;
      });
    }

    function _removeUndefined(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && _.isUndefined(obj[prop])) {
          delete obj[prop];
        }
      }
    }

    function _createFirebaseObject() {
      return pfFirebaseObject({
        $$updated: function(snap) {
          // debugger;
          var updated = $firebaseObject.prototype.$$updated.call(this, snap);
          if (updated) {
            // this.category = initialCateg;
            // categoriesDatacontext.get(rec.category).then(function (category) {
            // 	rec.category = category;
            // });
            var data = snap.val();
            if (data) {
              this.date = moment.unix(data.date);
            }

            // this.amountSigned = updatedTransaction.type === CONST.TransactionType.Expense ? -updatedTransaction.amount : updatedTransaction.amount;
          }

          return updated;
        },
      });
    }

    function _ensureUser() {
      user = Auth.resolveUser();
    }

    function _createTransactionsFirebaseArray() {
      return pfFirebaseArray({
        $$added: function(snap) {
          var rec = $firebaseArray.prototype.$$added.call(this, snap);
          rec.amountSigned = rec.type === CONST.TransactionType.Expense ? -rec.amount : rec.amount;
          rec.date = moment.unix(rec.date);

          if (rec.recurrenceId) {
            rec.recurrence = recurrenceDatacontext.getById(rec.recurrenceId);
          }

          categoriesDatacontext.get(rec.category).then(function(category) {
            rec.category = category;
          });

          return rec;
        },

        $$updated: function(snap) {
          // debugger;
          var updated = $firebaseArray.prototype.$$updated.call(this, snap);
          if (updated) {
            var rec = this.$getRecord($firebaseUtils.getKey(snap));

            rec.amountSigned = rec.type === CONST.TransactionType.Expense ? -rec.amount : rec.amount;
            rec.date = moment.unix(rec.date);

            if (rec.recurrenceId) {
              rec.recurrence = recurrenceDatacontext.getById(rec.recurrenceId);
            }

            categoriesDatacontext.get(rec.category).then(function(category) {
              rec.category = category;
            });
          }

          return updated;
        },
      });
    }
  }
})();
