// PE 2/3
var navbar = new Vue({
    el: "#navbar",
    delimiters: ['[[', ']]'],
    data: {
    },
    methods: {
    
        openAuthModal: function () {
            $('#auth-modal').modal();
        },
        openAddResourceModal: function () {
            addResourceModal.clearInputs();
            addResourceModal.open();
            
        }
    },
    created: function () {
        setTimeout(() => {
            $('[data-toggle="tooltip"]').tooltip()
        }, 100)
    }
})