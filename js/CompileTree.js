'use strict';

function TreeConfig(configFile,scope) {
    this._scope = scope;
    this._div = document.createElement("div");
    if (configFile && typeof configFile === 'string') {
        this._div.id = configFile;
    }
    this.url = configFile;
    this._div.className = "treepanel";
    this._div.style.width = "100%";
    this._div.style.height = "100%";
    this._div.style.position = "relative";
    this._xmlName = null;
    this._rootUL = null;
    this._clickListener = this.makeClickListener();
}
var currGroupName = null;

TreeConfig.prototype = {
    loadContent: function () {
        if (this.url) {
            $(this._div).empty();
            this.loadXMLFile(this.url, this.loadXmlDoc, this);
        }
    },
    loadXMLFile: function (url, listener, caller) {
        $.ajax({
            url: url,
            dataType: "xml",
            cache: false,
            success: function () {
                listener.apply(caller, arguments);
            }
        });
    },
    loadXmlDoc: function (xmlDoc) {
        var doc = xmlDoc.childNodes[0];
        this._xmlName = doc.tagName;
        this._treeName = "tree_mapstyle";
        var arr = doc.childNodes;
        this.makeTreeItem(this._div, arr);
    },

    makeTreeItem: function (node, childNodes) {
        if (childNodes.length > 0) {
            var jul = $('<ul>');
            if (node instanceof HTMLDivElement) {
                this._rootUL = jul.get(0);
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
                                node._attr[strName] = strValue.split("|");
                            }
                        }
                        continue;
                    }

                    var jli = $('<li><div></div><span class=' + tagName + '></span></li>');
                    var elementName = $(childNode).attr('name');
                    jli.find('>span').text(elementName).hover(addHover,removeHover);
                    var li = jli[0];
                    li._attr = {};
                    li._attr["groupName"] = currGroupName;
                    li._attr["name"] = elementName;
                    li.onclick = this._clickListener;
                    jul.append(jli);

                    if (childNode.childNodes.length > 0) {
                        this.makeTreeItem(li, childNode.childNodes);
                    }
                    var subUL = jli.find('>ul');
                    if (subUL.length > 0) {//有子节点
                        subUL.children().hide();
                        jli.find('>div').addClass('nodeclosed');
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
        return function (event) {
            event.stopPropagation();
            event.preventDefault();

            var props = [];
            var liObj = this;

            var groupName = null;
            if(liObj._attr) {
                groupName =  liObj._attr["groupName"];
            }
            var treePathArr = self.listPathNames(liObj,[]);
            while (liObj) {
                if (liObj._attr) {
                    for (var level = 0; level < 20; level++) {
                        if (!props[level]) {
                            props[level] = {};
                        }

                        if (groupName) {
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
                    jdiv.removeClass('nodeopen');
                    jdiv.addClass('nodeclosed');
                    jul.children().slideUp('slow');
                } else {
                    jdiv.removeClass('nodeclosed');
                    jdiv.addClass('nodeopen');
                    jul.children().slideDown('slow');
                }
            }
        };
    }
};

function addHover(event) {
    $(this).addClass("hover");
}

function removeHover(event) {
    $(this).removeClass("hover");
}

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

    var treeDiv = document.getElementById("tree");
    var tree = new TreeConfig("new.xml",$scope);
    treeDiv.appendChild(tree._div);
    tree.loadContent();

}


         











