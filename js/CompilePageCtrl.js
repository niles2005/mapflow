'use strict';

function CompilePageCtrl($scope) {
    $scope.fields = [{name:"exist",type:"boolean"}, "simplifypixel", "showpixel", "showriverwidth", "shownamerange"];

    $scope.existValue = 1;
    $scope.showpixelValue = 1.0;
    $scope.currentProp = '';
//    $scope.navigationPath = "";
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

    var treeDiv = document.getElementById("tree");
    var tree = new TreeConfig("new.xml",$scope);
    treeDiv.appendChild(tree._div);
    tree.loadContent(); 
    
    var maskCanvas = new MaskCanvas("MaskCanvas1",$scope);
    maskCanvas.repaint();

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