import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tableDense: false,
    role: {},
  },
  mutations: {
    changeDense(state, tableDense) {
      state.tableDense = tableDense
    },

    setRole(state, role) {
      state.role = role
    },
  },
  actions: {

  },
  getters: {
  tableDense: state => state.tableDense,
  role: state => state.role
}
});
