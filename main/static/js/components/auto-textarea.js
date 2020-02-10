Vue.component('auto-textarea', {
    props: ["value"],
    methods: {
        autoResize: function (event) {
            this.$emit('input', event.target.value);
            event.target.style.height = "1px";
            event.target.style.height = (event.target.scrollHeight + 5) + "px";
        }
    },
    template: `
        <textarea   class="auto-resize"
                    :value="value"
                    @input="autoResize($event)"
                    style="overflow: hidden;"></textarea>
    `
})

function autoResizeAllTextareas() {
    const ta = document.querySelectorAll(".auto-resize");
    for (var i = 0; i < ta.length; i++) {
        ta[i].style.height = "1px";
        ta[i].style.height = (ta[i].scrollHeight + 5) + "px";
    }
}