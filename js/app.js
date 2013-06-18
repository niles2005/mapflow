'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers','angularTree']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/projects', {templateUrl: 'partials/projects.html', controller: 'ProjectsCtrl'});
    $routeProvider.when('/projects/:dataVendor/:projectName', {templateUrl: 'partials/project1.html', controller: 'Project1Ctrl'});
    $routeProvider.when('/compile', {templateUrl: 'partials/compile.html', controller: 'CompileCtrl'});
    $routeProvider.when('/compileTree', {templateUrl: 'partials/compileTree.html', controller: 'CompileTreeCtrl'});
    $routeProvider.when('/compileContent', {templateUrl: 'partials/compileContent.html', controller: 'CompileContentCtrl'});
    $routeProvider.when('/compilePage', {templateUrl: 'partials/compilePage.html', controller: 'CompilePageCtrl'});
    $routeProvider.when('/projectNew', {templateUrl: 'partials/projectNew.html', controller: 'ProjectNew'});
    $routeProvider.when('/projectedit/:projectId', {templateUrl: 'partials/projectNew.html', controller: 'ProjectEdit'});
    $routeProvider.otherwise({redirectTo: '/projects'});
  }]);
