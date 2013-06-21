'use strict';

function CompilePageCtrl($scope) {
    $scope.fields = [
        {name:"exist",type:"boolean",value:"0",focus:false},
        {name:"simplifypixel",type:"float",value:"0.8",focus:false},
        {name:"showpixel",type:"float",value:"1.1",focus:false},
        {name:"showriverwidth",type:"float",value:"0.5",focus:false},
        {name:"shownamerange",type:"float",value:"60",focus:false}
    ];
    $scope.currentField = null;
    
    $scope.doConfig = function() {
        if(maskCanvas.isMask()) {
            maskCanvas.doRemoveMask();
            if($scope.currentField && $scope.currentField.name === this.myfield.name) {
                $scope.currentField.focus = false;
            } else {
                $scope.currentField = this.myfield;
                $scope.currentField.focus = true;
                maskCanvas.doMask('listul' + this.myfield.name);
            }
        } else {
            $scope.currentField = this.myfield;
            $scope.currentField.focus = true;
            maskCanvas.doMask('listul' + this.myfield.name);
        }
    };
    $scope.selectNode = function(navigationPath,propsArr) {
        $scope.props = propsArr;
        $scope.navigationPath = navigationPath;
        $scope.$apply();
    };
    
    new TreeConfig("new.xml",$scope);
    
    var maskCanvas = new MaskCanvas("MaskCanvas1",$scope);

}