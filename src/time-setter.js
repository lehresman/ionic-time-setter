/**
 * Ionic Time Setter v1.0.0, by Luke Ehresman
 * MIT License
 * http://github.com/lehresman/ionic-time-setter
 */
(function(app) {
  'use strict';

  app.filter('lpad', function() {
    return function(str) {
      return ("00" + str).slice(-2);
    };
  });

  app.factory("TimeSetter", ["$rootScope", "$ionicPopup", "$filter", function($rootScope, $ionicPopup, $filter) {
    var $scope;
    var timer;
    var callback;

    return {
      /**
       * Show the time setter
       * @param callback
       */
      show: function(options) {
        var $scope = setup(options);

        var popup = $ionicPopup.show({
          templateUrl: "time-setter.html",
          title: $scope.title,
          scope: $scope,
          buttons: [
            {text: $scope.cancelText, type: $scope.cancelClass},
            {text: $scope.setText, type: $scope.setClass, onTap: setTime}
          ]
        });

        popup.then(function(res) {
          // callback($scope.selection);
        });
      }
    };

    function setup(options) {
      if (!options) {
        options = {};
      }

      callback = options.onSet;
      $scope = $rootScope.$new();

      //
      // Options and defaults
      //
      $scope.startHour = options.startHour || 0;
      $scope.startMinute = options.startMinute || 0;
      $scope.startAmpm = (options.startHour >= 12 ? 'PM' : 'AM');
      $scope.title = options.title || "Set a time";
      $scope.cancelText = options.cancelText || "Cancel";
      $scope.cancelClass = options.cancelClass || 'button-clear button-dark';
      $scope.setText = options.setText || "Set Time";
      $scope.setClass = options.setClass || 'button-positive';

      $scope.input = {};
      reset();

      //
      // What user selects
      //
      $scope.selection = {
        hour: $scope.startHour,
        minute: $scope.startMinute,
        ampm: $scope.startAmpm
      };

      $scope.reset = reset;
      $scope.keyPressed = keyPressed;
      $scope.toggleAmpm = toggleAmpm;
      $scope.setFocus = setFocus;

      return $scope;
    }

    function keyPressed(value) {
      if (value == ':') {
        $scope.input.position = 'afterColon';
        $scope.input.clearValue = true;
        return;
      } else if ($scope.input.position == 'beforeColon') {
        if ($scope.input.clearValue)
          $scope.input.beforeColon = '';
        $scope.input.beforeColon = '' + parseInt($filter('lpad')($scope.input.beforeColon + value));
        $scope.input.beforeColonError = false;
      } else {
        if ($scope.input.clearValue)
          $scope.input.afterColon = '';
        $scope.input.afterColon = '' + parseInt($filter('lpad')($scope.input.afterColon + value));
        $scope.input.afterColonError = false;
      }

      $scope.input.clearValue = false;
      clearTimeout(timer);
      timer = setTimeout(function() {
        $scope.input.clearValue = true;
        $scope.$apply();
      }, 1500);
    }

    function setFocus(position) {
      if (position == 'beforeColon') {
        $scope.input.position = 'beforeColon';
        $scope.input.clearValue = true;
      } else if (position == 'afterColon') {
        $scope.input.position = 'afterColon';
        $scope.input.clearValue = true;
      }
    }

    function reset() {
      $scope.input.beforeColon = parseInt($scope.startHour);
      $scope.input.afterColon = $filter('lpad')($scope.startMinute);
      $scope.input.ampm = $scope.startAmpm;
      $scope.input.position = 'beforeColon';
      $scope.input.clearValue = true;
      $scope.input.beforeColonError = false;
      $scope.input.afterColonError = false;
    }

    function setTime(e) {
      var hour = parseInt($scope.input.beforeColon);
      var minute = parseInt($scope.input.afterColon);

      if (hour < 1 || hour > 12) {
        $scope.input.beforeColonError = true;
      }
      if (minute < 0 || minute > 59) {
        $scope.input.afterColonError = true;
      }
      if ($scope.input.beforeColonError || $scope.input.afterColonError) {
        e.preventDefault();
        return;
      }

      if (callback) {
        if ($scope.input.ampm == 'AM') {
          if (hour == 12) {
            hour = 0;
          }
        } else if ($scope.input.ampm == 'PM') {
          if (hour < 12) {
            hour += 12;
          }
        }
        callback(hour, minute);
      }
    }

    function toggleAmpm() {
      if ($scope.input.ampm == 'AM')
        $scope.input.ampm = 'PM';
      else
        $scope.input.ampm = 'AM';
    }

  }]);

}(angular.module("ionic-time-setter", ['ionic'])));
