(function () {
  'use strict';
  
  angular.module('pf.constants', [])
    .constant('CONST', {
      TransactionType: {
        Expense: 'expense',
        Income: 'income'
      },
      FirebaseUrl: 'https://scorching-fire-2874.firebaseio.com',
      Errors: {
        Category: {
          DUPLICATE_NAME: 'DUPLICATE_NAME',
          NOT_FOUND: 'NOT_FOUND'
        }
      }
    });

})();
