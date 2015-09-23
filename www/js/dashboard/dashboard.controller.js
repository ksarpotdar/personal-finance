/* global _, moment, angular */

(function () {
  "use strict";

  angular.module('pf.dashboard')
    .controller('DashboardCtrl', DashboardCtrl);
  
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  
  DashboardCtrl.$inject = ['$state', 'CONST', 'transactionsDatacontext']
  function DashboardCtrl($state, CONST, transactionsDatacontext) {
    var self = this;
    this.currentSold = 0;
    this.selectedTransactionType = CONST.TransactionType.Expense;
    this.transactions = [];
    this.expenseTransactions = [];
    this.incomeTransactions = [];

    this.addTransaction = addTransaction;
    this.editTransaction = editTransaction;
    this.deleteTransaction = deleteTransaction;

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

    function editTransaction(transaction) {
      // $state.go('transaction.edit', { id: transaction.$id });
      $state.go('transaction.edit', { id: transaction.$id });
    }

    function deleteTransaction($index) {

    }

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