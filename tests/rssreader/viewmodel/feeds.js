/*global define*/
define([
    "viewmodel/news"
], function (NewsViewModel) {
    var $feedsLoading = {};

    return  {
        feeds: [
            {
                id: 1,
                title: "Público",
                url: "http://feeds.feedburner.com/PublicoRSS",
                unread: 0,
                read: {}
            },
            {
                id: 2,
                title: "RTP Notícias / Geral / Últimas",
                url: "http://www.rtp.pt/noticias/index.php?headline=204&visual=58",
                unread: 0,
                read: {}
            }
        ],

        newsCache: {},

        loadFeeds : function() {
            if (window.localStorage) {
                var feedList = window.localStorage.getItem("feeds");
                if (feedList) {
                    this.feeds = JSON.parse(feedList);
                } else {
                    this.feeds = [];
                }
            }
        },

        saveFeeds : function() {
            if (window.localStorage) {
                var feedList = JSON.stringify(this.feeds);
                window.localStorage.setItem("feeds", feedList);
            }
        },

        onFeedLoad: function (data) {
            var url = data.query.meta.url.id || '';

            if ($feedsLoading[url] !== undefined) {
                var lastUpdateDate = data.query.results.feed.date;
                var news = data.query.results.feed.entry;

                var callback = $feedsLoading[url];
                $feedsLoading[url] = null;
                setTimeout(function () {
                    callback(url, lastUpdateDate, news);
                }, 0);
            } else {
                console.warn("[onFeedLoad] Received feed info but there is no one to collect! " + url);
            }
        },

        getNewsFromFeed: function (feed, onDone) {
            var yqlUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feednormalizer%20where%20url%3D'"
                       + encodeURIComponent(feed.url) + "'%20and%20output%3D'atom_1.0'&format=json&diagnostics=true&callback=onFeedLoad";

            $feedsLoading[feed.url] = onDone;

            var script = document.createElement("script");
            script.src = yqlUrl;
            document.getElementsByTagName("head")[0].appendChild(script);
        },

        parentController: null,
        view: null,
        init: function (parentController, view) {
            this.parentController = parentController;
            this.view = view || this.view;

            var self = this;

            this.view.ui.on("feeds:clicked", function (eventName, feed) {
                var cache = self.newsCache[feed.url];

                if (cache && cache.news && cache.news.length > 0 &&
                    cache.lastUpdateDate && cache.lastUpdateDate.getTime() - (new Date()).getTime() < 300000 /*5min*/) {
                    NewsViewModel.showNews(feed, cache.news);
                } else {
                    self.getNewsFromFeed(feed, function (url, lastUpdateDate, news) {
                        self.newsCache[feed.url] = {
                            news: news,
                            lastUpdateDate: new Date(lastUpdateDate)
                        };

                        NewsViewModel.showNews(feed, news);

                        self.parentController.updateUi();
                    });
                }

                self.parentController.navigateTo("news");
            });

            //this.loadFeeds();

            this.view.feeds(this.feeds);

            window.onFeedLoad = this.onFeedLoad;
        }
    };
});