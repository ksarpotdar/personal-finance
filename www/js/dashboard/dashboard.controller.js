(function() {
  'use strict';

  angular.module('pf.dashboard')
      .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = ['$state', '$ionicListDelegate', 'CONST', 'transactionsService', 'TimeFrameService'];
  function DashboardCtrl($state, $ionicListDelegate, CONST, transactionsService, timeFrame) {
    var _this = this;
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
      _this.timeFrame = timeFrame.getCurrentTimeFrame();
      transactionsService.list().then(function(result) {
        _this.transactions = result;
        _refreshCurrentSold();
      });
    }

    function addDefault() {
      $state.go('category.add');
    }

    function editTransaction(transaction) {
      $state.go('transaction.edit', {id: transaction.$id});
      $ionicListDelegate.closeOptionButtons();
    }

    function prevMonth() {
      _this.timeFrame = timeFrame.prevMonth();
      _refreshData(_this.timeFrame.start, _this.timeFrame.end);
    }

    function nextMonth() {
      _this.timeFrame = timeFrame.nextMonth();
      _refreshData(_this.timeFrame.start, _this.timeFrame.end);
    }

    function getPreviousMonthName() {
      return _this.timeFrame.start.clone().add(-1, 'month').format('MMMM');
    }

    function getNextMonthName() {
      return _this.timeFrame.end.clone().add(10, 'days').format('MMMM');
    }

    function getViewTitle() {
      return _this.timeFrame.start.format('MMMM');
    }

    function _refreshData(start, end) {
      transactionsService.list(start, end)
          .then(function(result) {
            _this.transactions = result;
            _refreshCurrentSold();
          });
    }

    function _sortTransactions(val) {
      return -val.date.unix();
    }

    function _changeTransactionType(newType) {
      _this.selectedTransactionType = newType;
    }

    function _refreshCurrentSold(transaction) {
      if (!transaction) {
        _this.currentSold = _.reduce(_this.transactions,
            function(sum, val) {
              return sum + val.amountSigned;
            }, 0);
      } else {
        _this.currentSold += transaction.amountSigned;
      }
    }

    function _refreshTransactionCollections() {
      _this.expenseTransactions = _(_this.transactions)
          .where({type: CONST.TransactionType.Expense})
          .sortBy('date')
          .value();

      _this.incomeTransactions = _(_this.transactions)
          .where({type: CONST.TransactionType.Income})
          .sortBy('date')
          .value();
    }
  }
})();
