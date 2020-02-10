var seeLater = new Vue({
    el: "#see-later",
    delimiters: ['{[', ']}'],
    data: {
        authUser: authUser,
        message: 'xd',
        userResources: []
    },
    methods: {
        editRating: function (rating) {
            addResourceModal.url = rating.resource;
            addResourceModal.title = rating.title;
            addResourceModal.rating = rating.rating;
            addResourceModal.seeLater = rating.isBookmarked;
            addResourceModal.open();
        },

        // UTILS
        getMainUrlName: getMainUrlName,
    },
    created: function () {
        var pathId = getUrlParamByName('p');
        if (pathId == 'SL') {
            fetchJson(urls.getBookmarkedUserResources).then(json => {
                this.userResources = json.userResources;
            })
        }
    }
})