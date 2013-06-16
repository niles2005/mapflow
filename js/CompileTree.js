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
                            node._attr[fieldName] = fieldValue;
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
                        jli.css('cursor','pointer');
                    } else{
                        jli.css('cursor','default');
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

            var props = {};
            var fields = ["exist", "simplifypixel", "showpixel", "showriverwidth", "shownamerange"];
            var liObj = this;
            while (liObj) {
                if (liObj._attr) {
                    for (var k in fields) {
                        var propName = fields[k];
                        if (props[propName]) {

                        } else {
                            if (liObj._attr[propName]) {
                                props[propName] = liObj._attr[propName];
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












