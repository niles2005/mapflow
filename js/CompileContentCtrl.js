function CompileContentCtrl($scope) {
    $scope.test = "aab";
    $scope.props = [
        {'exist': 0, "showPixel": 0.8, margin: 1},
        {'exist': 0},
        {'exist': 0},
        {'exist': 0},
        {'exist': 0},
        {'exist': 1},
        {'exist': 1},
        {'exist': 0},
        {'exist': 0},
        {'exist': 0},
        {'exist': 0},
        {'exist': 0},
        {'exist': 1},
        {'exist': 1},
        {'exist': 0},
        {'exist': 0},
        {'exist': 0},
        {'exist': 0},
        {'exist': 0},
        {'exist': 0}];
    $scope.existValue = 1;
    
    $scope.setProp = function(prop) {
        prop.exist = $scope.existValue;
    };
    var $Mask;
    $scope.doMask = function() {
        if (!$Mask) {
            $Mask = $('#listul').Mask();
        }
    };
    $scope.doRemoveMask = function() {
        if ($Mask) {
            $Mask.RemoveMask();
            $Mask = null;
        }
    };

    var rectArr = [];
    for (var i = 0; i < 20; i++) {
        var xx = i * 44;
        rectArr.push(new Rect(xx, 0, 44, 36));
    }


    var width = 880, height = 36;
    var canvas = document.getElementById("MaskCanvas");
    canvas.addEventListener("mousedown", onMouseDown, false);


    canvas.onselectstart = function() {
        return false;
    };
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');
    var pressX1, pressY1, pressX2, pressY2;


    function repaint() {


        context.clearRect(0, 0, width, height);
        context.fillStyle = 'rgb(255,255,255)';
        context.fillRect(0, 0, width, height);

        context.strokeStyle = "rgb(0,0,0)";
        context.strokeRect(0, 0, width, height);


        context.save();
        context.translate(0.5, 0.5);

        context.fillStyle = "rgb(0,0,250)";

        if (pressX1 && pressY1 && pressX2 && pressY2) {
            context.strokeStyle = 'rgb(255,0,0)';
            context.beginPath();
            context.moveTo(pressX1, pressY1);
            context.lineTo(pressX2, pressY2);
            context.closePath();
            context.stroke();
        }

        context.restore();
    }
    function onMouseDown(event) {
        pressX1 = event.offsetX;
        pressY1 = event.offsetY;
        var screenX1 = event.screenX;
        var screenY1 = event.screenY;

        function onMouseMove(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
                event.preventDefault();
            } else {//IE
                event.cancelBubble = true;
                event.returnValue = false;
            }
            pressX2 = event.screenX - screenX1 + pressX1;
            pressY2 = event.screenY - screenY1 + pressY1;
            repaint();
        }
        function onMouseUp(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
                event.preventDefault();
            } else {//IE
                event.cancelBubble = true;
                event.returnValue = false;
            }
            if (!pressX2 && !pressY2) {//just click
                pressX2 = pressX1;
                pressY2 = pressY1;
            }

            if (pressX1 > pressX2) {
                var tmp = pressX1;
                pressX1 = pressX2;
                pressX2 = tmp;
            }
            if (pressY1 > pressY2) {
                var tmp = pressY1;
                pressY1 = pressY2;
                pressY2 = tmp;
            }
            for (var k in rectArr) {
                var rect = rectArr[k];
                if (rect.intersects(pressX1, pressY1, pressX2 - pressX1, pressY2 - pressY1)) {
                    $scope.props[k]['exist'] = $scope.existValue;
                }
            }

            pressX1 = null;
            pressY1 = null;
            pressX2 = null;
            pressY2 = null;
            repaint();
            unbindEvent(document, "mousemove", onMouseMove);
            unbindEvent(document, "mouseup", onMouseUp);

            $scope.$apply();
        }
        bindEvent(document, "mousemove", onMouseMove);
        bindEvent(document, "mouseup", onMouseUp);
    }
    repaint();
}