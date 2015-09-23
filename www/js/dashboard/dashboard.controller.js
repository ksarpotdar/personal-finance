/* global _, moment, angular */

(function () {
  "use strict";

  angular.module('pf.dashboard')
    .controller('DashboardCtrl', DashboardCtrl);
  
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  
  DashboardCtrl.$inject = ['CONST', 'transactionsDatacontext']
  function DashboardCtrl(CONST, transactionsDatacontext) {
    var self = this;
    this.currentSold = 0;
    this.selectedTransactionType = CONST.TransactionType.Expense;
    this.transactions = [];
    this.expenseTransactions = [];
    this.incomeTransactions = [];

    this.addTransaction = addTransaction;

    activate();
    function activate() {
      transactionsDatacontext.list().then(function (result) {
        self.expenseTransactions = result;
        self.incomeTransactions = result;
        self.transactions = result;
      });
    }

    // _refreshTransactionCollections();
    // _refreshCurrentSold();

    function addTransaction() {
      // var newTransaction = transactionsDatacontext.add({});
      // _refreshTransactionCollections();
      // _refreshCurrentSold(newTransaction);
    }


    function _refreshCurrentSold(transaction) {
      if (!transaction) {
        self.currentSold = _.reduce(self.transactions,
          function (sum, val) {
            return sum + val.amountSigned();
          }, 0);
      } else {
        self.currentSold += transaction.amountSigned();
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