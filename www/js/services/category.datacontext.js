/* global moment */
/* global angular */
(function () {
	angular.module('pf.datacontext').factory('categoriesDatacontext', categoriesDatacontext);

	categoriesDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', 'Auth', 'CONST'];
	function categoriesDatacontext($q, $timeout, $window, $firebaseArray, Auth, CONST) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var user = Auth.resolveUser();
		var categoryRef = ref.child('profile').child(user.uid).child('categories');
		var categoriesArr = _createCategoryFirebaseArray()(categoryRef);

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
				}
			});
		}

		_activate();

		return {
			list: getCategories,
			sumByCategory: sumByCategory,
			get: _getById,
			add: add,
			addTransactionToCategory: addTransactionToCategory,
			update: update,
			categoryExists: categoryExists,
			categoryRef: categoryRef
		};

		function _activate(user) {
			categoriesArr
				.$loaded()
				.then(function (data) {
					console.log('Categories loaded: ', data);
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
			// var categoryTransactionCache = {};
			// var start = moment().add(-10, 'days').unix();
			// var end = moment().unix();

			// for (var i = 0; i < categoriesArr.length; i++) {
			// 	var categ = categoriesArr[i];

			// 	categoryTransactionCache[categ.$id] = categoryRef.child(categ.$id).child('transactions').orderByChild('date').startAt(start).endAt(end);
			// 	categoryTransactionCache[categ.$id].on('value', function (snapshot) {
			// 		console.log(snapshot.val())
			// 	});
			// }
			
			for (var i = 0; i < categoriesArr.length; i++) {
				var categ = categoriesArr[i];
				categ.refreshSum();
			}
			
			$timeout(function(){
				var r = categoriesArr[0];
				console.log(r);
			}, 1000);

		}

		function getCategories() {
			return categoriesArr.$loaded();
		}

		function categoryExists(name) {
			if (!categoriesArr.length) { return false; }
			return !!_getByName(name);
		}

		function add(name, type, parentCategoryId) {
			var deferred = $q.defer();
			if (categoryExists(name)) {
				deferred.reject({
					error: CONST.Errors.Category.DUPLICATE_CATEGORY_NAME,
					message: 'Category with this name already exists.'
				});
			} else {
				var newCategory = { user_id: user.uid, type, name: name };
				categoriesArr.$add(newCategory).then(function (result) {
					deferred.resolve(result);
				}).catch(function (err) {
					deferred.reject(err);
				});
			}

			return deferred.promise;
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

		function update(id, name, type) {
			var category = _getById(id);
			if (!category) return null;

			category.name = name;
			category.type = type;
			return categoriesArr.$save(category);
		}

		function remove(id) {
			var category = _getById(id);
			return categoriesArr.$remove(category);
		}

		function _getByName(name) {
			var lowerName = name.toLowerCase();
			var category = _.find(categoriesArr, function (c) { return name.toLowerCase() === lowerName; });
			return category;
		}

		function _getById(id) {
			return _.findWhere(categoriesArr, { $id: id });
		}
	}
})();