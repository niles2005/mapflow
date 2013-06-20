'use strict';
/**
 * Created with IntelliJ IDEA.
 * User: Dell
 * Date: 13-6-19
 * Time: 下午4:56
 * To change this template use File | Settings | File Templates.
 */

function AccordionGroup(scope,divDom){
    this._scope = scope;
    this._groupDiv = document.createElement("div");   //最外层
    var $headingDiv = $("<div/>").addClass("accordion-heading");   //  heading层,与collapse层同一级


    var $collapseDiv =  $("<div/>").addClass("accordion-body collapse");   //配置展开层
    $collapseDiv.attr("style","height: 0;");

    this.makeHeadingContent($headingDiv);
    this._groupDiv.appendChild($headingDiv[0]).appendChild($collapseDiv[0]);
    divDom.appendChild(this._groupDiv) ;

}

AccordionGroup.prototype = {
    makeHeadingContent: function(headingDiv){
        var $accordionInnerDiv =  $("<div/>").addClass("accordion-inner");     //属性名，配置按钮显示层， headingDiv 之子
        var $propName = $("<a></a>").text( this._scope.currentProp);
        var $configIcon =  $("<a class='pull-right' data-toggle='collapse' data-parent='data-parent'></a>");
        $configIcon.attr("href","#collapseTwo");
        $configIcon.append($("<img src='img/cfg.png'>"));
        $accordionInnerDiv.append($propName).append($configIcon).appendTo(headingDiv);

        var $paginationDiv =  $("<div class='pagination' style='padding: 8px 15px;margin: 0;'></div>"); //各层属性值显示层， headingDiv 之子
        var $levelListUl = $("<ul id='listul'></ul>") ;
        var $levelLi = $("<li ng-repeat=\"prop in props\">prop</li>");

//        var $levelA = $("<a/>").addClass("labeli{{$index}}");
//        $levelA.attr("ng-click","setProp(prop,'exist')");
//        $levelA.attr("ng-class","{active: $index==theIndex}");
//        var $levelIcon = $( "<img ng-src='img/exist{{prop.exist}}.png'/>");

//        $levelListUl.append($levelLi.text("prop"));


        $paginationDiv.append($levelListUl).appendTo(headingDiv);

    }


}


