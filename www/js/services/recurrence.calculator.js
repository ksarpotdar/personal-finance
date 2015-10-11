(function () {
	'use strict';

	angular.module('pf.datacontext').factory('recurrenceCalculator', recurrenceCalculator);

	function recurrenceCalculator() {

		return {
			getNewRunDate: getNewRunDate,
		};


		function getNewRunDate(startDate, rule) {
			var days = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0 };
			var rules = rule.split(' ');
			var timeSpanRule = rules[0];
			var dayRule = rules[1];
			var timeSpan = {};
			var day = -1;

			switch (timeSpanRule) {
				case '1W':
					timeSpan = { value: 1, type: 'week' };
					break;
				case '2W':
					timeSpan = { value: 2, type: 'week' };
					break;
				default:
					timeSpan = { value: 1, type: 'month' };
			}

			if (timeSpan.type === 'week') {
				day = days[dayRule];
			} else {
				day = parseInt(dayRule, 10);
			}
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