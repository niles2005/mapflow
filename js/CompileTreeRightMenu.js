'use strict';
/**
 * Created with IntelliJ IDEA.
 * User: Dell
 * Date: 13-6-24
 * Time: 下午12:57
 * To change this template use File | Settings | File Templates.
 */


var currentTreeNode = null;

function CompileTreeRightMenu(treeConfig) {
    this._tree =  treeConfig;
    this._treesDiv = treeConfig._jAreaDiv.parent();
    this.init();
}

CompileTreeRightMenu.prototype = {
    menuPanel: $('<ul id="config-tree-edit"></ul>'),

    init: function (document) {

        this._treesDiv.bind("contextmenu",function(){
            return false;  //去除默认右键弹出菜单
        });
        this._treesDiv.find(">div").mousedown( this.popup());


        var jQAdd =  $('<a>添加配置项</a>');
        jQAdd.click(this._addNode());
        var jQAddChild =  $('<a>添加子配置项</a>');
        jQAddChild.click(this._addNode(true));
        var jQEdit =  $('<a>配置项改名</a>');
        jQEdit.click(this._editNode());
        var jQDel =  $('<a>删除配置项</a>');
        jQDel.click(this._deleteNode());

        this.menuPanel.append($("<li></li>").wrapInner(jQAdd));
        this.menuPanel.append($("<li></li>").wrapInner(jQAddChild));
        this.menuPanel.append($("<li></li>").wrapInner(jQEdit));
        this.menuPanel.append($("<li></li>").wrapInner(jQDel));

        this.menuPanel.appendTo(this._treesDiv);
        this.menuPanel.hide();
    },

    _addNode:function(asChild){
        var self = this;
        var menuPanel = this.menuPanel;
        return function () {
            var jQli = $(currentTreeNode).parent();
            var newLi =  jQli.clone();
            var jQnameSpan = $(newLi.find('>span'));
            var jQinput = $('<input type="text"  placeholder="Enter a name here" style="width:120px;">');
            jQinput.keypress(self.insertNewName(jQnameSpan,jQinput,self._tree._clickListener));
            jQinput.bind('click', function(){
                return false;  //在输入到输入框时，不响应onclick事件！
            } );
            jQinput.bind('blur' ,function(){
                newLi.remove();
            });
            jQnameSpan.hide();
            newLi.append(jQinput);
            if(newLi.find('>ul')){
                $(newLi.find('>ul')).remove();  //去除它的子节点
                $(newLi.find('>div')).removeClass();
            }
            newLi[0]._attr = jQuery.extend({}, jQli[0]._attr); // 不能写成 newLi[0]._attr = jQli[0]._attr，这时是两个引用指向同一个_attr对象
            if (asChild) {
                jQli.append(newLi);
            }
            newLi.insertAfter(jQli);
            menuPanel.hide();
            jQinput.focus();
        }
    } ,

    _editNode:function(){
        var self = this;
        var menuPanel = this.menuPanel;
        return function(){
            var jQli = $(currentTreeNode).parent();
            var jQnameSpan = $(jQli.find('>span'));
            var jQinput = $('<input type="text" style="width:100px;">');
            jQinput.keypress(self.insertNewName(jQnameSpan,jQinput));
            jQinput.bind('click', function(){
                return false;  //在输入到输入框时，不响应onclick事件！
            } );
            jQinput.bind('blur' ,function(){
                jQinput.remove();
                jQnameSpan.fadeIn(200);
            });
            jQinput.val(jQnameSpan.text());
            jQnameSpan.hide();
            jQli.append(jQinput);
            menuPanel.hide();
            jQinput.focus();
        }

    } ,
    _deleteNode:function(){
        var menuPanel = this.menuPanel;
        return function(){
            var jQli = $(currentTreeNode).parent();
            jQli.remove();
            menuPanel.hide();
        }


    } ,
    insertNewName : function(spanNode,inputNode,treeClickListener){
        return function(event){
            if(event.keyCode == 13){
                spanNode.text(inputNode.val());
                spanNode.fadeIn(200);
                inputNode.fadeOut(200);
                spanNode.parent()[0]._attr["name"] = inputNode.val();
                spanNode.parent().click(treeClickListener);
//                inputNode.unbind();
                inputNode.remove();
            }
        }
    },
    popup: function () {
        var self = this;
        return function (event) {
            if (event.button == 2) {
                if(event.target.tagName !== 'SPAN' && event.target.className.slice(0,4) !== 'item' ){
                            return false;   // 只有在树的节点上单击时才有弹出菜单
                 }
                 currentTreeNode = event.target;

                var _menuW = self.menuPanel.outerWidth();
                var _menuH = self.menuPanel.outerHeight();
                var _winW = $(window).width();
                var _winH = $(window).height();
                var showX ,showY;
                if(event.pageX || event.pageY){
//                    console.dir(event.pageX + "  "+ event.pageY);
                    showX = event.pageX + _menuW > _winW ? event.pageX - _menuW : event.pageX;
                    showY = event.pageY + _menuH > _winH ? event.pageY - _menuH : event.pageY;
                } else {
//                    coord = {x:event.clientX + document.body.scrollLeft, y:event.clientY + document.body.scrollTop};
                }
                self.menuPanel.css({'left':showX, 'top':showY}).fadeIn(300).mouseleave(function(){
                    // 屏蔽菜单上的点击
//                    return false;
//                    console.dir(self.menuPanel.find('li'));
                    self.menuPanel.hide();
                });
            }else if(event.button == 1){
                if(event.target.tagName !== 'SPAN' && event.target.className.slice(0,4) !== 'item' ){


                }
            } else {
                self.menuPanel.hide();
            }
        }
    }


}
