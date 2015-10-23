(function () {
  'use strict';

  angular.module('pf.transactions')
    .controller('TransactionCtrl', TransactionCtrl);

  TransactionCtrl.$inject = ['$stateParams', '$state', '$ionicHistory', '$ionicPopup', 'CONST', 'transactionsService', 'recurrenceParser', 'categories', 'user', 'transaction', 'logging'];
  function TransactionCtrl($stateParams, $state, $ionicHistory, $ionicPopup, CONST, transactionsService, recurrenceParser, categories, user, transaction, logging) {
    var self = this;
    this.selectedTransactionType = $stateParams.transactionType;
    this.isExpense = $stateParams.transactionType === CONST.TransactionType.Expense;
    this.isIncome = !this.isExpense;
    this.buttonText = transaction.$id ? 'Update' : 'Add';
    this.transaction = transaction;
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
    this.delete = _delete;

    activate();
    function activate() {
      if (!self.transaction.$id) {
        self.transaction.category = categories[0];
      }

      transactionsService.list().then(function (result) {
        self.transactions = result;
      });

      _initializeDefaultRecurrence();

      if (self.transaction.recurrenceId) {
        _initializeExistingRecurrence(self.transaction.recurrence);
      }
    }

    function execute() {
      if (self.transaction.$id) {
        _updateTransaction();
      } else {
        _createTransaction();
      }
      _goBack();
    }

    function _createTransaction() {
      var newTran = angular.copy(self.transaction);
      var rule = '';

      if (self.useRecurrence) {
        rule = recurrenceParser.toRule(self.selectedRecurrencePeriod.key, self.selectedWeekDayRecurrence.short, self.selectedMonthDayRecurrence);
      }

      transactionsService.add(newTran, rule);
    }

    function _updateTransaction() {
      var rule = '';
      if (self.useRecurrence) {
        rule = recurrenceParser.toRule(self.selectedRecurrencePeriod.key, self.selectedWeekDayRecurrence.short, self.selectedMonthDayRecurrence);
      }

      transactionsService.update(self.transaction, rule);
    }

    function _delete() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'NO UNDO',
        template: 'Are you sure you want to delete this transaction?'
      });
      
      confirmPopup.then(function (res) {
        if (res) {
          transactionsService.remove(self.transaction);
          _goBack();
        }
      });      
    }

    function _goBack() {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        logging.debug('transactions.controller: no back state, going to dashboard');
        $state.go('tabs.dashboard');
      }
    }

    function _initializeDefaultRecurrence() {
      self.selectedRecurrencePeriod = self.recurrencePeriods[0];
      self.selectedWeekDayRecurrence = _.findWhere(self.weekDayRecurrence, { short: self.transaction.date.format('ddd') });
      self.selectedMonthDayRecurrence = self.transaction.date.date();
    }

    function _initializeExistingRecurrence(recurrence) {
      if (!recurrence) {
        return;
      }
      var recRule = recurrenceParser.fromRule(recurrence.rule);

      if (recRule.timeSpan.type === 'week') {
        if (recRule.timeSpan.value === 1) {
          self.selectedRecurrencePeriod = self.recurrencePeriods[0];
        } else {
          self.selectedRecurrencePeriod = self.recurrencePeriods[1];
        }
        self.selectedWeekDayRecurrence = _.findWhere(self.weekDayRecurrence, { short: recRule.day });
      } else {
        self.selectedRecurrencePeriod = self.recurrencePeriods[2];
        self.selectedMonthDayRecurrence = recRule.day;
      }

      self.useRecurrence = true;
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