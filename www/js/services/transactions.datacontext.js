/* global moment */
/* global angular */
(function () {
	angular.module('pf.datacontext').factory('transactionsDatacontext', transactionsDatacontext);

	transactionsDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', '$firebaseUtils', 'categoriesDatacontext', 'Auth', 'CONST'];
	function transactionsDatacontext($q, $timeout, $window, $firebaseArray, $firebaseUtils, categoriesDatacontext, Auth, CONST) {
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

		function update(updatedTransaction) {
			return _getById(updatedTransaction.$id).then(function (transaction) {
				if (!transaction) return null;
				// hmm .. better grab a new instance of a transaction otherwise we save all kinds of properties... hmm 

				transaction.amount = updatedTransaction.amount;
				transaction.note = updatedTransaction.note;
				transaction.date = updatedTransaction.date.unix();
				transaction.type = updatedTransaction.type;
				transaction.category = updatedTransaction.category.$id;

				return transactions.$save(transaction, ['amount', 'note', 'date', 'type', 'category']).then(function () {
					//TODO - not happy with this. should be handled in angular fire somehow.
					transaction.category = updatedTransaction.category;
					transaction.date = updatedTransaction.date;
					transaction.amountSigned = transaction.type === CONST.TransactionType.Expense ? -transaction.amount : transaction.amount;					 
					return transaction;
				});
			});
		}

		function remove(transaction) {
			return _getById(transaction.$id).then(function (tr) {
				if (tr) {
					return transactions.$remove(tr);
				} else {
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
				// $$defaults: {
				// 	amountSigned: this.type === CONST.TransactionType.Expense ? -this.amount : this.amount,
				// 	date:
				// },
				$$added: function (snap) {
					var rec = $firebaseArray.prototype.$$added.call(this, snap);
					rec.amountSigned = rec.type === CONST.TransactionType.Expense ? -rec.amount : rec.amount;
					rec.date = moment.unix(rec.date);

					categoriesDatacontext.get(rec.category).then(function (category) {
						rec.category = category;
					});

					return rec;
				},
				// $$updated: function (snap) {
				// 	$firebaseArray.prototype.$$updated.call(this, snap);
				// 	var rec = snap.val();
				// 	rec.amountSigned = rec.type === CONST.TransactionType.Expense ? -rec.amount : rec.amount;
				// 	rec.date = moment.unix(rec.date);

				// 	categoriesDatacontext.get(rec.category).then(function (category) {
				// 		rec.category = category;
				// 	});

				// 	return rec;
				// },
				// https://gist.github.com/katowulf/d0c230f1a7f6b5806a29
				$save: function (indexOrItem, listOfFields) {
					if (!listOfFields) {
						// do a normal save if no list of fields is provided
						return $firebaseArray.prototype.$save.apply(this, arguments);
					}

					var self = this;
					var item = self._resolveItem(indexOrItem);
					var key = self.$keyAt(item);
					if (key !== null) {
						var ref = self.$ref().ref().child(key);
						var updateFields = pickFields(item, listOfFields);
						var data = $firebaseUtils.toJSON(updateFields);

						return $firebaseUtils.doSet(ref, data).then(function () {
							self.$$notify('child_changed', key);
							return ref;
						});
					}
					else {
						return $firebaseUtils.reject('Invalid record; could determine key for ' + indexOrItem);
					}
				}
			});

		function pickFields(data, fields) {
			var out = {};
			angular.forEach(fields, function (k) {
				out[k] = data.hasOwnProperty(k) ? data[k] : null;
			});
			return out;
		}
	}
}
})();