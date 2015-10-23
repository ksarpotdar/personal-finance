(function () {
	'use strict';

	angular.module('pf.recurrence').factory('recurrenceService', recurrenceService);

	recurrenceService.$inject = ['Auth', 'CONST', 'recurrenceDatacontext', 'transactionsDatacontext', 'recurrenceCalculator'];
	function recurrenceService(Auth, CONST, recurrenceDatacontext, transactionsDatacontext, recurrenceCalculator) {
		//var user = Auth.resolveUser();
		
		return {
			processNext: processNext,
			add: add,
			remove: remove,
			removeFuture: removeFuture			
		};


		function processNext() {
			return recurrenceDatacontext.getNextOccurrence().then(function (occurrence) {
				if (occurrence.nextRunDate) {
					if (occurrence.nextRunDate > moment()) {
						// run transaction with the date of occurrence.nextRunDate
						// update this occurrence
						// create new one with the nextRunDate based on the current nextRunDate
						// even if we don't run every month (if it's a monthly recurrence), we will still catch up
						_runTransactionRecurrence(occurrence);
						_processRecurrenceAndCreateNew(occurrence);
						processNext();
					}
				}
				return occurrence;
			});
		}

		function add(transaction, rule) {
			var nextRunDate = recurrenceCalculator.getNewRunDate(transaction.date, rule);
			return recurrenceDatacontext.add(transaction.$id, rule, nextRunDate);
		}

		function remove(transaction) {
			return recurrenceDatacontext.getById(transaction.recurrenceId).then(function(recurrence){
				return recurrenceDatacontext.remove(recurrence);
			});			
		}
		
		function removeFuture(recurrence) {
			return recurrenceDatacontext.removeFuture(recurrence);			
		}

		function _runTransactionRecurrence(occurrence) {
			return transactionsDatacontext.single(occurrence.rootTransactionId).then(function (origTransaction) {
				var newTran = {};

				newTran.type = origTransaction.type;
				newTran.amount = origTransaction.amount;
				newTran.category = origTransaction.category;
				newTran.date = occurrence.nextRunDate.unix();
				newTran.formatted = occurrence.nextRunDate.format();
				newTran.note = origTransaction.note;
				newTran.rootTransactionId = origTransaction.rootTransactionId;
				newTran.recurrenceId = occurrence.$id;

				return transactionsDatacontext.add(newTran).then(function (savedTransaction) {
					return savedTransaction;
				});
			});
		}

		function _processRecurrenceAndCreateNew(occurrence) {
			occurrence.state = CONST.RecurrenceState.processed;
			recurrenceDatacontext.update(occurrence);

			_createFromOccurrence(occurrence);
		}

		function _createFromOccurrence(occurrence) {
			var nextRunDate = recurrenceCalculator.getNewRunDate(occurrence.nextRunDate, occurrence.rule);
			recurrenceDatacontext.add(occurrence.transactionId, occurrence.rule, nextRunDate);
		}

		// var recurrence = {
		// 	dateAdded: moment().format(),
		// 	nextRunDate: .. some next run date based on rules .. needs to be provided,
		// 	transactionId: .. from interface ..,
		// 	rule: '1W, 2W, 3W, 1M', // KISS 1week ...1month
		//  state: toProcess // after we process it, we update this one to 'processed' and create a new instance.						
		// };
			
		// when a recurrence is processed - let's store the resultingTransactionId .. so we can keep track of it 
		// when we create a recurrence we need to set the id on the transaction so it's easy to find/edit
		// need to create a service that holds the logic for running a recurring transaction
		// need a way to determine if the transaction is late the user opened the app 3 months later
		// it would be nice to run for all the missing months (weeks). ! Nice to have - not that important !
					
		// some other recurring jobs would be ?
	}
})();