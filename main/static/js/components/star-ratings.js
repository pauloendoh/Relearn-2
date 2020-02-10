// PE 2/3
Vue.component("star-ratings", {
    props: [
        "rating", // v-bind:rating.sync
    ],

    data: function () {
        return {
            ratingOptions: [
                { value: 1, tooltip: "I give up", color: "rgb(113, 113, 113)" },
                { value: 2, tooltip: "Boring", color: "#9c8c4d" },
                { value: 3, tooltip: "OK", color: "rgb(208, 176, 48)" },
                { value: 4, tooltip: "Interesting", color: "rgb(243, 197, 15)" },
                { value: 5, tooltip: "Very interesting!", color: "#ffcc00" },
            ],
            hoverRating: null,
        }
    },
    computed: {
        // PE 2/3
        // Returns the color of the stars.
        _starsColor: function () {
            let _ratingOptions = this.ratingOptions
            let _hoverRating = this.hoverRating
            let _rating = this.rating

            // The color of the hovered star
            if (_hoverRating) {
                return _ratingOptions.find(option => option.value == _hoverRating).color
            }
            // Or the color of the user rating. Eg: 5 = maximum yellow
            else if (_rating) {
                return _ratingOptions.find(option => option.value == _rating).color
            }
        }
    },
    methods: {
        // PE 2/3
        changeRating: function (newRating) {
            let _rating = this.rating;

            // If you click on the same rating, remove it
            if (_rating == newRating) {
                this.$emit('update:rating', null)
                this.hoverRating = null;
                this.$emit('change', null);
            }
            else {
                this.$emit('update:rating', newRating)
                this.$emit('change', newRating)
            }
        },

    },
    // 
    template: `
        <div class="d-flex align-center" style="font-size: 20px;">
            <div v-for="option in ratingOptions" class="pointer"
                v-on:click="changeRating(option.value)" 
                v-on:mouseenter="hoverRating = option.value"
                v-on:mouseleave="hoverRating = null"
                data-toggle="tooltip"
                v-bind:title="option.tooltip"
                >
                <template v-if="hoverRating > 0">
                    <i v-if="hoverRating >= option.value" class="fas fa-star"
                    v-bind:style="'color:'+ _starsColor"
                    ></i>
                    <i v-else class="far fa-star"></i>
                </template>
                <template v-else>
                    <i v-if="rating >= option.value" class="fas fa-star"
                    v-bind:style="'color:'+ _starsColor"

                    ></i>
                    <i v-else class="far fa-star"></i>
                </template>
            </div>
        </div>
    `,
    created: function () {
        // Create activateTooltips()
        setTimeout(()=>{
            $('[data-toggle="tooltip"]').tooltip()
        }, 100)
    }
})