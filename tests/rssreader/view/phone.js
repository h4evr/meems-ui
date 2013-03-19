/*global define*/
define([
    "meems/meems-ui", "meems-utils", "meems/observable",
    "view/feeds", "view/news", "view/newsdetail"
], function(UI, Utils, Obs, FeedsView, NewsView, NewsDetailView) {
    function PhoneUI() {
        /* The title of the aside panel */
        var title = Obs.observable("RSS Reader"),

        /* Our main component is an aside menu */
            phoneUi = UI.create("aside"),

        /* That will have a page holder on the right side, */
            pageHolder = UI.create("pageholder"),

        /* and simple page on the left side, which will contain the menu items .*/
            pageFeeds = new FeedsView(phoneUi);

        /* Pages should listen for the aside:click event if
           they want to do react to aside menu items.  */
        pageFeeds.ui.on("feeds:clicked", function (eventName, item) {
            phoneUi.fire("aside:clicked", item);
            phoneUi.expanded(false);
            Utils.Dom.applyChanges();
            return true;
        });

        /* Load pages */
        var pageNews = new NewsView(pageHolder),
            pageDetails = new NewsDetailView(pageHolder);

        /* Add all the necessary pages to the page holder. */
        pageHolder.pages([
            pageNews.ui,
            pageDetails.ui
        ]);

        /* Fill the aside component with the menu and the page holder. */
        phoneUi.facet("content", pageHolder).facet("menu", pageFeeds.ui);

        /* Expose a new event "aside:toggle", that allows pages to
           toggle the visibility of the aside menu. */
        pageHolder.on("aside:toggle", function() {
            phoneUi.expanded(!phoneUi.expanded());
            Utils.Dom.applyChanges();
        });

        this.ui = phoneUi;
        this.title = title;
        this.pageFeeds = pageFeeds;
        this.pageNews = pageNews;
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