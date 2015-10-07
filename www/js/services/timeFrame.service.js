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