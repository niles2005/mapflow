'use strict';

function TreeConfig(configFile, scope) {
    this._scope = scope;
    this._jAreaDiv = $("#treeTabArea");
    this._jLineDiv = $("#treeTabLine");
    this._jPointDiv = $("#treeTabPoint");
    this._jAreaDiv.empty();
    this._jLineDiv.empty();
    this._jPointDiv.empty();
    this._url = configFile;
    this._clickListener = this.makeClickListener();
    this.loadContent();
}
var currGroupName = null;
var asChild = false;
var defaultNewNodeName = "NewNode";

TreeConfig.prototype = {
    loadContent: function() {
        if (this._url) {
            this.loadXMLFile(this._url, this.loadXmlDoc, this);
        }
    },
    loadXMLFile: function(url, listener, caller) {
        $.ajax({
            url: url,
            dataType: "xml",
            cache: false,
            success: function() {
                listener.apply(caller, arguments);
            }
        });
    },
    loadXmlDoc: function(xmlDoc) {
        var doc = xmlDoc.childNodes[0];
        this._treeName = "tree_mapstyle";
        var arr = doc.childNodes;
        for (var k in arr) {
            var groupNode = arr[k];
            if (groupNode.nodeType === 1 && groupNode.tagName === 'group') {
                var groupName = $(groupNode).attr('name');
                if (groupName === 'area') {
                    this.makeTreeItem(this._jAreaDiv, groupName, groupNode.childNodes);
                } else if (groupName === 'line') {
                    this.makeTreeItem(this._jLineDiv, groupName, groupNode.childNodes);
                } else if (groupName === 'point') {
                    this.makeTreeItem(this._jPointDiv, groupName, groupNode.childNodes);
                }
            }
        }
//        this.makeTreeItem(this._jAreaDiv, arr);
    },
    _addHover: function(event) {
        $(this).addClass("nodeHover");
    },
    _removeHover: function(event) {
        $(this).removeClass("nodeHover");
    },
    makeTreeItem: function(node, groupName, childNodes) {
        if (childNodes.length > 0) {
            var jul = $('<ul>');
            if (node._attr) {
                jul.addClass(this._treeName);
            }

            for (var k in childNodes) {
                var childNode = childNodes[k];
                if (childNode.nodeType === 1) {
                    var strName = $(childNode).attr('name');
                    var elementType = childNode.tagName;
                    if (elementType === 'group') {
                        currGroupName = strName;
                    } else if (elementType === 'define') {
                        continue;
                    } else if (elementType === 'field') {
                        var strValue = $(childNode).attr('value');
                        if (strName && strValue) {
                            if(node._attr) {
                                var arr = strValue.split("|");
                                for (var k in arr) {
                                    arr[k] = $.trim(arr[k]);
                                }
                                node._attr[strName] = arr;
                            }
                        }
                        continue;
                    }
                    var elementName = $(childNode).attr('name');

                    var jli = $('<li><div></div><span class=' + elementType + '></span><span class=treeLabel></span></li>');
                    var elementName = $(childNode).attr('name');
                    jli.find(".treeLabel").text(elementName);
                    jli.find('.treeLabel').hover(this._addHover,this._removeHover);
                    var li = jli[0];
                    li._attr = {};
                    li._attr["groupName"] = groupName;
                    li._attr["name"] = elementName;

                    li.onclick = this._clickListener;
                    jul.append(jli);

                    if (childNode.childNodes.length > 0) {
                        this.makeTreeItem(li, groupName, childNode.childNodes);
                    }
                    var subUL = jli.find('>ul');
                    if (subUL.length > 0) {//有子节点
                        if (node._attr) {//LI node,has _attr
                            subUL.children().hide();
                            jli.find('>div').addClass('nodeclosed');
                        } else {//root node(div),don't has _attr
                            jli.find('>div').addClass('nodeopen');
                        }
                        jli.css('cursor', 'pointer');
                    } else {
                        jli.css('cursor', 'default');
                    }
                }
                if (jul.find('>li').length > 0) {
                    $(node).append(jul);
                }

            }
        }
    },
    newNode: function(node,elementName) {
        if (this._selectLI) {
            $(this._selectLI).find(">span").removeClass("nodeselected");
        }
        var groupName;
        if(node._attr) {
            groupName = node._attr["groupName"];
        } else {
            return;
        }
        if(!elementName) {
            elementName = defaultNewNodeName;
        }
        var jli = $('<li><div></div><span class=item></span><span style="display:none;" class=treeLabel></span><input class=labelInput type="text" value="' + elementName + '" style="width:120px;"></li>');
//        jli.find(".treeLabel").text(elementName);
        jli.find('.treeLabel').hover(this._addHover,this._removeHover);
        
        var li = jli[0];
        li._attr = {};
        li._attr["groupName"] = groupName;
        li._attr["name"] = elementName;

        li.onclick = this._clickListener;
        var jul = $(node).find("ul");
        if(jul) {
            if(jul.length == 0) {
                jul = $('<ul>');
                if (node._attr) {
                    jul.addClass(this._treeName);
                }
                $(node).append(jul);
            }
            jul.append(jli);
        }

        jli.css('cursor', 'default');
        var jQLabel = jli.find(".treeLabel");
        var jQinput = jli.find('.labelInput');
        jQinput.bind('blur' ,function(){
            jQLabel.text(jQinput.val());
            jQinput.hide();
            jQLabel.show();
        });
        jQinput.focus();
        return jli;
    },

    listPathNames: function (node,arr) {
        if(!node) {
            return;
        }
        if(node._attr) {
//            arr.unshift(node._attr["name"]);
            arr.unshift(node);
        } else {
            return;
        }
        var parent = node.parentElement;
        if(parent) {
            node  = parent.parentElement;
        }
        return this.listPathNames(node,arr);
    },

    makeClickListener: function () {
        var self = this;
        return function(event) {
            if(event) {
                event.stopPropagation();
                event.preventDefault();
            }

            var props = [];
            var liObj = this;
            var groupName = liObj._attr["groupName"];

            var treeNodeArr = [];
            var treePathArr = [];
            self.listPathNames(liObj,treeNodeArr);
            for(var k in treeNodeArr) {
                treePathArr.push(treeNodeArr[k]._attr["name"]);
            }
            selectTreeNodeArray = treeNodeArr;
            while (liObj) {
                if (liObj._attr) {
                    for (var level = 0; level < 20; level++) {
                        if (!props[level]) {
                            props[level] = {};
                        }

                        for (var propArray in groupMap[groupName]) {
                                var propName = groupMap[groupName][propArray].name;
                                if (props[level][propName]) {

                                } else {
                                    if (liObj._attr[propName]) {
                                        var index = level > liObj._attr[propName].length - 1 ? liObj._attr[propName].length - 1 : level;
                                        props[level][propName] = liObj._attr[propName][index];
                                    }
                                }

                        }
                    }

                }
                var ulObj = liObj.parentElement;
                if (ulObj) {
                    liObj = ulObj.parentElement;
                } else {
                    liObj = null;
                }
            }
            if(self._scope) {
                self._scope.selectNode(groupName,treePathArr,props);
            }

            var jli = $(this);
            var jul = jli.find('>ul');
            if (jul.length > 0) {
                var jdiv = jli.find('>div');
                if (jdiv.hasClass('nodeopen')) {
                    if (event && event.target instanceof HTMLDivElement) {//点击+/-才可以展开/关闭树，点击内容部分不能关闭，可以打开，参考windows目录
                        jdiv.removeClass('nodeopen');
                        jdiv.addClass('nodeclosed');
                        jul.children().slideUp('slow');
                    }
                } else {
                    jdiv.removeClass('nodeclosed');
                    jdiv.addClass('nodeopen');
                    jul.children().slideDown('slow');

                }
            }
            //增加节点选择背景
            if (self._selectLI && self._selectLI !== this) {
                $(self._selectLI).find(">span").removeClass("nodeselected");
            }
            jli.find(">span").addClass("nodeselected");
            self._selectLI = this;
        };
    },
    menuPanel: $('<ul id="config-tree-edit"></ul>'),
    initMenuPanel : function(){
        this._jAreaDiv.parent().bind("contextmenu",function(){
            return false;  //去除默认右键弹出菜单
        });
        this._jAreaDiv.parent().find(">div").mousedown( this.popup());

        var jQAdd =  $('<a>添加1</a>');
        jQAdd.click(this._addNode());
//        var jQEdit =  $('<a>从命名</a>');
//        jQEdit.click(this._editNode());
//        var jQDel =  $('<a>删除</a>');
//        jQDel.click(function(){$('#confirm').modal()} );

        this.menuPanel.append($("<li></li>").wrapInner(jQAdd));
//        this.menuPanel.append($("<li></li>").wrapInner(jQEdit));
//        this.menuPanel.append($("<li></li>").wrapInner(jQDel));

        this.menuPanel.appendTo(this._jAreaDiv.parent());
        this.menuPanel.hide();
    },

    _addNode:function(){
        var self = this;
        var menuPanel = this.menuPanel;
        return function (event) {
            var jQli = $(currentTreeNode).parent();
            self.newNode(jQli[0]);
        }

    },
    popup: function () {
        var self = this;
        function popupClick() {
            self.menuPanel.hide();
            unbindEvent(document,'click',popupClick);
        }
        return function (event) {
            if (event.button == 2) {
                if(event.target.tagName == 'SPAN' && event.target.className.slice(0,9) == 'treeLabel' ){
                    asChild  = true;   // 只有在树的节点上单击时才有弹出菜单
                }else{
                    asChild  = false;
                }
                currentTreeNode = event.target;

                var _menuW = self.menuPanel.outerWidth();
                var _menuH = self.menuPanel.outerHeight();
                var _winW = $(window).width();
                var _winH = $(window).height();
                var showX ,showY;
                if(event.pageX || event.pageY){
                    showX = event.pageX + _menuW > _winW ? event.pageX - _menuW : event.pageX;
                    showY = event.pageY + _menuH > _winH ? event.pageY - _menuH : event.pageY;
                } else {
//                    coord = {x:event.clientX + document.body.scrollLeft, y:event.clientY + document.body.scrollTop};
                }
                self.menuPanel.css({'left':showX, 'top':showY}).fadeIn(300);
                bindEvent(document,'click',popupClick);
            }else if(event.button == 1){
                if(event.target.tagName !== 'SPAN' && event.target.className.slice(0,4) !== 'item' ){

                }
            } else {
                self.menuPanel.hide();
            }
        }
    }
};

var selectTreeNodeArray = null;

function CompileTreeCtrl($scope) {

    $scope.selectNode = function(treePathArr,propsArr) {
        $scope.treePathArr = treePathArr;
        $scope.p = propsArr;
        console.dir(treePathArr);
        console.table(propsArr);
        $scope.$apply();
    };
    var tree = new TreeConfig("new.xml", $scope);

}














