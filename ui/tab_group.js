define(["meems-utils", "meems-scroll", "./widget", "./footer", "./button_group", "./button"], 
function(Utils, Scroll, Widget, Footer, ButtonGroup, Button) {    
    function TabGroup() {
        Widget.apply(this, arguments);    
        this._tabs = [];
        this._visibleTab = 0;
        this._scroller = null;
        this._tabHolder = null;
        this._buttonGroup = null;
        return this;
    }
    
    function onButtonTapped(eventName, e) {
        var target = e.target;
        while (target && target.className.indexOf("ui-button") === -1) {
            target = target.parentNode;
        }
        
        if (target) {
            var tabIndex = Utils.indexOfByProp(this._buttonGroup.buttons, "_el", target);
            if (tabIndex > -1) {
                this.visibleTab(tabIndex);
            }
        }
    }
    
    TabGroup.extend(Widget, {
        addTab : function (tab) {
            this._tabs.push(tab);
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
                return this._visibleTab;
            } else {
                if (index < 0 || index >= this._tabs.length) {
                    return this;
                }
                
                if (index != this._visibleTab && this._scroller) {
                    this._scroller.scrollTo(index * this.el().offsetWidth);
                    this._visibleTab = index;
                }
            
                return this;
            }
        },
        
        tabs : function () {
            return this._tabs;
        },
        
        update : function () {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-tab-group";
                
                this._tabHolder = document.createElement("div");
                this._helperHolder = document.createElement("div");
                this._buttonGroup = document.createElement("div");
                
                this._tabHolder.className = "ui-fill";
                this._helperHolder.className = "ui-tab-holder ui-fill";
                this._buttonGroup.className = "ui-tab-buttons";
                this._buttonGroup.buttons = [];
                
                this._helperHolder.appendChild(this._tabHolder);
                this.el().appendChild(this._helperHolder);
                
                var position = this.attr("tabPosition") || 'top';
                
                if (position === 'top') {
                    this.el().className += " ui-tab-buttons-top";
                } else {
                    this.el().className += " ui-tab-buttons-bottom";
                }
                
                this.el().appendChild(this._buttonGroup);
            }
            
            if (this._tabs.length > 0) {
                var tab, btn,
                    tabSize = 100.0 / this._tabs.length;
                this._tabHolder.style.width = this._tabs.length * 100 + "%";
                
                for (var i = 0, ln = this._tabs.length; i < ln; ++i) {
                    tab = this._tabs[i];
                    
                    tab.update();
                    
                    if (tab.el().parentNode !== this._tabHolder) {
                        tab.el().style.position = "absolute";
                        tab.el().style.left = i * tabSize + "%";
                        tab.el().style.top = "0";
                        tab.el().style.width = tabSize + "%";
                        tab.el().style.bottom = "0";
                        this._tabHolder.appendChild(tab.el());
                        
                        btn = (new Button()).attr("style", "vertical");
                        btn.update();
                        btn.on("dom:" + (Utils.Dom.supportsTouch() ? "touchstart" : "click"), 
                            Utils.bind(onButtonTapped, this));
                            
                        this._buttonGroup.appendChild(btn.el());
                        this._buttonGroup.buttons.push(btn);
                    }
                    
                    btn = btn || this._buttonGroup.buttons[i];
                    btn.attr("title", tab.attr("title")).attr("icon", tab.attr("icon"))
                       .attr("disabled", this._visibleTab !== i);
                    btn.update();
                    btn.el().style.width = tabSize + "%";
                    
                    if (i == this._visibleTab) {
                        Utils.Dom.addClass(btn.el(), "ui-selected");
                    } else {
                        Utils.Dom.removeClass(btn.el(), "ui-selected");
                    }
                    
                    btn = null;
                }
                
                Utils.Dom.addClass(this._tabHolder, "ui-footer-on");
                
                if (!this._scroller) {
                    this._scroller = new Scroll(this._helperHolder, {
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
                Utils.Dom.addClass(this._tabHolder, "ui-footer-off");
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return TabGroup;
});