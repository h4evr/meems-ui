/*global define*/
/**
 * A bag for all the pages in a program. Allows to transition between pages.
 *
 * @module meems-ui
 * @submodule pageholder
 * @requires meems-utils
 */
define(["meems-utils", "./widget", "./page"], function (Utils, Widget, Page) {
    "use strict";

    /**
     * @class PageHolder
     * @constructor
     * @extends Widget
     */
    function PageHolder() {
        Widget.apply(this, arguments);

        /**
         * @property $pages
         * @private
         * @type Page[]
         */
        this.$pages = [];

        /**
         * @property $currentPage
         * @private
         * @type Page
         */
        this.$currentPage = null;
        return this;
    }
    
    PageHolder.extend(Widget, {
        /**
         * Getter and setter for all the pages in the bag.
         *
         * @method pages
         * @param {Page[]} [val] Array with the new pages.
         * @chainable
         * @return {Page[]|PageHolder} `this` if called as a setter, the current array of pages otherwise.
         */
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

        /**
         * Getter and setter for the current page.
         *
         * @method currentPage
         * @param {Page} [val] The page to go to.
         * @chainable
         * @return {Page|PageHolder} `this` if called as a setter, the current page otherwise.
         */
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

                return this;
            }
        },

        update : function (structureOnly) {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-page-holder";
            }
            
            if (this.$pages) {
                var page;

                for (var i = 0, len = this.$pages.length; i < len; ++i) {
                    page = this.$pages[i];
                    page.update(structureOnly);

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
