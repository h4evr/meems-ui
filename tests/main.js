/*globals require */
require.config({
    paths: {
        "meems-utils": "../lib/meems-utils/meems-utils",
        "meems-events": "../lib/meems-events/meems-events",
        "meems-scroll": "../lib/meems-scroll/meems-scroll",
        "mustache": "//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.7.2/mustache.min"
    }
});

function loadCss(urls) {
    "use strict";

    var link,
        head = document.getElementsByTagName("head")[0],
        firstSibling = head.childNodes[0];

    for (var i = 0, ln = urls.length; i < ln; ++i) {
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = urls[i];
        head.insertBefore(link, firstSibling);
    }
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
loadCss([
    "../themes/" + theme + "/ui.css",
    "../themes/" + theme + "/icons.css",
    "../themes/" + theme + "/effects.css"
]);

require(["../meems-ui", "../observable", "meems-utils", "meems-scroll", "meems-events"], function (UI, VmUtils, Utils, Scroll, Events) {
    "use strict";

    var eventClick = 'dom:' + Events.touchEndEventName,

        buttonTitle = VmUtils.observable("Explore"),

        title = VmUtils.observable("Thesis - Meems Library"),

        aside = UI.create("aside"),
        
        page1 = UI.create("page").facet("header",
        UI.create("header")
            .attr("title", title)
            .facet("buttonsleft",
                UI.create("buttongroup")
                .addButton(UI.create("button")
                    .attr("title", buttonTitle)
                    .attr("icon", "explore")
                    .on(eventClick, function () {
                        aside.expanded(!aside.expanded());
                        Utils.Dom.applyChanges();
                    }))));

    var tab1 = UI.create("tab").attr("title", "Thesis").attr("icon", "facebook").facet("content",
        UI.create("list").items([
            { text: "Introduction", header : true },
            { text: "Context" },
            { text: "Motivation and Goals" },
            { text: "Structure" },
            { text: "State of Art", header : true },
            { text: "What are smartphones?" },
            { text: "Operating systems" },
            { text: "Approaches in mobile development" },
            { text: "Publishing applications" },
            { text: "HTML5, Javascript and CSS3" },
            { text: "Frameworks for developing mobile web applications" },
            { text: "Analysis of the problem at hand", header : true },
            { text: "Conclusions" },
            { text: "", header : true },
            { text: "Conclusions and Future Work" },
            { text: "Future Work" },
            { text: "", header : true },
            { text: "References" }
        ]).style('full')),
    
    tab2 = UI.create("tab").attr("title", "Teste").attr("icon", "facebook").facet("content",
        UI.create("list").items([
            { text: "Introduction", header : true },
            { text: "Context" },
            { text: "Motivation and Goals" },
            { text: "Structure" },
            { text: "State of Art", header : true },
            { text: "What are smartphones?" },
            { text: "Operating systems" },
            { text: "Approaches in mobile development" },
            { text: "Publishing applications" },
            { text: "HTML5, Javascript and CSS3" },
            { text: "Frameworks for developing mobile web applications" },
            { text: "Analysis of the problem at hand", header : true },
            { text: "Conclusions" },
            { text: "", header : true },
            { text: "Conclusions and Future Work" },
            { text: "Future Work" },
            { text: "", header : true },
            { text: "References" }
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
            { text: "Segundo ecra!" }
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
            { text: "Terceiro ecra!" }
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

    menuItems = VmUtils.observableArray([
        { id: 1, text : "Home" },
        { id: 2, text : "Page 1" },
        { id: 3, text : "Page 2" },
        { id: 4, text : "Page 3" }
    ]),

    pageAside = UI.create("page")
        .facet("header", UI.create("header").attr("title", title))
        .facet("content", UI.create("list").items(menuItems)
            .style('full').on("item:clicked", function (eventName, item) {
                var id = item.id;

                if (id === 1) {
                    pageHolder.currentPage(page1);
                } else if (id === 2) {
                    pageHolder.currentPage(page2);
                } else if (id === 3) {
                    pageHolder.currentPage(page3);
                } else {
                    return true;
                }

                aside.expanded(false);
                Utils.Dom.applyChanges();

                return true;
        })),

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
