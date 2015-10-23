(function () {
  'use strict';

  angular.module('pf.dashboard')
    .controller('DashboardCtrl', DashboardCtrl);


  DashboardCtrl.$inject = ['$state', 'CONST', 'transactionsService', 'TimeFrameService'];
  function DashboardCtrl($state, CONST, transactionsService, timeFrame) {
    var self = this;
    this.currentSold = 0;
    this.TransactionTypes = CONST.TransactionType;
    this.selectedTransactionType = CONST.TransactionType.Expense;
    this.transactions = [];
    this.timeFrame = timeFrame.getCurrentTimeFrame();


    this.editTransaction = editTransaction;
    this.addDefault = addDefault;
    this.sortTransactions = _sortTransactions;
    this.changeTransactionType = _changeTransactionType;
    this.prevMonth = prevMonth;
    this.nextMonth = nextMonth;
    this.getPreviousMonthName = getPreviousMonthName;
    this.getNextMonthName = getNextMonthName;
    this.getViewTitle = getViewTitle;

    activate();
    function activate() {
      timeFrame.init();
      self.timeFrame = timeFrame.getCurrentTimeFrame();
      transactionsService.list().then(function (result) {
        self.transactions = result;
        _refreshCurrentSold();
      });
      
      
    }

    function addDefault() {
      $state.go('category.add');
    }

    function editTransaction(transaction) {
      $state.go('transaction.edit', { id: transaction.$id });
    }

    function prevMonth() {
      self.timeFrame = timeFrame.prevMonth();
      _refreshData(self.timeFrame.start, self.timeFrame.end);
    }

    function nextMonth() {
      self.timeFrame = timeFrame.nextMonth();
      _refreshData(self.timeFrame.start, self.timeFrame.end);
    }

    function getPreviousMonthName() {
      return self.timeFrame.start.clone().add(-1, 'month').format('MMMM');
    }

    function getNextMonthName() {
      return self.timeFrame.end.clone().add(10, 'days').format('MMMM');
    }

    function getViewTitle() {
      return self.timeFrame.start.format('MMMM');
    }

    function _refreshData(start, end) {
      transactionsService.list(start, end)
        .then(function (result) {
          self.transactions = result;
          _refreshCurrentSold();
        });
    }

    function _sortTransactions(val) {
      return -val.date.unix();
    }

    function _changeTransactionType(newType) {
      self.selectedTransactionType = newType;
    }

    function _refreshCurrentSold(transaction) {
      if (!transaction) {
        self.currentSold = _.reduce(self.transactions,
          function (sum, val) {
            return sum + val.amountSigned;
          }, 0);
      } else {
        self.currentSold += transaction.amountSigned;
      }
    }

    function _refreshTransactionCollections() {
      self.expenseTransactions = _(self.transactions)
        .where({ type: CONST.TransactionType.Expense })
        .sortBy('date')
        .value();

      self.incomeTransactions = _(self.transactions)
        .where({ type: CONST.TransactionType.Income })
        .sortBy('date')
        .value();
    }
  }
})();