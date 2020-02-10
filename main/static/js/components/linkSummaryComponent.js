/*  
      INTUITIVE: PE 2/3
    DESCRIPTION: Shows the summary info from a link. Eg: avgRating, number of votes, etc.
                 Only the authUser may interact with it. I.e.: rate, bookmark, etc.
MAIN REFERENCES: "/path?p=WL"
*/
Vue.component('link-summary', {     
    props: ["userResource"], 

    methods:{
        // PE 2/3
        saveUserLinkInteraction: function(){
            var postData = {
                csrfmiddlewaretoken: csrfmiddlewaretoken,
                url: this.userResource.resource,
                title: this.userResource.title,
                rating: this.userResource.rating ? this.userResource.rating : null,
                isBookmarked: this.userResource.isBookmarked
            }
            fetchJson(urls.userLinkInteraction, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfmiddlewaretoken
                },
                body: JSON.stringify(postData)
            }).then(json => {
                
            })
        },

        // PE 2/3
        updateBookmark: function(newValue){
            if(newValue == false && confirm("Deseja remover esse recurso?") == true){
                this.userResource.isBookmarked = false;
                this.saveUserLinkInteraction();
            }
            else {
                setTimeout(() => {
                    this.userResource.isBookmarked = true;
                    this.saveUserLinkInteraction();
                }, 50)
               
            }

        },

        // UTILS
        getMainUrlName: getMainUrlName
    }, 

    template: `
    <div class="resource bg-white rounded shadow-sm p-3">
        <div v-if="userResource.title">
            {{ userResource.title }} 
            <a :href="userResource.resource" target="_blank">[{{getMainUrlName(userResource.resource)}}]</a>
        </div>
        <div v-else>
            <a :href="userResource.resource" target="_blank"> {{userResource.resource}} </a>
        </div>

        <div class="d-flex">
            <div v-if="userResource.user">
                Avaliar
                <star-ratings v-bind:rating.sync="userResource.rating"
                v-on:change="saveUserLinkInteraction()"></star-ratings>
               
            </div>
            <div class="form-check ml-3">
                <input  v-bind:id="'see-later-check-' + userResource.id"
                        v-model="userResource.isBookmarked" 
                        v-on:change="updateBookmark($event.target.checked)"
                        class="form-check-input pointer" type="checkbox">
                <label class="form-check-label pointer" v-bind:for="'see-later-check-' + userResource.id">
                    Ver depois
                </label>
            </div>  
        </div>
    </div>
    `
})