/* global moment */
/* global angular */
(function () {
	angular.module('pf.datacontext').factory('transactionsDatacontext', transactionsDatacontext);

	transactionsDatacontext.$inject = ['$q', '$timeout', 'CONST'];
	function transactionsDatacontext($q, $timeout, CONST) {
		var transactions = [];

		_activate();

		return {
			list: getTransactions,
			single: getSingle,
			add: add,
			update: update
		};


		function _activate() {
			console.log('TODO: load data from Firebase');
			transactions.push({
				type: CONST.TransactionType.Expense,
				amount: 123,
				currency: '$',
				category: 'Some cat',
				date: moment().startOf('day')
			});
			transactions.push({
				type: CONST.TransactionType.Income,
				amount: 321,
				currency: '$',
				category: 'Other cat',
				date: moment().add(-1, 'day').startOf('day')
			});
			transactions.push({
				type: CONST.TransactionType.Expense,
				amount: 3,
				currency: '$',
				category: 'Some cat',
				date: moment().add(-2, 'day').startOf('day')
			});
			transactions.push({
				type: CONST.TransactionType.Expense,
				amount: 17,
				currency: '$',
				category: 'Facebook',
				date: moment().add(-2, 'day').startOf('day')
			});

			transactions.forEach(function (t) {
				t.amountSigned = function () {
					return this.type === CONST.TransactionType.Expense ? -this.amount : this.amount;
				}
			});
		}

		function getSingle(transactionId) {
			console.info('TODO: if transaction doesn"t exist locally, we should try to find it in firebase');
			var deferred = $q.defer();

			$timeout(function () {
				var transaction = _.findWhere(transactions, { id: transactionId });
				deferred.resolve(transaction || {
					type: CONST.TransactionType.Expense,
					amount: 17,
					currency: '$',
					category: 'Facebook FAKE',
					date: moment().add(-2, 'day').startOf('day')
				});
			}, 500);

			return deferred.promise;
		}

		function getTransactions() {
			console.info('TODO: add filters for transactions - when should we refresh from Firebase ?')
			return transactions;
		}

		function add(type, amount, category, date, currency) {
			transactions.push({
				type: type,
				amount: amount,
				category: category,
				date: date,
				currency: currency
			});
			console.log('TODO : save to firebase - return promise with transaction id');
		}

		function update(type, amount, category, date) {
			console.log('TODO : update to firebase - return promise');
		}

		function remove(transactionId) {
			console.log('TODO : remove from firebase - return promise');
		}
	}
})();