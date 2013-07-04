'use strict';

function StyleCtrl($scope) {
	$('.dashboard-tabs a').removeClass('selected');
	$('.dashboard-tabs a[href="#/style"]').addClass('selected');
}