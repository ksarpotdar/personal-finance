(function() {
  'use strict';

  angular.module('pf.charts')
    .controller('ChartsCtrl', ChartsCtrl);

  ChartsCtrl.$inject = ['$state', 'CONST', 'transactionsService', 'chartsDatacontext'];
  function ChartsCtrl($state, CONST, transactionsService, chartsDatacontext) {
    var _this = this;

    _this.labels = ['b','c'];
    _this.series = ['Series A'];
    _this.data = [65, 59, 80, 81, 56, 55, 40];
    _this.legend = true;

    var sum = function(a, b) {
      return a + b;
    };

    _this.options = {
      labelInterpolationFnc: function(value) {
        return Math.round(value / data.series.reduce(sum) * 100) + '%';
      },
    };

    _this.onClick = function(points, evt) {
      console.log(points, evt);
    };

    activate();
    function activate() {
      chartsDatacontext.getSumByCategory(moment().startOf('month'), moment().endOf('month')).then(function(data) {
        _this.labels.length = 0;
        _this.data.length = 0;

        _.each(data, function(item) {
          _this.labels.push(item.key);
          _this.data.push(item.sum);
        });
      });
    }
  }
})();
