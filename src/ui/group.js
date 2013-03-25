/*global define*/
define(["meems-utils", "./widget"],
/**
 * Enables the grouping of several components in the same view.
 *
 * @module meems-ui
 * @submodule group
 * @requires meems-utils
 */
function (Utils, Widget) {
    "use strict";

    /**
     * @class Group
     * @constructor
     * @extends Widget
     */
    function Group() {
        Widget.apply(this, arguments);

        this.$children = [];
        
        return this;
    }

    Group.extend(Widget, {
        /**
         * Getter and Setter for the children widgets.
         *
         * @method children
         * @param {Widget[]} [val] New array of children.
         * @chainable
         * @return {Widget[]|Group} `this` when used as a setter, the current children otherwise.
         */
        children : function (val) {
            if (val === undefined) {
                return this.$children;
            } else {
                var child, i, ln;

                if (this.$children) {
                    for (i = 0, ln = this.$children.length; i < ln; ++i) {
                        child = this.$children[i];
                        if (child.el().parentNode === this.el()) {
                            this.el().removeChild(child.el());
                        }
                    }
                }

                this.$children = val;

                for (var i = 0, ln = this.$children.length; i < ln; ++i) {
                    child = this.$children[i];

                    if (child.el() && child.el().parentNode !== this.el()) {
                        this.el().appendChild(child.el());
                    }
                }

                return this;
            }
        },

        /**
         * Add a widget to the group.
         *
         * @method appendChild
         * @param {Widget} child The widget to add
         * @chainable
         */
        appendChild : function (child) {
            this.$children.push(child);

            if (this.el()) {
                if (child.el() && child.el().parentNode !== this.el()) {
                    this.el().appendChild(child.el());
                }
            }

            return this;
        },

        /**
         * Remove a widget from the group.
         *
         * @method removeChild
         * @param {Widget} child The widget to remove.
         * @chainable
         */
        removeChild : function (child) {
            Utils.Array.remove(this.$children, child);

            if (this.el()) {
                if (child.el() && child.el().parentNode === this.el()) {
                    this.el().removeChild(child.el());
                }
            }

            return this;
        },

        update : function (structureOnly) {
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-group";
            }

            var child;

            for (var i = 0, ln = this.$children.length; i < ln; ++i) {
                child = this.$children[i];
                child.update(structureOnly);

                if (child.el().parentNode !== this.el()) {
                    this.el().appendChild(child.el());
                }
            }

            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Group;
});
