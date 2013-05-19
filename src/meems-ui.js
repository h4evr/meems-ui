/*global define*/
/**
 * Provides all Meems UI components.
 * Factory module, allows the user to create any UI widget through a single method.
 *
 * @module meems-ui
 * @requires observable
 */
define(["./observable",
        "./ui/widget",
        "./ui/header",
        "./ui/footer",
        "./ui/page",
        "./ui/html",
        "./ui/button",
        "./ui/button_group",
        "./ui/list",
        "./ui/aside",
        "./ui/split_view",
        "./ui/tab_group",
        "./ui/tab",
        "./ui/form",
        "./ui/textfield",
        "./ui/page_holder",
        "./ui/group",
        "./ui/switch",
        "./ui/slider",
        "./ui/popup_menu"],
function (Observable, Widget, Header, Footer, Page,
          Html, Button, ButtonGroup, List,
          Aside, SplitView, TabGroup, Tab, Form,
          TextField, PageHolder, Group, Switch, Slider, PopupMenu) {
    "use strict";

    /*
     * All available widget types.
     */
    var factories = {
        "header"     : Header,
        "footer"     : Footer,
        "page"       : Page,
        "html"       : Html,
        "button"     : Button,
        "buttongroup": ButtonGroup,
        "list"       : List,
        "aside"      : Aside,
        "splitview"  : SplitView,
        "tabgroup"   : TabGroup,
        "tab"        : Tab,
        "form"       : Form,
        "textfield"  : TextField,
        "pageholder" : PageHolder,
        "group"      : Group,
        "switch"     : Switch,
        "slider"     : Slider,
        "popupmenu"  : PopupMenu
    };

    /**
     * @class meems-ui
     */
    var UI = {
        /**
         * Creates a new widget.
         *
         * @method create
         * @static
         * @param {String} type The name of the type of widget to create.
         * @param {Widget} [parent] Registers the created widget as child of the given parent.
         * @return {mixed} The widget, or null in case of error.
         */
        create : function (type, parent) {
            var obj = factories[type] ? new factories[type]() : null;

            if (obj && parent) {
                obj.parent(parent);
            }

            return obj;
        },

        /**
         * Register a new type of widget.
         *
         * @method registerWidget
         * @param {String} name The name that will be used to identify this type of widget.
         * @param {Function} constructor The widget constructor.
         */
        registerWidget : function (name, constructor) {
            factories[name] = constructor;
        }
    };
    
    return UI;
});
