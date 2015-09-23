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