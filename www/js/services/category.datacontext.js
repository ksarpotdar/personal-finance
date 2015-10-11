/* global moment */
/* global angular */
(function () {
	'use strict';
	
	angular.module('pf.datacontext').factory('categoriesDatacontext', categoriesDatacontext);

	categoriesDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', '$firebaseUtils', 'Auth', 'CONST', 'errors'];
	function categoriesDatacontext($q, $timeout, $window, $firebaseArray, $firebaseUtils, Auth, CONST, errors) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var user = Auth.resolveUser();
		var categoryRef = ref.child('profile').child(user.uid).child('categories');
		var categoriesArr = _createCategoryFirebaseArray()(categoryRef);
		var _categoriesLoaded = false;

		_activate();

		return {
			list: getCategories,
			sumByCategory: sumByCategory,
			get: _getById,
			addTransactionToCategory: addTransactionToCategory,
			categoryRef: categoryRef
		};

		function _activate(user) {
			categoriesArr
				.$loaded()
				.then(function (data) {
					console.log('Categories loaded: ', data);
					_categoriesLoaded = true;
				});
			
			//var categoriesArr = $firebaseArray(ref.child('category'));
			
			// 	categoriesArr.$loaded()
			// 	.then(function (data) {
			// 		console.log('Categories loaded: ', data);
			// 	});

			// debugger;
			
			// categoriesArr.$add({
			// 	type: CONST.TransactionType.Expense,
			// 	name: 'Groceries',
			// 	user_id: user.uid
			// });
			
			// var userRef = ref.child('profile').child(user.uid);
			// userRef.child('Groceries').set({
			// 	user_id: user.uid,
			// 	type: CONST.TransactionType.Expense
			// })
			// var categoryRef = userRef.child('category');
			// categoryRef.child('Car').set({
			// 	user_id: user.uid,
			// 	type: CONST.TransactionType.Expense
			// }, function(err){
			// 	if(err){
			// 		console.log(err);
			// 	}else{
			// 		console.log('Saved Car');
			// 	}
			// })
			
						
			
			// categoryRef.child('Groceries').set({
			// 	user_id: user.uid,
			// 	type: CONST.TransactionType.Expense
			// }, function(err){
			// 	if(err){
			// 		console.log(err);
			// 	}else{
			// 		console.log('Saved Car');
			// 	}
			// })
			
			
			
			// categoryRef.orderByKey().on('value', function (data) {
			// 	var transactionRef = userRef.child('transactions');
			// 	var categories = data.val();

			// 	for (var key in categories) {
			// 		if (categories.hasOwnProperty(key)) {
			// 			var category = categories[key];
			// 			for (var i = 0; i < 5; i++) {
			// 				(function (i) {
			// 					setTimeout(function () {
			// 						var id = transactionRef.push();
			// 						id.setWithPriority({
			// 							amount: 123,
			// 							category: key,
			// 							date: Firebase.ServerValue.TIMESTAMP,
			// 							type: category.type,
			// 							text: 'text' + i
			// 						}, Date.now())
			// 						console.log('Added at: %d', Date.now());
			// 						console.log(Date.now());
			// 					}, 1000 * (i + 1))
			// 				})(i);
			// 			}
			// 		}
			// 	}
			// });

			// var transactionRef = userRef.child('transactions');
			// transactionRef.orderByChild('date').endAt(1441887019891).on('value', function (data) {
			// 	console.log(data.val());
			// });
			
			// var transactionArr = $firebaseArray(transactionRef);

			// transactionArr.$loaded()
			// 	.then(function (data) {
			// 		console.log('Transactions loaded: ', data);
			// 	});

			// var result = transactionArr.$add(
			// 	{
			// 		amount: 123,
			// 		category: 'Groceries',
			// 		date: Firebase.ServerValue.TIMESTAMP,
			// 		type: 'expense',
			// 		text: 'text-WWWOOOOT'
			// 	}).then(function (ref) {
			// 		var id = ref.key();
			// 		console.log("added record with id " + id);
			// 		//  list.$indexFor(id); // returns location in the array
			// 	});

			// debugger;
			// categoryRef.orderByKey().on('child_added',function(data){
			// 	console.log('Received Data: child_added');
			// 	console.log(data);
			// });
			
			// categories.push({
			// 	type: CONST.TransactionType.Expense,
			// 	id: 1,
			// 	name: 'Groceries'
			// });
			// categories.push({
			// 	type: CONST.TransactionType.Expense,
			// 	id: 4,
			// 	name: 'Auchan',
			// 	parent: 1
			// });
			// categories.push({
			// 	type: CONST.TransactionType.Expense,
			// 	id: 2,
			// 	name: 'Entertainment'
			// });
			// categories.push({
			// 	type: CONST.TransactionType.Income,
			// 	id: 3,
			// 	name: 'Salary'				
			// });

			// categories.forEach(function (t) {
			// 	t.amountSigned = function () {
			// 		return this.type === CONST.TransactionType.Expense ? -this.amount : this.amount;
			// 	}
			// });
		}

		function sumByCategory() {			
			for (var i = 0; i < categoriesArr.length; i++) {
				var categ = categoriesArr[i];
				categ.refreshSum();
			}

			$timeout(function () {
				var r = categoriesArr[0];
				console.log(r);
			}, 1000);
		}

		function getCategories() {
			return categoriesArr.$loaded();
		}
		
		//link the category with a transaction
		function addTransactionToCategory(category, transactionKey, transaction) {
			var categoryTransactionRef = categoryRef.child(category.$id).child('transactions');
			categoryTransactionRef.child(transactionKey)
				.setWithPriority({
					amount: transaction.amount,
					date: transaction.date
				}, transaction.date);
		}

		function _getById(id) {
			var deferred = $q.defer();
			if (_categoriesLoaded) {
				var category = _.findWhere(categoriesArr, { $id: id });
				if (category) {
					deferred.resolve(category);
				} else {
					deferred.reject(new errors.NotFoundError('Category not found'));
				}
			} else {
				categoriesArr.$loaded().then(function () {
					var category = _.findWhere(categoriesArr, { $id: id });
					if (category) {
						deferred.resolve(category);
					} else {
						deferred.reject(new errors.NotFoundError('Category not found'));
					}
				});
			}
			return deferred.promise;
		}

		function _createCategoryFirebaseArray() {
			return $firebaseArray.$extend({
				$$added: function (snap) {
					var rec = $firebaseArray.prototype.$$added.call(this, snap);

					rec.refreshSum = function (start, end) {
						var start = moment().add(-10, 'days').unix();
						var end = moment().unix();
						rec.sum = 0;

						var categSumRef = categoryRef.child(rec.$id).child('transactions').orderByChild('date').startAt(start).endAt(end);
						categSumRef.on('child_added', function (snapshot) {
							console.log(snapshot.key());
							var data = snapshot.val();
							rec.sum += data.amount;
						});
					}
					return rec;
				},
				// https://gist.github.com/katowulf/d0c230f1a7f6b5806a29
				$save: function (indexOrItem, listOfFields) {
					listOfFields = listOfFields || ['name', 'type', 'deleted']
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