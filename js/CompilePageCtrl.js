'use strict';

function CompilePageCtrl($scope) {
    $scope.props = [
//        {'exist': 0, "showPixel": 0.8, margin: 1},
//        {'exist': 0},
//        {'exist': 0},
//        {'exist': 0},
//        {'exist': 0},
//        {'exist': 1},
//        {'exist': 1},
//        {'exist': 0},
//        {'exist': 0},
//        {'exist': 0},
//        {'exist': 0},
//        {'exist': 0},
//        {'exist': 1},
//        {'exist': 1},
//        {'exist': 0},
//        {'exist': 0},
//        {'exist': 0},
//        {'exist': 0},
//        {'exist': 0},
//        {'exist': 0}
    ];
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