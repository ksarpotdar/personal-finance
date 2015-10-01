(function () {
  'use strict';

  angular.module('pf.dashboard')
    .controller('DashboardCtrl', DashboardCtrl);
 
  
  DashboardCtrl.$inject = ['$state', 'CONST', 'transactionsDatacontext'];
  function DashboardCtrl($state, CONST, transactionsDatacontext) {
    var self = this;
    this.currentSold = 0;
    this.TransactionTypes = CONST.TransactionType;
    this.selectedTransactionType = CONST.TransactionType.Expense;
    this.transactions = [];
    this.viewTitle = 'September';
    this.editTransaction = editTransaction;
    this.addDefault = addDefault;
    this.sortTransactions = _sortTransactions;
    this.changeTransactionType = _changeTransactionType;
    
    activate();
    function activate() {
      transactionsDatacontext.list().then(function (result) {
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

    function _sortTransactions(val){
      return -val.date.unix();
    } 
    
    function _changeTransactionType(newType){
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