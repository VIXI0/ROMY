import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tableDense: false,
    role: {
      permisos: [],
    },
    currentSis: null,
  },
  mutations: {
    changeDense(state, tableDense) {
      state.tableDense = tableDense;
    },

    setRole(state, role) {
      state.role = role;
    },

    setCS(state, nSis){
      state.currentSis = nSis;
    },
  },
  actions: {

  },
  getters: {
  tableDense: state => state.tableDense,
  role: state => state.role,
  sistemas: state => state.role.permisos
}
});
