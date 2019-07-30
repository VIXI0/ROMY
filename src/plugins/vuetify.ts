import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import es from 'vuetify/src/locale/es';

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
      locales: { es },
      current: 'es',
    },
  icons: {
    iconfont: 'mdi',
  },
});
