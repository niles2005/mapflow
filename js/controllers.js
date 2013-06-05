'use strict';

/* Controllers */

var projectList = [
	{
		"id": "p1",
		"name": "shanghai",
		"dataVendor": "OSM",
		"imageUrl": "img/osm.png",
		"createTime": "2013-5-29 15:03:02",
		"creator": "niles",
		"info": "Test map project for shanghai"
	},
	{
		"id": "p2",
		"name": "test",
		"dataVendor": "OSM",
		"imageUrl": "img/osm.png",
		"createTime": "2013-5-28 10:33:27",
		"creator": "niles",
		"info": "Test map project"
	},
	{
		"id": "p3",
		"name": "njcc",
		"dataVendor": "OSM",
		"imageUrl": "img/osm.png",
		"createTime": "2013-5-29 13:13:43",
		"creator": "niles",
		"info": "map project for njcc"
	}
];

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

angular.module('myApp.controllers', []).
		controller('ProjectsCtrl', function($rootScope) {
	$rootScope.projects = projectList;
}).
		controller('Project1Ctrl', function($scope, $routeParams) {
	$scope.project = projectDetail;
}).
		controller('MyCtrl1', [function() {

	}])
		.controller('ProjectNew', function($rootScope, $scope, $location, $filter) {
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


}).controller('ProjectEdit', function($rootScope, $scope, $location, $routeParams) {
	var res = $rootScope.projects.filter(function(value) {
		return value.id == $routeParams.projectId;
	});
	if (res.length == 1) {
		$scope.project = res[0];
	}

	$scope.save = function() {
		$scope.project.createTime = new Date();
		$location.path('#/projects');

	};
}).controller(CompileCtrl);


