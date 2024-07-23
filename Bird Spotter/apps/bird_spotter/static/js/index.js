"use strict";

//CITATION:
//GET: https://jasonwatmore.com/post/2021/07/01/axios-http-get-request-examples
//POST: https://jasonwatmore.com/post/2021/06/25/axios-http-post-request-examples
//PUT: https://jasonwatmore.com/post/2021/08/24/axios-http-put-request-examples
//DELETE: https://jasonwatmore.com/post/2021/08/25/axios-http-delete-request-examples
//Hiding a div: https://dcblog.dev/vue-show-and-hide-form-elements#:~:text=Show%20%2F%20Hide%20elements%20select,-Now%20to%20only&text=This%20can%20be%20accomplished%20by,using%20a%20v%2Dshow%20directive.&text=v%2Dshow%20takes%20a%20condition,not%20rendered%20to%20the%20page.

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

let app = {};
(app.empty_new_bird = {
  id: 0,
  name: "",
  habitat: "",
  weight: 0,
  sightings: 0,
}),
  (app.config = {
    data: function () {
      return {
        new_bird: clone(app.empty_new_bird),
        birds: [],
        selected_birds: [],
        editing: { current: null },
        errors: { weight: "" },
      };
    },
    methods: {
      search: function () {
        this.cancel();
        this.selected_birds = this.birds.filter((bird) => {
          return bird.name
            .toLowerCase()
            .includes(this.new_bird.name.toLowerCase());
        });
      },
      add_bird: function () {
        this.cancel();
        if (this.selected_birds.length == 0 && this.new_bird.name.length > 1) {
          let bird = clone(this.new_bird);
          this.birds.push(bird);
          this.new_bird = app.empty_new_bird;
          this.selected_birds = [bird];

          // POST bird to /bird_spotter/birds which returns {id: #} and store it in bird.id = #;
          axios
            .post("/bird_spotter/api/birds", bird)
            .then(function (res) {
              console.log("Response:", res.data);
              bird.id = res.data.id;
              app.vue.new_bird = clone(app.empty_new_bird);
            })

            .catch((error) => {
              console.error("ERROR: Is not able to add bird:", error);
            });
        }
      },
      edit: function (bird) {
        this.cancel();
        this.editing = { current: bird, old: clone(bird) };
      },
      save: function (bird) {
        bird = clone(bird);
        let id = bird.id;
        delete bird.id;
        delete bird.name;
        // PUT bird to /bird_spotter/birds/{bird.id}
        axios
          .put(` /bird_spotter/api/birds/${id}`, bird)
          .then(function (res) {})
          .catch((error) => {
            console.error("ERROR: Is not able to put bird:", error);
          });

        this.editing = { current: null };
      },
      cancel: function () {
        if (this.editing.current)
          for (var key in this.editing.current)
            this.editing.current[key] = this.editing.old[key];
        this.editing = { current: null };
      },
      add_sighting: function (bird) {
        bird.sightings += 1;

        // POST {} to /bird_spotter/birds/{bird.id}/increase_sightings
        axios
          .post(`/bird_spotter/api/birds/${bird.id}/increase_sightings`, bird)
          .then(function (res) {})
          .catch((error) => {
            console.error("ERROR: Can't add sighting:", error);
          });
      },
      color: function (name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++)
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
        let ret = `hsl(${hash % 360}, 100%, 75%)`;
        return ret;
      },
    },
  });
app.load_data = function () {
  // GET from /bird_spotter/birds {birds: [...]} and store it into app.vue.birds = [...]
  axios
    .get("/bird_spotter/api/birds")
    .then(function (res) {
      app.vue.birds = res.data.birds;
      app.vue.selected_birds = res.data.birds;
    })

    .catch((error) => {
      console.error("ERROR: Is not able to get bird:", error);
    });
};

app.vue = Vue.createApp(app.config).mount("#app");
app.load_data();
