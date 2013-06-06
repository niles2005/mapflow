'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers','angularTree']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/projects', {templateUrl: 'partials/projects.html', controller: 'ProjectsCtrl'});
    $routeProvider.when('/projects/:dataVendor/:projectName', {templateUrl: 'partials/project1.html', controller: 'Project1Ctrl'});
    $routeProvider.when('/compiling', {templateUrl: 'partials/compiling.html', controller: 'CompileCtrl'});
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
    $routeProvider.when('/projectnew', {templateUrl: 'partials/projectnew.html', controller: 'ProjectNew'});
    $routeProvider.when('/projectedit/:projectId', {templateUrl: 'partials/projectnew.html', controller: 'ProjectEdit'});
    $routeProvider.otherwise({redirectTo: '/projects'});
  }]);
