'use strict';

var groupMap = {
    area: [
        {name:"exist",type:"boolean",value:"0"},
        {name:"simplifypixel",type:"float",value:"0.8"},
        {name:"showpixel",type:"float",value:"1.1"},
        {name:"showriverwidth",type:"float",value:"0.5"},
        {name:"shownamerange",type:"float",value:"60"}
    ],
    line: [
        {name:"exist",type:"boolean",value:"0"},
        {name:"simplifypixel",type:"float",value:"0.8"},
        {name:"maxanglefilter",type:"float",value:"1.1"},
        {name:"namefilter",type:"float",value:"0.5"},
        {name:"nameblank",type:"float",value:"60"},
        {name:"namegroupmargin",type:"float",value:"60"}
    ],
    point: [
        {name:"exist",type:"boolean",value:"0"},
        {name:"fontsize",type:"float",value:"0.8"},
        {name:"fontstyle",type:"fontstyle",value:"1"},
        {name:"iconstyle",type:"float",value:"1"},
        {name:"labelorient",type:"labelorient",value:"1"},
        {name:"labellevel",type:"float",value:"60"},
        {name:"labelmargin", type:"float",value:"60"},
        {name:"labelcharspace", type:"float",value:"60"},
        {name:"sameclassrange", type:"float",value:"60"},
        {name:"sametyperange", type:"float",value:"60"},
        {name:"samenamerange", type:"float",value:"60"}
    ]
};
    
function CompilePageCtrl($scope) {
    $scope.fields = [];
    $scope.currentField = null;
    
    $scope.doConfig = function() {
        if(maskCanvas.isMask()) {
            maskCanvas.doRemoveMask();
            if($scope.currentField && $scope.currentField.name === this.myfield.name) {
                $scope.currentField = null;
            } else {
                $scope.currentField = this.myfield;
                maskCanvas.doMask('listul' + this.myfield.name);
            }
        } else {
            $scope.currentField = this.myfield;
            maskCanvas.doMask('listul' + this.myfield.name);
        }
    };
    $scope.selectNode = function(groupName,treePathArr,propsArr) {
        $scope.groupName = groupName;
        $scope.props = propsArr;
        
        $scope.navigationPath = treePathArr;
        if($scope.fields !== groupMap[groupName]) {
            $scope.fields = groupMap[groupName];
            $scope.currentField = null;//remove select node
        }
        
        if(!$scope.$$phase) {
            $scope.$apply();
          }
    };
    $scope.clickTreeNode = function(index) {
        if(selectTreeNodeArray && index < selectTreeNodeArray.length - 1) {
            selectTreeNodeArray[index].onclick();
        }
    };

    $scope.setFontStyle = function(fontStyleIndex){
        $scope.fontStyle0 = $scope.fontStyle1 = $scope.fontStyle2 = "";
        $scope["fontStyle" + fontStyleIndex] =  "fontSelected";

        this.myfield.value =  fontStyleIndex;
    } ;

    $scope.setLabelOrient = function($event){
        var $td =  $($event.target);
        var $table = $td.parent().parent();
        this.myfield.value =  $td.find(">span").text();
        $table.find("td").removeClass("labelOrientSelected");
        $td.addClass("labelOrientSelected");
    }
    $scope.deleteTreeNodeName;
    $scope.deleteTreeNode = function(){
        treeConfig.deleteNode();
    }

    var treeConfig = new TreeConfig("new.xml",$scope);

}