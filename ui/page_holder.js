/*global define*/
define(["meems-utils", "./widget"], function (Utils, Widget) {
    "use strict";

    function PageHolder() {
        Widget.apply(this, arguments);
        this.$pages = [];
        this.$currentPage = null;
        return this;
    }
    
    PageHolder.extend(Widget, {
        pages : function (val) {
            if (val === undefined) {
                return this.$pages;
            } else {
                var page, i, len;

                if (this.$pages) {
                    for (i = 0, len = this.$pages.length; i < len; ++i) {
                        page = this.$pages[i];
                        if (page.el() && page.el().parentNode === this.el()) {
                            this.el().removeChild(page.el());
                        }
                    }
                }

                this.$pages = val;
                
                if (this.$pages) {
                    for (i = 0, len = this.$pages.length; i < len; ++i) {
                        page = this.$pages[i];
                        if (page.el() && page.el().parentNode !== this.el()) {
                            this.el().appendChild(page.el());
                        }
                    }
                }

                return this;
            }
        },

        currentPage : function (val) {
            if (val === undefined) {
                return this.$currentPage;
            } else {
                if (this.$currentPage) {
                    Utils.Dom.removeClass(this.$currentPage.el(), "ui-show");
                    Utils.Dom.addClass(this.$currentPage.el(), "ui-hide");
                }

                this.$currentPage = val;

                if (this.$currentPage) {
                    Utils.Dom.removeClass(this.$currentPage.el(), "ui-hide");
                    Utils.Dom.addClass(this.$currentPage.el(), "ui-show");
                }
            }
        },

        update : function () {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-page-holder";
            }
            
            if (this.$pages) {
                var page;

                for (var i = 0, len = this.$pages.length; i < len; ++i) {
                    page = this.$pages[i];
                    page.update();

                    if (page.el() && page.el().parentNode !== this.el()) {
                        this.el().appendChild(page.el());
                    }

                    if (!this.$currentPage) {
                        this.$currentPage = page;
                    }
                    
                    if (page.el()) {
                        if (this.$currentPage === page) {
                            Utils.Dom.removeClass(this.$currentPage.el(), "ui-hide");
                            Utils.Dom.addClass(this.$currentPage.el(), "ui-show");
                        } else {
                            Utils.Dom.addClass(page.el(), "ui-hide");
                            Utils.Dom.removeClass(page.el(), "ui-show");
                        }
                    }
                }
            }

            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return PageHolder;
});
