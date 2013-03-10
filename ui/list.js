/*global define*/
define(["mustache", "meems-utils", "meems-events", "./widget", "./list_item", "./html"], function (Mustache, Utils, Events, Widget, ListItem, Html) {
    "use strict";

    function List() {
        Widget.apply(this, arguments);
        this.$generatedItems = [];
        this.$items = [];
        this.$style = 'normal';
        this.$template = "{{text}}";
        this.$compiledTemplate = Mustache.compile(this.$template);
        this.$headerTemplate = "{{text}}";
        this.$headerCompiledTemplate = Mustache.compile(this.$template);
        return this;
    }
    
    List.extend(Widget, {
        onItemClicked : function (eventName, e) {
            var target = e.target;

            while(target && target._meems_item_index === undefined) {
                target = target.parentNode;
            }

            if (target) {
                this.fire("item:clicked", this.$items[target._meems_item_index]);
            }
        },

        template : function (val) {
            if (val === undefined) {
                return this.$template;
            } else {
                this.$template = val;
                this.$compiledTemplate = Mustache.compile(val);
            }

            return this;
        },

        headerTemplate : function (val) {
            if (val === undefined) {
                return this.$headerTemplate;
            } else {
                this.$headerTemplate = val;
                this.$headerCompiledTemplate = Mustache.compile(val);
            }

            return this;
        },

        style : function (val) {
            if (val === undefined) {
                return this.$style;
            } else {
                if (this.el() && this.$style) {
                    Utils.Dom.removeClass(this.el(), "ui-list-" +  this.$style);
                }
                
                this.$style = val;
                
                if (this.el() && this.$style) {
                    Utils.Dom.addClass(this.el(), "ui-list-" +  this.$style);
                }
                
                return this;
            }
        },
        
        items: function (items) {
            if (items === undefined) {
                return this.$items;
            } else {
                var item, curItem, i, ln, el = this.el();

                if (this.$generatedItems && el) {
                    for (i = 0, ln = this.$generatedItems.length; i < ln; ++i) {
                        item = this.$generatedItems[i];
                        if (item.el()) {
                            el.removeChild(item.el());
                        }
                    }
                }

                this.$items = items;

                if (this.$items && el) {
                    this.$generatedItems = [];

                    for (i = 0, ln = this.$items.length; i < ln; ++i) {
                        curItem = this.$items[i];

                        item = new ListItem();
                        item.header(curItem.header === true);

                        if (this.$headerCompiledTemplate && item.header()) {
                            item.facet("item", (new Html()).attr("html", this.$headerCompiledTemplate(curItem)));
                        } else {
                            item.facet("item", (new Html()).attr("html", this.$compiledTemplate(curItem)));
                        }

                        item.update();

                        if (!item.header()) {
                            if (i < ln - 1) {
                                if (this.$items[i + 1].header === true) {
                                    Utils.Dom.addClass(item.el(), "ui-list-item-last");
                                } else {
                                    Utils.Dom.removeClass(item.el(), "ui-list-item-last");
                                }
                            } else {
                                Utils.Dom.addClass(item.el(), "ui-list-item-last");
                            }
                        }

                        item.el()._meems_parentList = this;
                        item.el()._meems_item_index = i;

                        el.appendChild(item.el());

                        this.$generatedItems.push(item);
                    }
                }

                return this;
            }
        },
        
        update : function () {
            if (!this.el()) {
                this.el(document.createElement("ul"));
                this.el().className =  "ui-list";
                this.on("dom:" + Events.touchEndEventName, Utils.bind(this.onItemClicked, this));
            }
            
            this.style(this.$style);
            this.items(this.$items);
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return List;
});
