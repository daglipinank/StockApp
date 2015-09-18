// create the module and name it stockApp
// also include ngRoute for all our routing needs
var stockApp = angular.module('stockApp', ['ui.router']);
// configure our routes
stockApp.config(function($urlRouterProvider, $stateProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl : 'pages/home.html',
    controller  : 'mainController'
  })
  .state('add', {
    url:'/add',
    templateUrl : 'pages/add.html',
    controller  : 'addController'
  })
  .state('details',{
    url: '/details', 
    templateUrl : 'pages/details.html',
    controller  : 'detailsController'
  });
});



stockApp.service("sendDataServerService",function($http){
  console.log("sending data to server");
  this.sendStockData = function(compSymbol){
    return $http.post('https://polar-scrubland-9815.herokuapp.com/stocks/',{'symb': compSymbol});
  };
});

stockApp.service("stockService",function($http){
  console.log("stock service Called");
  this.getStock = function(companySymbol){
    return $http.jsonp('http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input='+companySymbol+'&&callback=JSON_CALLBACK');
  };
});
stockApp.service("getDataServerService",function($http){
  console.log("getting data from server");
  this.getStockData = function(){
    return $http.get('https://polar-scrubland-9815.herokuapp.com/stocks/');
  };
});
stockApp.service("getDetailedDataService",function($http){
  console.log("getting detaied data of saved stock");
  this.getStockDetailedData = function(companySymbol){
    return $http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+companySymbol+'&&callback=JSON_CALLBACK');
  };
});

// create the controller and inject Angular's $scope
stockApp.controller('mainController', function($scope) { 
});

var StoredData=[];
stockApp.controller('addController',['$scope','stockService','sendDataServerService',function($scope,stockService,sendDataServerService) {
  console.log("Controller Working!!");

  $scope.stocks=[];
  $scope.symbols=[];
  $scope.addToTrackingList = function(){
    stockService.getStock($scope.companySymbol)
    .success(function(data){
      data.forEach(function(compName){
        $scope.stocks.push(compName);
      });
    });
  }
  $scope.sendDataToServer = function(currSymbol){
    //on click send data to server
    sendDataServerService.sendStockData(currSymbol)
    .success(function(data){
      console.log("data sent successfully");
    }) 
  }
}]);


stockApp.controller('detailsController', function($scope,getDataServerService,getDetailedDataService) {

  $scope.getDatafromServer = function(){
    //on click send data to server
    getDataServerService.getStockData()
    .success(function(data){
      console.log("data received successfully");
      console.log(data);
      $scope.detailesData=[];
      data.forEach(function(e){
        getDetailedDataService.getStockDetailedData(e)
        .success(function(newStockdata){
          console.log(newStockdata);
          $scope.detailesData.push(newStockdata);
        });
      })
      console.log($scope.detailesData);
    })
  }
});
