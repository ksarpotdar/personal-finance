/* global moment */
/* global angular */
(function () {
	angular.module('pf.datacontext').factory('transactionsDatacontext', transactionsDatacontext);

	transactionsDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', 'categoriesDatacontext', 'Auth', 'CONST'];
	function transactionsDatacontext($q, $timeout, $window, $firebaseArray, categoriesDatacontext, Auth, CONST) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var user = Auth.resolveUser();
		var transactionRef = ref.child('profile').child(user.uid).child('transactions');
		var transactionsFirebaseArray = _createTransactionsFirebaseArray();
		var transactions = transactionsFirebaseArray(transactionRef);


		_activate();

		return {
			list: getTransactions,
			listByCategory: getByCategory,
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
				});
		}

		function getTransactions() {
			return transactions.$loaded();
		}

		function getByCategory(categoryId, start, end) {
			var categoryRef = categoriesDatacontext.categoryRef;
			categoryRef.child(categoryId).child('transactions').once('value', function(trSnap){
				debugger;
			});
		}

		function add(type, amount, note, category, date) {
			var newTransaction = {
				type: type,
				amount: amount,
				note: note,
				category: category.$id,
				date: date.unix()
			};

			return transactions.$add(newTransaction).then(function(result){
				categoriesDatacontext.addTransactionToCategory(category, result.key(), newTransaction);
				return result;
			});
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

		function _createTransactionsFirebaseArray() {
			return $firebaseArray.$extend({
				$$added: function (snap) {
					var rec = $firebaseArray.prototype.$$added.call(this, snap);
					rec.amountSigned = rec.type === CONST.TransactionType.Expense ? -rec.amount : rec.amount;
					rec.mDate = moment.unix(rec.date);
					 
					var categoryRef = categoriesDatacontext.categoryRef;
					categoryRef.child(rec.category).once('value', function(catSnapshot){
						var cat = catSnapshot.val();
						rec.category = cat.name;
						rec.icon = cat.icon;
					});
							
					return rec;
				}
			});
		}
	}
})();