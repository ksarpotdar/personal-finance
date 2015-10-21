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

			return transactionsDatacontext.getTransactions(start, end);
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
					return recurrenceService.add(transaction, recurrenceRule).then(function (rec) {
						transaction.recurrenceId = rec.$id;
						return transactionsDatacontext.update(transaction);
					});
				}
				return tran;
			});
		}

		function update(updatedTransaction) {
			transactionsDatacontext.update(updatedTransaction);
		}

		function remove(transaction) {
			return transactionsDatacontext.remove(transaction);
		}
	}
})();