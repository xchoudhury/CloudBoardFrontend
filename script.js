var app = angular.module('CloudBoard', ['ngCookies']);

app.factory('loginService', ['$rootScope', '$cookies', '$cookieStore', function($rootScope, $cookies, $cookieStore) {
  var loggedIn = false;
  var user;
  var logins = {'admin': 'admin'};

  var logIn = function(username, password) {
    if (!(logins[username] == password)) {
      return false;
    }
    loggedIn = true;
    user = username;
    $cookieStore.put("loggedIn", "true");
    $cookieStore.put("user", username);
    $rootScope.$broadcast('loggingIn');
    return true;
  };

  var logOut = function() {
    loggedIn = false;
    user = "";
    $cookieStore.put("loggedIn", false);
  };

  var getLoginStatus = function() {
    return $cookieStore.get("loggedIn") || loggedIn;
  };

  var getUserName = function() {
    //return $cookieStore.get("user");
    return user;
  }

  return {
    logIn: logIn,
    logOut: logOut,
    getLoginStatus: getLoginStatus,
    getUserName: getUserName
  };
}]);

app.controller('boards', ['$scope', '$http', 'loginService', function($scope, $http, loginService) {
  $scope.loggedIn = loginService.getLoginStatus();
  $scope.name = loginService.getUserName();
  $scope.boards = [];

  $scope.$on('loggingIn', function() {
    $scope.loggedIn = loginService.getLoginStatus();
    $scope.name = loginService.getUserName();
  })
}]);

app.controller('login', ['$scope', '$http', 'loginService', function($scope, $http, loginService) {
  $scope.loggedIn = loginService.getLoginStatus();
  $scope.username;
  $scope.password;

  $scope.logIn = function() {
    var logInSuccessful = loginService.logIn($scope.username, $scope.password);
    if (logInSuccessful != true) {
      alert('Login failed');
    }
    $scope.loggedIn = loginService.getLoginStatus();
  };
  $scope.logOut = function() {
    loginService.logOut();
  }
}]);
