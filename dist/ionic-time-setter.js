/**
 * Ionic Time Setter v1.0.2, by Luke Ehresman
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
      //
      // What user selects
      //
      var ampm = 'AM';
      var hour = $scope.startHour;
      if (hour == 0) {
        hour = 12;
        ampm = 'AM';
      } else if (hour == 12) {
        hour = 12;
        ampm = 'PM';
      } else if (hour > 12) {
        hour = hour - 12;
        ampm = 'PM';
      }

      $scope.selection = {
        hour: hour,
        minute: $scope.startMinute,
        ampm: ampm
      };

      $scope.input.beforeColon = parseInt($scope.selection.hour);
      $scope.input.afterColon = $filter('lpad')($scope.selection.minute);
      $scope.input.ampm = $scope.selection.ampm;
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

angular.module("ionic-time-setter").run(["$templateCache", function($templateCache) {$templateCache.put("time-setter.html","<div class=\"ionic-time-setter\"><style>.ionic-time-setter .label .time {\n      font-size: 32px;\n      font-weight: bold;\n      line-height: 45px;\n    }\n    .ionic-time-setter .row {\n      padding: 0;\n      margin: 0;\n    }\n    .ionic-time-setter .col {\n      padding: 3px;\n      margin: 0;\n    }\n    .ionic-time-setter .button {\n      margin: 0;\n      padding-left: 0;\n      padding-right: 0;\n    }\n    .ionic-time-setter .ion-ios-refresh-outline:before {\n      font-size: 32px;\n    }\n    .ionic-time-setter hr {\n      border: 0;\n      border-top: 1px solid #ddd;\n    }\n    .ionic-time-setter .input-focus {\n      text-decoration: underline;\n    }\n    .ionic-time-setter .not-clearing {\n      background-color: #ddd;\n    }\n    .ionic-time-setter .error {\n      color: #c00;\n    }</style><div class=\"row year label\"><div class=\"col col-60 text-right time\" style=\"padding-right:20px\"><strong><span ng-click=\"setFocus(\'beforeColon\')\" ng-class=\"{\n              \'error\': input.beforeColonError,\n              \'input-focus\': input.position==\'beforeColon\',\n              \'not-clearing\': input.position==\'beforeColon\' && !input.clearValue\n            }\">{{ input.beforeColon }}</span>:<span ng-click=\"setFocus(\'afterColon\')\" ng-class=\"{\n              \'error\': input.afterColonError,\n              \'input-focus\': input.position==\'afterColon\',\n              \'not-clearing\': input.position==\'afterColon\' && !input.clearValue\n            }\">{{ input.afterColon | lpad }}</span> </strong></div><div class=\"col col-40\" ng-click=\"\"><button class=\"button button-dark button-outline button-block\" ng-click=\"toggleAmpm()\">{{ input.ampm }}</button></div></div><hr><div class=\"keypad\"><div class=\"row\"><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"keyPressed(\'1\')\">1</button></div><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"keyPressed(\'2\')\">2</button></div><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"keyPressed(\'3\')\">3</button></div></div><div class=\"row\"><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"keyPressed(\'4\')\">4</button></div><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"keyPressed(\'5\')\">5</button></div><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"keyPressed(\'6\')\">6</button></div></div><div class=\"row\"><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"keyPressed(\'7\')\">7</button></div><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"keyPressed(\'8\')\">8</button></div><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"keyPressed(\'9\')\">9</button></div></div><div class=\"row\"><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"keyPressed(\':\')\">:</button></div><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"keyPressed(\'0\')\">0</button></div><div class=\"col col-33\"><button class=\"button button-dark button-outline button-block\" ng-click=\"reset()\"><i class=\"ion ion-ios-refresh-outline\"></i></button></div></div></div></div>");}]);