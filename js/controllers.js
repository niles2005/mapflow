'use strict';

/* Controllers */
function bindEvent(elementTarget, eventType, func) {
	if (window.addEventListener) {
		elementTarget.addEventListener(eventType, func, false);
	} else if (window.attachEvent) {
		elementTarget.attachEvent("on" + eventType, func);
	}
}

function unbindEvent(elementTarget, eventType, func) {
	if (window.addEventListener) {
		elementTarget.removeEventListener(eventType, func, false);
	} else if (window.attachEvent) {
		elementTarget.detachEvent("on" + eventType, func);
	}
}

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


}).controller('ProjectEdit', function($rootScope, $scope, $location, $routeParams,$filter) {
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
}).controller(CompilingCtrl);


var errorImg = new Image();
errorImg.onload = function() {
	errorImg.loaded = true;
};
errorImg.src = 'img/error.png';
var validImg = new Image();
validImg.onload = function() {
	validImg.loaded = true;
};
validImg.src = 'img/valid.png';

function CompilingCtrl($scope) {
	var width = 900, height = 400;
	var canvas = document.getElementById("compile_canvas");
	canvas.addEventListener("mousedown", onMouseDown, false);


	canvas.onselectstart = function() {
		return false;
	}
	canvas.width = width;
	canvas.height = height;
	var context = canvas.getContext('2d');
	var pressX1,pressY1,pressX2,pressY2;
	
	function repaint() {
		context.clearRect(0, 0, width, height);
		context.fillStyle = 'rgb(255,255,255)';
		context.fillRect(0, 0, width, height);

		context.storkeStyle = "rgb(0,0,0)";
		context.strokeRect(0, 0, width, height);
		
		context.save();
		context.translate(0.5, 0.5);
		var posX = 80;
		var posY = 100;
		context.fillStyle = 'rgb(0,0,0)';
		for (var k = 0; k < 20; k++) {
			var offsetX = 12;
			if (k < 10) {
				offsetX = 16;
			}
			context.fillText("" + k, posX + k * 40 + offsetX, posY - 20);
		}

		drawRect(context, posX, posY, width - 100, 30, '0D(Label)');
		posY += 50;
		drawRect(context, posX, posY, width - 100, 30, '1D(Line)');
		posY += 50;
		drawRect(context, posX, posY, width - 100, 30, '2D(Area)');
		
		if(pressX1 && pressY1 && pressX2 && pressY2) {
//			context.strokeStyle = "rgb(255,0,0)";
//			context.beginPath();
//			context.moveTo(pressX1,pressY1);
//			context.lineTo(pressX2,pressY2);
//			context.stroke();

            drawHotArea(context,pressX1 , pressY1 , pressX2 , pressY2)  ;

		}
		
		context.restore();
	}
	function onMouseDown(event) {
		pressX1 = event.offsetX;
		pressY1 = event.offsetY;
		console.dir(event);
		function onMouseMove(event) {
			if (event.stopPropagation) {
				event.stopPropagation();
				event.preventDefault();
			} else {//IE
				event.cancelBubble = true;
				event.returnValue = false;
			}
			pressX2 = event.offsetX;
			pressY2 = event.offsetY;
			repaint();
		}
		function onMouseUp(event) {
			if (event.stopPropagation) {
				event.stopPropagation();
				event.preventDefault();
			} else {//IE
				event.cancelBubble = true;
				event.returnValue = false;
			}
			pressX1 = null;
			pressY1 = null;
			pressX2 = null;
			pressY2 = null;
			repaint();
			unbindEvent(document, "mousemove", onMouseMove);
			unbindEvent(document, "mouseup", onMouseUp);
		}
		bindEvent(document, "mousemove", onMouseMove);
		bindEvent(document, "mouseup", onMouseUp);
	}
	repaint();
}


function drawRect(context, x, y, width, height, info) {
	context.fillStyle = 'rgb(0,0,0)';
	context.fillText(info, x - 70, y + 20);
	context.strokeRect(x, y, width, height);
	context.storkeStyle = "rgb(0,0,0)";

	context.beginPath();
	for (var k = 0; k < 20; k++) {
		context.moveTo(x + k * 40, y);
		context.lineTo(x + k * 40, y + height);
		context.drawImage(errorImg, x + k * 40 + 12, y + 5);
	}
	context.stroke();
}

function drawHotArea(context,x1 ,y1 ,x2 , y2){
    if(x1 >= x2)  {
        var minX = x2;
        var maxX = x1;
    }else{
        var minX = x1;
        var maxX = x2;
    }
    if(y1 >= y2)  {
        var minY = y2;
        var maxY = y1;
    }else{
        var minY = y1;
        var maxY = y2;
    }
    context.globalAlpha = 0.3;
    context.fillStyle = 'rgb(255,0,0)';
    context.fillRect(minX, minY, maxX - minX, maxY - minY);
//    context.fill();

}

function drawGrid(context, x, y, width, height, validImage, errorImage) {

}