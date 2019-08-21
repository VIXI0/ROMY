import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tableDense: false,
    role: {
      nombre: "",
      permisos: [],
    },
    currentSis: null,
    currentCRUDA: {
      c: false,
      r: false,
      u: false,
      d: false,
      a: false,
    },
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

    setCRUDA(state, CRUDA){
      state.currentCRUDA = CRUDA;
    },
  },
  actions: {

  },
  getters: {
  tableDense: (state) => state.tableDense,
  role: (state) => state.role,
  sistemas: (state) => state.role.permisos,
  currentSis: (state) => state.currentSis,
  currentC: (state) => state.currentCRUDA.c,
  currentR: (state) => state.currentCRUDA.r,
  currentU: (state) => state.currentCRUDA.u,
  currentD: (state) => state.currentCRUDA.d,
  currentA: (state) => state.currentCRUDA.a,

  roleName: (state) => state.role.nombre,
}
});
