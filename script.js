function Board(id, hasContent, preview, content) {
  this.id = id;
  this.hasContent = hasContent;
  this.preview = preview;
  this.content = content;
  this.pasting = false;
}

var app = angular.module('CloudBoard', ['ngCookies']);

app.factory('loginService', ['$rootScope', '$cookies', '$cookieStore', function($rootScope, $cookies, $cookieStore) {
  var loggedIn = true;
  var user = "admin";

  var logIn = function(username, password) {
    loggedIn = true;
    user = username;
    $cookieStore.put("loggedIn", "true");
    $cookieStore.put("user", username);
    $rootScope.$broadcast('loggingIn');
  };

  var logOut = function() {
    loggedIn = false;
    user = "";
    $cookieStore.put("loggedIn", false);
    $rootScope.$broadcast('loggingOut');
  };

  var getLoginStatus = function() {
    if ($cookieStore.get("loggedIn")) {
      loggedIn = true;
    }
    return loggedIn;
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

app.controller('settings', ['$scope', 'loginService', function($scope, loginService) {
  $scope.settingsVisible = false;

  $scope.toggle = function() {
    if (!$scope.settingsVisible) {
      $('#settingsButton').html('close');
      $scope.settingsVisible = true;
      $('#settingsDiv').addClass("settingsPanel");
    }
    else {
      $('#settingsButton').html('menu');
      $scope.settingsVisible = false;
      $('#settingsDiv').removeClass("settingsPanel");
    }
    $('#dimmer').toggle();
    $('.settingsOptions').toggle();
  };

  $scope.logOut = function() {
    $scope.toggle();
    $('#dimmer').show();
    loginService.logOut();
  }
}]);

app.controller('boards', ['$scope', '$http', '$window', 'loginService', function($scope, $http, $window, loginService) {
  $scope.loggedIn = loginService.getLoginStatus();
  $scope.name = loginService.getUserName();
  $scope.boards = [];

  if ($scope.loggedIn) {
    $('#dimmer').hide();
  }

  $scope.$on('loggingIn', function() {
    $scope.loggedIn = loginService.getLoginStatus();
    $scope.name = loginService.getUserName();
    $scope.getBoards();
    $('#dimmer').hide();
  });

  $scope.$on('loggingOut', function() {
    $scope.loggedIn = loginService.getLoginStatus();
    $scope.name = loginService.getUserName();
    $scope.boards = [];
  })

  $scope.createBasicBoard = function() {
    var basicBoard = new Board(1, true, "some sample text", "some sample text");
    $scope.boards.push(basicBoard);
  };

  $scope.createBlankBoard = function(id) {
    var blankBoard = new Board(id, false, "", "");
    $scope.boards.push(blankBoard);
  };

  $scope.getBoards = function() {
    $scope.boards = [];
    $scope.createBasicBoard();
    $scope.createBlankBoard(2);
    $scope.createBlankBoard(3);
  };


  $scope.getBoards();

  $scope.copyFromBoard = function(board) {
    if (!board.hasContent) {
      return;
    }
    $('#copyAlert').hide();
    var textarea = document.createElement( "textarea" );
    textarea.style.height = "0px";
    textarea.style.left = "-100px";
    textarea.style.opacity = "0";
    textarea.style.position = "fixed";
    textarea.style.top = "-100px";
    textarea.style.width = "0px";
    document.body.appendChild( textarea );
    textarea.value = board.content;
    textarea.select();
    document.execCommand('copy');
    textarea.parentNode.removeChild( textarea );
    $('#copyAlert').show();
    setTimeout(function() {
      $('#copyAlert').fadeOut(300);
    }, 3000);
  };

  $scope.pasteToBoard = function(board) {
    board.pasting = true;
    board.hasContent = true;
    setTimeout(function() {
      document.getElementById(board.id + "pasting").focus();
    }, 200);
  };

  $scope.keyCheck = function(e, board) {
    if (e.keyCode == 13) {
      $scope.savePaste(board);
    }
  };

  $scope.savePaste = function(board) {
    board.pasting = false;
    board.hasContent = true;
    board.preview = $scope.filterPreview(board.content);
    // Send to server
  };

  $scope.filterPreview = function(x) {
    if (typeof x == undefined) {
      return "";
    }
    if (x.length <= 45) {
      return x;
    }
    else {
      return x.substring(0, 44) + "...";
    }
  }

}]);

app.controller('login', ['$scope', '$http', 'loginService', function($scope, $http, loginService) {
  $scope.loggedIn = loginService.getLoginStatus();
  $scope.username;
  $scope.password;
  var logins = {'admin': 'admin'};

  $scope.$on('loggingOut', function() {
    $scope.loggedIn = loginService.getLoginStatus();
    $scope.username = "";
    $scope.password = "";
  })

  $scope.keyCheck = function(e) {
    if (e.keyCode == 13) {
      $scope.logIn();
    }
  }

  $scope.logIn = function() {
    if (!(logins[$scope.username] == $scope.password)) {
      alert('Login failed!');
      return;
    }
    loginService.logIn($scope.username, $scope.password);
    $scope.loggedIn = loginService.getLoginStatus();
  };

  $scope.logOut = function() {
    loginService.logOut();
  };
}]);
