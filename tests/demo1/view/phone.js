define([
    "meems/meems-ui", "meems-utils", "meems/observable",
    "view/users", "view/userdetail"
], function(UI, Utils, Obs, UsersView, UserDetailView) {
    function PhoneUI() {
        /* Define menu items to appear on the aside menu */
        var menuItems = Obs.observableArray([
                { id: 1, text : "People" }
            ]),

        /* The title of the aside panel */
            title = Obs.observable("Demo 1"),

        /* Our main component is an aside menu */
            phoneUi = UI.create("aside"),

        /* That will have a page holder on the right side, */
            pageHolder = UI.create("pageholder"),

        /* and simple page on the left side, which will contain the menu items .*/
            asideMenu = UI.create("page")
                .facet("header", UI.create("header").attr("title", title))
                .facet("content", UI.create("list").items(menuItems)
                    .attr('style', 'normal')

                    /* Pages should listen for the aside:click event if
                       they want to do react to aside menu items.  */
                    .on("item:clicked", function (eventName, item) {
                        phoneUi.fire("aside:click", item);
                        phoneUi.expanded(false);
                        Utils.Dom.applyChanges();
                        return true;
                    }));

        /* Load pages */
        var pageUsers = new UsersView(pageHolder),
            pageDetails = new UserDetailView(pageHolder);

        /* Add all the necessary pages to the page holder. */
        pageHolder.pages([
            pageUsers.ui,
            pageDetails.ui
        ]);

        /* Fill the aside component with the menu and the page holder. */
        phoneUi.facet("content", pageHolder).facet("menu", asideMenu);

        /* Expose a new event "aside:toggle", that allows pages to
           toggle the visibility of the aside menu. */
        pageHolder.on("aside:toggle", function() {
            phoneUi.expanded(!phoneUi.expanded());
            Utils.Dom.applyChanges();
        });

        this.ui = phoneUi;
        this.title = title;
        this.pageUsers = pageUsers;
        this.pageHolder = pageHolder;
        this.pageDetails = pageDetails;

        return this;
    }

    PhoneUI.prototype = {
        refresh: function () {
            this.ui.update();
            Utils.Dom.applyChanges();
        }
    };

    return PhoneUI;
});