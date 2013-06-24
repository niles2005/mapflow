'use strict';

/* Directives */


angular.module('myApp.directives', []).
        directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])
        .directive('zippy', function() {
    return {
        restrict: 'C',
        // This HTML will replace the zippy directive.
        replace: true,
        transclude: true,
        scope: {title: '@zippyTitle'},
        template: '<div>' +
                '<div class="title">{{title}}</div>' +
                '<div class="body" ng-transclude></div>' +
                '</div>',
        // The linking function will add behavior to the template
        link: function(scope, element, attrs) {
            // Title element
            var title = angular.element(element.children()[0]),
                    // Opened / closed state
                    opened = true;

            // Clicking on title should open/close the zippy
            title.bind('click', toggle);

            // Toggle the closed/opened state
            function toggle() {
                opened = !opened;
                element.removeClass(opened ? 'closed' : 'opened');
                element.addClass(opened ? 'opened' : 'closed');
            }

            // initialize the zippy
            toggle();
        }
    };
})
.directive('myitem', function($compile) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
//            console.dir(attrs);
            var type = scope.myfield.type;
            if (type === 'float'|| type === 'fontstyle'||  type === 'labelorient') {
                var htmlText = '<span>{{prop.' + scope.$parent.myfield.name + '}}</span>';
                element.replaceWith($compile(htmlText)(scope));
            } else if (type === 'boolean') {
                var htmlText = '<img ng-src="img/exist{{prop.' + scope.$parent.myfield.name + '}}.png"/>';
                element.replaceWith($compile(htmlText)(scope));
            }
        }
    };
})
.directive('myinput', function($compile) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var type = scope.myfield.type;
            if (type === 'float') {
                var htmlText = '<input type="text" ng-model="myfield.value">';
                element.replaceWith($compile(htmlText)(scope));
            } else if (type === 'boolean') {
                var htmlText = '<form>' +
                        '<label class="radio  inline">' +
                        '    <input type="radio" ng-model="myfield.value" name="optionsRadios" value="1" checked="true"><img src="img/valid.png">' +
                        '</label>' +
                        '<label class="radio  inline">' +
                        '    <input type="radio" ng-model="myfield.value" name="optionsRadios" value="0"><img src="img/error.png">' +
                        '</label>' +
                        '</form>';
                element.replaceWith($compile(htmlText)(scope));
            }else if(type === 'fontstyle'){
                var htmlText = '<div class="fontStyleList">'+
                    '<div ng-class = "fontStyle0" ng-click="setFontStyle(0)">正体 Plain</div>' +
                    '<div ng-class = "fontStyle1" ng-click="setFontStyle(1)">斜体 Italic</div>' +
                    '<div ng-class = "fontStyle2" ng-click="setFontStyle(2)">粗体 Blod</div>'+
                    '</div>';

                element.replaceWith($compile(htmlText)(scope));
            }else if(type === 'labelorient'){
                var htmlText = '<table  border="1px" class="labelOrient" ng-click=setLabelOrient($event)>'+
                    '<tr><td>左上<span>1</span></td><td>上<span>2</span></td><td>右上<span>3</span></td></tr>' +
                    '<tr><td>左中<span>4</span></td><td>只有图标<span>0</span></td><td>右中<span>5</span></td></tr>' +
                    '<tr><td>左下<span>6</span></td><td>下<span>7</span></td><td>右下<span>8</span></td></tr>' +
                    '</table>';
                element.replaceWith($compile(htmlText)(scope));
            }

        }
    };
});
