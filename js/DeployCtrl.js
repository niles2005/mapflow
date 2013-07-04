'use strict';

function DeployCtrl($scope) {
	$('.dashboard-tabs a').removeClass('selected');
	$('.dashboard-tabs a[href="#/deploy"]').addClass('selected');
	
}