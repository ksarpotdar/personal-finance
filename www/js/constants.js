(function () {
  'use strict';
  
  angular.module('pf.constants', [])
    .constant('CONST', {
      ISODate: 'YYYY-MM-DDTHH:mm:ssZ',
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
