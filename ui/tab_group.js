/*global define*/
define(["meems-utils", "meems-scroll", "./widget", "./footer", "./button_group", "./button"],
function (Utils, Scroll, Widget, Footer, ButtonGroup, Button) {
    "use strict";

    function TabGroup() {
        Widget.apply(this, arguments);
        this.$tabs = [];
        this.$visibleTab = 0;
        this.$scroller = null;
        this.$tabHolder = null;
        this.$buttonGroup = null;
        return this;
    }
    
    var onButtonTapped = function (eventName, e) {
        var target = e.target;
        while (target && target.className.indexOf("ui-button") === -1) {
            target = target.parentNode;
        }
        
        if (target) {
            var tabIndex = Utils.indexOfByProp(this.$buttonGroup.buttons, "$el", target);
            if (tabIndex > -1) {
                this.visibleTab(tabIndex);
            }
        }
    };
    
    TabGroup.extend(Widget, {
        addTab : function (tab) {
            this.$tabs.push(tab);
            return this;
        },
        
        onScrollEnd : function (eventName, x, y) {
            var page = Math.round(x / this.el().offsetWidth);
            this.visibleTab(page);
            this.update();
            Utils.Dom.applyChanges();
        },
        
        visibleTab : function (index) {
            if (index === undefined) {
                return this.$visibleTab;
            } else {
                if (index < 0 || index >= this.$tabs.length) {
                    return this;
                }
                
                if (index !== this.$visibleTab && this.$scroller) {
                    this.$scroller.scrollTo(index * this.el().offsetWidth);
                    this.$visibleTab = index;
                }
            
                return this;
            }
        },
        
        tabs : function () {
            return this.$tabs;
        },

        partialUpdate : function (attrName, oldValue, newValue) {
            if (attrName === 'tabPosition' && this.el()) {
                Utils.Dom.removeClass(this.el(), "ui-tab-buttons-" + oldValue);
                Utils.Dom.addClass(this.el(), "ui-tab-buttons-" + newValue);
            }
        },
        
        update : function () {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-tab-group";
                
                this.$tabHolder = document.createElement("div");
                this.$helperHolder = document.createElement("div");
                this.$buttonGroup = document.createElement("div");
                
                this.$tabHolder.className = "ui-fill";
                this.$helperHolder.className = "ui-tab-holder ui-fill";
                this.$buttonGroup.className = "ui-tab-buttons";
                this.$buttonGroup.buttons = [];
                
                this.$helperHolder.appendChild(this.$tabHolder);
                this.el().appendChild(this.$helperHolder);
                
                var position = this.attr("tabPosition") || 'top';
                
                if (position === 'top') {
                    this.el().className += " ui-tab-buttons-top";
                } else {
                    this.el().className += " ui-tab-buttons-bottom";
                }
                
                this.el().appendChild(this.$buttonGroup);
            }
            
            if (this.$tabs.length > 0) {
                var tab, btn,
                    tabSize = 100.0 / this.$tabs.length;
                this.$tabHolder.style.width = this.$tabs.length * 100 + "%";
                
                for (var i = 0, ln = this.$tabs.length; i < ln; ++i) {
                    tab = this.$tabs[i];
                    
                    tab.update();
                    
                    if (tab.el().parentNode !== this.$tabHolder) {
                        tab.el().style.position = "absolute";
                        tab.el().style.left = i * tabSize + "%";
                        tab.el().style.top = "0";
                        tab.el().style.width = tabSize + "%";
                        tab.el().style.bottom = "0";
                        this.$tabHolder.appendChild(tab.el());
                        
                        btn = (new Button()).attr("style", "vertical");
                        btn.update();
                        btn.on("dom:" + (Utils.Dom.supportsTouch() ? "touchstart" : "click"),
                            Utils.bind(onButtonTapped, this));
                            
                        this.$buttonGroup.appendChild(btn.el());
                        this.$buttonGroup.buttons.push(btn);
                    }
                    
                    btn = btn || this.$buttonGroup.buttons[i];
                    btn.attr("title", tab.attr("title")).attr("icon", tab.attr("icon"))
                       .attr("disabled", this.$visibleTab !== i);
                    btn.update();
                    btn.el().style.width = tabSize + "%";
                    
                    if (i === this.$visibleTab) {
                        Utils.Dom.addClass(btn.el(), "ui-selected");
                    } else {
                        Utils.Dom.removeClass(btn.el(), "ui-selected");
                    }
                    
                    btn = null;
                }
                
                Utils.Dom.addClass(this.$tabHolder, "ui-footer-on");
                
                if (!this.$scroller) {
                    this.$scroller = new Scroll(this.$helperHolder, {
                        scrollX: true,
                        scrollY: false,
                        bouncing: false,
                        paging: true,
                        totalMaxTime: 0.25,
                        disableTouchEvents : false,
                        hideScroller : true
                    }).on("scroll:end", Utils.bind(TabGroup.prototype.onScrollEnd, this));
                }
            } else {
                Utils.Dom.addClass(this.$tabHolder, "ui-footer-off");
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return TabGroup;
});
