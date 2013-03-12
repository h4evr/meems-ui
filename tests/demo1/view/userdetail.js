define([ "meems/meems-ui", "meems-utils", "meems-events", "meems/observable" ], function(UI, Utils, Events, Obs) {
    function UserDetailView(parentView) {
        var pageTemplate =
            "<div class=\"contact-details-page\">" +
            "<div class=\"contact-icon\">" +
                "<img src=\"http://www.gravatar.com/avatar/{{gravatar}}.png?s=128\">" +
            "</div><div class=\"contact-details\">" +
                "<div class=\"contact-name\">{{name}}{{test}}</div>" +
                "<div class=\"contact-phone\">{{phoneNumber}}</div>" +
                "<div class=\"contact-email\">{{email}}</div>" +
            "</div>" +
            "</div>";

        var user = Obs.observable(),
            title = Obs.observable("Contact Detail"),
            pageUsers =
            UI.create("page", parentView)
                .attr("enableScroll", false)
                /* Create the page's header */
                .facet("header",
                    UI.create("header")
                        .attr("title", title)
                        .facet("buttonsleft",
                            UI.create("buttongroup")
                                .addButton(UI.create("button")
                                    .attr("title", "List")
                                    .attr("icon", "explore")
                                    .on('dom:' + Events.touchEndEventName, function () {
                                        parentView.fire("goto:people");
                                    }))))

                        /* Create the page's content */
                        .facet("content",
                            UI.create("tabgroup")
                                .attr("tabPosition", 'top')
                                .addTab(
                                    UI.create("tab")
                                        .attr("title", "Contact")
                                        .attr("icon", "facebook")
                                        .facet("content",
                                            UI.create("html")
                                                .attr("html", pageTemplate)
                                                .attr("data", user))
                                )
                                .addTab(
                                    UI.create("tab")
                                        .attr("title", "Messages")
                                        .attr("icon", "facebook")
                                        .facet("content",
                                            UI.create("html")
                                                .attr("html", ""))
                                ));

        this.ui = pageUsers;
        this.title = title;
        this.user = user;

        return this;
    }

    return UserDetailView;
});