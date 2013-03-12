define([
    "viewmodel/userdetail"
], function (UserDetailsViewModel) {
    return  {
        users: [
            {
                id: 1,
                name: "Diogo Albergaria Oliveira Francisco Costa",
                age: 23,
                phoneNumber: "910720911",
                email: "costa.h4evr@gmail.com",
                gravatar: "62b48b5fc670fd413fe3bfc6e62e2cdf"
            },
            {
                id: 2,
                name: "Sandra Magalhães",
                age: 24,
                phoneNumber: "919060641",
                email: "sandrmagalhaes@gmail.com"
            },
            {
                id: 1,
                name: "Diogo Costa",
                age: 23,
                phoneNumber: "910720911",
                email: "costa.h4evr@gmail.com",
                gravatar: "62b48b5fc670fd413fe3bfc6e62e2cdf"
            },
            {
                id: 1,
                name: "Diogo Costa",
                age: 23,
                phoneNumber: "910720911",
                email: "costa.h4evr@gmail.com",
                gravatar: "62b48b5fc670fd413fe3bfc6e62e2cdf"
            },
            {
                id: 1,
                name: "Diogo Costa",
                age: 23,
                phoneNumber: "910720911",
                email: "costa.h4evr@gmail.com",
                gravatar: "62b48b5fc670fd413fe3bfc6e62e2cdf"
            },
            {
                id: 1,
                name: "Diogo Costa",
                age: 23,
                phoneNumber: "910720911",
                email: "costa.h4evr@gmail.com",
                gravatar: "62b48b5fc670fd413fe3bfc6e62e2cdf"
            },
            {
                id: 1,
                name: "Diogo Costa",
                age: 23,
                phoneNumber: "910720911",
                email: "costa.h4evr@gmail.com",
                gravatar: "62b48b5fc670fd413fe3bfc6e62e2cdf"
            },
            {
                id: 1,
                name: "Diogo Costa",
                age: 23,
                phoneNumber: "910720911",
                email: "costa.h4evr@gmail.com",
                gravatar: "62b48b5fc670fd413fe3bfc6e62e2cdf"
            }
        ],

        parentController: null,
        view: null,
        init: function (parentController, view) {
            this.parentController = parentController;
            this.view = view || this.view;

            var self = this;

            this.view.ui.on("user:clicked", function (eventName, user) {
                console.log(user);
                UserDetailsViewModel.showUser(user);
                self.parentController.navigateTo("details");
            });

            this.view.users(this.users);
        }
    };
});