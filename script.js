var app = angular.module('ClouadBoard', []);

app.service('loginService', function() {
  var loggedIn = false;
  var user;

  var logIn = function(userData) {
    loggedIn = true;
    user = userData;
    document.cookie = "loggedin=true;user=userData;";
  };

  var logOut = function() {
    loggedIn = false;
    user = "";
    document.cookie = "loggedin=false;";
  };

  var getLoginStatus = function() {
    var name = "loggedin=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          loggedInString = c.substring(name.length, c.length);
          loggedIn = (loggedInString == "true") ? true : false;
      }
    }
    return loggedIn;
  };

  var getUserName = function() {
    if (!getLoginStatus()) {
      return "";
    }

    var name = "user=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  return {
    logIn: logIn,
    logOut: logOut,
    getLoginStatus: getLoginStatus,
    getUserName: getUserName
  };
});

app.controller('boards', ['$scope', '$http', function($scope, $http, loginService) {
  $scope.loggedIn = loginService.getLoginStatus();

}]);

app.controller('login', ['$scope', '$http', function($scope, $http, loginService) {
  $scope.logIn = function(userData) {
    loginService.logIn(userData);
  };
  $scope.logOut = function(userData) {
    loginService.logOut();
  }
}]);
