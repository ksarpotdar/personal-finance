/* global angular */

(function () {
  angular.module('pf.constants', [])
    .constant('CONST', {
      TransactionType: {
        Expense: 'expense',
        Income: 'income'
      },
      FirebaseUrl: 'https://scorching-fire-2874.firebaseio.com',
      Errors: {
        Category: {
          DUPLICATE_CATEGORY_NAME: 'DUPLICATE_CATEGORY_NAME'
        }
      }
    })

})();
