'use strict';

/**
 * @ngdoc function
 * @name vubiquityAnalyticsApp.controller:HealthTrendCtrl
 * @description
 * # HealthTrendCtrl
 * Controller of the vubiquityAnalyticsApp
 */
 /* global d3 */
 /* global moment */
angular.module('anyvuAnalyticsApp')
  .controller('HealthTrendCtrl', ['$scope', '$http', '$log', function ($scope, $http , $log) {

    /// Date functions and properties ///

    $scope.today = function(dt) {
      dt = new Date();
    };
    $scope.today();

    $scope.tomorrow = function(dt) {
       dt = new Date()  +1;
    };

    $scope.clear = function (dt) {
      dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    // See http://stackoverflow.com/a/21865712/220287
    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'yyyy-MM-dd' , 'shortDate'];
    $scope.format = $scope.formats[0];

    var getMomentDate = function(d) {
      var date = moment(d);
      return date.unix()*1000;
    };

    $scope.$watch(function (){
        if ($scope.dtFrom && $scope.dtTo) {
          return $scope.dtFrom.getTime() + '-' + $scope.dtTo.getTime();
        }
      },
      function() {
        $log.debug('Selected date range was changed:', $scope.dtFrom, $scope.dtTo);
      }
    );

    /// End date functions and properties ///



    $scope.chartType = 'Health & Trend';
    $scope.chartParameters = {
                    affiliateID: '100',
                    dateScope: 'monthly',
                    dtTo: $scope.tomorrow(),
                    dtFrom: $scope.today()

                };



    $scope.dateAggregationOptions = [
    {value:'daily', name: 'daily'},
    {value:'monthly', name: 'monthly'},
    {value:'annually', name: 'annually'}
    ];


    $http.get('http://localhost:8080/avc-data-1.0.0.0/rest/json/buydata/affiliates').
      success(function(data) {
          $scope.affiliates = data;
      });

       $scope.leaseData = [];
       $scope.updateData =  function() {
        //moment($scope.chartParameters.dtFrom).format('YYYY-MM-DD')
        var leaseQuery = 'http://localhost:8080/avc-data-1.0.0.0/rest/json/buydata/leases?start_date=' +  '2013-01-01' + '&end_date=' + moment($scope.chartParameters.dtTo).format('YYYY-MM-DD') + '&date_scope=monthly&affiliate_and_headend_ids=' + $scope.chartParameters.affiliateID;
        console.log(leaseQuery);
        $http.get(leaseQuery).
          success(function(data){
             var buyDataValues = [];
             var revenueDataValues = [];
             for (var i = 0; i < data.length; i++)
             {
               buyDataValues[buyDataValues.length] =  [data[i].startDate,data[i].buyTotal];
               revenueDataValues[revenueDataValues.length] = [getMomentDate(data[i].startDate),data[i].transactionTotal];
             }
             $scope.leaseData.push(
             {
                'key': 'buy Totals',
                'values': buyDataValues
             } ,
             {
                'key': 'revenue Totals',
                'values': revenueDataValues
             }
             );
          });
      };


    $scope.updateData();

/*
      $scope.$watch('chartParameters.affiliateID', function(){

          $scope.updateData();
      });
*/



      $scope.xAxisTickFormat = function(){
            return function(d){
              //  return d3.time.format('%b %y')(new Date(d));  //uncomment for date format
              moment(d).format('MM-YY');
              };
            };
      $scope.y1AxisTickFormat = function(){
            return function(d){
                    return d3.format('d')(d);
              };
            };
      $scope.y2AxisTickFormat = function(){
            return function(d){
                    return '$' + d3.format(',.2f')(d);
              };
            };

  }]);
