(function() {
  'use strict';

  angular.module('pf.recurrence').factory('recurrenceDatacontext', recurrenceDatacontext);

  recurrenceDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', '$firebaseObject', '$firebaseUtils', 'Auth', 'CONST'];
  function recurrenceDatacontext($q, $timeout, $window, $firebaseArray, $firebaseObject, $firebaseUtils, Auth, CONST) {
    var ref = new $window.Firebase(CONST.FirebaseUrl);
    var user = Auth.resolveUser();
    var recurrences = null;

    return {
      getNextOccurrence: getNextOccurrence,
      add: add,
      remove: remove,
      removeFuture: removeFuture,
      getById: getById,
      markRan: markRan,
    };

    function getNextOccurrence() {
      var recurrenceRef = ref.child('profile').child(user.uid).child('recurrences/transactions')
          .orderByChild('state')
          .startAt('toProcess').endAt('toProcess');

      var recFirebaseArray = _createRecurrencesFirebaseArray();
      recurrences = recFirebaseArray(recurrenceRef);

      return recurrences.$loaded().then(function(items) {
        var recurrences = _(items).sortBy('nextRunDateUnix').take(1).value();
        if (recurrences.length) {
          return recurrences[0];
        }

        return null;
      });
    }

    function getById(id) {
      var recurrenceRef = ref.child('profile').child(user.uid).child('recurrences/transactions')
          .child(id);

      return $firebaseObject(recurrenceRef).$loaded();
    }

    function add(transactionId, rule, nextRunDate) {
      var recurrence = {
            dateAdded: moment().format(),
            nextRunDate: nextRunDate.format(),
            nextRunDateUnix: nextRunDate.unix(),
            rootTransactionId: transactionId,
            state: CONST.RecurrenceState.toProcess,
            rule: rule,
            dateUpdated: null,
            $priority: nextRunDate.unix(),
          },
          newRecurrenceRef = ref.child('profile').child(user.uid).child('recurrences/transactions');

      newRecurrenceRef = newRecurrenceRef.push();
      var newRecurrence = $firebaseObject(newRecurrenceRef);

      _.extend(newRecurrence, recurrence);
      return newRecurrence.$save();
    }

    function markRan(recurrence) {
      recurrence.state = 'processed';
      recurrence.nextRunDate = recurrence.nextRunDate.format();
      recurrence.dateAdded = recurrence.dateAdded.format();
      return recurrences.$save(recurrence).then(function() {
        recurrence.dateAdded = moment(recurrence.dateAdded, CONST.ISODate);
        recurrence.nextRunDate = moment(recurrence.nextRunDate, CONST.ISODate);
        return recurrence;
      });
    }

    function remove(recurrence) {
      var deferred = $q.defer(),
          recurrenceDeleted = false,
          transactionsDeleted = false,
          recurrencesToDeleteRef = ref.child('profile').child(user.uid).child('recurrences/transactions')
              .orderByChild('transactionId')
              .startAt(recurrence.transactionId).endAt(recurrence.transactionId),
          transactionsToDeleteRef = ref.child('profile').child(user.uid).child('transactions')
              .orderByChild('rootTransactionId')
              .startAt(recurrence.transactionId).endAt(recurrence.rootTransactionId);

      recurrencesToDeleteRef.remove(function() {
        recurrenceDeleted = true;
        if (transactionsDeleted) {
          deferred.resolve();
        }
      });

      transactionsToDeleteRef.remove(function() {
        transactionsDeleted = true;
        if (recurrenceDeleted) {
          deferred.resolve();
        }
      });

      return deferred.promise;
    }

    function removeFuture(recurrence) {
      var deferred = $q.defer(),
          deletingFutureOccurrence = false,
          recurrencesToDeleteRef = ref.child('profile').child(user.uid).child('recurrences/transactions')
              .orderByChild('transactionId')
              .startAt(recurrence.transactionId).endAt(recurrence.transactionId);

      recurrencesToDeleteRef.on('value', function(snapshot) {
        var recurrences = snapshot.val(),
            today = moment().startOf('day');

        _.each(recurrences, function(rec) {
          var nextRunDate = moment(rec.nextRunDate, CONST.ISODate);
          if (nextRunDate.isAfter(today) || nextRunDate.isSame(today)) {
            deletingFutureOccurrence = true;
            var recToDelete = ref.child('profile').child(user.uid).child('recurrences/transactions');
            recToDelete.child(rec.key());
            recToDelete.remove(function() {
              deferred.resolve();
            });
          }
        });

        if (!deletingFutureOccurrence) {
          deferred.resolve();
        }
      });

      return deferred.promise;
    }

    function _createRecurrencesFirebaseArray() {
      return $firebaseArray.$extend({
        $$added: function(snap) {
          var rec = $firebaseArray.prototype.$$added.call(this, snap);
          rec.dateAdded = moment(rec.dateAdded, CONST.ISODate);
          rec.nextRunDate = moment(rec.nextRunDate, CONST.ISODate);

          return rec;
        },
      });
    }
  }
})();
