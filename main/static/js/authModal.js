var authModal = new Vue({
    delimiters: ['{[', ']}'],
    el: '#auth-modal',
    data: {
        loginIsShowing: true,

        username: "",
        email: "",
        password: "", 

        errors: []
    },
    computed: {
        signupIsShowing: function () {
            return !this.loginIsShowing;
        }
    },
    methods: {
        login: function () {
            this.errors = []
            var data = {
                // csrfmiddlewaretoken: csrfmiddlewaretoken,
                username: this.username,
                password: this.password,
            }

            fetch(urls.login, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfmiddlewaretoken, 
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify(data)
            })
                .then(r => r.json())
                .then(json => {
                    if (json.errors) {
                        this.errors = json.errors;
                        // if(json.errors.__all__){
                        //     for (var error of  json.errors.__all__) {
                        //         this.errors.push(error)
                        //     }
                        // }
                        // else {
                        //     if(typeof(json.errors) == "object"){
                        //         for (var error in json.errors) {
                        //             this.errors.push(error)
                        //         }     
                        //     }
                        // }
                    }
                    else
                        location.reload();
                })
        },
        signUp: function () {
            this.errors = []
            var data = {
                csrfmiddlewaretoken: csrfmiddlewaretoken,
                username: this.email.split('@')[0],
                email: this.email,
                password1: this.password,
                password2: this.password
            }

            fetch(urls.createUser, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfmiddlewaretoken,
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify(data)
            })
                .then(r => r.json())
                .then(json => {
                    if (json.errors) {
                        this.errors = json.errors;
                        // if(json.errors.__all__){
                        //     for (var error of  json.errors.__all__) {
                        //         this.errors.push(error)
                        //     }
                        // }
                        // else {
                        //     if(typeof(json.errors) == "object"){
                        //         for (var error in json.errors) {
                        //             this.errors.push(error)
                        //         }     
                        //     }
                        // }
                    }
                    else
                        location.reload();
                })
        }
    }
});