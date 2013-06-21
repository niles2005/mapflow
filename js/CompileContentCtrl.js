'use strict';

function MaskCanvas(canvasId,scope) {
    this.width = 880; 
    this.height = 36;
    this._scope = scope;
    this._maskDiv = null;
    var canvas = document.getElementById(canvasId);
    var self = this;
    canvas.addEventListener("mousedown", function(event) {
        self.onMouseDown.call(self,event);
    }, false);
    canvas.onselectstart = function() {
        return false;

    };
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d');
    this.pressX1 = this.pressY1 = this.pressX2 = this.pressY2 = null;
    this._rectArr = [];
    for (var i = 0; i < 20; i++) {
        var xx = i * 44;
        this._rectArr.push(new Rect(xx, 0, 44, 36));
    }
    this.repaint();
}

MaskCanvas.prototype = {
    repaint: function () {
        this.context.clearRect(0, 0, this.width, this.height);

        this.context.strokeStyle = "rgb(250,0,0)";
        this.context.strokeRect(0, 0, this.width, this.height);


        this.context.save();
        this.context.translate(0.5, 0.5);

        this.context.fillStyle = "rgb(0,0,250)";

        if (this.pressX1 && this.pressY1 && this.pressX2 && this.pressY2) {
            this.context.strokeStyle = 'rgb(255,0,0)';
            this.context.beginPath();
            this.context.moveTo(this.pressX1, this.pressY1);
            this.context.lineTo(this.pressX2, this.pressY2);
            this.context.closePath();
            this.context.stroke();
        }

        this.context.restore();
    },
    onMouseDown: function(event) {
        this.pressX1 = event.offsetX;
        this.pressY1 = event.offsetY;
        var screenX1 = event.screenX;
        var screenY1 = event.screenY;
        var self = this;
        
        function onMouseMove(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
                event.preventDefault();
            } else {//IE
                event.cancelBubble = true;
                event.returnValue = false;
            }
            self.pressX2 = event.screenX - screenX1 + self.pressX1;
            self.pressY2 = event.screenY - screenY1 + self.pressY1;
            self.repaint();
        }
        function onMouseUp(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
                event.preventDefault();
            } else {//IE
                event.cancelBubble = true;
                event.returnValue = false;
            }
            if (!self.pressX2 && !self.pressY2) {//just click
                self.pressX2 = self.pressX1;
                self.pressY2 = self.pressY1;
            }

            if (self.pressX1 > self.pressX2) {
                var tmp = self.pressX1;
                self.pressX1 = self.pressX2;
                self.pressX2 = tmp;
            }
            if (self.pressY1 > self.pressY2) {
                var tmp = self.pressY1;
                self.pressY1 = self.pressY2;
                self.pressY2 = tmp;
            }
            for (var k in self._rectArr) {
                var rect = self._rectArr[k];
                if (rect.intersectsLine(self.pressX1, self.pressY1, self.pressX2, self.pressY2)) {
                    self._scope.props[k][self._scope.currentField.name] = self._scope.currentField.value;
                }
            }

            self.pressX1 = self.pressY1 = self.pressX2 = self.pressY2 = null;
            self.repaint();
            unbindEvent(document, "mousemove", onMouseMove);
            unbindEvent(document, "mouseup", onMouseUp);
            
            self._scope.$apply();
        }
        bindEvent(document, "mousemove", onMouseMove);
        bindEvent(document, "mouseup", onMouseUp);
    },
    isMask: function() {
        return this._maskDiv !== null;
    },
    doMask: function(elemtId) {
        if (!this._maskDiv) {
            this._maskDiv = $('#'+elemtId).Mask();
        }
    },
    doRemoveMask: function() {
        if (this._maskDiv) {
            this._maskDiv.RemoveMask();
            this._maskDiv = null;
        }
    }
};

function CompileContentCtrl($scope) {
    $scope.props = [
        {'exist': 0, "showpixel": 0.8, margin: 1},
        {'exist': 0, "showpixel": 0.5},
        {'exist': 0, "showpixel": 0.6},
        {'exist': 0, "showpixel": 0.8},
        {'exist': 0, "showpixel": 0.7},
        {'exist': 1, "showpixel": 0.8},
        {'exist': 1, "showpixel": 0.8},
        {'exist': 0, "showpixel": 0.9},
        {'exist': 0, "showpixel": 1.8},
        {'exist': 0, "showpixel": 0.8},
        {'exist': 0, "showpixel": 0.8},
        {'exist': 0, "showpixel": 0.8},
        {'exist': 1, "showpixel": 0.8},
        {'exist': 1, "showpixel": 0.8},
        {'exist': 0, "showpixel": 0.8},
        {'exist': 0, "showpixel": 0.8},
        {'exist': 0, "showpixel": 0.8},
        {'exist': 0, "showpixel": 0.8},
        {'exist': 0, "showpixel": 0.8},
        {'exist': 0, "showpixel": 0.8}];
    $scope.existValue = 1;
    $scope.showpixelValue = 1.0;
    $scope.currentProp = 'exist1';
    $scope.setProp = function(prop,propName,index) {
//        prop[propName] = $scope[propName+'Value'];
//        $scope.theIndex = index;
//        $scope.currentProp = propName;
    };

//    var accordion2 = document.getElementById("accordion2");
//    new AccordionGroup($scope,accordion2);




    var maskCanvas = new MaskCanvas("MaskCanvas",$scope);
    
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

angular.module('DirectiveTest', [])
    .directive('fundooRating', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                console.dir(attrs);
                console.log("Recognized the fundoo-rating directive usage");
            }
        }
    })
