define(["./ui/widget", 
        "./ui/header", 
        "./ui/footer", 
        "./ui/page", 
        "./ui/html", 
        "./ui/button", 
        "./ui/button_group",
        "./ui/list_item",
        "./ui/list",
        "./ui/aside",
        "./ui/split_view"], 
function (Widget, Header, Footer, Page, Html, Button, ButtonGroup, ListItem, List, Aside, SplitView) {
    var factories = {
        "header": Header,
        "footer": Footer,
        "page": Page,
        "html": Html,
        "button": Button,
        "buttongroup": ButtonGroup,
        "list": List,
        "listitem": ListItem,
        "aside": Aside,
        "splitview": SplitView
    };
    
    var UI = {
        create : function (type) {
            return factories[type] ? new factories[type]() : null;
        }
    };
    
    return UI;
});