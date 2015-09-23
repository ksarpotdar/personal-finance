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