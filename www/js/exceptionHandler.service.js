(function () {
	'use strict';

	angular.module('pf')
		.factory('$exceptionHandler', exceptionHandler);

	exceptionHandler.$inject = ['$log','logging'];
	function exceptionHandler($log, logging) {
		return function (exception) {
			$log.error.apply($log, arguments);
			logging.logError(exception.message, exception.stack);
			throw exception;
		};
	}
})();