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
            if (type === 'float'|| type === 'fontstyle') {
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
                var htmlText = '<div>'+
                    '<div class="fontStyleList" ng-class = "fontStyle0" ng-click="setFontStyle(0)">正体 Plain</div>' +
                    '<div class="fontStyleList" ng-class = "fontStyle1" ng-click="setFontStyle(1)">斜体 Italic</div>' +
                    '<div class="fontStyleList" ng-class = "fontStyle2" ng-click="setFontStyle(2)">粗体 Blod</div>'+
                    '</div>';

                element.replaceWith($compile(htmlText)(scope));
            }

        }
    };
});
