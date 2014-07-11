'use strict';

/**
 * @ngdoc overview
 * @name anyvuAnalyticsApp
 * @description
 * # anyvuAnalyticsApp
 *
 * Main module of the application.
 */
angular
  .module('anyvuAnalyticsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'nvd3ChartDirectives',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/healthTrend.html',
        controller: 'HealthTrendCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
