'use strict';

function CompilePageCtrl($scope) {
    $scope.existValue = 1;
    $scope.showpixelValue = 1.0;
    $scope.currentProp = '';
    $scope.selectNode = function(groupName,itemName,propsArr) {
        $scope.groupName = groupName;
        $scope.itemName = itemName;
        $scope.props = propsArr;
        console.log(groupName + "-->" + itemName);
//        console.table(propsArr);
        $scope.$apply();
    };

    var tree = new TreeConfig("new.xml",$scope);
    
    var maskCanvas = new MaskCanvas("MaskCanvas1",$scope);

    $('#collapseTwo').on('show', function () {
        $scope.currentProp = 'exist';
        maskCanvas.doMask('listul');
    });

    $('#collapseTwo').on('hide', function () {
        maskCanvas.doRemoveMask();
        $scope.currentProp = '';
    });

    $('#collapseShowPixel').on('show', function () {
        $scope.currentProp = 'showpixel';
        maskCanvas.doMask('listul2');
    });

    $('#collapseShowPixel').on('hide', function () {
        $scope.currentProp = '';
        maskCanvas.doRemoveMask();
    });
}