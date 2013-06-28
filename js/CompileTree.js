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
    this._initMenuPanel();
    this.loadContent();
    this.currentTreeNode = null;
    this.targetTreeNode = null;
    this.selectTreeNodeArray = null;

}

var asChild = false;
TreeConfig.defaultNewNodeName = "NewNode";

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
                var treeDiv;
                if (groupName === 'area') {
                    treeDiv = this._jAreaDiv.get(0);
                } else if (groupName === 'line') {
                    treeDiv = this._jLineDiv.get(0);
                } else if (groupName === 'point') {
                    treeDiv = this._jPointDiv.get(0);
                }
                if (treeDiv) {
                    treeDiv._attr = {};
                    treeDiv._attr["groupName"] = groupName;
                    this._makeTreeItem(treeDiv, groupName, groupNode.childNodes);
                }
            }
        }
    },

    _addHover: function(event) {
//		event.preventDefault();
//		event.stopPropagation();
        $(this).addClass("nodeHover");
    },
    _removeHover: function(event) {
//		event.preventDefault();
//		event.stopPropagation();
        $(this).removeClass("nodeHover");
    },
    _makeTreeItem: function(node, groupName, childNodes) {
        if (childNodes.length > 0) {
            var jul = $('<ul>');
            jul.addClass(this._treeName);

            for (var k in childNodes) {
                var childNode = childNodes[k];
                if (childNode.nodeType === 1) {
                    var strName = $(childNode).attr('name');
                    var elementType = childNode.tagName;
                    if (elementType === 'group') {
                    } else if (elementType === 'define') {
                        continue;
                    } else if (elementType === 'field') {
                        var strValue = $(childNode).attr('value');
                        if (strName && strValue) {
                            if (node._attr) {
                                var arr = strValue.split("|");
                                for (var k in arr) {
                                    arr[k] = $.trim(arr[k]);
                                }
                                node._attr[strName] = arr;
                            }
                        }
                        continue;
                    }

                    var jli = $('<li><div></div><span class=' + elementType + '></span><span class=treeLabel></span></li>');
                    var elementName = $(childNode).attr('name');
                    jli.find(".treeLabel").text(elementName);
                    jli.find('.treeLabel').hover(this._addHover, this._removeHover);
                    jli.find('.treeLabel').mouseover(this._treeNodeMouseOver());

                    var li = jli[0];
                    li._attr = {};
                    li._attr["groupName"] = groupName;
                    li._attr["name"] = elementName;

                    li.onclick = this._clickListener;
                    jul.append(jli);

                    if (childNode.childNodes.length > 0) {
                        this._makeTreeItem(li, groupName, childNode.childNodes);
                    }
                    var subUL = jli.find('>ul');
                    if (subUL.length > 0) {//有子节点
                        if (node._attr && node._attr['name']) {//LI node,has _attr
                            subUL.children().hide();
                            jli.find('>div').addClass('nodeclosed');
                        } else {//root node(div),don't has _attr
                            jli.find('>div').addClass('nodeopen');
                        }
                    }
                    jli.css('cursor', 'default');
                }
                if (jul.find('>li').length > 0) {
                    $(node).append(jul);
                }

            }
        }

    },



    listPathNames: function(node, arr) {
        if(node instanceof HTMLLIElement) {
            arr.unshift(node);
        } else {
            return;
        }
        var parent = node.parentElement;
        if (parent) {
            node = parent.parentElement;
        }
        return this.listPathNames(node, arr);
    },
    selectLINode: function(liNode) {
        if(liNode) {
            var theNode = liNode;
            var props = [];
            var groupName = liNode._attr["groupName"];

            var treeNodeArr = [];
            var treePathArr = [];
            this.listPathNames(liNode, treeNodeArr);
            for (var k in treeNodeArr) {
                treePathArr.push(treeNodeArr[k]._attr["name"]);
            }
            this.selectTreeNodeArray = treeNodeArr;
            while (liNode) {
                if (liNode._attr) {
                    for (var level = 0; level < 20; level++) {
                        if (!props[level]) {
                            props[level] = {};
                        }

                        for (var propArray in groupMap[groupName]) {
                            var propName = groupMap[groupName][propArray].name;
                            if (props[level][propName]) {

                            } else {
                                if (liNode._attr[propName]) {
                                    var index = level > liNode._attr[propName].length - 1 ? liNode._attr[propName].length - 1 : level;
                                    props[level][propName] = liNode._attr[propName][index];
                                }
                            }

                        }
                    }

                }
                var ulObj = liNode.parentElement;
                if (ulObj) {
                    liNode = ulObj.parentElement;
                } else {
                    liNode = null;
                }
            }

            if (this._scope) {
                this._scope.selectNode(groupName, treePathArr, props);
            }
            //增加节点选择背景
            if (this._selectLI && this._selectLI !== theNode) {
                $(this._selectLI).find(">span").removeClass("nodeselected");

            }
            this._selectLI = theNode;
            $(this._selectLI).find(">span").addClass("nodeselected");
        } else {
            this._scope.selectNode();
        }
    },
    makeClickListener: function() {
        var self = this;
        return function(event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            
            var liNode = this;
            self.selectLINode(liNode);
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
        };
    },

    _initMenuPanel: function() {
        this.menuPanel= $('<ul id="config-tree-edit"></ul>');
        this._jAreaDiv.parent().bind("contextmenu", function() {
            return false;  //去除默认右键弹出菜单
        });
        this._jAreaDiv.parent().find(">div").mousedown(this.popup());
        var self = this;

        var jQAdd = $('<a>添加</a>');
        jQAdd.click(this._addNode());
        var jQEdit = $('<a>重命名</a>');
        jQEdit.click(this._editNode());
        var jQDel = $('<a>删除</a>');
        jQDel.click(function() {
            self._scope.deleteTreeNodeName = self.currentTreeNode.textContent;
            self._scope.$apply();
            $('#confirm').modal();
        });

        this.menuPanel.append($("<li></li>").wrapInner(jQAdd));
        this.menuPanel.append($("<li></li>").wrapInner(jQEdit));
        this.menuPanel.append($("<li></li>").wrapInner(jQDel));

        this.menuPanel.appendTo(this._jAreaDiv.parent());
        this.menuPanel.hide();

        $(window).keypress(function(event){
            console.dir(this);
            if(event.keyCode===113){
                self._editNode()();
            }
        });


    },
    popup: function() {
        var self = this;
        function popupClick() {
            self.menuPanel.hide();
            unbindEvent(document, 'click', popupClick);
        }
        return function(event) {
            if (event.which === 3) {
                if (event.target.tagName === 'SPAN' && event.target.className.slice(0, 9) === 'treeLabel') {
                    asChild = true;   // 只有在树的节点上单击时才有弹出菜单
                } else {
                    asChild = false;
                }
                var jqNode = $(event.target).parent();
                self.currentTreeNode = jqNode[0];
                if (self._selectLI && self._selectLI !== self.currentTreeNode) {
                    $(self._selectLI).find(">span").removeClass("nodeselected");
                }
                self._selectLI = self.currentTreeNode;
                $(self._selectLI).find(">span").addClass("nodeselected");


                var _menuW = self.menuPanel.outerWidth();
                var _menuH = self.menuPanel.outerHeight();
                var _winW = $(window).width();
                var _winH = $(window).height();
                var showX, showY;
                if (event.pageX || event.pageY) {
                    showX = event.pageX + _menuW > _winW ? event.pageX - _menuW : event.pageX;
                    showY = event.pageY + _menuH > _winH ? event.pageY - _menuH : event.pageY;
                } else {
//                    coord = {x:event.clientX + document.body.scrollLeft, y:event.clientY + document.body.scrollTop};
                }
                self.menuPanel.css({'left': showX, 'top': showY}).fadeIn(300);
                bindEvent(document, 'click', popupClick);
            } else if (event.which === 1) {
                if (event.target.tagName == 'SPAN' && event.target.className.slice(0,9) == 'treeLabel') {
                    self.currentTreeNode = $(event.target).parent();
                    var dragUl =  self.currentTreeNode.clone();
                    var showX =   self.currentTreeNode.offset().left;
                    var showY =   self.currentTreeNode.offset().top;
                    dragUl.css({'position':'absolute','pointer-events': 'none','background-color':'#3488ff','opacity': 0.5,'left':showX,'top':showY});
                    var offsetX = event.pageX - showX;
                    var offsetY = event.pageY - showY;

                    $(document).mousemove(function(){
                        return function(evt){
                            if (evt.which === 1) {
                                self.currentTreeNode.append(dragUl);
                                dragUl.css({'left': evt.pageX - offsetX, 'top': evt.pageY - offsetY});
                            }
                        }
                    }());
                    $(document).mouseup(function(){
                        dragUl.remove();
                        $(document).unbind();
                        if(self.targetTreeNode ){
                            console.log('tree node transfer');
                            var wrapperUl = $('<ul>');
                            wrapperUl.addClass(this._treeName);
                            $(self.targetTreeNode).append(wrapperUl.wrapInner(self.currentTreeNode));
                            self.selectLINode(self.currentTreeNode[0]);
                            self.targetTreeNode = null;
                        }
                    });
                }
            } else {
                self.menuPanel.hide();
            }
        };
    },

    _treeNodeMouseOver : function(){
        var self = this;
        return function(event){
            if (event.which  === 1) {
                console.log( $(this).parent()[0]._attr["name"] + ' on mouse over')
                self.targetTreeNode = $(this).parent();
            }
        }
    } ,

    _addNode: function() {
        var self = this;
        var menuPanel = this.menuPanel;
        return function(event) {
            var node = self.currentTreeNode;
            if (self._selectLI) {
                $(self._selectLI).find(">span").removeClass("nodeselected");
            }
            var groupName;
            if (node._attr) {
                groupName = node._attr["groupName"];
            } else {
                groupName =  $('.tab-pane.treepanel.active').find('li:first')[0]._attr["groupName"];
//                return;
            }
            var elementName = TreeConfig.defaultNewNodeName;
            var jli = $('<li><div></div><span class=item></span><span style="display:none;" class=treeLabel></span><input class=labelInput type="text" value="' + elementName + '" style="width:120px;"></li>');
            jli.hover(self._addHover, self._removeHover);

            var li = jli[0];
            li._attr = {};
            li._attr["groupName"] = groupName;
            li._attr["name"] = elementName;

            li.onclick = self._clickListener;
            var jul = $(node).find(">ul");
            if (jul) {
                var nodeDiv = $(node).find('>div');
                if (jul.length === 0) {
                    jul = $('<ul>');
                    jul.addClass(self._treeName);
                    $(node).append(jul);
                } else {
                    $(node).find('>ul').children().slideDown();
                }
                nodeDiv.removeClass('nodeclosed');
                nodeDiv.addClass('nodeopen');
                if (asChild) {
                    jul.append(jli);
                }else{
                    console.log('not child')
                    jul = $('<ul>');
                    jul.addClass(this._treeName);
                    var defaultLi =   $('.tab-pane.treepanel.active').find('li:first');
                    jli[0]._attr = jQuery.extend({}, defaultLi[0]._attr );
                    jul.append(jli);
                    jul.insertAfter(defaultLi);
                }

            }

            jli.css('cursor', 'default');
            var jQLabel = jli.find(".treeLabel");
            var jQinput = jli.find('.labelInput');
            jQinput.bind('click', function() {
                return false;  //在输入到输入框时，不响应onclick事件！
            });
            jQinput.bind('blur', function() {
                var newName = jQinput.val();
                jQLabel.text(newName);
                li._attr["name"] = newName;
                jQinput.remove();
                jQLabel.show();
                self.selectLINode(li);
            });
            jQinput.keypress(function(event) {
                if (event.keyCode === 13) {
                    var newName = jQinput.val();
                    jQLabel.text(newName);
                    li._attr["name"] = newName;
                    jQinput.remove();
                    jQLabel.show();
                    self.selectLINode(li);
                }
            });

            jQinput.focus();

        };
    },
    _editNode: function() {
        var self = this;
        var menuPanel = this.menuPanel;
        return function() {
            if (self._selectLI) {
                $(self._selectLI).find(">span").removeClass("nodeselected");
            }
            self._selectLI = self.currentTreeNode;
            $(self._selectLI).find(">span").addClass("nodeselected");

            var li = self.currentTreeNode;
            var jQli = $(li);
            
            var jQnameSpan = $(jQli.find('>span.treeLabel'));
            var jQinput = $('<input type="text" class="labelInput" style="width:100px;">');
                jQinput.keypress(function(event) {
                if (event.keyCode === 13) {
                    var newName = jQinput.val();
                    jQnameSpan.text(newName);
                    jQnameSpan.fadeIn(200);
                    jQinput.fadeOut(200);
                    var attr = jQli[0]._attr;
                    if(attr) {
                        attr["name"] = newName;
                    }
                    jQinput.remove();

                    self.selectLINode(li);
                }
            });
            jQinput.bind('click', function() {
                return false;  //在输入到输入框时，不响应onclick事件！
            });
            jQinput.bind('blur', function() {
                var newName = jQinput.val();
                jQnameSpan.text(newName);
                jQnameSpan.fadeIn(200);
                jQinput.fadeOut(200);
                var attr = jQli[0]._attr;
                if(attr) {
                    attr["name"] = newName;
                }
                jQinput.remove();
                self.selectLINode(li);
            });
            jQinput.val(jQnameSpan.text());
            var jQChildNode =  jQli.find('>ul:first');
            if (jQChildNode.length == 1) {
                jQinput.insertBefore(jQChildNode);
            } else{
                jQli.append(jQinput);
            }
            jQnameSpan.hide();
            menuPanel.hide();
            jQinput.focus();
        };
    },
    deleteNode: function() {
        this.menuPanel.hide();
        var jQli = $(this.currentTreeNode);

        if(jQli.siblings().filter("li").length === 0){
            var jQUl = jQli.parent();
            var jQDiv = jQUl.siblings().filter("div.nodeopen");
            jQDiv.removeClass('nodeopen') ;
            jQUl.remove();
        }else{
            jQli.remove();
        }
		this.selectLINode();
    }
};

function CompileTreeCtrl($scope) {

    $scope.selectNode = function(treePathArr, propsArr) {
        $scope.treePathArr = treePathArr;
        $scope.p = propsArr;
        console.dir(treePathArr);
        console.table(propsArr);
        $scope.$apply();
    };
    var tree = new TreeConfig("new.xml", $scope);

}














