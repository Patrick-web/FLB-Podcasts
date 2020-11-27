import Vuex from "vuex";
import Vue from "vue";
import podcasts from "./modules/podcasts";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    podcasts,
  },
});
