(function(){
	"use strict";
	
  angular.module('pf.account', []);	
	
})();
(function () {
	'use strict';

	angular.module('pf.categories', ['pf.constants', 'pf.datacontext', 'pf.errors']);

})();
(function () {
	"use strict";

	angular.module('pf.common-directives', []);

})();
(function () {
	'use strict';

	angular.module('pf.dashboard', ['pf.constants', 'pf.datacontext', 'pf.common-services']);

})();
(function () {
	"use strict";
	
	angular.module('pf.errors', []);
})();
(function () {
	"use strict";

	angular.module('pf.filters', []);

})();
(function(){
	'use strict';
	
	angular.module('pf.logging', ['pf.constants', 'firebase']);
})();
(function(){
	'use strict';
	
	angular.module('pf.common-services', []);
})();
(function(){
	'use strict';
	angular.module('pf.datacontext', ['pf.constants', 'firebase', 'pf.errors']);
})();
(function(){
	"use strict";
	
  angular.module('pf.transactions', ['pf.constants', 'pf.datacontext', 'pf.errors']);	
	
})();
/* global angular */

(function () {
  'use strict';
  angular.module('pf', ['ionic', 'ionic-datepicker', 'pf.dashboard', 'pf.account', 'pf.datacontext', 'pf.categories', 'pf.transactions', 'pf.common-directives', 'pf.constants', 'pf.filters', 'pf.logging'])
    .run(['$ionicPlatform', function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleLightContent();
        }
      });
    }])
    .run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {
      $rootScope.$on('$stateChangeStart', function (event, next) {
        if (!Auth.signedIn()) {
          // all controllers need authentication unless otherwise specified
          if (!next.data || !next.data.anonymous) {
            event.preventDefault();
            debugger;
            $state.go('account.login');
          }
        }
      });

      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        console.error('$stateChangeError: ', error);
        console.log(arguments);
      });
    }]);
})();

/* global angular */

(function () {
  'use strict';
  angular.module('pf')
    .config(['$provide', function ($provide) { 
      $provide.decorator('$locale', ['$delegate', function ($delegate) {
        if ($delegate.id === 'en-us') {
          $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
          $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
        }
        return $delegate;
      }]);
    }])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

      $stateProvider
 
        .state('tabs', {
          url: '',
          abstract: true,
          templateUrl: 'templates/tabs.html',
          resolve: {
            user: ['Auth', function (Auth) {
              return Auth.resolveUser();
            }]
          }
        })
        .state('tabs.dashboard', {
          url: '/dashboard',
          views: {
            'tab-dashboard': {
              controller: 'DashboardCtrl as dash',
              templateUrl: 'templates/dashboard.html'
            }
          }
        })
        .state('tabs.settings', {
          url: '/settings',
          views: {
            'tab-settings': {
              templateUrl: 'templates/settings.html'
            }
          }
        });

      $urlRouterProvider.otherwise('/dashboard');

    }]);
})();

(function () {
  'use strict';
  
  angular.module('pf.constants', [])
    .constant('CONST', {
      ISODate: 'YYYY-MM-DDTHH:mm:ssZ',
      RecurrenceState: {
        toProcess: 'toProcess',
        processed: 'processed'
      },
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

(function () {
	'use strict';

	angular.module('pf')
		.factory('$exceptionHandler', exceptionHandler);

	exceptionHandler.$inject = ['$log','logging'];
	function exceptionHandler($log, logging) {
		return function (exception) {
			$log.error.apply($log, arguments);
			logging.logError(exception.message, exception.stack);
			throw exception;
		};
	}
})();
/* global angular */

(function () {
  angular.module('pf.account')
    .config(configuration);

  configuration.$inject = ['$stateProvider', '$urlRouterProvider'];
  function configuration($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('account', {
        url: '/account',
        abstract: true,
        template: '<ion-nav-view></ion-nav-view>',
        resolve: {
          user: _userResolver
        }
      })
      .state('account.login', {
        url: '/login',
        controller: 'LoginCtrl as login',
        templateUrl: 'templates/account/login.html',
        data: {
          anonymous: true
        }
      })
      .state('account.logout', {
        url: '/logout',
        controller: 'LogoutCtrl as logout',
        template: '',
        data: {
          anonymous: true
        }
      })
      .state('account.new', {
        url: '/new',
        controller: 'NewAccountCtrl as new',
        templateUrl: 'templates/account/new.html',
        data: {
          anonymous: true
        }
      });

    $urlRouterProvider.otherwise('/account/login');

    _userResolver.$inject = ['Auth'];
    function _userResolver(Auth) {
      return Auth.resolveUser();
    }
  }
})();

(function () {
  'use strict';

  angular.module('pf.account')
    .controller('AccountCtrl', function () { })
    .controller('LoginCtrl', loginCtrl)
    .controller('LogoutCtrl', logoutCtrl)
    .controller('NewAccountCtrl', newAccountCtrl);

  logoutCtrl.$inject = ['$state', '$ionicHistory', 'Auth'];
  function logoutCtrl($state, $ionicHistory, Auth) {
    activate();

    function activate() {
      Auth.logout();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('account.login');
    }
  }

  loginCtrl.$inject = ['$state', '$timeout', '$location', '$ionicHistory', 'Auth', 'user'];
  function loginCtrl($state, $timeout, $location, $ionicHistory, Auth, user) {
    var self = this;
    this.username = '';
    this.password = '';
    this.loading = false;

    this.submit = login;

    activate();

    function activate() {
      //$ionicHistory.clearHistory();
      if (Auth.signedIn()) {
        debugger;
        _toDashboard();
      }
    }

    function login() {
      self.loading = true;
      self.password = 'asdf';
      Auth.login(self.username, self.password).then(function () {
        self.loading = false;
        _toDashboard();
      }).catch(function (err) {
        self.errorMessage = err;
      });
      self.loading = true;
    }

    function _toDashboard() {
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
      $state.go('tabs.dashboard');
    }

  }


  newAccountCtrl.$inject = ['$state', '$ionicHistory', 'Auth', 'user'];
  function newAccountCtrl($state, $ionicHistory, Auth, user) {
    var self = this;
    this.errorMessage = '';
    this.username = '';
    this.password = '';
    this.loading = false;

    this.submit = createAccount;

    activate();


    function activate() {
      if (Auth.signedIn()) {
        _toDashboard();
      }
    }

    function createAccount() {
      self.errorMessage = '';
      self.loading = true;

      Auth.register(self.username, self.password).then(function () {
        return Auth.login(self.username, self.password).then(function (result) {
          return Auth.createProfile(result).then(function () {
            self.loading = false;
            _toDashboard();
          });
        });
      }).catch(function (err) {
        self.errorMessage = err;
      });
      self.loading = true;
    }

    function _toDashboard() {
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
      debugger;
      $state.go('tabs.dashboard', {}, { location: "replace", reload: true });
    }
  }

})();
/* global angular */

(function () {
  'use strict';
  angular.module('pf.categories')
    .config(configuration);

  configuration.$inject = ['$stateProvider', '$urlRouterProvider', 'CONST'];
  function configuration($stateProvider, $urlRouterProvider, CONST) {

    $stateProvider
      .state('category', {
        url: '/category',
        template: '<ion-nav-view></ion-nav-view>',
        abstract: true,
        resolve: {
          user: _userResolver,
          categories: _categoriesResolver
        }
      })
      .state('category.list', {
        url: '/list',
        controller: 'CategoriesCtrl as catCtrl',
        templateUrl: 'templates/categories/list.html'
      })
      .state('category.add', {
        url: '/add',
        controller: 'CategoryCtrl as catCtrl',
        templateUrl: 'templates/categories/edit.html',
        resolve: {
          category: _addCategoryResolver
        }
      })
      .state('category.edit', {
        url: '/edit/:id',
        controller: 'CategoryCtrl as catCtrl',
        templateUrl: 'templates/categories/edit.html',
        resolve: {
          category: _editCategoryResolver
        }
      });

    $urlRouterProvider.otherwise('/category/list');


    _categoriesResolver.$inject = ['$stateParams', 'categoriesDatacontext']
    function _categoriesResolver($stateParams, categoriesDatacontext) {
      return categoriesDatacontext.list();
    }

    _userResolver.$inject = ['Auth'];
    function _userResolver(Auth) {
      return Auth.resolveUser();
    }

    function _addCategoryResolver() {
      return {
        name: '',
        type: CONST.TransactionType.Expense
      };
    }

    _editCategoryResolver.$inject = ['$stateParams', 'categoriesDatacontext'];
    function _editCategoryResolver($stateParams, categoriesDatacontext) {
      var transactionId = $stateParams.id;
      return categoriesDatacontext.get(transactionId);
    }
  }
})();

(function () {
  'use strict';

  angular.module('pf.categories')
    .controller('CategoriesCtrl', CategoriesCtrl);


  CategoriesCtrl.$inject = ['$state', 'CONST', 'categoriesDatacontext', 'logging'];
  function CategoriesCtrl($state, CONST, categoriesDatacontext, logging) {
    logging.logDebug('entering CategoriesCtrl');
    
    var self = this;
    this.categories = [];

    this.edit = _edit;

    activate();
    function activate() {
      // searchProvider.query(
      //   { a: 'b' },
      //   function (data) {
      //     console.log(data);
      //   });

      categoriesDatacontext.list().then(function (result) {
        self.categories = result;
      });
    }

    function _edit(category) {
      logging.logDebug('Clicked on edit Category.', category);
      $state.go('category.edit', { id: category.$id });
    }
  }
})();
(function () {
  'use strict';

  angular.module('pf.categories')
    .controller('CategoryCtrl', CategoryCtrl);


  CategoryCtrl.$inject = ['$state', '$ionicHistory', '$ionicPopup', 'CONST', 'CategoryService', 'logging', 'category', 'user'];
  function CategoryCtrl($state, $ionicHistory, $ionicPopup, CONST, categoriesService, logging, category, user) {
    logging.logDebug('Entering Add/Edit category controller');
    var self = this;
    this.category = angular.copy(category);

    this.categoryTypes = [{
      name: 'Income',
      id: CONST.TransactionType.Income
    }, {
        name: 'Expense',
        id: CONST.TransactionType.Expense
      }];


    this.execute = execute;
    this.delete = _delete;

    activate();
    function activate() { }

    function execute(categoryFrm) {
      if (!categoryFrm.$valid) {
        return;
      }

      if (self.category.$id) {
        _updateCategory();
      } else {
        _addCategory();
      }
    }

    function _addCategory() {
      categoriesService.add(self.category.name, self.category.type, user).then(function (result) {
        console.log('wohooo', result);
      }).catch(function (result) {
        console.log('oooops', result);
      });
    }

    function _updateCategory() {
      categoriesService.update(self.category).then(function (result) {
        console.log('wohooo', result);
      }).catch(function (result) {
        console.log('oooops', result);
      });
    }

    function _delete() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'NO UNDO',
        template: 'Are you sure you want to delete this category?'
      });
      
      confirmPopup.then(function (res) {
        if (res) {
          categoriesService.delete(self.category);
          _goBack();
        }
      });      
    }

    function _goBack() {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $state.go('category.list');
      }
    }
  }
})();
/* global _, moment, angular */

(function () {
  'use strict';

  angular.module('pf.categories')
    .factory('CategoryService', categoriesService);

  categoriesService.$inject = ['$state', '$q', 'CONST', 'categoriesDatacontext', 'errors', 'logging'];
  function categoriesService($state, $q, CONST, categoriesDatacontext, errors, logging) {
    logging.logDebug('entering categories service');
    
    /*jshint validthis: true */
    var self = this;
    this.categories = [];

    _activate();

    return {
      add: _add,
      updat: _update,
      delete: _delete,
    };

    function _activate() {
      categoriesDatacontext.list().then(function (result) {
        self.categories = result;
      });
      logging.logDebug('activated categories service');
    }

    function _add(name, type, user) {           
      var deferred = $q.defer();

      if (_categoryExists(name)) {
        deferred.reject(new errors.DuplicateCategoryNameError('Category with this name already exists.'));
      } else {
        var newCategory = { user_id: user.uid, type: type, name: name }; // jshint ignore:line
        return self.categories.$add(newCategory);
      }

      return deferred.promise;
    }    
    
    function _update(categ) {
      return categoriesDatacontext.get(categ.$id).then(function (category) {
        if (_categoryExists(categ.name, categ.$id)) {
          throw new errors.DuplicateCategoryNameError('Category with this name already exists.');
        } else {
          category.name = categ.name;
          category.type = categ.type;
          return self.categories.$save(category);
        }
      });
    }
    
    function _delete(categ) {
      return categoriesDatacontext.get(categ.$id).then(function(category){
        category.deleted = moment().unix();
        return self.categories.$save(category);
      });
    }

    function _categoryExists(name, excludedId) {
      if (!self.categories.length) { return false; }

      if (excludedId) {
        var cat = _getByName(name);
        return cat && cat.$id !== excludedId;
      }
      return !!_getByName(name);
    }

    function _getByName(name) {
      var lowerName = name.toLowerCase();
      var category = _.find(self.categories, function (c) { return c.name.toLowerCase() === lowerName; });
      return category;
    }

  }
})();
(function () {
	"use strict";

	angular.module('pf.common-directives').directive('momentDate', momentDateDirective);

	function momentDateDirective($compile) {
		return {
			restrict: 'A',
			require:'ngModel',
			link: linkFunction
		};

		function linkFunction(scope, elem, attrs, ctrl) {
			ctrl.$parsers.push(function(value){
				return moment(value, 'MM/DD/YYYY');
			});
			
			ctrl.$formatters.push(function(value){
				if(value){
					return value.toDate();
				}
			});
		}
	}
})();
(function () {
	'use strict';

	angular.module('pf.common-directives').directive('pfSpinnerButton', spinnerButtonDirective);

	spinnerButtonDirective.$inject = ['$compile'];
	function spinnerButtonDirective($compile) {
		return {
			restrict: 'A',
			link: linkFunction
		};

		function linkFunction(scope, elem, attrs) {
			var initialContent = elem.html();
			elem.data('initial-content', initialContent);

			scope.$watch(function () {
				return scope.$eval(attrs.pfSpinnerButton);
			}, function (_new, _old) {
				if (_new === _old) { return; }
				if (_new) {
					var compileFn = $compile('<ion-spinner icon="spiral" class="spinner-light spinner-s"></ion-spinner>')
					var compiledContent = compileFn(scope);
					elem.append(compiledContent);					
				} else {
					elem.empty();
					elem.html(elem.data('initial-content'));
				}
			})
		}
	}
})();
(function () {
  'use strict';

  angular.module('pf.dashboard')
    .controller('DashboardCtrl', DashboardCtrl);


  DashboardCtrl.$inject = ['$state', 'CONST', 'transactionsDatacontext', 'TimeFrameService'];
  function DashboardCtrl($state, CONST, transactionsDatacontext, timeFrame) {
    var self = this;
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
      self.timeFrame = timeFrame.getCurrentTimeFrame();
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

    function prevMonth() {
      self.timeFrame = timeFrame.prevMonth();
      _refreshData(self.timeFrame.start, self.timeFrame.end);
    }

    function nextMonth() {
      self.timeFrame = timeFrame.nextMonth();
      _refreshData(self.timeFrame.start, self.timeFrame.end);
    }

    function getPreviousMonthName() {
      return self.timeFrame.start.clone().add(-1, 'month').format('MMMM');
    }

    function getNextMonthName() {
      return self.timeFrame.end.clone().add(10, 'days').format('MMMM');
    }

    function getViewTitle() {
      return self.timeFrame.start.format('MMMM');
    }

    function _refreshData(start, end) {
      transactionsDatacontext.list(start, end)
        .then(function (result) {
          self.transactions = result;
          _refreshCurrentSold();
        });
    }

    function _sortTransactions(val) {
      return -val.date.unix();
    }

    function _changeTransactionType(newType) {
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
(function () {
	"use strict";

	angular.module('pf.errors')
		.factory('errors', errors);

	function errors() {
		function NotFoundError(message) {

			var error = Error.call(this, message);
			this.name = 'NotFoundError';
			this.message = error.message;
			this.stack = error.stack;
		}

		NotFoundError.prototype = Object.create(Error.prototype, {
			constructor: {
				value: NotFoundError,
				writable: true,
				configurable: true
			}
		});
		
		
		function DuplicateCategoryNameError(message) {

			var error = Error.call(this, message);
			this.name = 'DuplicateCategoryNameError';
			this.message = error.message;
			this.stack = error.stack;
		}

		DuplicateCategoryNameError.prototype = Object.create(Error.prototype, {
			constructor: {
				value: DuplicateCategoryNameError,
				writable: true,
				configurable: true
			}
		});
		
		return {
			NotFoundError: NotFoundError,
			DuplicateCategoryNameError: DuplicateCategoryNameError
		};
	}
})();
(function () {
	"use strict";

	angular.module('pf.filters').filter('pfMomFilter', momentFilter);
	
	function momentFilter(){
		return function(value, format){
			format = format || 'YYYY-MM-DD';
			if(moment.isMoment(value)){
				return value.format(format);
			}
			return value;
		}
	}

})();
(function () {
	'use strict';

	angular.module('pf.logging')
		.factory('logging', loggingService);

	loggingService.$inject = ['$window', 'CONST'];
	function loggingService($window, CONST) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var loggingKey = moment().startOf('hour').format('YYYY-MM-DDHH:mm:ss');

		return {
			logDebug: logDebug,
			logError: logError
		};

		function logDebug(message, data) {
			_log(message, data, null, 'debug');
		}

		function logError(message, stack) {
			_log(message, null, stack, 'error');
		}

		function _log(message, data, stack, type) {
			var logRef = ref.child('logging/' + type + '/' + loggingKey);
			var logKey = moment().format('YYYY-MM-DDHH:mm:ss');

			logRef.child(logKey).set({
				message: message,
				data: (data ? JSON.stringify(data) : null),
				stack: (stack ? JSON.stringify(stack) : null)
			});
			
			console.log(message);			
		}
	}
})();
/* global angular */
(function () {
	'use strict';
	angular.module('pf.datacontext').factory('Auth', authService);

	authService.$inject = ['$q', '$window', '$rootScope', '$firebaseObject', 'CONST'];
	function authService($q, $window, $rootScope, $firebaseObject, CONST) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);

		var auth = {
			register: register,
			createProfile: createProfile,
			login: login,
			logout: logout,
			resolveUser: resolveUser,
			signedIn: signedIn,
			user: {},
		};

		ref.onAuth(function (authData) {
			angular.copy(authData || {}, auth.user);
		});

		return auth;

		function register(username, password) {
			var deferred = $q.defer();
			ref.createUser({ email: username, password: password }, function (error, authData) {
				if (error) {
					deferred.reject(error);
				} else {
					deferred.resolve(authData);
				}
			});
			return deferred.promise;
		}

		function login(username, password) {
			var deferred = $q.defer();
			ref.authWithPassword({ email: username, password: password }, function (error, authData) {
				if (error) {
					deferred.reject(error);
				} else {
					deferred.resolve(authData);
				}
			});
			return deferred.promise;
		}

		function createProfile(user) {
			var deferred = $q.defer();
			var profile = {
				username: user.password.email,
				'md5_hash': 'XX'
			};

			var profileRef = ref.child('profile').child(user.uid);
			profileRef.set(profile, function (err) {
				if (err) {
					deferred.reject(err);
				} else {
					deferred.resolve(profile);
				}
			});

			return deferred.promise;
		}

		function logout() {
			ref.unauth();
		}
		function resolveUser() {
			return ref.getAuth();
		}
		function signedIn() {
			return !!auth.user.provider;
		}
	}
})();
/* global moment */
/* global angular */
(function () {
	'use strict';
	
	angular.module('pf.datacontext').factory('categoriesDatacontext', categoriesDatacontext);

	categoriesDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', '$firebaseUtils', 'Auth', 'CONST', 'errors'];
	function categoriesDatacontext($q, $timeout, $window, $firebaseArray, $firebaseUtils, Auth, CONST, errors) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var user = Auth.resolveUser();
		var categoryRef = ref.child('profile').child(user.uid).child('categories');
		var categoriesArr = _createCategoryFirebaseArray()(categoryRef);
		var _categoriesLoaded = false;

		_activate();

		return {
			list: getCategories,
			sumByCategory: sumByCategory,
			get: _getById,
			addTransactionToCategory: addTransactionToCategory,
			categoryRef: categoryRef
		};

		function _activate(user) {
			categoriesArr
				.$loaded()
				.then(function (data) {
					console.log('Categories loaded: ', data);
					_categoriesLoaded = true;
				});
			
			//var categoriesArr = $firebaseArray(ref.child('category'));
			
			// 	categoriesArr.$loaded()
			// 	.then(function (data) {
			// 		console.log('Categories loaded: ', data);
			// 	});

			// debugger;
			
			// categoriesArr.$add({
			// 	type: CONST.TransactionType.Expense,
			// 	name: 'Groceries',
			// 	user_id: user.uid
			// });
			
			// var userRef = ref.child('profile').child(user.uid);
			// userRef.child('Groceries').set({
			// 	user_id: user.uid,
			// 	type: CONST.TransactionType.Expense
			// })
			// var categoryRef = userRef.child('category');
			// categoryRef.child('Car').set({
			// 	user_id: user.uid,
			// 	type: CONST.TransactionType.Expense
			// }, function(err){
			// 	if(err){
			// 		console.log(err);
			// 	}else{
			// 		console.log('Saved Car');
			// 	}
			// })
			
						
			
			// categoryRef.child('Groceries').set({
			// 	user_id: user.uid,
			// 	type: CONST.TransactionType.Expense
			// }, function(err){
			// 	if(err){
			// 		console.log(err);
			// 	}else{
			// 		console.log('Saved Car');
			// 	}
			// })
			
			
			
			// categoryRef.orderByKey().on('value', function (data) {
			// 	var transactionRef = userRef.child('transactions');
			// 	var categories = data.val();

			// 	for (var key in categories) {
			// 		if (categories.hasOwnProperty(key)) {
			// 			var category = categories[key];
			// 			for (var i = 0; i < 5; i++) {
			// 				(function (i) {
			// 					setTimeout(function () {
			// 						var id = transactionRef.push();
			// 						id.setWithPriority({
			// 							amount: 123,
			// 							category: key,
			// 							date: Firebase.ServerValue.TIMESTAMP,
			// 							type: category.type,
			// 							text: 'text' + i
			// 						}, Date.now())
			// 						console.log('Added at: %d', Date.now());
			// 						console.log(Date.now());
			// 					}, 1000 * (i + 1))
			// 				})(i);
			// 			}
			// 		}
			// 	}
			// });

			// var transactionRef = userRef.child('transactions');
			// transactionRef.orderByChild('date').endAt(1441887019891).on('value', function (data) {
			// 	console.log(data.val());
			// });
			
			// var transactionArr = $firebaseArray(transactionRef);

			// transactionArr.$loaded()
			// 	.then(function (data) {
			// 		console.log('Transactions loaded: ', data);
			// 	});

			// var result = transactionArr.$add(
			// 	{
			// 		amount: 123,
			// 		category: 'Groceries',
			// 		date: Firebase.ServerValue.TIMESTAMP,
			// 		type: 'expense',
			// 		text: 'text-WWWOOOOT'
			// 	}).then(function (ref) {
			// 		var id = ref.key();
			// 		console.log("added record with id " + id);
			// 		//  list.$indexFor(id); // returns location in the array
			// 	});

			// debugger;
			// categoryRef.orderByKey().on('child_added',function(data){
			// 	console.log('Received Data: child_added');
			// 	console.log(data);
			// });
			
			// categories.push({
			// 	type: CONST.TransactionType.Expense,
			// 	id: 1,
			// 	name: 'Groceries'
			// });
			// categories.push({
			// 	type: CONST.TransactionType.Expense,
			// 	id: 4,
			// 	name: 'Auchan',
			// 	parent: 1
			// });
			// categories.push({
			// 	type: CONST.TransactionType.Expense,
			// 	id: 2,
			// 	name: 'Entertainment'
			// });
			// categories.push({
			// 	type: CONST.TransactionType.Income,
			// 	id: 3,
			// 	name: 'Salary'				
			// });

			// categories.forEach(function (t) {
			// 	t.amountSigned = function () {
			// 		return this.type === CONST.TransactionType.Expense ? -this.amount : this.amount;
			// 	}
			// });
		}

		function sumByCategory() {			
			for (var i = 0; i < categoriesArr.length; i++) {
				var categ = categoriesArr[i];
				categ.refreshSum();
			}

			$timeout(function () {
				var r = categoriesArr[0];
				console.log(r);
			}, 1000);
		}

		function getCategories() {
			return categoriesArr.$loaded();
		}
		
		//link the category with a transaction
		function addTransactionToCategory(category, transactionKey, transaction) {
			var categoryTransactionRef = categoryRef.child(category.$id).child('transactions');
			categoryTransactionRef.child(transactionKey)
				.setWithPriority({
					amount: transaction.amount,
					date: transaction.date
				}, transaction.date);
		}

		function _getById(id) {
			var deferred = $q.defer();
			if (_categoriesLoaded) {
				var category = _.findWhere(categoriesArr, { $id: id });
				if (category) {
					deferred.resolve(category);
				} else {
					deferred.reject(new errors.NotFoundError('Category not found'));
				}
			} else {
				categoriesArr.$loaded().then(function () {
					var category = _.findWhere(categoriesArr, { $id: id });
					if (category) {
						deferred.resolve(category);
					} else {
						deferred.reject(new errors.NotFoundError('Category not found'));
					}
				});
			}
			return deferred.promise;
		}

		function _createCategoryFirebaseArray() {
			return $firebaseArray.$extend({
				$$added: function (snap) {
					var rec = $firebaseArray.prototype.$$added.call(this, snap);

					rec.refreshSum = function (start, end) {
						var start = moment().add(-10, 'days').unix();
						var end = moment().unix();
						rec.sum = 0;

						var categSumRef = categoryRef.child(rec.$id).child('transactions').orderByChild('date').startAt(start).endAt(end);
						categSumRef.on('child_added', function (snapshot) {
							console.log(snapshot.key());
							var data = snapshot.val();
							rec.sum += data.amount;
						});
					}
					return rec;
				},
				// https://gist.github.com/katowulf/d0c230f1a7f6b5806a29
				$save: function (indexOrItem, listOfFields) {
					listOfFields = listOfFields || ['name', 'type', 'deleted']
					if (!listOfFields) {
						// do a normal save if no list of fields is provided
						return $firebaseArray.prototype.$save.apply(this, arguments);
					}

					var self = this;
					var item = self._resolveItem(indexOrItem);
					var key = self.$keyAt(item);
					if (key !== null) {
						var ref = self.$ref().ref().child(key);
						var updateFields = pickFields(item, listOfFields);
						var data = $firebaseUtils.toJSON(updateFields);

						return $firebaseUtils.doSet(ref, data).then(function () {
							self.$$notify('child_changed', key);
							return ref;
						});
					}
					else {
						return $firebaseUtils.reject('Invalid record; could determine key for ' + indexOrItem);
					}
				}
			});

			function pickFields(data, fields) {
				var out = {};
				angular.forEach(fields, function (k) {
					out[k] = data.hasOwnProperty(k) ? data[k] : null;
				});
				return out;
			}
		}
	}
})();
(function () {
	'use strict';

	angular.module('pf.datacontext').factory('recurrenceCalculator', recurrenceCalculator);

	function recurrenceCalculator() {

		return {
			getNewRunDate: getNewRunDate,
		};


		function getNewRunDate(startDate, rule) {
			var days = { 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0 };
			var rules = rule.split(' ');
			var timeSpanRule = rules[0];
			var dayRule = rules[1];
			var timeSpan = {};
			var day = -1;

			switch (timeSpanRule) {
				case '1W':
					timeSpan = { value: 1, type: 'week' };
					break;
				case '2W':
					timeSpan = { value: 2, type: 'week' };
					break;
				default:
					timeSpan = { value: 1, type: 'month' };
			}

			if (timeSpan.type === 'week') {
				day = days[dayRule];
			} else {
				day = parseInt(dayRule, 10);
			}
			var start = startDate.clone();
			if (timeSpan.type === 'week') {
				start.startOf('week').day(day);
				if (start.isBefore(startDate) || start.isSame(startDate)) {
					start.add(timeSpan.value, 'week');
				}
			} else {
				start.startOf('month').date(day);
				if (start.isBefore(startDate) || start.isSame(startDate)) {
					start.add(timeSpan.value, 'month');
				}
			}

			return start;
		}
	}
})();
(function () {
	'use strict';

	angular.module('pf.datacontext').factory('recurrenceDatacontext', recurrenceDatacontext);

	recurrenceDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', '$firebaseObject', '$firebaseUtils', 'Auth', 'CONST'];
	function recurrenceDatacontext($q, $timeout, $window, $firebaseArray, $firebaseObject, $firebaseUtils, Auth, CONST) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var user = Auth.resolveUser();
		var recurrences = null;

		return {
			getNextOccurence: getNextOccurrence,
			add: add,
			remove: remove,
			update: update,
			getById: getById			
		};


		function getNextOccurrence() {
			var recurrenceRef = ref.child('profile').child(user.uid).child('recurrences/transactions')
				.orderByChild('state')
				.startAt('toProcess').endAt('toProcess');

			var recFirebaseArray = _createRecurrencesFirebaseArray();
			recurrences = recFirebaseArray(recurrenceRef);

			return recurrences.$loaded().then(function(items){
				return _(items).orderBy('nextRunDateUnix').take(1).value();
			});
		}

		function getById(id) {
			var recurrenceRef = ref.child('profile').child(user.uid).child('recurrences/transactions')
				.child(id);

			return $firebaseObject(recurrenceRef).$loaded();
		}

		function add(transactionId, rule, nextRunDate) {
			var recurrence = {
				dateAdded: moment().format(),
				nextRunDate: nextRunDate.format(),
				nextRunDateUnix: nextRunDate.unix(),
				transactionId: transactionId,
				state: CONST.RecurrenceState.toProcess,
				dateUpdated: null,
				$priority: nextRunDate.unix()
			};
				
			return recurrences.$add(recurrence);
			// var recurrence = {
			// 	dateAdded: moment().format(),
			// 	nextRunDate: .. some next run date based on rules .. needs to be provided,
			// 	transactionId: .. from interface ..,
			// 	rule: '1W, 2W, 3W, 1M', // KISS 1week ...1month
			//  state: toProcess // after we process it, we update this one to 'processed' and create a new instance.						
			// };
			
			// when a recurrence is processed - let's store the resultingTransactionId .. so we can keep track of it 
			// when we create a recurrence we need to set the id on the transaction so it's easy to find/edit
			// need to create a service that holds the logic for running a recurring transaction
			// need a way to determine if the transaction is late the user opened the app 3 months later
					// it would be nice to run for all the missing months (weeks). ! Nice to have - not that important !
					
			// some other recurring jobs would be ?

		}

		function update(recurrence) {
			recurrence.dateAdded = recurrence.dateAdded.format();
			recurrence.nextRunDate = recurrence.nextRunDate.format();
			recurrence.dateUpdated = moment().format();
			
			return recurrences.$save(recurrence).then(function () {
				//TODO - not happy with this. should be handled in angular fire somehow.
				recurrence.dateAdded = moment(recurrence.dateAdded, CONST.ISODate);
				recurrence.nextRunDate = moment(recurrence.nextRunDate, CONST.ISODate);
				return recurrence;
			});
		}

		function remove(recurrence) {
			
			var recurrencesToDeleteRef = ref.child('profile').child(user.uid).child('recurrences/transactions')
				.orderByChild('transactionId')
				.startAt(recurrence.transactionId).endAt(recurrence.transactionId);

			var recFirebaseArray = _createRecurrencesFirebaseArray();
			var recurrencesToDelete = recFirebaseArray(recurrencesToDeleteRef);

			return recurrencesToDelete.$loaded().then(function(items){
				var allDeletePromises = [];
				_.each(items, function(item){
					allDeletePromises.push(recurrencesToDelete.$remove(item));
				});
				return $q.all(allDeletePromises);
			});
		}

		function _createRecurrencesFirebaseArray() {
			return $firebaseArray.$extend({
				$$added: function (snap) {
					var rec = $firebaseArray.prototype.$$added.call(this, snap);
					rec.dateAdded = moment(rec.dateAdded, CONST.ISODate);
					rec.nextRunDate = moment(rec.nextRunDate, CONST.ISODate);

					return rec;
				}
			});
		}
	}
})();
(function () {
	'use strict';

	angular.module('pf.datacontext').factory('recurrenceService', recurrenceService);

	recurrenceService.$inject = ['Auth', 'CONST', 'recurrenceDatacontext', 'transactionsDatacontext', 'recurrenceCalculator'];
	function recurrenceService(Auth, CONST, recurrenceDatacontext, transactionsDatacontext, recurrenceCalculator) {
		//var user = Auth.resolveUser();
		
		return {
			processNext: processNext,
			// add: add,
			// remove: remove,
			// update: update,
			// getById: getById,
			
		};


		function processNext() {
			return recurrenceDatacontext.getNextOccurrence().then(function (occurrence) {
				if (occurrence.nextRunDate) {
					if (occurrence.nextRunDate > moment()) {
						// run transaction with the date of occurrence.nextRunDate
						// update this occurrence
						// create new one with the nextRunDate based on the current nextRunDate
						// even if we don't run every month (if it's a monthly recurrence), we will still catch up
						_runTransactionRecurrence(occurrence);
						_processRecurrenceAndCreateNew(occurrence);
					}
				}
			});
		}


		function _runTransactionRecurrence(occurrence) {
			return transactionsDatacontext.single(occurrence.transactionId).then(function (origTransaction) {
				var newTran = {};

				newTran.type = origTransaction.type;
				newTran.amount = origTransaction.amount;
				newTran.category = origTransaction.category;
				newTran.date = occurrence.nextRunDate.unix();
				newTran.formatted = occurrence.nextRunDate.format();
				newTran.note = '(recurrence)' + origTransaction.note;

				return transactionsDatacontext.add(newTran).then(function (savedTransaction) {
					return savedTransaction;
				});
			});
		}

		function _processRecurrenceAndCreateNew(occurrence) {
			occurrence.state = CONST.RecurrenceState.processed;
			recurrenceDatacontext.update(occurrence);

			_createFromOccurrence(occurrence);
		}

		function _createFromOccurrence(occurrence) {
			var nextRunDate = recurrenceCalculator.getNewRunDate(occurrence.nextRunDate, occurrence);
			recurrenceDatacontext.add(occurrence.transactionId, occurrence.rule, nextRunDate);
		}

		// var recurrence = {
		// 	dateAdded: moment().format(),
		// 	nextRunDate: .. some next run date based on rules .. needs to be provided,
		// 	transactionId: .. from interface ..,
		// 	rule: '1W, 2W, 3W, 1M', // KISS 1week ...1month
		//  state: toProcess // after we process it, we update this one to 'processed' and create a new instance.						
		// };
			
		// when a recurrence is processed - let's store the resultingTransactionId .. so we can keep track of it 
		// when we create a recurrence we need to set the id on the transaction so it's easy to find/edit
		// need to create a service that holds the logic for running a recurring transaction
		// need a way to determine if the transaction is late the user opened the app 3 months later
		// it would be nice to run for all the missing months (weeks). ! Nice to have - not that important !
					
		// some other recurring jobs would be ?
	}
})();
(function () {
  'use strict';

  angular.module('pf.common-services')
    .factory('TimeFrameService', TimeFrameService);

  function TimeFrameService() {
    var _start = null, _end = null;

    return {
      init: init,
      nextMonth: nextMonth,
      prevMonth: prevMonth,
      getCurrentTimeFrame: getTimeFrame
    };


    function init(force) {
      if (!_start || force) {
        _start = moment().startOf('month');
        _end = moment().endOf('month');
      }
    }

    function nextMonth() {
      return _changeMonth(1);
    }

    function prevMonth() {
      return _changeMonth(-1);
    }

    function getTimeFrame() {
      return {
        start: _start,
        end: _end,
        canMoveForward: _start && _start.isBefore(moment().startOf('month'))
      };
    }

    function _changeMonth(value) {
      _start = _start.clone().add(value, 'month');
      _end = _start.clone().endOf('month');

      return getTimeFrame();
    }

  }
})();
(function () {
	'use strict';

	angular.module('pf.datacontext').factory('transactionsDatacontext', transactionsDatacontext);

	transactionsDatacontext.$inject = ['$q', '$timeout', '$window', '$firebaseArray', '$firebaseUtils', 'categoriesDatacontext', 'Auth', 'CONST', 'errors'];
	function transactionsDatacontext($q, $timeout, $window, $firebaseArray, $firebaseUtils, categoriesDatacontext, Auth, CONST, errors) {
		var ref = new $window.Firebase(CONST.FirebaseUrl);
		var user = Auth.resolveUser();
		var _transactionsLoaded = false;
		var transactions = null;
		_activate();

		return {
			list: getTransactions,
			listByCategory: getByCategory,
			single: _getById,
			add: add,
			update: update,
			remove: remove,
		};


		function _activate() {
			getTransactions()
				.then(function () {
					_transactionsLoaded = true;
				});
		}

		function getTransactions(start, end) {
			if (!start) {
				start = moment().startOf('month');
			}

			if (!end) {
				end = start.clone().endOf('month');
			}

			var transactionRef = ref.child('profile').child(user.uid).child('transactions')
				.orderByChild('date')
				.startAt(start.unix()).endAt(end.unix());

			var transactionsFirebaseArray = _createTransactionsFirebaseArray();
			transactions = transactionsFirebaseArray(transactionRef);

			return transactions.$loaded().then(function (data) {
				_transactionsLoaded = true;
				return data;
			});
		}

		function getByCategory(categoryId, start, end) {
			var categoryRef = categoriesDatacontext.categoryRef;
			categoryRef.child(categoryId).child('transactions').once('value', function (trSnap) {
				debugger;
			});
		}

		function add(transaction) {
			var newTransaction = {
				type: transaction.type,
				amount: transaction.amount || 0,
				note: transaction.note || '',
				category: transaction.category.$id,
				date: transaction.date.unix(),
				dateFormatted: transaction.date.format()
			};

			return transactions.$add(newTransaction).then(function (result) {
				categoriesDatacontext.addTransactionToCategory(transaction.category, result.key(), newTransaction);
				return result;
			});
		}

		function update(updatedTransaction) {
			return _getById(updatedTransaction.$id).then(function (transaction) {
				if (!transaction) { return null; }
				// hmm .. better grab a new instance of a transaction otherwise we save all kinds of properties... hmm 

				transaction.amount = updatedTransaction.amount;
				transaction.note = updatedTransaction.note;
				transaction.date = updatedTransaction.date.unix();
				transaction.type = updatedTransaction.type;
				transaction.category = updatedTransaction.category.$id;

				return transactions.$save(transaction, ['amount', 'note', 'date', 'type', 'category']).then(function () {
					//TODO - not happy with this. should be handled in angular fire somehow.
					transaction.category = updatedTransaction.category;
					transaction.date = updatedTransaction.date;
					transaction.amountSigned = transaction.type === CONST.TransactionType.Expense ? -transaction.amount : transaction.amount;
					return transaction;
				});
			});
		}

		function remove(transaction) {
			return _getById(transaction.$id).then(function (tr) {
				if (tr) {
					return transactions.$remove(tr);
				} else {
					return null;
				}
			});
		}

		function _getById(id) {
			var deferred = $q.defer();
			if (_transactionsLoaded) {
				var transaction = _.findWhere(transactions, { $id: id });
				if (transaction) {
					deferred.resolve(transaction);
				} else {
					deferred.reject(new errors.NotFoundError('Transaction not found'));
				}
			} else {
				transactions.$loaded().then(function () {
					_transactionsLoaded = true;
					var transaction = _.findWhere(transactions, { $id: id });
					if (transaction) {
						deferred.resolve(transaction);
					} else {
						deferred.reject(new errors.NotFoundError('Transaction not found'));
					}
				});
			}
			return deferred.promise;
		}

		function _createTransactionsFirebaseArray() {
			return $firebaseArray.$extend({
				$$added: function (snap) {
					var rec = $firebaseArray.prototype.$$added.call(this, snap);
					rec.amountSigned = rec.type === CONST.TransactionType.Expense ? -rec.amount : rec.amount;
					rec.date = moment.unix(rec.date);

					categoriesDatacontext.get(rec.category).then(function (category) {
						rec.category = category;
					});

					return rec;
				},
				// https://gist.github.com/katowulf/d0c230f1a7f6b5806a29
				$save: function (indexOrItem, listOfFields) {
					
					//FIXME - abstract this save method to a different object to use for both categories and transactions
					
					listOfFields = listOfFields || []

					if (!listOfFields) {
						// do a normal save if no list of fields is provided
						return $firebaseArray.prototype.$save.apply(this, arguments);
					}

					var self = this;
					var item = self._resolveItem(indexOrItem);
					var key = self.$keyAt(item);
					if (key !== null) {
						var ref = self.$ref().ref().child(key);
						var updateFields = pickFields(item, listOfFields);
						var data = $firebaseUtils.toJSON(updateFields);

						return $firebaseUtils.doSet(ref, data).then(function () {
							self.$$notify('child_changed', key);
							return ref;
						});
					}
					else {
						return $firebaseUtils.reject('Invalid record; could determine key for ' + indexOrItem);
					}
				}
			});

			function pickFields(data, fields) {
				var out = {};
				angular.forEach(fields, function (k) {
					out[k] = data.hasOwnProperty(k) ? data[k] : null;
				});
				return out;
			}
		}
	}
})();
/* global angular */

(function () {
  angular.module('pf.transactions')
    .config(configuration);

  configuration.$inject = ['$stateProvider', '$urlRouterProvider', 'CONST'];
  function configuration($stateProvider, $urlRouterProvider, CONST) {

    $stateProvider
      .state('transaction', {
        url: '/transaction',
        template: '<ion-nav-view></ion-nav-view>',
        abstract: true,
        resolve: {
          user: _userResolver,
          categories: _categoriesResolver
        }
      })
      .state('transaction.add', {
        url: '/add/:transactionType',
        controller: 'TransactionCtrl as tran',
        templateUrl: 'templates/transactions/edit.html',
        resolve: {
          transaction: _addTransactionResolver
        }
      })
      .state('transaction.edit', {
        url: '/edit/:id',
        controller: 'TransactionCtrl as tran',
        templateUrl: 'templates/transactions/edit.html',
        resolve: {
          transaction: _editTransactionResolver
        }
      });

    $urlRouterProvider.otherwise('/dashboard');


    _categoriesResolver.$inject = ['$stateParams', 'categoriesDatacontext']
    function _categoriesResolver($stateParams, categoriesDatacontext) {
      return categoriesDatacontext.list().then(function (categories) {
        return _.filter(categories, function (c) { return !c.deleted; });
      });
    }

    _userResolver.$inject = ['Auth'];
    function _userResolver(Auth) {
      return Auth.resolveUser();
    };

    _addTransactionResolver.$inject = ['$stateParams'];
    function _addTransactionResolver($stateParams) {
      return {
        amount: 0,
        category: '',
        currency: '$',
        date: moment(),
        type: $stateParams.transactionType
      };
    }

    _editTransactionResolver.$inject = ['$stateParams', 'transactionsDatacontext'];
    function _editTransactionResolver($stateParams, transactionsDatacontext) {
      var transactionId = $stateParams.id;
      return transactionsDatacontext.single(transactionId);
    }
  }
})();

(function () {
  'use strict';

  angular.module('pf.transactions')
    .controller('TransactionCtrl', TransactionCtrl);

  TransactionCtrl.$inject = ['$stateParams', '$state', '$ionicHistory', 'CONST', 'transactionsDatacontext', 'categories', 'user', 'transaction'];
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
      //TODO get last transaction date and set the input date to that
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
        .then(function () { });
    }

    function _delete() {
      transactionsDatacontext.remove(self.transaction).then(function () {
        _goBack();
      });
    }

    function _updateTransaction() {
      transactionsDatacontext.update(self.transaction)
        .then(function () {
          _goBack();
        });
    }

    function _goBack() {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $state.go('dashboard');
      }
    }
  }
})();