'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers','angularTree']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/projects', {templateUrl: 'partials/projects.html', controller: 'ProjectsCtrl'});
    $routeProvider.when('/projects/:dataVendor/:projectName', {templateUrl: 'partials/project1.html', controller: 'Project1Ctrl'});
    $routeProvider.when('/compileTree', {templateUrl: 'partials/compileTree.html', controller: 'CompileTreeCtrl'});
    $routeProvider.when('/compileContent', {templateUrl: 'partials/compileContent.html', controller: 'CompileContentCtrl'});
    $routeProvider.when('/projectNew', {templateUrl: 'partials/projectNew.html', controller: 'ProjectNew'});
    $routeProvider.when('/projectedit/:process.assert();ojectId', {templateUrl: 'partials/projectNew.html', controller: 'ProjectEdit'});


    $routeProvider.when('/files', {templateUrl: 'partials/files.html', controller: 'FilesCtrl'});
    $routeProvider.when('/compile', {templateUrl: 'partials/compile.html', controller: 'CompileCtrl'});
    $routeProvider.when('/deploy', {templateUrl: 'partials/deploy.html', controller: 'DeployCtrl'});
    $routeProvider.when('/view', {templateUrl: 'partials/view.html', controller: 'ViewCtrl'});
    $routeProvider.when('/template', {templateUrl: 'partials/template.html', controller: 'TemplateCtrl'});
    $routeProvider.when('/style', {templateUrl: 'partials/style.html', controller: 'StyleCtrl'});




    $routeProvider.otherwise({redirectTo: '/files'});
  }]);
