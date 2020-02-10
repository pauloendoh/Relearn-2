var userTimeline = new Vue({
    el: "#user-timeline", 
    delimiters: ['{[', ']}'],
    data: {
        authUser: authUser,
        username: username,
        ratings: [],
        
    }, 
    methods: {
        
    },
    created: function(){
        fetchJson(urls.userLinkInteractions + "?username=" + username + "&rating__gte=" + 1)
        .then(resultJson => {
            this.ratings = resultJson.ratings;
        })
    }
})