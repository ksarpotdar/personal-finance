(function() {
  'use strict';

  angular.module('pf.transactions')
    .controller('TransactionCtrl', TransactionCtrl);

  TransactionCtrl.$inject = ['$stateParams', '$state', '$ionicHistory', '$ionicPopup', 'CONST', 'transactionsService', 'recurrenceParser', 'categories', 'transaction', 'logging'];
  function TransactionCtrl($stateParams, $state, $ionicHistory, $ionicPopup, CONST, transactionsService, recurrenceParser, categories, transaction, logging) {
    var _this = this;

    this.selectedTransactionType = $stateParams.transactionType;
    this.isExpense = $stateParams.transactionType === CONST.TransactionType.Expense;
    this.isIncome = !this.isExpense;
    this.buttonText = transaction.$id ? 'Update' : 'Add';
    this.transaction = transaction;
    this.categories = categories;
    this.useRecurrence = false;
    this.recurrencePeriods = [
      {key: '1W', name: '1 Week'},
      {key: '2W', name: '2 Weeks'},
      {key: '1M', name: '1 Month'},
    ];

    this.weekDayRecurrence = [
      {long: 'Monday', short: 'Mon'},
      {long: 'Tuesday', short: 'Tue'},
      {long: 'Wednesday', short: 'Wed'},
      {long: 'Thursday', short: 'Thu'},
      {long: 'Friday', short: 'Fri'},
      {long: 'Saturday', short: 'Sat'},
      {long: 'Sunday', short: 'Sun'},
    ];

    this.datepickerObject = {
      titleLabel: 'Select Date',

      //TODO get last transaction date and set the input date to that
      inputDate: transaction.date.toDate(),
      callback: function(val) {
        _this.transaction.date = moment(val);
        _this.selectedMonthDayRecurrence = _this.transaction.date.date();
      },
    };

    this.execute = execute;
    this.getRecurrenceText = getRecurrenceText;
    this.delete = _delete;

    activate();
    function activate() {
      if (!_this.transaction.$id) {
        _this.transaction.category = categories[0];
      }

      transactionsService.list().then(function(result) {
        _this.transactions = result;
      });

      _initializeDefaultRecurrence();

      if (_this.transaction.recurrenceId) {
        _initializeExistingRecurrence(_this.transaction.recurrence);
      }
    }

    function execute() {
      if (_this.transaction.$id) {
        _updateTransaction();
      } else {
        _createTransaction();
      }

      _goBack();
    }

    function _createTransaction() {
      var newTran = angular.copy(_this.transaction);
      var rule = '';

      if (_this.useRecurrence) {
        rule = recurrenceParser.toRule(_this.selectedRecurrencePeriod.key, _this.selectedWeekDayRecurrence.short, _this.selectedMonthDayRecurrence);
      }

      transactionsService.add(newTran, rule);
    }

    function _updateTransaction() {
      var rule = '';
      if (_this.useRecurrence) {
        rule = recurrenceParser.toRule(_this.selectedRecurrencePeriod.key, _this.selectedWeekDayRecurrence.short, _this.selectedMonthDayRecurrence);
      }

      transactionsService.update(_this.transaction, rule);
    }

    function _delete() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'NO UNDO',
        template: 'Are you sure you want to delete this transaction?',
      });

      confirmPopup.then(function(res) {
        if (res) {
          transactionsService.remove(_this.transaction);
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
      _this.selectedRecurrencePeriod = _this.recurrencePeriods[0];
      _this.selectedWeekDayRecurrence = _.findWhere(_this.weekDayRecurrence, {short: _this.transaction.date.format('ddd')});
      _this.selectedMonthDayRecurrence = _this.transaction.date.date();
    }

    function _initializeExistingRecurrence(recurrence) {
      if (!recurrence) {
        return;
      }

      var recRule = recurrenceParser.fromRule(recurrence.rule);

      if (recRule.timeSpan.type === 'week') {
        if (recRule.timeSpan.value === 1) {
          _this.selectedRecurrencePeriod = _this.recurrencePeriods[0];
        } else {
          _this.selectedRecurrencePeriod = _this.recurrencePeriods[1];
        }

        _this.selectedWeekDayRecurrence = _.findWhere(_this.weekDayRecurrence, {short: recRule.day});
      } else {
        _this.selectedRecurrencePeriod = _this.recurrencePeriods[2];
        _this.selectedMonthDayRecurrence = recRule.day;
      }

      _this.useRecurrence = true;
    }

    function getRecurrenceText() {
      if (!_this.transaction.recurrence) {
        return '';
      }

      var rule = _this.transaction.recurrence.rule;
      var parts = rule.split(' ');
      var text = '';
      var selectedWeekDayRecurrence = '';
      if (_this.selectedRecurrencePeriod && _this.selectedRecurrencePeriod.key === '1W') {
        text = 'Weekly on ';
        selectedWeekDayRecurrence = _.findWhere(_this.weekDayRecurrence, {short: parts[1]});
        text += selectedWeekDayRecurrence.long;
      } else if (_this.selectedRecurrencePeriod && _this.selectedRecurrencePeriod.key === '2W') {
        text = 'By-Weekly on ';
        selectedWeekDayRecurrence = _.findWhere(_this.weekDayRecurrence, {short: parts[1]});
        text += selectedWeekDayRecurrence.long;
      } else {
        text = 'Monthly on the ';
        var selectedMonthDayRecurrence = _this.transaction.date.date();
        text += selectedMonthDayRecurrence;
      }
    }
  }
})();
