define([
    "meems/meems-ui", "meems-utils", "meems-events", "meems/observable"
], function(UI, Utils, Events, Obs) {
    function UsersView(parentView) {
        var itemTemplate =
            "<div class=\"contact-icon\">" +
                "<img src=\"http://www.gravatar.com/avatar/{{gravatar}}.png?s=44\">" +
            "</div>" +
            "<div class=\"contact-name\">{{name}}</div>" +
            "<div class=\"clear\"></div>";

        var users = Obs.observableArray([]),
            title = Obs.observable("People"),
            pageUsers =
            UI.create("page", parentView)
                .attr("enableScroll", true)
                /* Create the page's header */
                .facet("header",
                    UI.create("header")
                        .attr("title", title)
                        .facet("buttonsleft",
                            UI.create("buttongroup")
                                .addButton(UI.create("button")
                                    .attr("title", "Explore")
                                    .attr("icon", "explore")
                                    .on('dom:' + Events.touchEndEventName, function () {
                                        pageUsers.fire("aside:toggle");
                                    }))))

                /* Create the page's content */
                .facet("content",
                    UI.create("list")
                        /* Bind to an observable array. */
                        .items(users)
                        .template(itemTemplate)
                        .style('normal')
                        .on("item:clicked", function (eventName, item) {
                            pageUsers.fire("user:clicked", item);
                            return true;
                        }));

        this.ui = pageUsers;
        this.title = title;
        this.users = users;

        return this;
    }

    return UsersView;
});