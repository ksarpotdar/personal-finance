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
		var _transactionsLoaded = false;

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
					_transactionsLoaded = true;
				});
		}

		function getTransactions() {
			return transactions.$loaded();
		}

		function getByCategory(categoryId, start, end) {
			var categoryRef = categoriesDatacontext.categoryRef;
			categoryRef.child(categoryId).child('transactions').once('value', function (trSnap) {
				debugger;
			});
		}

		function add(transaction) {
			var newTransaction = {
				type: transaction.type,
				amount: transaction.amount || 0,
				note: transaction.note || '',
				category: transaction.category.$id,
				date: transaction.date.unix()
			};

			return transactions.$add(newTransaction).then(function (result) {
				categoriesDatacontext.addTransactionToCategory(transaction.category, result.key(), newTransaction);
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
			return _getById(id).then(function (transaction) {
				if (transaction) {
					return transactions.$remove(transaction);
				}else{
					return null;
				}
			});
		}

		function _getById(id) {
			var deferred = $q.defer();
			if (_transactionsLoaded) {
				var transaction = _.findWhere(transactions, { $id: id });
				deferred.resolve(transaction);
			} else {
				transactions.$loaded().then(function (data) {
					var transaction = _.findWhere(transactions, { $id: id });
					if (transaction) {
						deferred.resolve(transaction);
					}
				});
			}
			return deferred.promise;
		}

		function _createTransactionsFirebaseArray() {
			return $firebaseArray.$extend({
				$$added: function (snap) {
					var rec = $firebaseArray.prototype.$$added.call(this, snap);
					rec.amountSigned = rec.type === CONST.TransactionType.Expense ? -rec.amount : rec.amount;
					rec.date = moment.unix(rec.date);

					categoriesDatacontext.get(rec.category).then(function(category){
						rec.category = category;
					});

					return rec;
				}
			});
		}
	}
})();