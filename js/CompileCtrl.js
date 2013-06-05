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

var module2D = {
	"levels": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
var module1D = {
	"levels": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
var module0D = {
	"levels": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

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
		if (status === 0) {
			context.drawImage(errorImg, this.x + 12, this.y + 5);
		} else {
			context.drawImage(validImg, this.x + 12, this.y + 5);
		}
	},
	isEmpty: function() {
		return (this.width <= 0.0) || (this.height <= 0.0);
	},
	intersects: function(x1, y1, w1, h1) {
		if (this.isEmpty() || w1 <= 0 || h1 <= 0) {
			return false;
		}
		return ((x1 + w1) > this.x &&
				(y1 + h1) > this.y &&
				x1 < (this.x + this.width) &&
				y1 < (this.y + this.height));
	}

};

function CompileCtrl($scope) {
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
	var width = 900, height = 400;
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

		drawModule(context, module2D, '2D(Area)', rect2DArr);
		drawModule(context, module1D, '1D(Line)', rect1DArr);
		drawModule(context, module0D, '0D(Label)', rect0DArr);

		if (pressX1 && pressY1 && pressX2 && pressY2) {
			context.strokeStyle = "#F00";
			context.beginPath();
			context.moveTo(pressX1, pressY1);
			context.lineTo(pressX2, pressY2);
			context.stroke();
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
			checkIntersect(pressX1,pressY1,pressX2,pressY2,rect2DArr,module2D);
			checkIntersect(pressX1,pressY1,pressX2,pressY2,rect1DArr,module1D);
			checkIntersect(pressX1,pressY1,pressX2,pressY2,rect0DArr,module0D);
			
			pressX1 = null;
			pressY1 = null;
			pressX2 = null;
			pressY2 = null;
			repaint();
			unbindEvent(document, "mousemove", onMouseMove);
			unbindEvent(document, "mouseup", onMouseUp);
		}
		bindEvent(document, "mousemove", onMouseMove);
		bindEvent(document, "mouseup", onMouseUp);
	}

	function drawModule(context, module, moduleName, rects) {
		context.storkeStyle = "rgb(0,0,0)";
		for (var j = 0; j < rects.length; j++) {
			rects[j].draw(context);
		}
		context.fillStyle = "rgb(0,0,250)";
		context.fillText(moduleName, rects[0].x - 60, rects[0].y + 20);
		if (module) {
			var levels = module.levels;
			if (levels.length === gridNum) {
				for (var k = 0; k < gridNum; k++) {
					rects[k].drawImage(context, levels[k]);
				}
			}
		}
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
			module.levels[i] = 1;
		} else {
			module.levels[i] = 0;
		}
	}
}

