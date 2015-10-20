(function () {
  'use strict';

  angular.module('pf.transactions')
    .controller('TransactionCtrl', TransactionCtrl);

  TransactionCtrl.$inject = ['$stateParams', '$state', '$ionicHistory', 'CONST', 'transactionsDatacontext', 'categories', 'user', 'transaction'];
  function TransactionCtrl($stateParams, $state, $ionicHistory, CONST, transactionsDatacontext, categories, user, transaction) {
    var self = this;
    this.selectedTransactionType = $stateParams.transactionType;
    this.isExpense = $stateParams.transactionType === CONST.TransactionType.Expense;
    this.isIncome = !this.isExpense;
    this.buttonText = transaction.$id ? 'Update' : 'Add';
    this.transaction = angular.copy(transaction); //create a copy so we can cancel without affecting the original transaction
    this.categories = categories;
    this.useRecurrence = false;
    this.recurrencePeriods = [
      { key: '1W', name: '1 Week' },
      { key: '2W', name: '2 Weeks' },
      { key: '1M', name: '1 Month' },
    ];
    this.weekDayRecurrence = [
      { long: 'Monday', short: 'Mon' },
      { long: 'Tuesday', short: 'Tue' },
      { long: 'Wednesday', short: 'Wed' },
      { long: 'Thursday', short: 'Thu' },
      { long: 'Friday', short: 'Fri' },
      { long: 'Saturday', short: 'Sat' },
      { long: 'Sunday', short: 'Sun' },
    ];

    this.datepickerObject = {
      titleLabel: 'Select Date',
      //TODO get last transaction date and set the input date to that
      inputDate: transaction.date.toDate(),
      callback: function (val) {
        self.transaction.date = moment(val);
        self.selectedMonthDayRecurrence = self.transaction.date.date();
      }
    };

    this.execute = execute;
    this.getRecurrenceText = getRecurrenceText;
    this.recurrencePeriodChange = recurrencePeriodChange;
    this.delete = _delete;

    activate();
    function activate() {
      if (!self.transaction.$id) {
        self.transaction.category = categories[0];
      }

      transactionsDatacontext.list().then(function (result) {
        self.transactions = result;
      });

      _initializeRecurrence();

      self.selectedRecurrencePeriod = self.recurrencePeriods[0];
      self.selectedWeekDayRecurrence = _.findWhere(self.weekDayRecurrence, { short: self.transaction.date.format('DDD') });
      self.selectedMonthDayRecurrence = self.transaction.date.date();
    }

    function execute() {
      if (self.transaction.$id) {
        _updateTransaction();
      } else {
        _createTransaction();
      }
    }

    function recurrencePeriodChange() {

    }

    function _createTransaction() {
      var newTran = angular.copy(self.transaction);
      transactionsDatacontext.add(newTran)
        .then(function () { });
    }

    function _delete() {
      transactionsDatacontext.remove(self.transaction).then(function () {
        _goBack();
      });
    }

    function _updateTransaction() {
      transactionsDatacontext.update(self.transaction)
        .then(function () {
          _goBack();
        });
    }

    function _goBack() {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $state.go('dashboard');
      }
    }

    function _initializeRecurrence() {
      if (!self.transaction.recurrence) {
        return;
      }
      var rule = self.transaction.recurrence.rule;
      var parts = rule.split(' ');
      self.selectedRecurrencePeriod = _.findWhere(self.recurrencePeriods, { key: parts[0] });
      if (self.selectedRecurrencePeriod && self.selectedRecurrencePeriod.key !== '1M') {
        //weekly
        self.selectedWeekDayRecurrence = _.findWhere(self.weekDayRecurrence, { short: parts[1] });
      } else {
        //monthly
        self.selectedMonthDayRecurrence = self.transaction.date.date();
      }
    }

    function getRecurrenceText() {
      if (!self.transaction.recurrence) {
        return '';
      }
      var rule = self.transaction.recurrence.rule;
      var parts = rule.split(' ');
      var text = '';
      var selectedWeekDayRecurrence = '';
      if (self.selectedRecurrencePeriod && self.selectedRecurrencePeriod.key === '1W') {
        text = 'Weekly on ';
        selectedWeekDayRecurrence = _.findWhere(self.weekDayRecurrence, { short: parts[1] });
        text += selectedWeekDayRecurrence.long;
      } else if (self.selectedRecurrencePeriod && self.selectedRecurrencePeriod.key === '2W') {
        text = 'By-Weekly on ';
        selectedWeekDayRecurrence = _.findWhere(self.weekDayRecurrence, { short: parts[1] });
        text += selectedWeekDayRecurrence.long;
      } else {
        text = 'Monthly on the ';
        var selectedMonthDayRecurrence = self.transaction.date.date();
        text += selectedMonthDayRecurrence;
      }
    }
  }
})();