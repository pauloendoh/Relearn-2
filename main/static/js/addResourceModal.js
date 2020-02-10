var addResourceModal = new Vue({
    delimiters: ['{[', ']}'],
    el: '#add-resource-modal',
    data: {
        url: "",
        

        title: "",
        rating: null,

        ratingOptions: [
            { value: 1, tooltip: "I give up"},
            { value: 2, tooltip: "Bad"},
            { value: 3, tooltip: "OK"},
            { value: 4, tooltip: "Good"},
            { value: 5, tooltip: "Excellent!"},
        ],
        hoverRating: null,
        seeLater: false
    },
    computed: {
        urlIsValid: function () {
            if (this.url.length > 0 && URLisValid(this.url) == false) {
                return false;
            }
            return true
        }
    },
    methods: {
       
        open: function () {
            $('#add-resource-modal').modal();
            doEveryXSecondsForYSeconds(() => {
                var url = document.querySelector("#url");
                url.focus();
                autoResizeAllTextareas();
            }, 0.1, 0.5);
        },
        save: function () {
            if (this.urlIsValid == false || this.url.length == 0) {
                alert("URL inválida!")
                return;
            }

            var postData = {
                csrfmiddlewaretoken: csrfmiddlewaretoken,
                url: this.url,
                title: this.title,
                rating: this.rating ? this.rating : null,
                isBookmarked: this.seeLater
            }
            fetch(urls.userLinkInteractions, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfmiddlewaretoken
                },
                body: JSON.stringify(postData)
            })
                .then(r => r.json())
                .then(json => {
                    if (json.errors) {
                        alert(json.errors[0])
                    }
                    else {
                        $('#add-resource-modal').modal('hide');

                        var message = "<b>Recurso salvo!</b>"
                        if(this.title)
                            message += `<br>${this.title}`
                        cornerMessage.show(message)
                        this.clearInputs();

                        var returnRating = json.userResource;
                        if (returnRating && typeof (statusFeed) != "undefined") {
                            var feedRating = statusFeed.ratings.find(r => r.id == returnRating.id)
                            if (feedRating && json.userResource.rating >= 4) {
                                feedRating.title = returnRating.title;
                                feedRating.rating = returnRating.rating;
                                feedRating.isBookmarked = returnRating.isBookmarked;
                            }
                            else if (feedRating && json.userResource.rating <= 3) {
                                statusFeed.ratings = statusFeed.ratings.filter(r => r.id != json.userResource.id)
                            }
                            else if (feedRating == false && json.userResource.rating >= 4)
                                statusFeed.ratings.unshift(json.userResource);
                        }
                    }
                })
        },
        autofill: function () {
            if (addResourceModal.url.includes('http')) {
                if (addResourceModal.url.includes('youtube.com')) {
                    fetch('https://noembed.com/embed?format=json&url=' + addResourceModal.url)
                        .then(response => response.json())
                        .then(json => {
                            addResourceModal.title = json.title;

                        })
                    // $.get('https://noembed.com/embed', { format: 'json', url: url }, function (data) {
                    // });
                }
                else {
                    fetch('https://textance.herokuapp.com/title/' + addResourceModal.url)
                        .then((resp) => resp.text()) // Transform the data into json
                        .then(function (title) {
                            addResourceModal.title = title;
                            doEveryXSecondsForYSeconds(() => {
                                autoResizeAllTextareas();
                            }, 0.1, 0.5)
                        })
                }
            }
        },
        clearInputs: function(){
            this.url = ""
            this.title =  ""
            this.rating = null
            this.seeLater = false
        },
    }
});