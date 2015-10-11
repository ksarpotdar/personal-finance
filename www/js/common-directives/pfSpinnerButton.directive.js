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