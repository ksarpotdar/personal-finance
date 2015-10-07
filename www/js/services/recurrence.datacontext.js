(function () {
	'use strict';

	angular.module('pf.datacontext').factory('recurrenceDatacontext', recurrenceDatacontext);

	recurrenceDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', '$firebaseUtils', 'Auth', 'CONST'];
	function recurrenceDatacontext($q, $timeout, $window, $firebaseArray, $firebaseUtils, Auth, CONST) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var user = Auth.resolveUser();
		var _transactionsLoaded = false;
		var recurrences = null;
		_activate();

		return {
			getOccurences: getOccurences,
			listByCategory: getByCategory,
			single: _getById,
			add: add,
			update: update,
			remove: remove,
		};


		function _activate() {
			getOccurences()
				.then(function () {
					_transactionsLoaded = true;
				});
		}

		function getOccurences() {
			var recurrenceRef = ref.child('profile').child(user.uid).child('recurrences/transactions')
				.orderByChild('state')
				.startAt('toProcess').endAt('toProcess');

			var recFirebaseArray = _createRecurrencesFirebaseArray();
			recurrences = recFirebaseArray(recurrenceRef);

			return recurrences.$loaded().then(function (data) {
				_transactionsLoaded = true;
				return data;
			});
		}

		function add(recurrence) {
			
				
			
			// var recurrence = {
			// 	dateAdded: moment().format(),
			// 	nextRunDate: .. some next run date based on rules .. needs to be provided,
			// 	transactionId: .. from interface ..,
			// 	rule: '1W, 2W, 3W, 1M', // KISS 1week ...1month
			//  state: toProcess // after we process it, we update this one to 'processed' and create a new instance.						
			// };
			
			// when a recurrence is processed - let's store the resultingTransactionId .. so we can keep track of it 
			// when we create a recurrence we need to set the id on the transaction so it's easy to find/edit
			// need to create a service that holds the logic for running a recurring transaction
			// need a way to determine if the transaction is late the user opened the app 3 months later
					// it would be nice to run for all the missing months (weeks). ! Nice to have - not that important !
					
			// some other recurring jobs would be ?

		}

		function update(recurrence) {
			recurrence.date = recurrence.date.format();
			
			return recurrences.$save(recurrence).then(function () {
				//TODO - not happy with this. should be handled in angular fire somehow.
				recurrence.date = moment(recurrence.date, CONST.ISODate);
				return recurrence;
			});
		}

		function _createRecurrencesFirebaseArray() {
			return $firebaseArray.$extend({
				$$added: function (snap) {
					var rec = $firebaseArray.prototype.$$added.call(this, snap);
					rec.date = moment(rec.date, CONST.ISODate);

					return rec;
				}
			});
		}
	}
})();