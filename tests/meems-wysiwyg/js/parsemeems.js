/*global Meems CodeMirror*/


function parseMeemsUi(txt, ids) {
    "use strict";

    var json;
    
    try {
        json = eval('(' + txt + ')');
    } catch (e) {
        return null;
    }

    if (!json) {
        return null;
    }

    var processWidget = function (node) {
        var k, i, len;

        if (!node) {
            return null;
        }

        if (typeof(node) === 'function') {
            return node;
        }

        if (node.type === undefined) {
            if (typeof(node) === 'object') {
                for (k in node) {
                    if (node.hasOwnProperty(k)) {
                        node[k] = processWidget(node[k]);
                    }
                }
            }

            return node;
        }

        if (node.length !== undefined) {
            for (i = 0, len = node.length; i < len; ++i) {
                node[i] = processWidget(node[i]);
            }
            return node;
        }

        var widget = Meems.UI.create(node.type);
        if (!widget) {
            return null;
        }

        for (k in node) {
            if (k === 'type') {
                continue;
            } else if (k === 'facets') {
                for (i in node[k]) {
                    if (node[k].hasOwnProperty(i)) {
                        widget.facet(i, processWidget(node[k][i]));
                    }
                }
            } else if (k === 'on') {
                for (i in node[k]) {
                    if (node[k].hasOwnProperty(i)) {
                        widget.on(i, node[k][i]);
                    }
                }
            } else if (node.hasOwnProperty(k)) {
                if (typeof(widget[k]) === 'function') {
                    widget[k].call(widget, processWidget(node[k]));
                } else {
                    widget.attr(k, processWidget(node[k]));
                }
            }
        }

        if (node.id !== undefined) {
            ids[node.id] = widget;
        }

        return widget;
    };

    return processWidget(json);
}

