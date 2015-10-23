(function () {
    'use strict';

    angular.module('pf.datacontext').factory('pfFirebaseArray', pfFirebaseArray);

	pfFirebaseArray.$inject = ['$firebaseArray', '$firebaseUtils'];
    function pfFirebaseArray($firebaseArray, $firebaseUtils) {

		var firebaseArrayChanges = {
            // https://gist.github.com/katowulf/d0c230f1a7f6b5806a29
			$save: function (indexOrItem, listOfFields) {
					
				//FIXME - abstract this save method to a different object to use for both categories and transactions
					
				listOfFields = listOfFields || [];

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
        };


		return init;
		

		function init(methods) {
			_.extend(firebaseArrayChanges, methods || {});
			return $firebaseArray.$extend(firebaseArrayChanges);
		}

		function pickFields(data, fields) {
			var out = {};
			angular.forEach(fields, function (k) {
				out[k] = data.hasOwnProperty(k) ? data[k] : null;
			});
			return out;
		}
    }
})();