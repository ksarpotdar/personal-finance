(function () {
	'use strict';

	angular.module('pf.datacontext').factory('recurrenceDatacontext', recurrenceDatacontext);

	recurrenceDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', '$firebaseObject', '$firebaseUtils', 'Auth', 'CONST'];
	function recurrenceDatacontext($q, $timeout, $window, $firebaseArray, $firebaseObject, $firebaseUtils, Auth, CONST) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var user = Auth.resolveUser();
		var recurrences = null;

		return {
			getNextOccurence: getNextOccurrence,
			add: add,
			remove: remove,
			update: update,
			getById: getById			
		};


		function getNextOccurrence() {
			var recurrenceRef = ref.child('profile').child(user.uid).child('recurrences/transactions')
				.orderByChild('state')
				.startAt('toProcess').endAt('toProcess');

			var recFirebaseArray = _createRecurrencesFirebaseArray();
			recurrences = recFirebaseArray(recurrenceRef);

			return recurrences.$loaded().then(function(items){
				return _(items).orderBy('nextRunDateUnix').take(1).value();
			});
		}

		function getById(id) {
			var recurrenceRef = ref.child('profile').child(user.uid).child('recurrences/transactions')
				.child(id);

			return $firebaseObject(recurrenceRef).$loaded();
		}

		function add(transactionId, rule, nextRunDate) {
			var recurrence = {
				dateAdded: moment().format(),
				nextRunDate: nextRunDate.format(),
				nextRunDateUnix: nextRunDate.unix(),
				transactionId: transactionId,
				state: CONST.RecurrenceState.toProcess,
				dateUpdated: null,
				$priority: nextRunDate.unix()
			};
				
			return recurrences.$add(recurrence);
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
			recurrence.dateAdded = recurrence.dateAdded.format();
			recurrence.nextRunDate = recurrence.nextRunDate.format();
			recurrence.dateUpdated = moment().format();
			
			return recurrences.$save(recurrence).then(function () {
				//TODO - not happy with this. should be handled in angular fire somehow.
				recurrence.dateAdded = moment(recurrence.dateAdded, CONST.ISODate);
				recurrence.nextRunDate = moment(recurrence.nextRunDate, CONST.ISODate);
				return recurrence;
			});
		}

		function remove(recurrence) {
			
			var recurrencesToDeleteRef = ref.child('profile').child(user.uid).child('recurrences/transactions')
				.orderByChild('transactionId')
				.startAt(recurrence.transactionId).endAt(recurrence.transactionId);

			var recFirebaseArray = _createRecurrencesFirebaseArray();
			var recurrencesToDelete = recFirebaseArray(recurrencesToDeleteRef);

			return recurrencesToDelete.$loaded().then(function(items){
				var allDeletePromises = [];
				_.each(items, function(item){
					allDeletePromises.push(recurrencesToDelete.$remove(item));
				});
				return $q.all(allDeletePromises);
			});
		}

		function _createRecurrencesFirebaseArray() {
			return $firebaseArray.$extend({
				$$added: function (snap) {
					var rec = $firebaseArray.prototype.$$added.call(this, snap);
					rec.dateAdded = moment(rec.dateAdded, CONST.ISODate);
					rec.nextRunDate = moment(rec.nextRunDate, CONST.ISODate);

					return rec;
				}
			});
		}
	}
})();