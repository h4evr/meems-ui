define(["meems-utils", "meems-scroll", "./widget", "./footer", "./button_group", "./button"], 
function(Utils, Scroll, Widget, Footer, ButtonGroup, Button) {    
    function TabGroup() {
        Widget.apply(this, arguments);    
        this._tabs = [];
        this._visibleTab = 0;
        this._scroller = null;
        this._tabHolder = null;
        this._footer = null;
        this._buttonGroup = null;
        return this;
    }
    
    TabGroup.extend(Widget, {
        addTab : function (tab) {
            this._tabs.push(tab);
            return this;
        },
        
        onScrollEnd : function (eventName, x, y) {
            console.log(x, y);
            var page = Math.round(x / this.el().offsetWidth);
            this.visibleTab(page);
            this.update();
        },
        
        visibleTab : function (index) {
            if (index === undefined) {
                return this._visibleTab;
            } else {
                if (index < 0 || index >= this._tabs.length) {
                    return this;
                }
                
                if (index != this._visibleTab && this._scroller) {
                    this._scroller.scrollTo(index * this.el().offsetWidth, 0);
                    this._visibleTab = index;
                }
            
                return this;
            }
        },
        
        tabs : function () {
            return this._tabs;
        },
        
        update : function () {
            Widget.prototype.update.apply(this, arguments); //super
            
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-tab-group";
                this._tabHolder = document.createElement("div");
                this._tabHolder.className = "ui-fill";
                this.el().appendChild(this._tabHolder);
                
                this._scroller = new Scroll(this.el(), {
                    scrollX: true,
                    scrollY: false,
                    bouncing: false,
                    paging: true,
                    totalMaxTime: 0.25,
                    disableTouchEvents : false
                }).on("scroll:end", Utils.bind(TabGroup.prototype.onScrollEnd, this));
                
                this._footer = new Footer();
                this._footer.update();
                this.el().appendChild(this._footer.el());
                
                this._buttonGroup = new ButtonGroup();
                this._buttonGroup.attr("stretch", true);
                this._footer.facet("buttons", this._buttonGroup);
                this._buttonGroup.on("button:pressed", 
                    Utils.bind(function (eventName, btn) {
                        var tabIndex = Utils.indexOfByProp(this._buttonGroup.buttons(), "_el", btn);
                        this.visibleTab(tabIndex);
                        this.update();
                    }, this));
            }
            
            Utils.Dom.addClass(this.el(), "ui-tab-group");
            
            if (this._tabs.length > 0) {
                var tab, btn,
                    tabSize = 100.0 / this._tabs.length;

                this._tabHolder.style.width = this._tabs.length * 100 + "%";
                
                for (var i = 0; i < this._tabs.length; ++i) {
                    tab = this._tabs[i];
                    
                    tab.update();
                    
                    if (tab.el().parentNode !== this._tabHolder) {
                        tab.el().style.position = "absolute";
                        tab.el().style.left = i * tabSize + "%";
                        tab.el().style.top = "0";
                        tab.el().style.width = tabSize + "%";
                        tab.el().style.bottom = "0";
                        this._tabHolder.appendChild(tab.el());
                        this._buttonGroup.addButton((new Button()).attr("style", "vertical"));
                    }
                    
                    btn = this._buttonGroup.buttons()[i];
                    btn.attr("title", tab.attr("title")).attr("icon", tab.attr("icon"))
                       .attr("disabled", this._visibleTab !== i);
                }
                
                this._buttonGroup.attr("selected", this._visibleTab);
                this._footer.el().style.display = "block";
                Utils.Dom.removeClass(this._tabHolder, "ui-footer-off");
            } else {
                this._footer.facet("buttons", null);
                this._footer.el().style.display = "none";
                Utils.Dom.addClass(this._tabHolder, "ui-footer-off");
            }
            
            this._footer.update();
        }
    });
    
    return TabGroup;
});