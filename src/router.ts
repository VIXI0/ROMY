import Vue from 'vue';
import Router from 'vue-router';
import login from './views/login.vue';

import inv_main from './components/inventario/navigation/navigation.vue';
import inv_welcome from './components/inventario/welcome/welcome.vue';
import inv_suplidores from './components/inventario/mantenimiento/suplidores.vue';
import inv_marcas from './components/inventario/mantenimiento/marcas.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/index.html",
      redirect: "/"
    },
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path: '/menu_sys',
      name: 'menu_sys',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/menu_sys.vue'),
    },
    {
      path: '/inv_main',
      name: 'inv_main',
      component: inv_main,
      children: [
        {
          path: '/inv_welcome',
          name: 'inv_welcome',
          component: inv_welcome
        },

          {
            path: '/inv_suplidores',
            name: 'inv_suplidores',
            component: inv_suplidores
          },


          {
            path: '/inv_marcas',
            name: 'inv_marcas',
            component: inv_marcas
          },
      ]
    }
  ],
});
