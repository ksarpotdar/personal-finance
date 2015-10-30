(function() {
  'use strict';

  angular.module('pf.recurrence').factory('recurrenceService', recurrenceService);

  recurrenceService.$inject = ['Auth', 'CONST', 'recurrenceDatacontext', 'recurrenceCalculator'];
  function recurrenceService(Auth, CONST, recurrenceDatacontext, recurrenceCalculator) {

    return {
      add: add,
      remove: remove,
      removeFuture: removeFuture,
    };

    function add(transaction, rule) {
      var nextRunDate = recurrenceCalculator.getNewRunDate(transaction.date, rule);
      return recurrenceDatacontext.add(transaction.$id, rule, nextRunDate);
    }

    function remove(transaction) {
      return recurrenceDatacontext.getById(transaction.recurrenceId).then(function(recurrence) {
        return recurrenceDatacontext.remove(recurrence);
      });
    }

    function removeFuture(recurrence) {
      return recurrenceDatacontext.removeFuture(recurrence);
    }

  }
})();
