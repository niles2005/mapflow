'use strict';

/* Controllers */


var projectDetail = {
	"id": "p1",
	"name": "shanghai",
	"dataVendor": "OSM",
	"imageUrl": "img/osm.png",
	"createTime": "2013-5-29 15:03:02",
	"creator": "niles",
	"info": "Test map project for shanghai",
	"files": [
		{"name": "bj_park_pat_region.xmd", "time": "2013-5-29 13:2:43", "size": 24235},
		{"name": "bj_railway_pat_polyline.xmd", "time": "2013-5-29 3:13:43", "size": 54386},
		{"name": "destOcean.xmd", "time": "2013-5-29 13:13:4", "size": 426787568},
		{"name": "green_region.xmd", "time": "2013-5-9 13:13:43", "size": 57845}
	]
};

function ProjectsCtrl($rootScope) {
    $rootScope.projects = projectList;
}

function Project1Ctrl($scope, $routeParams) {
	$scope.project = projectDetail;
}

function ProjectNew($rootScope, $scope, $location, $filter) {
    console.log("new project");
	$scope.project = {
		"id": "",
		"name": "",
		"dataVendor": "",
		"imageUrl": "img/osm.png",
		"createTime": "",
		"creator": "default",
		"info": ""
	};

	$scope.save = function() {
		$scope.project.id = 'p' + ($rootScope.projects.length + 1);
		$scope.project.createTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

		$rootScope.projects.push($scope.project);
		$location.path('#/projects');
	};
}

function ProjectEdit($rootScope, $scope, $location, $routeParams,$filter) {
	var res = $rootScope.projects.filter(function(value) {
		return value.id == $routeParams.projectId;
	});
	if (res.length == 1) {
		$scope.project = res[0];
	}

	$scope.save = function() {
        if ($scope.project) {
            $scope.project.createTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'); // new Data() not support the format
        }
		$location.path('#/projects');

	};
}






angular.module('myApp.controllers', []).
		controller(ProjectsCtrl).
		controller(Project1Ctrl).
		controller(ProjectNew).
                controller(ProjectEdit).
                controller(CompileCtrl).
                controller(CompileContentCtrl).
                controller(CompileTreeCtrl);
