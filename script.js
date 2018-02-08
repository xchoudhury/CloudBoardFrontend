function Board(id, hasContent, preview) {
  this.id = id;
  this.hasContent = hasContent;
  this.preview = preview;
}

var app = angular.module('CloudBoard', ['ngCookies']);

app.factory('loginService', ['$rootScope', '$cookies', '$cookieStore', function($rootScope, $cookies, $cookieStore) {
  var loggedIn = false;
  var user = "admin";
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
    //$rootScope.$broadcast('loggingIn');
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
    $scope.createBasicBoard();
    $scope.createBlankBoard(2);
    $scope.createBlankBoard(3);
  });

  $scope.createBasicBoard = function() {
    var basicBoard = new Board(1, true, "some sample text");
    $scope.boards.push(basicBoard);
  };

  $scope.createBlankBoard = function(id) {
    var blankBoard = new Board(id, false, "");
    $scope.boards.push(blankBoard);
  };
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
  };
}]);
