'use strict';

function TreeConfig(configFile) {
    this._div = document.createElement("div");
    if (configFile && typeof configFile == 'string') {
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
                    var tagName = childNode.tagName;
                    if (tagName && tagName === 'define') {
                        continue;
                    } else if (tagName && tagName === 'field') {
                        var strName = $(childNode).attr('name');
                        var strValue = $(childNode).attr('value');
                        if (strName && strValue) {
                            if (!node._attr) {
                                node._attr = {};
                            }
                            var groupName = this.getGroup(childNode);
                            node._attr['group'] = groupName;
                            node._attr[strName] = strValue.split("|");
                            console.dir(node._attr);
                        }
                        continue;
                    }

                    var jli = $('<li><div></div><span class=' + tagName + '></span></li>');
                    var elementName = $(childNode).attr('name');
                    jli.find(">span").text(elementName);
                    var li = jli[0];
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

    getGroup: function (node) {
        var tagName = node.tagName;
        if (tagName && tagName === 'group') {
            return $(node).attr('name');
        } else if (node.parentElement) {
            return this.getGroup(node.parentElement);
        } else {
            return null;
        }

    },

    makeClickListener: function () {
        return function (evnet) {
            event.stopPropagation();
            event.preventDefault();

            var props = [];
            var liObj = this;
            //check which tree
//            var treeName = ...;//
            while (liObj) {
                if (liObj._attr) {
                    for (var level = 0; level < 20; level++) {
                        if (!props[level]) {
                            props[level] = {};
                        }

                        var group = liObj._attr['group'];
                        if (group) {
                            for (var key in propsMap[group]) {
                                var propName = propsMap[group][key];
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
            levelPropsArr = props;
            angular.element($(this).get(0)).scope().getProps();
            console.dir(angular.element($(this).get(0)).scope().p);
//            Document.MY_SCOPE.getProps();


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
        }
    }
}

var levelPropsArr = [];
var propsMap = {
    area: ["exist", "simplifypixel", "showpixel", "showriverwidth", "shownamerange"],
    line: ["exist", "simlifypixel", "maxanglefilter", "namefilter", "nameblank", "namegroupmargin"],
    point: ["exist", "fontsize", "fontstyle", "iconstyle", "labelorient", "labellevel", "labelmargin", "labelcharspace", "sameclassrange", "sametyperange", "samenamerange"]
}

function CompileTreeCtrl($scope) {
//    Document.MY_SCOPE = $scope ;
    $scope.p = [];
    $scope.getProps = function () {
        $scope.p = levelPropsArr;
    };

}














