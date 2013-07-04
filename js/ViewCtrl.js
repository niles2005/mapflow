'use strict';

function ViewCtrl($scope) {
	$('.dashboard-tabs a').removeClass('selected');
	$('.dashboard-tabs a[href="#/view"]').addClass('selected');
	
}