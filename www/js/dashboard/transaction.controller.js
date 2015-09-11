/* global _, moment, angular */

(function () {
  "use strict";

  angular.module('pf.dashboard')
    .controller('TransactionCtrl', TransactionCtrl);

  TransactionCtrl.$inject = ['$stateParams', 'CONST', 'transactionsDatacontext', 'categoriesDatacontext', 'user', 'transaction']
  function TransactionCtrl($stateParams, CONST, transactionsDatacontext, categoriesDatacontext, user, transaction) {
    var self = this;
    this.selectedTransactionType = $stateParams.transactionType;
    this.currentTransaction = transaction;
    this.categories = [];
    this.addTransaction = addTransaction;
    this.testCreate = testCreate;

    activate();
    function activate() {
      categoriesDatacontext.list().then(function (result) {
        self.categories = result;
      });
    }

    function testCreate() {
      ///categoriesDatacontext.activate(user);
      categoriesDatacontext
        .update(self.categories[0].$id, 'some category WOHOO', CONST.TransactionType.Income)
        .then(function (result) {
          console.log(result);
        }).catch(function (err) {
          console.error(err);
        });
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