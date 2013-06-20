'use strict';

/* Directives */


angular.module('myApp.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive('zippy', function () {
        return {
            restrict: 'C',
            // This HTML will replace the zippy directive.
            replace: true,
            transclude: true,
            scope: { title: '@zippyTitle' },
            template: '<div>' +
                '<div class="title">{{title}}</div>' +
                '<div class="body" ng-transclude></div>' +
                '</div>',

            // The linking function will add behavior to the template
            link: function (scope, element, attrs) {
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
    .directive('mytest', function ($compile) {
        return {
            restrict: 'E',
            scope: {existValue: "="},
            link: function (scope, element, attrs) {
                console.dir(attrs);
                var type = scope.myfield.type;
                if (type === 'a') {
                    var htmlText = '<div class="control-group">' +
                        '<label class="control-label" >' + scope.title + '</label>' +
                        '<div class="controls">' +
                        '</div>' +
                        '</div>';
                    element.replaceWith(htmlText);
                } else if (type === 'b') {
                    var htmlText = '<img src="img/exist1.png"/>';
                    element.replaceWith(htmlText);
                } else if (type === 'int') {
                    var defalutValue = scope.myfield.defalutValue;
                    var htmlText = '<input type="text" ng-model="existValue" value="' + defalutValue + '">';
//                element.replaceWith(htmlText);    
                    element.append($compile(htmlText)(scope));
                } else if (type === 'boolean') {
                    var htmlText = '<form>' +
                        '<label class="radio  inline">' +
                        '    <input type="radio" ng-model="existValue" name="optionsRadios" value="1" checked="true"><img src="img/valid.png">' +
                        '</label>' +
                        '<label class="radio  inline">' +
                        '    <input type="radio" ng-model="existValue" name="optionsRadios" value="0"><img src="img/error.png">' +
                        '</label>' +
                        '</form>';
                    element.replaceWith(htmlText);
                    element.append($compile(htmlText)(scope));
//                element.replaceWith(htmlText);    

                }
            }
        }
    })
    .directive('levelcycle', function () {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                console.dir(scope);
                var levelHtml = '';
                if (scope.field.name === 'exist') {
                    levelHtml = '<img src="img/exist' + scope.prop["exist"] + '.png"/>';
                }
                levelHtml = scope.prop["showpixel"];

                element.replaceWith(levelHtml);
            }

        }
    });


  
