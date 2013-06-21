'use strict';

function CompilePageCtrl($scope) {
    console.log("aaa")
    $scope.fields = [
        {name:"exist",type:"boolean",value:"0"},
        {name:"simplifypixel",type:"int",defalutValue:"1"},
        {name:"showpixel",type:"int"},
        {name:"showriverwidth",type:"int"},
        {name:"shownamerange",type:"int"}
    ];
    $scope.existValue = 0;
    $scope.showpixelValue = 1.0;
    $scope.currentProp = '';
//    $scope.navigationPath = "";
    $scope.doTest = function() {
        $scope.currentProp = this.myfield.name;

        maskCanvas.doMask('listulexist');
        console.log("sssss");
    }
    $scope.selectNode = function(navigationPath,propsArr) {

        $scope.props = propsArr;
//        console.dir(groupName);
//        if (navigationPath instanceof Array) {
//            var treePath = "" ;
//            for (var i = groupName.length - 1; i >= 0; i--) {
//                if(i < groupName.length - 1)  {
//                    treePath+=" > ";
//                }
//                treePath+=groupName[i];
//            }

//            console.dir(treePath);
//        }
        $scope.navigationPath = navigationPath;
        $scope.$apply();
    };

    var tree = new TreeConfig("new.xml",$scope);
    
    var maskCanvas = new MaskCanvas("MaskCanvas1",$scope);

    $('#collapseexist').on('show', function () {
        $scope.currentProp = 'exist';
        maskCanvas.doMask('listulexist');
    });

    $('#collapseexist').on('hide', function () {
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