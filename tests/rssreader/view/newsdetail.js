/*global define*/
define([ "meems/meems-ui", "meems-utils", "meems-events", "meems/observable" ],
function(UI, Utils, Events, Obs) {
    function NewsDetailView(parentView) {
        var pageTemplate =
            "<iframe class=\"news-details\" src=\"{{link.href}}\"></iframe>";

        var news = Obs.observable(),
            title = Obs.observable("Feed title"),
            pageDetail =
            UI.create("page", parentView)
                .attr("enableScroll", false)
                /* Create the page's header */
                .facet("header",
                    UI.create("header")
                        .attr("title", title)
                        .facet("buttonsleft",
                            UI.create("buttongroup")
                                .addButton(UI.create("button")
                                    .attr("title", "News")
                                    .attr("icon", "explore")
                                    .on('dom:' + Events.Touch.touchEndEventName, function () {
                                        parentView.fire("goto:news");
                                    }))))

                        /* Create the page's content */
                        .facet("content",
                            UI.create("html")
                                .attr("customClass", "ui-fill")
                                .attr("html", pageTemplate)
                                .attr("data", news));

        this.ui = pageDetail;
        this.title = title;
        this.news = news;

        return this;
    }

    return NewsDetailView;
});