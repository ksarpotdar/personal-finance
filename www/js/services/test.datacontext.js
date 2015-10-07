(function () {
	'use strict';
	angular.module('pf.datacontext').factory('categoriesDatacontext', categoriesDatacontext);

	categoriesDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', 'Auth', 'CONST'];
	function categoriesDatacontext($q, $timeout, $window, $firebaseArray, Auth, CONST) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var user = Auth.resolveUser();
		var categoryRef = ref.child('profile').child(user.uid).child('category');
		var categoriesArr = $firebaseArray(categoryRef);

		_activate();

		return {
			list: getCategories,
			get: _getById,
			add: add,
			update: update,
			categoryExists: categoryExists
		};

		function _activate(user) {
			categoriesArr
				.$loaded()
				.then(function (data) {
					console.log('Categories loaded: ', data);
				});
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

		function update(id, name, type) {
			var category = _getById(id);
			if (!category) { return null; }

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