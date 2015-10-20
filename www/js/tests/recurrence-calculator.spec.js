describe('Recurrence Calculator Tests', function(){
	'use strict';
    var recurrenceCalculator;
    
	beforeEach(module('pf.datacontext'));

    beforeEach(inject(function (_recurrenceCalculator_) {
        recurrenceCalculator = _recurrenceCalculator_;
    }));

    it('does not return occurrence on the same day as startDate', function() {
        var startDate = moment({year:2015, month: 9, day: 7});
        var nextRunDate = recurrenceCalculator.getNewRunDate(startDate, '1W Wed');

        expect(nextRunDate.format()).not.toBe(startDate);
    });
    
    it('returns `1W Wed` occurrence correctly', function() {
        var startDate = moment({year:2015, month: 9, day: 7});
        var nextRunDate = recurrenceCalculator.getNewRunDate(startDate, '1W Wed');

        expect(nextRunDate.format()).toBe(startDate.add(1, 'week').format());
    });
    
    it('returns `2W Wed` occurrence correctly', function() {
        var startDate = moment({year:2015, month: 9, day: 7});
        var nextRunDate = recurrenceCalculator.getNewRunDate(startDate, '2W Wed');

        expect(nextRunDate.format()).toBe(startDate.add(2, 'week').format());
    });
        
    it('returns `1M 3` occurrence correctly', function() {
        var startDate = moment({year:2015, month: 9, day: 3});
        var nextRunDate = recurrenceCalculator.getNewRunDate(startDate, '1M 3');

        expect(nextRunDate.format()).toBe(startDate.add(1, 'month').format());
    });
});