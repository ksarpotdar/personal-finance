/* global _, moment, angular */

(function () {
  "use strict";

  angular.module('pf.dashboard')
    .controller('TransactionCtrl', TransactionCtrl);

  TransactionCtrl.$inject = ['$stateParams', '$state', '$ionicHistory', 'CONST', 'transactionsDatacontext', 'categories', 'user', 'transaction']
  function TransactionCtrl($stateParams, $state, $ionicHistory, CONST, transactionsDatacontext, categories, user, transaction) {
    var self = this;
    this.selectedTransactionType = $stateParams.transactionType;
    this.isExpense = $stateParams.transactionType === CONST.TransactionType.Expense;
    this.isIncome = !this.isExpense;
    this.buttonText = transaction.$id ? 'Update' : 'Add';
    this.transaction = angular.copy(transaction); //create a copy so we can cancel without affecting the original transaction
    this.categories = categories;

    this.datepickerObject = {
      titleLabel: 'Select Date',
      inputDate: transaction.date.toDate(),
      callback: function (val) {
        self.transaction.date = moment(val);
      }
    };

    this.execute = execute;
    this.delete = _delete;


    activate();
    function activate() {
      if (!self.transaction.$id) {
        self.transaction.category = categories[0];
      }

      transactionsDatacontext.list().then(function (result) {
        self.transactions = result;
      });
    }


    function execute() {
      if (self.transaction.$id) {
        _updateTransaction();
      } else {
        _createTransaction();
      }
    }

    function _createTransaction() {
      var newTran = angular.copy(self.transaction);
      transactionsDatacontext.add(newTran)
        .then(function () {
          _afterTransactionAddCleanup();
        });
    }

    function _delete() {
      transactionsDatacontext.remove(self.transaction).then(function () {
        _goBack();
      });
    }

    function _updateTransaction() {
      transactionsDatacontext.update(self.transaction)
        .then(function () {
          _afterTransactionAddCleanup();
          _goBack();
        })
    }

    function _afterTransactionAddCleanup() {
      self.transaction.amount = null;
      self.transaction.note = '';
    }

    function _goBack() {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $state.go('dashboard');
      }
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