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
                        var fieldName = $(childNode).attr('name');
                        var fieldValue = $(childNode).attr('value');
                        if (fieldName && fieldValue) {
                            if (!node._attr) {
                                node._attr = {};
                            }
                            var levelValueArr = fieldValue.split("|");
                            node._attr[fieldName] = levelValue;
//                            for (var i=0; i < 20 ; i++) {
//                                if (!node._attr[i]) {
//                                    node._attr[i] = {};
//                                }
//                                if (levelValue.length == 20) {
//                                    node._attr[i][fieldName] = levelValue[i];
//                                } else{
//                                    node._attr[i][fieldName] = fieldValue;
//                                }
//                            }

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

    makeClickListener: function () {
        return function (evnet) {
            event.stopPropagation();
            event.preventDefault();

            var props = [];
            var fields = {
                area: ["exist", "simplifypixel", "showpixel", "showriverwidth", "shownamerange"],
                line: ["exist", "simlifypixel", "maxanglefilter", "namefilter", "nameblank", "namegroupmargin"],
                point: ["exist", "fontsize", "fontstyle", "iconstyle", "labelorient", "labellevel", "labelmargin", "labelcharspace", "sameclassrange", "sametyperange", "samenamerange"]
            }
            var liObj = this;
            //check which tree
//            var treeName = ...;//
            while (liObj) {
                if (liObj._attr) {
                    for (var level=0 ; level < 20 ; level++) {
                        if(!props[level]){
                            props[level] = {};
                        }
                        var group = fields[treeName];
                        for (var group in fields) {
                            for (var key in fields[group]) {
                                var propName = fields[group][key];
                                if (props[level][propName]) {

                                } else {
                                    if (liObj._attr[level][propName]) {
                                        props[level][propName] = liObj._attr[level][propName];
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
            console.dir(props);

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












