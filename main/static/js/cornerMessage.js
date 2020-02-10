var cornerMessage = new Vue({
    el: "#corner-message-app",
    delimiters: ['[[', ']]'],
    data: {
        message: "",
    },
    methods: {
        show: function (message = "", seconds = 3) {
            this.message = message;
            setTimeout(() => {
                this.message = "";
            }, seconds * 1000);

        }
    }
})