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