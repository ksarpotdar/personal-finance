(function () {
	'use strict';

	angular.module('pf.datacontext').factory('transactionsService', transactionsService);

	transactionsService.$inject = ['recurrenceService', 'transactionsDatacontext', 'Auth', 'CONST', 'errors'];
	function transactionsService(recurrenceService, transactionsDatacontext) {
		_activate();

		return {
			list: getTransactions,
			getTransactions: getTransactions,
			add: add,
			update: update,
			remove: remove,
		};


		function _activate() {
			getTransactions();
		}

		function getTransactions(start, end) {
			if (!start) {
				start = moment().startOf('month');
			}

			if (!end) {
				end = start.clone().endOf('month');
			}

			return transactionsDatacontext.list(start, end);
		}

		// function getByCategory(categoryId, start, end) {
		// 	var categoryRef = categoriesDatacontext.categoryRef;
		// 	categoryRef.child(categoryId).child('transactions').once('value', function (trSnap) {
		// 		debugger;
		// 	});
		// }

		function add(transaction, recurrenceRule) {
			return transactionsDatacontext.add(transaction).then(function (tran) {
				if (recurrenceRule) {
					return recurrenceService.add(tran, recurrenceRule).then(function (rec) {
						tran.recurrenceId = rec.key();
						return transactionsDatacontext.update(tran);
					});
				}
				return tran;
			});
		}

		function update(updatedTransaction, recurrenceRule) {
			var recurrenceChanged = updatedTransaction.recurrence && updatedTransaction.recurrence.rule !== recurrenceRule;
			var recurrenceRemoved = updatedTransaction.recurrence && !recurrenceRule;

			if (recurrenceChanged || recurrenceRemoved) {
				recurrenceService.removeFuture(updatedTransaction.recurrence);
			}

			return transactionsDatacontext.update(updatedTransaction).then(function (tran) {
				if (recurrenceRule) {
					return recurrenceService.add(tran, recurrenceRule).then(function (rec) {
						tran.recurrenceId = rec.key();
						return transactionsDatacontext.update(tran);
					});
				}
				return tran;
			});
		}

		function remove(transaction) {
			return transactionsDatacontext.remove(transaction);
		}
	}
})();