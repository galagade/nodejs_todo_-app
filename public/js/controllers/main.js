angular.module('todoController', [])
  .controller('mainController', ['$scope', '$http', 'Todos', '$timeout', function($scope, $http, Todos, $timeout) {
    $scope.formData = {};
    $scope.loading = true;
    $scope.myVar = false;
    $scope.errv = false;

    Todos.get()
      .success(function(data) {
        $scope.todos = data;
        $scope.loading = false;
      });

    $scope.sortColumn = "text";
    $scope.createTodo = function() { 
      if ($scope.formData.text != undefined) {
        $scope.loading = true;
        $scope.json = angular.toJson($scope.todos);
        $scope.val = 0;
        $scope.dt = angular.forEach($scope.todos, function(value, key){

          if(angular.lowercase(value.text) == angular.lowercase($scope.formData.text))
            $scope.val = 1;
            
            if($scope.myVar === true)
              $scope.myVar = false;
            $scope.error = $scope.formData.text + " is already in the Todo list";
            $scope.errv = true;
            $timeout(function() {
              $scope.errv = false;
              $scope.error= false;
            }, 3000);
            $scope.loading = false;

         });

        if($scope.val ===  0){
          
            Todos.create($scope.formData)
              .success(function(data) {
                if($scope.errv === true)
                  $scope.errv = false;
                if($scope.myVar === false)
                  $scope.myVar = true;
                $scope.succesmsg = "You have successfully added " + $scope.formData.text + "on your Todo List";
                $timeout(function() {
                  $scope.myVar = false;
                  $scope.succesmsg= false;
                }, 3000);
                $scope.loading = false;
                $scope.formData = {};
                $scope.todos = data;
            });
        }

      }
      else
      {
        if($scope.myVar === true)
          $scope.myVar = false;
        if($scope.errv === false)
          $scope.errv = true;
         $scope.error= 'Please enter a Todo';
          $timeout(function() {
            $scope.errv = false;
            $scope.error = false
          }, 3000);
      }
    };

    $scope.deleteTodo = function(id) {
      $scope.loading = true;
      Todos.delete(id)
        .success(function(data) {
          if($scope.errv === true)
            $scope.errv = false;
          if($scope.myVar === false)
            $scope.myVar = true;
          $scope.succesmsg = "You have successfully delete a Todo data on your Todo List";
          $timeout(function() {
            $scope.myVar = false;
            $scope.succesmsg = false;
          }, 3000);
          $scope.loading = false;
          $scope.todos = data;
        });
    };

    $scope.closemsgx= function(){
      $scope.errv = false;
    }
    $scope.closemsg= function(){
      $scope.myVar = false;
    }
  }]);
