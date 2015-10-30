(function() {
  'use strict';

  angular.module('pf.firebase').factory('pfFirebaseArray', pfFirebaseArray);

  pfFirebaseArray.$inject = ['$firebaseArray', '$firebaseUtils'];
  function pfFirebaseArray($firebaseArray, $firebaseUtils) {

    var firebaseArrayChanges = {
      // https://gist.github.com/katowulf/d0c230f1a7f6b5806a29
      $save: function(indexOrItem, listOfFields) {
        listOfFields = listOfFields || [];

        if (!listOfFields) {
          // do a normal save if no list of fields is provided
          return $firebaseArray.prototype.$save.apply(this, arguments);
        }

        var _this = this,
            item = _this._resolveItem(indexOrItem),
            key = _this.$keyAt(item);

        if (key !== null) {
          var ref = _this.$ref().ref().child(key),
              updateFields = pickFields(item, listOfFields),
              data = $firebaseUtils.toJSON(updateFields);

          return $firebaseUtils.doSet(ref, data).then(function() {
            _this.$$notify('child_changed', key);
            return ref;
          });
        } else {
          return $firebaseUtils.reject('Invalid record; could determine key for ' + indexOrItem);
        }
      },
    };

    return init;

    function init(methods) {
      _.extend(firebaseArrayChanges, methods || {});
      return $firebaseArray.$extend(firebaseArrayChanges);
    }

    function pickFields(data, fields) {
      var out = {};
      angular.forEach(fields, function(k) {
        out[k] = data.hasOwnProperty(k) ? (data[k] || null) : null;
      });

      return out;
    }
  }
})();
