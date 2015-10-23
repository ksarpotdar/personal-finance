(function () {
	'use strict';

	angular.module('pf.recurrence').factory('recurrenceParser', recurrenceParser);

	function recurrenceParser() {

		return {
			toRule: toStringRule,
			fromRule: fromStringRule,
		};


		function fromStringRule(rule) {
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
				day = dayRule;
			} else {
				day = parseInt(dayRule, 10);
			}

			return {
				timeSpan: timeSpan,
				day: day
			};
		}

		function toStringRule(timespan, weekDay, monthDay) {
			if(timespan === '1W' || timespan === '2W'){
				return timespan + ' ' + weekDay;
			}
			return timespan + ' ' + monthDay;
		}
	}
})();