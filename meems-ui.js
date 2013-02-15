define(["./ui/widget", "./ui/header", "./ui/footer", "./ui/page", "./ui/html"], function (Widget, Header, Footer, Page, Html) {
    var factories = {
        "header": Header,
        "footer": Footer,
        "page": Page,
        "html": Html
    };
    
    var UI = {
        create : function (type) {
            return factories[type] ? new factories[type]() : null;
        }
    };
    
    return UI;
});