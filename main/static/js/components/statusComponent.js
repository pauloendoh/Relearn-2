// PE 2/3 
var userLink = Vue.component('user-link', {
    props: ["user-link", "auth-user", ],

    methods: {
        // change this name to openModal(userLinkInteraction)
        editRating: function (userLink) {
            addResourceModal.url = userLink.resource;
            addResourceModal.title = userLink.title;
            addResourceModal.rating = userLink.rating;
            addResourceModal.seeLater = userLink.isBookmarked;
            addResourceModal.open();
        },

        // UTILS
        getMainUrlName: getMainUrlName,
    },

    // 
    template: `
    <div class="bg-white rounded shadow-sm p-3" style="font-size: 15px;">
        <div class="d-flex justify-content-between">
            <div style="font-weight: 500">
                {{ userLink.user }}
            </div>
            <div v-if="authUser && userLink.user == authUser.username" class="dropdown d-flex align-items-center">
                <i class="fas fa-ellipsis-v" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false" style="width: 20px; text-align: center"></i>
                <div class="dropdown-menu dropdown-menu-right">
                    <a v-on:click="editRating(userLink)" class="dropdown-item pointer">Editar</a>
                </div>
            </div>
        </div>
        <div class="resource-title" v-if="userLink.title">
            {{ userLink.title }}
            <a :href="userLink.resource" target="_blank" 
                data-toggle="tooltip"
                v-bind:title="userLink.resource"    
            >[{{getMainUrlName(userLink.resource)}}]</a>
        </div>
        <div v-else>
            <a :href="userLink.resource" target="_blank"> {{userLink.resource}}  </a>
        </div>
    </div>
    `
})