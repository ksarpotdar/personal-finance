(function () {
	"use strict";

	angular.module('pf.errors')
		.factory('errors', errors);

	function errors() {
		function NotFoundError(message) {

			var error = Error.call(this, message);
			this.name = 'NotFoundError';
			this.message = error.message;
			this.stack = error.stack;
		}

		NotFoundError.prototype = Object.create(Error.prototype, {
			constructor: {
				value: NotFoundError,
				writable: true,
				configurable: true
			}
		});
		
		
		function DuplicateCategoryNameError(message) {

			var error = Error.call(this, message);
			this.name = 'DuplicateCategoryNameError';
			this.message = error.message;
			this.stack = error.stack;
		}

		DuplicateCategoryNameError.prototype = Object.create(Error.prototype, {
			constructor: {
				value: DuplicateCategoryNameError,
				writable: true,
				configurable: true
			}
		});
		
		return {
			NotFoundError: NotFoundError,
			DuplicateCategoryNameError: DuplicateCategoryNameError
		};
	}
})();