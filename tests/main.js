function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

function getTheme() {
    var m;
    
    if ((m = /theme=(\w+)/.exec(window.location.search))) {
        return m[1];
    }
    
    return null;
}

var theme = getTheme() || 'android';
loadCss("../themes/" + theme + "/ui.css");
loadCss("../themes/" + theme + "/icons.css");

require.config({
    paths: {
        "meems-utils": "../lib/meems-utils/meems-utils",
        "meems-events": "../lib/meems-events/meems-events",
        "meems-scroll": "../lib/meems-scroll/meems-scroll"
    }
});

require(["../meems-ui", "meems-utils", "meems-scroll", "meems-events"], function (UI, Utils, Scroll, Events) {
    //Utils.Dom.fixedViewport();
    
    var page1 = UI.create("page");
    
    var buttonExplore = UI.create("button").attr("title", "Explore").attr("icon", "explore");
    
    var header = UI.create("header").attr("title", "Thesis - Meems Library")
                    .facet("buttonsleft", UI.create("buttongroup").addButton(buttonExplore));
                    //.facet("buttonsright", UI.create("buttongroup").addButton(UI.create("button").attr("title", "Right")));

    var tab1 = UI.create("tab").
        attr("title", "Thesis").
        attr("icon", "facebook").
        facet("content", 
        UI.create("list").items([
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Introduction")).header(true),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Context")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Motivation and Goals")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Structure")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "State of Art")).header(true),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "What are smartphones?")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Operating systems")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Approaches in mobile development")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Publishing applications")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "HTML5, Javascript and CSS3")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Frameworks for developing mobile web applications")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Analysis of the problem at hand")).header(true),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Conclusions")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "")).header(true),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Conclusions and Future Work")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Future Work")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "")).header(true),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "References"))
        ]).style('full'));
    
    var tab2 = UI.create("tab").
        attr("title", "Teste").
        attr("icon", "facebook").
        facet("content", 
        UI.create("list").items([
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Introduction")).header(true),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Context")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Motivation and Goals")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Structure")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "State of Art")).header(true),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "What are smartphones?")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Operating systems")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Approaches in mobile development")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Publishing applications")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "HTML5, Javascript and CSS3")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Frameworks for developing mobile web applications")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Analysis of the problem at hand")).header(true),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Conclusions")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "")).header(true),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Conclusions and Future Work")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Future Work")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "")).header(true),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "References"))
        ]).style('normal'));
        
    var tab3 = UI.create("tab").
        attr("title", "Form").
        attr("icon", "facebook").
        facet("content", 
        UI.create("form").attr("title", "Form Demo").fields([
            UI.create("textfield").attr("label", "First Name"),
            UI.create("textfield").attr("label", "Last Name"),
            UI.create("textfield").attr("label", "Birthdate").attr("type", "date"),
            UI.create("textfield").attr("label", "Email").attr("type", "email"),
            UI.create("textfield").attr("label", "Phone Number").attr("type", "tel"),
            UI.create("textfield").attr("label", "Notes")
        ]));
    
    var content = UI.create("tabgroup").attr("tabPosition", theme === 'ios' ? 'bottom' : 'top')
                .addTab(tab1).addTab(tab2).addTab(tab3);
    
    page1.facet("header", header);
    page1.facet("content", content);
    //page1.facet("footer", footer);
    
    var pageAside = UI.create("page")
        .facet("header", UI.create("header").attr("title", "Menu"))
        .facet("content", UI.create("list").items([
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Home")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Page 1")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Page 2")),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Page 3"))
        ]));
        
    var aside = UI.create("aside").facet("content", page1).facet("menu", pageAside);
    
    aside.update();
    Utils.Dom.applyChanges();
    
    var eventClick = 'dom:' + ('ontouchstart' in document ? 'touchstart' : 'click');
    
    buttonExplore.on(eventClick, function() {
        aside.expanded(!aside.expanded());
        Utils.Dom.applyChanges();
    });
    
    Events.Dom.on(window, 'resize', Scroll.updateAll);
    document.body.appendChild(aside.el());
    Scroll.updateAll();
});