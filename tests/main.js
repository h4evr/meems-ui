function loadCss(url) {
    "use strict";
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

function getTheme() {
    "use strict";

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
    "use strict";

    var eventClick = 'dom:' + ('ontouchstart' in document ? 'touchstart' : 'click'),
        
        aside = UI.create("aside"),
        
        page1 = UI.create("page").facet("header",
        UI.create("header")
            .attr("title", "Thesis - Meems Library")
            .facet("buttonsleft",
                UI.create("buttongroup")
                .addButton(UI.create("button")
                    .attr("title", "Explore")
                    .attr("icon", "explore")
                    .on(eventClick, function () {
                        aside.expanded(!aside.expanded());
                        Utils.Dom.applyChanges();
                    }))));

    var tab1 = UI.create("tab").attr("title", "Thesis").attr("icon", "facebook").facet("content",
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
        ]).style('full')),
    
    tab2 = UI.create("tab").attr("title", "Teste").attr("icon", "facebook").facet("content",
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
        ]).style('normal')),

    tab3 = UI.create("tab").attr("title", "Form").attr("icon", "facebook").facet("content",
        UI.create("form").attr("title", "Form Demo").fields([
            UI.create("textfield").attr("label", "First Name"),
            UI.create("textfield").attr("label", "Last Name"),
            UI.create("textfield").attr("label", "Birthdate").attr("type", "date"),
            UI.create("textfield").attr("label", "Email").attr("type", "email"),
            UI.create("textfield").attr("label", "Phone").attr("type", "tel"),
            UI.create("textfield").attr("label", "Notes")
        ])),
    
    page2 = UI.create("page")
        .facet("content", UI.create("list").items([
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Segundo ecra!"))
        ]))
        .facet("header", UI.create("header")
            .attr("title", "Thesis - Page 2")
            .facet("buttonsleft", UI.create("buttongroup")
                .addButton(UI.create("button")
                    .attr("title", "Explore")
                    .attr("icon", "explore")
                    .on(eventClick, function () {
                        aside.expanded(!aside.expanded());
                        Utils.Dom.applyChanges();
                    })))),
    
    page3 = UI.create("page")
        .facet("content", UI.create("list").items([
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Terceiro ecra!"))
        ]))
        .facet("header", UI.create("header")
            .attr("title", "Thesis - Page 3")
            .facet("buttonsleft", UI.create("buttongroup")
                .addButton(UI.create("button")
                    .attr("title", "Explore")
                    .attr("icon", "explore")
                    .on(eventClick, function () {
                        aside.expanded(!aside.expanded());
                        Utils.Dom.applyChanges();
                    })))),
    
    pageAside = UI.create("page")
        .facet("header", UI.create("header").attr("title", "Menu"))
        .facet("content", UI.create("list").items([
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Home"))
                .on(eventClick, function () {
                    aside.expanded(false);
                    pageHolder.currentPage(page1);
                    Utils.Dom.applyChanges();
                }),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Page 1"))
                .on(eventClick, function () {
                    aside.expanded(false);
                    pageHolder.currentPage(page2);
                    Utils.Dom.applyChanges();
                }),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Page 2"))
                .on(eventClick, function () {
                    aside.expanded(false);
                    pageHolder.currentPage(page3);
                    Utils.Dom.applyChanges();
                }),
            UI.create("listitem").facet("item", UI.create("html").attr("html", "Page 3"))
        ]).style('full')),

    pageHolder = UI.create("pageholder").pages([ page1, page2, page3 ]);

    page1.facet("content", UI.create("tabgroup")
        .attr("tabPosition", theme === 'ios' ? 'bottom' : 'top')
        .addTab(tab1)
        .addTab(tab2)
        .addTab(tab3));
    
    aside.facet("content", pageHolder).facet("menu", pageAside);
    
    aside.update();
    Utils.Dom.applyChanges();

    Events.Dom.on(window, 'resize', Utils.throttle(Scroll.updateAll, 100));
    document.body.appendChild(aside.el());
    Scroll.updateAll();
});
