var myApp = angular.module('myApp',[]);

myApp.controller('helloWorld', ['$scope', function($scope){
	$scope.hello = "Hello world!";
	console.log($scope.hello);
}]);