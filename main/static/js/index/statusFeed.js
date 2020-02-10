var statusFeed = new Vue({
    delimiters: ['{[', ']}'],
    el: "#status-feed",
    data: {
        authUser: authUser, 
        ratings: []
    },
    methods: {
        getLastRatings: function(){
            fetchJson(urls.userLinkInteractions, null, {
                username: authUser.username, 
                following: true, 
                rating__gte: 4
            })
            .then(json => {
                this.ratings = json.ratings;
            })
        }, 
        editRating: function(rating){
            addResourceModal.url = rating.resource;
            addResourceModal.title = rating.title;
            addResourceModal.rating = rating.rating;
            addResourceModal.seeLater = rating.isBookmarked;
            addResourceModal.open();
        },

        // UTILS
        getMainUrlName: getMainUrlName,
    },
    created: function() {
        if(authUser)
            this.getLastRatings();
    }
})
