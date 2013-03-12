define([
    "meems-utils", "viewmodel/users", "viewmodel/userdetail"
], function (Utils, UsersViewModel, UserDetailsViewModel) {
    var PhoneViewModel = {
        navigateTo : function (page) {
            if (page === 'details') {
                this.view.pageHolder.currentPage(this.view.pageDetails.ui);
            } else if (page === 'people') {
                this.view.pageHolder.currentPage(this.view.pageUsers.ui);
            }

            Utils.Dom.applyChanges();
        },

        view : null,
        init : function (view) {
            this.view = view || this.view;

            UsersViewModel.init(this, this.view.pageUsers);
            UserDetailsViewModel.init(this, this.view.pageDetails);

            var self = this, pageHolder = this.view.pageHolder;

            pageHolder.on("goto:people", function() {
                self.navigateTo("people");
            });

            pageHolder.on("goto:details", function() {
                self.navigateTo("details");
            });
        }
    };

    return PhoneViewModel;
});