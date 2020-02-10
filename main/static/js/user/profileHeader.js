var profileHeader = new Vue({
    el: "#profile-header",
    delimiters: ['{[', ']}'],
    data: {
        authUser: authUser,
        username: username,
        isFollowing: false,
        profile: null
    },
    computed: {
        isLoading: function () {
            return this.profile == null;
        }
    },
    methods: {
        follow: function (willFollow) {
            var postData = {
                following: this.username
            }
            if (willFollow) {
                fetchJson(urls.follow, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrfmiddlewaretoken
                        },
                        body: JSON.stringify(postData)
                    })
                    .then(jsonResult => {
                        if (jsonResult.follow)
                            this.isFollowing = true
                    })
            } else {
                fetchJson(urls.follow, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrfmiddlewaretoken
                        },
                        body: JSON.stringify(postData)
                    })
                    .then(jsonResult => {
                        if (jsonResult.errors.length == 0)
                            this.isFollowing = false

                    })
            }

        },
    },
    created: function () {
        // GET USER PROFILE
        fetchJson(urls.profile, null, {
            user: this.username
        }).then(profile => {
            this.profile = profile;
        })

        // SETTING FOLLOWING BUTTON
        if (authUser) {
            fetchJson(urls.follow, null, {
                    follower: this.authUser.username,
                    following: this.username
                })
                .then(jsonResult => {
                    if (jsonResult.follow)
                        this.isFollowing = true
                })
        }
    }
})