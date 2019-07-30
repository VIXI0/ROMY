import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tableDense: false,

  },
  mutations: {
    changeDense(state, tableDense) {
      state.tableDense = tableDense
    },
  },
  actions: {

  },
  getters: {
  tableDense: state => state.tableDense
}
});
