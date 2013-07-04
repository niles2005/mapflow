'use strict';

var files = [
	{"name": "bj_park_pat_region.xmd", "time": "2013-5-29 13:2:43", "size": 24235},
	{"name": "bj_railway_pat_polyline.xmd", "time": "2013-5-29 3:13:43", "size": 54386},
	{"name": "destOcean.xmd", "time": "2013-5-29 13:13:4", "size": 426787568},
	{"name": "green_region.xmd", "time": "2013-5-9 13:13:43", "size": 57845}
]

function FilesCtrl($scope) {
	$scope.files = files;
	$('.dashboard-tabs a').removeClass('selected');
	$('.dashboard-tabs a[href="#/files"]').addClass('selected');

}