function CompileContentCtrl($scope) {
    $scope.test = "aab";
    $scope.props = [
        {'exist':0,"showPixel":0.8,margin:1},
        {'exist':0},
        {'exist':0},
        {'exist':0},
        {'exist':0},
        
        {'exist':1},
        {'exist':1},
        {'exist':0},
        {'exist':0},
        {'exist':0},
        
        {'exist':0},
        {'exist':0},
        {'exist':1},
        {'exist':1},
        {'exist':0},
        
        {'exist':0},
        {'exist':0},
        {'exist':0},
        {'exist':0},
        {'exist':0}];
    $scope.setProp = function(prop) {
        if($scope.myVar) {
            $scope.myVar='';
        } else {
            $scope.myVar='my-class';
        }
        $scope.currProp = prop;
    };
}