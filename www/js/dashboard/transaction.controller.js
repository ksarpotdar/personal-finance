/* global _, moment, angular */

(function () {
  "use strict";

  angular.module('pf.dashboard')
    .controller('TransactionCtrl', TransactionCtrl);

  TransactionCtrl.$inject = ['$stateParams', 'CONST', 'transactionsDatacontext', 'categories', 'user', 'transaction']
  function TransactionCtrl($stateParams, CONST, transactionsDatacontext, categories, user, transaction) {
    var self = this;
    this.selectedTransactionType = $stateParams.transactionType;
    this.isExpense = $stateParams.transactionType === CONST.TransactionType.Expense;
    this.isIncome = !this.isExpense;
    this.buttonText = transaction.$id ? 'Update' : 'Add';
    this.transaction = transaction;
    this.categories = [];
    this.addTransaction = addTransaction;
    this.testCreate = testCreate;
    this.createTransaction = createTransaction;
    this.categories = categories;

    this.datepickerObject = {
      titleLabel: 'Select Date',
      inputDate: new Date(),
      callback: function (val) {
        self.transaction.date = moment(val);
      }
    };

    activate();
    function activate() {
      if (!self.transaction.$id) {
        self.transaction.category = categories[0];
      }

      transactionsDatacontext.list().then(function (result) {
        self.transactions = result;
      });
    }

    function createTransaction() {
      var newTran = angular.copy(self.transaction);
      transactionsDatacontext.add(newTran)
        .then(function () {
          _afterTransactionAddCleanup();
        })
    }

    function _afterTransactionAddCleanup() {
      self.transaction.amount = null;
      self.transaction.note = '';
    }

    function testCreate() {
      // debugger;
      // transactionsDatacontext.listByCategory(self.categories[0].$id);
      
      categoriesDatacontext.sumByCategory();
      
      
      // categoriesDatacontext
      //   .add('some category WOHOO', CONST.TransactionType.Income)
      //   .then(function (result) {
      //     console.log(result);
          
      //     transactionsDatacontext.add(
      //       CONST.TransactionType.Income,
      //       100,
      //       self.categories[0],
      //       moment().unix()
      //     ).then(function(result){
      //       console.log(result);
      //     }).catch(function(err){
      //       console.error(err);
      //     })
          
          
      //     transactionsDatacontext.add(
      //       CONST.TransactionType.Income,
      //       100,
      //       self.categories[0],
      //       moment().unix()
      //     ).then(function(result){
      //       console.log(result);
      //     }).catch(function(err){
      //       console.error(err);
      //     })
          
          
      //     transactionsDatacontext.add(
      //       CONST.TransactionType.Income,
      //       100,
      //       self.categories[0],
      //       moment().unix()
      //     ).then(function(result){
      //       console.log(result);
      //     }).catch(function(err){
      //       console.error(err);
      //     })
          
      //   }).catch(function (err) {
      //     console.error(err);
      //   });
      
      
      // transactionsDatacontext.listCategory('d'
      // ).then(function(result){
      //   console.log(result);
      // }).catch(function(err){
      //   console.error(err);
      // });
      
      
      // transactionsDatacontext
    }

    function addTransaction() {
      if (self.currentTransaction.id) {
        transactionsDatacontext.update(self.currentTransaction);
      } else {
        transactionsDatacontext.add(self.currentTransaction);
      }
    }
  }
})();