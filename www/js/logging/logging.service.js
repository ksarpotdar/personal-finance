(function () {
	'use strict';

	angular.module('pf.logging')
		.factory('logging', loggingService);

	loggingService.$inject = ['$window', 'CONST'];
	function loggingService($window, CONST) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var loggingKey = moment().startOf('hour').format('YYYY-MM-DDHH:mm:ss');

		return {
			debug: logDebug,
			logError: logError
		};

		function logDebug(message, data) {
			_log(message, data, null, 'debug');
		}

		function logError(message, stack) {
			_log(message, null, stack, 'error');
		}

		function _log(message, data, stack, type) {
			var logRef = ref.child('logging/' + type + '/' + loggingKey);
			var logKey = moment().format('YYYY-MM-DDHH:mm:ss');

			logRef.child(logKey).set({
				message: message,
				data: (data ? JSON.stringify(data) : null),
				stack: (stack ? JSON.stringify(stack) : null)
			});
			
			console.log(message);			
		}
	}
})();