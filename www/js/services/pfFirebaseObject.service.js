(function () {
    'use strict';

    angular.module('pf.datacontext').factory('pfFirebaseObject', pfFirebaseObject);

	pfFirebaseObject.$inject = ['$firebaseObject', '$firebaseUtils'];
    function pfFirebaseObject($firebaseObject, $firebaseUtils) {

		var firebaseObjectChanges = {
            // https://gist.github.com/katowulf/d0c230f1a7f6b5806a29
			$save: function (listOfFields) {
					
				//FIXME - abstract this save method to a different object to use for both categories and transactions
					
				listOfFields = listOfFields || [];

				if (!listOfFields) {
					// do a normal save if no list of fields is provided
					return $firebaseObject.prototype.$save.apply(this, arguments);
				}

				var self = this;
				var ref = self.$ref();
				var item = $firebaseUtils.toJSON(self);

				var updateFields = pickFields(item, listOfFields);
				var data = $firebaseUtils.toJSON(updateFields);

				return $firebaseUtils.doSet(ref, data).then(function () {
					self.$$notify();
					return self.$ref();
				});


			}
        };


        return init;


		function init(methods) {
			_.extend(firebaseObjectChanges, methods || {});
			return $firebaseObject.$extend(firebaseObjectChanges);
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