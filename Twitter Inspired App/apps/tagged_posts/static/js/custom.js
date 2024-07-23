"use strict";
//CITATIONS:
//https://vuejs.org/api/options-lifecycle.html

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

let app = {};
(app.empty_post = {
  id: 0,
  content: "",
  created_on: "",
  created_by: "",
}),
  (app.config = {
    data: function () {
      return {
        new_post: Vue.ref(clone(app.empty_post)),
        posts: Vue.ref([]),
        tags: [],
        toggle_tags: [],
      };
    },
    created() {
      this.retrieve();
    },
    methods: {
      // create a new post from body {content: "..."}
      add_post: function () {
        axios
          .post("/tagged_posts/api/posts", app.vue.new_post)
          .then(function (res) {
            app.vue.new_post.id = res.data.id;
            app.vue.posts.unshift(clone(app.vue.new_post));
            app.vue.new_post = clone(app.empty_post);
          });
        app.vue.retrieve();
      },
      // to retrieve all known tags (without duplicates, sorted alphabetically)
      retrieve: function () {
        axios.get("/tagged_posts/api/tags").then(function (res) {
          app.vue.tags = res.data.tags;
        });
      },
      //tags should be toggable and toggling tags should refresh the feed and tags. When a a tag is toggled/selected should have an additional class selected.
      add_tag: function (tag) {
        if (app.vue.toggle_tags.includes(tag)) {
          let index = app.vue.toggle_tags.indexOf(tag);
          app.vue.toggle_tags.splice(index, 1);
        } else {
          app.vue.toggle_tags.push(tag);
        }
        app.load_posts();
      },

      delete_post: function (id) {
        axios.delete(`/tagged_posts/api/posts/${id}`, id).then(function (res) {
          app.vue.posts = app.vue.posts.filter((post) => post.id != id);
        });
      },
    },
  });
app.load_posts = function () {
  let url_ext = "";
  if (app.vue.toggle_tags.length > 0) {
    url_ext = "?tags=" + app.vue.toggle_tags.join(",");
  }
  axios.get("/tagged_posts/api/posts" + url_ext).then(function (res) {
    console.log("loading posts");
    app.vue.posts = res.data.posts;
  });
};

app.vue = Vue.createApp(app.config).mount("#app");
app.load_posts();
