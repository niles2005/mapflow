'use strict';

function bindEvent(elementTarget, eventType, func) {
	if (window.addEventListener) {
		elementTarget.addEventListener(eventType, func, false);
	} else if (window.attachEvent) {
		elementTarget.attachEvent("on" + eventType, func);
	}
}

function unbindEvent(elementTarget, eventType, func) {
	if (window.addEventListener) {
		elementTarget.removeEventListener(eventType, func, false);
	} else if (window.attachEvent) {
		elementTarget.detachEvent("on" + eventType, func);
	}
}



var errorImg = new Image();
errorImg.onload = function() {
	errorImg.loaded = true;
};
errorImg.src = 'img/error.png';
var validImg = new Image();
validImg.onload = function() {
	validImg.loaded = true;
};
validImg.src = 'img/valid.png';

// var module2D = {
// 	"levels": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// };
// var module1D = {
// 	"levels": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// };
// var module0D = {
// 	"levels": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// };

function Rect(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Rect.prototype = {
	draw: function(context) {
		context.strokeRect(this.x, this.y, this.width, this.height);
	},
	drawImage: function(context, status) {
		if (status) {
            context.drawImage(validImg, this.x + 12, this.y + 5);
		} else {
            context.drawImage(errorImg, this.x + 12, this.y + 5);
		}
	},
	isEmpty: function() {
		return (this.width <= 0.0) || (this.height <= 0.0);
	},
	intersects: function(x1, y1, w1, h1) {
		return ((x1 + w1) > this.x &&
				(y1 + h1) > this.y &&
				x1 < (this.x + this.width) &&
				y1 < (this.y + this.height));
	},
        intersectsLine: function(x1,y1,x2,y2) {
            var out1, out2;
            var OUT_LEFT = 1;
            var OUT_TOP = 2;
            var OUT_RIGHT = 4;
            var OUT_BOTTOM = 8;
            var self = this;
            function  outcode(x, y) {
                var out = 0;
                if (self.width <= 0) {
                    out |= OUT_LEFT | OUT_RIGHT;
                } else if (x < self.x) {
                    out |= OUT_LEFT;
                } else if (x > self.x + self.width) {
                    out |= OUT_RIGHT;
                }
                if (self.height <= 0) {
                    out |= OUT_TOP | OUT_BOTTOM;
                } else if (y < self.y) {
                    out |= OUT_TOP;
                } else if (y > self.y + self.height) {
                    out |= OUT_BOTTOM;
                }
                return out;
            }
            
            if ((out2 = outcode(x2, y2)) === 0) {
                return true;
            }
            while ((out1 = outcode(x1, y1)) !== 0) {
                if ((out1 & out2) != 0) {
                    return false;
                }
                if ((out1 & (OUT_LEFT | OUT_RIGHT)) !== 0) {
                    var x = this.x;
                    if ((out1 & OUT_RIGHT) !== 0) {
                        x += this.width;
                    }
                    y1 = y1 + (x - x1) * (y2 - y1) / (x2 - x1);
                    x1 = x;
                } else {
                    var y = this.y;
                    if ((out1 & OUT_BOTTOM) !== 0) {
                        y += this.height;
                    }
                    x1 = x1 + (y - y1) * (x2 - x1) / (y2 - y1);
                    y1 = y;
                }
            }
            return true;
        }
};

function CompileCtrl($rootScope,$scope,$http) {
	console.dir($rootScope.project)
	var module = null;
	var url = 'project';
	var value = {project:'shanghai',action:'module'};
	$http({method:'POST',url:url,data:value}).success(function(data) {
		if(data && data.d0) {
			module = data;
		}
		repaint();
		// console.dir(data);
	});

	value = {action: 'list'};
	$http({method:'POST',url:'template',data:value}).success(function(data) {
		if(data) {
			$scope.tempList = data;
		}
		// console.dir(data);
	});


	$scope.beginCompile = function() {
		if(module) {
			value = {project:'shanghai',action:'moduleUpdate',module: module};
			$http({method:'POST',url:url,data:value}).success(function(data) {
				console.log(data);
			});
		}		
		console.log("begin compile");
	}

	$('.dashboard-tabs a').removeClass('selected');
	$('.dashboard-tabs a[href="#/compile"]').addClass('selected');
        $scope.test1 = "test1";
	var gridNum = 20;
	var startX = 80;
	var startY = 30;
	var gridWidth = 40;
	var gridHeight = 30;
	var margin = 20;

	var rect0DArr = [];
	var rect1DArr = [];
	var rect2DArr = [];
	for (var i = 0; i < gridNum; i++) {
		var xx = startX + i * gridWidth;
		rect2DArr.push(new Rect(xx, startY, gridWidth, gridHeight));
		rect1DArr.push(new Rect(xx, startY + gridHeight + margin, gridWidth, gridHeight));
		rect0DArr.push(new Rect(xx, startY + gridHeight * 2 + margin * 2, gridWidth, gridHeight));
	}
	var width = 900, height = 200;
	var canvas = document.getElementById("compile_canvas");
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
		for(var j=0;j<gridNum;j++) {
			var xx = startX + j * gridWidth + gridWidth/2;
			if(j <= 9) {
				xx -= 4;
			} else {
				xx -= 8;
			}
			context.fillText("" + j, xx, startY - 12);
		}

		if(module) {
			drawModule(context, module.d2, '2D(Area)', rect2DArr);
			drawModule(context, module.d1, '1D(Line)', rect1DArr);
			drawModule(context, module.d0, '0D(Label)', rect0DArr);
		}

		if (pressX1 && pressY1 && pressX2 && pressY2) {
                    drawHotArea(context,pressX1 , pressY1 , pressX2 , pressY2);
		}

		context.restore();
	}
	function onMouseDown(event) {
		pressX1 = event.offsetX;
		pressY1 = event.offsetY;
		function onMouseMove(event) {
			if (event.stopPropagation) {
				event.stopPropagation();
				event.preventDefault();
			} else {//IE
				event.cancelBubble = true;
				event.returnValue = false;
			}
			pressX2 = event.offsetX;
			pressY2 = event.offsetY;
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
			if(!pressX2 && !pressY2) {//just click
				pressX2 = pressX1;
				pressY2 = pressY1;
			}
			if(module) {
				checkIntersect(pressX1,pressY1,pressX2,pressY2,rect2DArr,module.d2);
				checkIntersect(pressX1,pressY1,pressX2,pressY2,rect1DArr,module.d1);
				checkIntersect(pressX1,pressY1,pressX2,pressY2,rect0DArr,module.d0);
			}
				
			pressX1 = null;
			pressY1 = null;
			pressX2 = null;
			pressY2 = null;
			repaint();
			unbindEvent(canvas, "mousemove", onMouseMove);
			unbindEvent(canvas, "mouseup", onMouseUp);
		}
		bindEvent(canvas, "mousemove", onMouseMove);
		bindEvent(canvas, "mouseup", onMouseUp);
	}

	function drawModule(context, module, moduleName, rects) {
		context.storkeStyle = "rgb(0,0,0)";
		for (var j = 0; j < rects.length; j++) {
			rects[j].draw(context);
		}
		context.fillStyle = "rgb(0,0,250)";
		context.fillText(moduleName, rects[0].x - 60, rects[0].y + 20);
		if (module) {
			if (module.length === gridNum) {
				for (var k = 0; k < gridNum; k++) {
					rects[k].drawImage(context, module[k]);
				}
			}
		}
	}

    function drawHotArea(context, x1, y1, x2, y2){
         if(x1 >= x2){
             var maxX = x1;
             var minX = x2;
         } else{
             var maxX = x2;
             var minX = x1;
         }
         if(y1 >= y2){
             var maxY = y1;
             var minY = y2;
         } else{
             var maxY = y2;
             var minY = y1;
         }
        context.globalAlpha = 0.3;
        context.fillStyle = 'rgb(255,0,0)';
        context.fillRect(minX,minY,maxX-minX,maxY-minY);
        context.fill();
        context.globalAlpha = 0.5;
        context.strokeStyle = 'rgb(255,0,0)';
        context.strokeRect(minX,minY,maxX-minX,maxY-minY);
        context.stroke();
    }

	repaint();
}

function checkIntersect(x1, y1, x2, y2, rects, module) {
	if(x1 > x2) {
		var tmp = x1;
		x1 = x2;
		x2 = tmp;
	}
	if(y1 > y2) {
		var tmp = y1;
		y1 = y2;
		y2 = tmp;
	}
	for (var i = 0; i < rects.length; i++) {
		if (rects[i].intersects(x1, y1, x2 - x1, y2 - y1)) {
			if(module[i]) {
				module[i] = 0;
			} else {
				module[i] = 1;
			}
		}
	}
}

