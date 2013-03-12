/*global define*/
define(["./observable",
        "./ui/widget",
        "./ui/header",
        "./ui/footer",
        "./ui/page",
        "./ui/html",
        "./ui/button",
        "./ui/button_group",
        "./ui/list_item",
        "./ui/list",
        "./ui/aside",
        "./ui/split_view",
        "./ui/tab_group",
        "./ui/tab",
        "./ui/form",
        "./ui/textfield",
        "./ui/page_holder"],
function (Observable, Widget, Header, Footer, Page,
          Html, Button, ButtonGroup, ListItem, List,
          Aside, SplitView, TabGroup, Tab, Form,
          TextField, PageHolder) {
    "use strict";

    var factories = {
        "header"     : Header,
        "footer"     : Footer,
        "page"       : Page,
        "html"       : Html,
        "button"     : Button,
        "buttongroup": ButtonGroup,
        "list"       : List,
        "listitem"   : ListItem,
        "aside"      : Aside,
        "splitview"  : SplitView,
        "tabgroup"   : TabGroup,
        "tab"        : Tab,
        "form"       : Form,
        "textfield"  : TextField,
        "pageholder" : PageHolder
    };
    
    var UI = {
        create : function (type, parent) {
            var obj = factories[type] ? new factories[type]() : null;

            if (obj && parent) {
                obj.parent(parent);
            }

            return obj;
        }
    };
    
    return UI;
});
