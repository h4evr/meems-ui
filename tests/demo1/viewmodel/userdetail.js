define(function () {
    return  {
        user: {
            id: null,
            name: null,
            age: null,
            phoneNumber: null,
            email: null,
            gravatar: null
        },

        showUser : function (user) {
            this.user = user;
            this.view.user(this.user);
        },

        view: null,
        parentController: null,
        init: function (parentController, view) {
            this.parentController = parentController;
            this.view = view || this.view;
            this.view.user(this.user);
        }
    };
});