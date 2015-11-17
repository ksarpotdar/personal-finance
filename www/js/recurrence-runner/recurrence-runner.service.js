(function() {
  'use strict';

  angular.module('pf.recurrence-runner', ['pf.transactions', 'pf.recurrence']).factory('recurrenceRunnerService', recurrenceRunnerService);

  recurrenceRunnerService.$inject = ['$timeout', 'Auth', 'CONST', 'recurrenceDatacontext', 'transactionsDatacontext', 'recurrenceCalculator', 'logging'];
  function recurrenceRunnerService($timeout, Auth, CONST, recurrenceDatacontext, transactionsDatacontext, recurrenceCalculator, logging) {
    var _started = false,
      _errorsProcessingRecurrences = 0,
      _nextProcessPromise = 0;

    return {
      start: start,
      stop: stop,
      isStarted: isStarted,
    };

    function start() {
      if (_started || !Auth.resolveUser()) {
        return;
      }

      _started = true;
      _processNext();
    }

    function isStarted() {
      return _started;
    }

    function stop() {
      $timeout.cancel(_nextProcessPromise);
      _started = false;
    }

    function _processNext() {
      recurrenceDatacontext.getNextOccurrence().then(function(occurrence) {
        logging.debug('Recurrence running: ', occurrence);
        if (occurrence && occurrence.nextRunDate) {
          logging.debug('Has a next run date: ', occurrence.nextRunDate.format());
          if (occurrence.nextRunDate <= moment()) {
            // run transaction with the date of occurrence.nextRunDate
            // update this occurrence
            // create new one with the nextRunDate based on the current nextRunDate
            // even if we don't run every month (if it's a monthly recurrence), we will still catch up
            logging.debug('We need to run the occurrences: ', occurrence.$id);

            _runTransactionRecurrence(occurrence).then(function() {
              return _processRecurrenceAndCreateNew(occurrence);
            }).then(function() {
              _processNext();
            }).catch(_recurrenceRunnerError);

          } else {
            _nextProcessPromise = $timeout(_processNext, 10 * 1000);
          }
        } else {
          _nextProcessPromise = $timeout(_processNext, 10 * 1000);
        }

        return occurrence;
      }).catch(_recurrenceRunnerError);
    }

    function _recurrenceRunnerError(err) {
      logging.logError(err);
      if (_errorsProcessingRecurrences > 3) {
        logging.logError('Too many errors processing recurrences - shutting down recurrence processing.');
        return;
      }

      _errorsProcessingRecurrences += 1;

      _nextProcessPromise = $timeout(_processNext, 60 * 1000);
    }

    function _runTransactionRecurrence(occurrence) {
      return transactionsDatacontext.single(occurrence.rootTransactionId).then(function(origTransaction) {
        var newTran = {};

        newTran.type = origTransaction.type;
        newTran.amount = origTransaction.amount;
        newTran.category = origTransaction.category;
        newTran.date = occurrence.nextRunDate;
        newTran.formatted = occurrence.nextRunDate.format();
        newTran.note = origTransaction.note;
        newTran.rootTransactionId = origTransaction.rootTransactionId || origTransaction.$id;
        newTran.recurrenceId = occurrence.$id;

        return transactionsDatacontext.add(newTran).then(function(savedTransaction) {
          return savedTransaction;
        });
      });
    }

    function _processRecurrenceAndCreateNew(occurrence) {
      occurrence.state = CONST.RecurrenceState.processed;
      return recurrenceDatacontext.markRan(occurrence).then(function(occurrence) {
        return _createFromOccurrence(occurrence);
      });
    }

    function _createFromOccurrence(occurrence) {
      var nextRunDate = recurrenceCalculator.getNewRunDate(occurrence.nextRunDate, occurrence.rule);
      return recurrenceDatacontext.add(occurrence.rootTransactionId, occurrence.rule, nextRunDate);
    }
  }
})();
