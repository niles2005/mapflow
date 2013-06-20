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
    makeTreeItem: function(node, groupName, childNodes) {
        function addHover(event) {
            $(this).addClass("nodeHover");
        }

        function removeHover(event) {
            $(this).removeClass("nodeHover");
        }
        if (childNodes.length > 0) {
            var jul = $('<ul>');
            if (node instanceof jQuery) {
                jul.addClass(this._treeName);
            }

            for (var k in childNodes) {
                var childNode = childNodes[k];
                if (childNode.nodeType === 1) {
                    var strName = $(childNode).attr('name');
                    var tagName = childNode.tagName;
                    if (tagName === 'group') {
                        currGroupName = strName;
                    } else if (tagName === 'define') {
                        continue;
                    } else if (tagName === 'field') {
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

                    var jli = $('<li><div></div><span class=' + tagName + '></span></li>');
                    var elementName = $(childNode).attr('name');
                    jli.find(">span").text(elementName);
                    jli.find('>span').hover(addHover,removeHover);
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
                        if (node instanceof jQuery) {
                            jli.find('>div').addClass('nodeopen');
                        } else {
                            subUL.children().hide();
                            jli.find('>div').addClass('nodeclosed');
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

    listPathNames: function (node,arr) {
        if(!node) {
            return arr;
        }
        if(node._attr) {
            arr.unshift(node._attr["name"]);
        } else {
            return arr;
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
            event.stopPropagation();
            event.preventDefault();


            var props = [];
            var liObj = this;
            var groupName = liObj._attr["groupName"];

            var treePathArr = self.listPathNames(liObj,[]);
            while (liObj) {
                if (liObj._attr) {
                    for (var level = 0; level < 20; level++) {
                        if (!props[level]) {
                            props[level] = {};
                        }

                        for (var key in propsMap[groupName]) {
                            var propName = propsMap[groupName][key];
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
                self._scope.selectNode(treePathArr,props);
            }

            var jli = $(this);
            var jul = jli.find('>ul');
            if (jul.length > 0) {
                var jdiv = jli.find('>div');
                if (jdiv.hasClass('nodeopen')) {
                    if (event.target instanceof HTMLDivElement) {//点击+/-才可以展开/关闭树，点击内容部分不能关闭，可以打开，参考windows目录
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
    }
};

var propsMap = {
    area: ["exist", "simplifypixel", "showpixel", "showriverwidth", "shownamerange"],
    line: ["exist", "simlifypixel", "maxanglefilter", "namefilter", "nameblank", "namegroupmargin"],
    point: ["exist", "fontsize", "fontstyle", "iconstyle", "labelorient", "labellevel", "labelmargin", "labelcharspace", "sameclassrange", "sametyperange", "samenamerange"]
};

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














