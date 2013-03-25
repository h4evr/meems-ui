define([
    "meems/meems-ui", "meems-utils", "meems-events", "meems/observable"
], function(UI, Utils, Events, Obs) {
    function FeedsView(parentView) {
        var itemTemplate =
            "<div class=\"feed\">" +
                "<div class=\"icon\">" +
                    "<img src=\"{{icon}}\">" +
                "</div>" +
                "<div class=\"name\">{{title}}</div>" +
                "<div class=\"clear\"></div>" +
            "</div>",
            manageItemTemplate =
            "<table style=\"width:100%;\"><tr><td><div class=\"feed\">" +
                "<div class=\"icon\">" +
                    "<img src=\"{{icon}}\">" +
                "</div>" +
                "<div class=\"name\">{{title}}</div></td><td width=\"30px\">" +
                "<div class=\"ui-button ui-button-normal ui-button-red remove\">" +
                    "<div class=\"ui-icon ui-icon-delete\"></div>" +
                    "<div class=\"ui-title\">Delete</div>" +
                "</div></td>" +
            "</div></tr></table><div class=\"clear\"></div>";

        var feeds = Obs.observableArray([]),
            title = "Feeds",

            feedsList = UI.create("list")
                /* Bind to an observable array. */
                .items(feeds)
                .template(itemTemplate)
                .attr('style', 'normal')
                .attr('sortable', true)
                .attr('selectionMode', 'multiple')
                .on("item:clicked", function (eventName, item, e) {
                    //pageHolder.fire("feeds:clicked", item);
                    return true;
                })
                .on("selection:changed", function (eventName, selection) {
                    if (selection.length > 0) {
                        pageManageFeeds.facet("footer", contextMenuFooter).update(true);
                    } else {
                        pageManageFeeds.facet("footer", null).update(true);
                    }
                    Utils.Dom.applyChanges();
                }),

            contextMenuFooter = UI.create("footer")
                .facet("buttons", UI.create("buttongroup").buttons([
                    UI.create("button").attr("action", "delete").attr("style", "icon").attr("title", "Delete").attr("icon", "delete")
                ]).on("button:pressed", function (eventName, button) {
                    var action = button.attr("action");

                    if (action === 'delete') {
                        feeds.removeAll(feedsList.getSelectedItems());
                        feedsList.update();
                        Utils.Dom.applyChanges();
                    }
                })),

            pageHolder = UI.create("pageholder", parentView),
            pageFeeds =
            UI.create("page", pageHolder)
                .attr("enableScroll", true)
                /* Create the page's header */
                .facet("header",
                    UI.create("header")
                        .attr("title", title)
                        .facet("buttonsright",
                            UI.create("buttongroup")
                                .addButton(UI.create("button")
                                    .attr("title", "Add")
                                    .attr("icon", "add")
                                    .on('dom:' + Events.Touch.touchEndEventName, function () {
                                        pageHolder.currentPage(pageManageFeeds);
                                        Utils.Dom.applyChanges();
                                    }))))

                /* Create the page's content */
                .facet("content",
                    UI.create("list")
                        /* Bind to an observable array. */
                        .items(feeds)
                        .template(itemTemplate)
                        .attr('style', 'normal')
                        .on("item:clicked", function (eventName, item) {
                            pageHolder.fire("feeds:clicked", item);
                            return true;
                        })),

            newUrl = Obs.observable(""),

            pageManageFeeds =
            UI.create("page", pageHolder)
                .attr("enableScroll", "true")
                .facet("header",
                    UI.create("header")
                        .attr("title", title)
                        .facet("buttonsleft",
                            UI.create("buttongroup")
                                .addButton(UI.create("button")
                                    .attr("title", "Back")
                                    .attr("icon", "back")
                                    .on('dom:' + Events.Touch.touchEndEventName, function () {
                                        pageHolder.currentPage(pageFeeds);
                                        Utils.Dom.applyChanges();
                                    }))))
                 /* Create the page's content */
                .facet("content",
                    UI.create("group")
                        .attr("customClass", "ui-align-right")
                        .appendChild(
                            UI.create("form")
                                .addField(UI.create("textfield").attr("label", "URL").value(newUrl))
                        )
                        .appendChild(UI.create("button").attr("title", "Add")
                            .on("dom:" + Events.Touch.touchEndEventName, function () {
                                var url = newUrl();

                                if (url.length > 0) {
                                    pageManageFeeds.fire("feeds:add", url);
                                    newUrl("");
                                }
                            }))
                        .appendChild(feedsList));

        pageHolder.pages([ pageFeeds, pageManageFeeds ]);

        this.ui = pageHolder;
        this.feeds = feeds;

        return this;
    }

    return FeedsView;
});