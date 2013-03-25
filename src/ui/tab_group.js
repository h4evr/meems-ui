/*global define*/
/**
 * Groups several tabs and allows to change between them.
 *
 * @module meems-ui
 * @submodule tabgroup
 * @requires meems-utils
 * @requires meems-scroll
 * @requires meems-ui/button
 * @requires meems-ui/buttongroup
 */
define(["meems-utils", "meems-scroll", "./widget", "./tab", "./button_group", "./button"],
function (Utils, Scroll, Widget, Tab, ButtonGroup, Button) {
    "use strict";

    /**
     * @class TabGroup
     * @constructor
     * @extends Widget
     */
    function TabGroup() {
        Widget.apply(this, arguments);
        /**
         * @property $tabs
         * @private
         * @type {Tab[]}
         */
        this.$tabs = [];

        /**
         * @property $visibleTab
         * @private
         * @type {number}
         */
        this.$visibleTab = 0;

        /**
         * @property $scroller
         * @private
         * @type {Scroll}
         */
        this.$scroller = null;
        /**
         * @property $tabHolder
         * @private
         * @type {HTMLElement}
         */
        this.$tabHolder = null;

        /**
         * @property $buttonGroup
         * @private
         * @type {ButtonGroup}
         */
        this.$buttonGroup = null;
        return this;
    }
    
    var onButtonTapped = function (eventName, e) {
        var target = e.target;
        while (target && target.className.indexOf("ui-button") === -1) {
            target = target.parentNode;
        }
        
        if (target) {
            var tabIndex = Utils.Array.indexOfByProp(this.$buttonGroup.buttons, "$el", target);
            if (tabIndex > -1) {
                this.visibleTab(tabIndex);
            }
        }
    };

    var onScrollEnd = function (eventName, x) {
        var page = Math.round(x / this.el().offsetWidth);
        this.visibleTab(page);
        this.update();
        Utils.Dom.applyChanges();
    };
    
    TabGroup.extend(Widget, {
        /**
         * Adds a new tab to the group.
         *
         * @method addTab
         * @param {Tab} tab The new tab to add.
         * @chainable
         */
        addTab : function (tab) {
            this.$tabs.push(tab);
            return this;
        },

        /**
         * Getter and setter for the visible page.
         *
         * @method visibleTab
         * @param {Number} [index] Position of page in the array.
         * @return {Number|TabGroup} `this` if called as a setter, the current page if called as getter.
         */
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

        /**
         * Getter for all the tabs.
         *
         * @method tabs
         * @return {Tab[]} The array to tabs.
         */
        tabs : function () {
            return this.$tabs;
        },

        partialUpdate : function (attrName, oldValue, newValue) {
            if (attrName === 'tabPosition' && this.el()) {
                Utils.Dom.removeClass(this.el(), "ui-tab-buttons-" + oldValue);
                Utils.Dom.addClass(this.el(), "ui-tab-buttons-" + newValue);
            }
        },
        
        update : function (structureOnly) {
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
                    
                    tab.update(structureOnly);
                    
                    if (tab.el().parentNode !== this.$tabHolder) {
                        tab.el().style.position = "absolute";
                        tab.el().style.left = i * tabSize + "%";
                        tab.el().style.top = "0";
                        tab.el().style.width = tabSize + "%";
                        tab.el().style.bottom = "0";
                        this.$tabHolder.appendChild(tab.el());
                        
                        btn = (new Button()).attr("style", "vertical");
                        btn.update(structureOnly);
                        btn.on("dom:" + (Utils.Dom.supportsTouch() ? "touchstart" : "click"),
                            Utils.Fn.bind(onButtonTapped, this));
                            
                        this.$buttonGroup.appendChild(btn.el());
                        this.$buttonGroup.buttons.push(btn);
                    }
                    
                    btn = btn || this.$buttonGroup.buttons[i];
                    btn.attr("title", tab.attr("title")).attr("icon", tab.attr("icon"))
                       .attr("disabled", this.$visibleTab !== i);
                    btn.update(structureOnly);
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
                    }).on("scroll:end", Utils.Fn.bind(onScrollEnd, this));
                }
            } else {
                Utils.Dom.addClass(this.$tabHolder, "ui-footer-off");
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return TabGroup;
});
