import Vue from 'vue';
import Router from 'vue-router';
import login from './views/login.vue';

import inv_main from './components/inventario/navigation/navigation.vue';
import inv_welcome from './components/inventario/welcome/welcome.vue';

// mantenimiento
import inv_suplidores from './components/inventario/mantenimiento/suplidores.vue';
import inv_marcas from './components/inventario/mantenimiento/marcas.vue';
import inv_productos from './components/inventario/mantenimiento/productos.vue';


//Proceso
import inv_compra from './components/inventario/proceso/compra.vue';
import inv_orden_compra from './components/inventario/proceso/orden_compra.vue';
import inv_recepcion_orden_compra from './components/inventario/proceso/recepcion_orden_compra.vue';
import inv_transferencia from './components/inventario/proceso/transferencia.vue';

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

          {
            path: '/inv_productos',
            name: 'inv_productos',
            component: inv_productos
          },

          {
            path: '/inv_compra',
            name: 'inv_compra',
            component: inv_compra
          },

          {
            path: '/inv_orden_compra',
            name: 'inv_orden_compra',
            component: inv_orden_compra
          },

          {
            path: '/inv_recepcion_orden_compra',
            name: 'inv_recepcion_orden_compra',
            component: inv_recepcion_orden_compra
          },

          {
            path: '/inv_transferencia',
            name: 'inv_transferencia',
            component: inv_transferencia
          },

      ]
    }
  ],
});
