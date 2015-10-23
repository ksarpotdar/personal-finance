(function () {
	'use strict';

	angular.module('pf.recurrence').factory('recurrenceCalculator', recurrenceCalculator);

	recurrenceCalculator.$inject = ['recurrenceParser'];
	function recurrenceCalculator(recurrenceParser) {

		return {
			getNewRunDate: getNewRunDate,
		};


		function getNewRunDate(startDate, rule) {
			var recData = recurrenceParser.fromRule(rule);
			var timeSpan = recData.timeSpan;
			var day = recData.day;

			var start = startDate.clone();
			if (timeSpan.type === 'week') {
				start.startOf('week').day(day);
				if (start.isBefore(startDate) || start.isSame(startDate)) {
					start.add(timeSpan.value, 'week');
				}
			} else {
				start.startOf('month').date(day);
				if (start.isBefore(startDate) || start.isSame(startDate)) {
					start.add(timeSpan.value, 'month');
				}
			}

			return start;
		}
	}
})();