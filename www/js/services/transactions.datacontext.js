/* global moment */
/* global angular */
(function () {
	angular.module('pf.datacontext').factory('transactionsDatacontext', transactionsDatacontext);

	transactionsDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', 'Auth', 'CONST'];
	function transactionsDatacontext($q, $timeout, $window, $firebaseArray, Auth, CONST) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var user = Auth.resolveUser();
		var categoryRef = ref.child('profile').child(user.uid).child('category');
		var transactions = $firebaseArray(categoryRef);


		_activate();

		return {
			list: getTransactions,
			single: _getById,
			add: add,
			update: update,
			remove: remove,
		};


		function _activate() {
			transactions
				.$loaded()
				.then(function (data) {
					console.log('Transactions loaded: ', data);
				});;


			transactions.forEach(function (t) {
				t.amountSigned = function () {
					return this.type === CONST.TransactionType.Expense ? -this.amount : this.amount;
				}
			});
		}

		function getTransactions() {
			return transactions.$loaded();
		}

		function add(type, amount, category, date, currency) {
			var newTransaction = {
				type: type,
				amount: amount,
				category: category.$id,
				date: date
			};
			
			return transactions.$add(newTransaction);
		}

		function update(id, amount, type, category) {
			var transaction = _getById(id);
			if (!transaction) return null;

			transaction.amount = name;
			transaction.type = type;
			transaction.category = category.$id;
			
			return transactions.$save(transaction);
		}
		
		function remove(id) {
			var transaction = _getById(id);
			return transactions.$remove(transaction);
		}
		
		function _getById(id) {
			return _.findWhere(transactions, { $id: id });
		}
	}
})();