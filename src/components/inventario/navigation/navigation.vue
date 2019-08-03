<template>
  <v-app>

    <v-app-bar color="primary" dense app>

      <v-btn color="white" icon text to='/inv_main'><v-icon>mdi-home</v-icon></v-btn>



      <!-- Bmenu -->
      <v-menu offset-y v-for="item in menuItems" :key="item.titulo" :close-on-content-click="false" v-model="item.menu">
        <template v-slot:activator="{on}">
          <v-btn outlined dark text v-on="on" class="mx-1">{{item.titulo}}</v-btn>
        </template>
        <v-list>

          <template v-for="sub in item.sub">

                  <template v-if="sub.tipo === 'i'">

                          <v-list-item :key="sub.titulo" @click="item.menu = false, loadCRUDA(sub)" :to="sub.link" :href="sub.href" :target="sub.target">
                            <v-list-item-title>{{sub.titulo}}</v-list-item-title>
                            <v-chip small v-if="sub.chip === 'new'" color="success" text-color="white">new</v-chip>
                            <v-chip small v-if="sub.chip === 'fixing'" color="red" text-color="white">fixing</v-chip>
                          </v-list-item>

                  </template>

                  <template v-else-if="sub.tipo === 'g'">

                          <v-list-group :key="sub.titulo">

                                  <template v-slot:activator>
                                    <v-list-item>
                                      <v-list-item-title>{{sub.titulo}}</v-list-item-title>
                                    </v-list-item>
                                  </template>
                                  <template v-for="sub2 in sub.sub">

                                    <template v-if="sub2.tipo === 'i'">

                                        <v-list-item :key="sub2.titulo" @click="item.menu = false, loadCRUDA(sub2)"  :to="sub2.link" :href="sub2.href" :target="sub2.target">
                                          <v-list-item-title >{{sub2.titulo}}</v-list-item-title>
                                          <v-chip small v-if="sub.chip === 'new'" color="success" text-color="white">new</v-chip>
                                          <v-chip small v-if="sub.chip === 'fixing'" color="red" text-color="white">fixing</v-chip>
                                        </v-list-item>

                                    </template>

                                    <template v-if="sub2.tipo === 'sg'">

                                          <v-list-group no-action sub-group :key="sub2.titulo">
                                                <template v-slot:activator>
                                                 <v-list-item >
                                                   <v-list-item-title>{{sub2.titulo}}</v-list-item-title>
                                                 </v-list-item>
                                                </template>

                                                <template v-for="sub3 in sub2.sub">
                                                       <v-list-item :key="sub3.titulo" @click="item.menu = false, loadCRUDA(sub3)" :to="sub3.link" :href="sub3.href" :target="sub3.target">
                                                         <v-list-item-title  >{{sub3.titulo}}</v-list-item-title>
                                                         <v-chip small v-if="sub.chip === 'new'" color="success" text-color="white">new</v-chip>
                                                         <v-chip small v-if="sub.chip === 'fixing'" color="red" text-color="white">fixing</v-chip>
                                                       </v-list-item>
                                                </template>

                                             </v-list-group>

                                    </template>

                                  </template>

                          </v-list-group>

                        </template>


          </template>



        </v-list>
      </v-menu>



      <v-spacer>
        <v-alert  v-model="alert.model" border="left" transition="slide-x-transition" :type="alert.type" class="mb-4 my-10">
          {{alert.text}}
        </v-alert>
      </v-spacer>

        <!-- NAVABAR AVATAR MENU-->
        <div class="text-xs-center">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="200"
            offset-x
          >
            <template v-slot:activator="{ on }">
              <v-btn small fab dark color="white" v-on="on" class="elevation-0">

                  <v-avatar size="40">
                    <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="alt">
                  </v-avatar>

            </v-btn>
            </template>

            <v-card>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{user}}</v-list-item-title>
                    <v-list-item-subtitle>no rol atribuido</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn
                    color="black"
                      icon
                    >
                      <v-icon>mdi-account-badge-horizontal-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-item>
                  <v-list-item-action>
                    <v-switch color="purple"></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>Activar notificaciones</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-action>
                    <v-switch color="black" v-model="tableDense"></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>Tablas densas</v-list-item-title>
                </v-list-item>
              </v-list>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="primary" text to="/menu_sys">Salir del Sistema</v-btn>
                <v-btn color="error" text @click="logout">Cerrar sesión</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
    </v-app-bar>


      <v-img :src="image.background">
        <v-content>
          <router-view></router-view>
        </v-content>
      </v-img>


  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({

    image: {
      background: require('./../../../assets/background.jpg')
    },
    tableDense: false,
    alert: {
      type: "info",
      model: false,
      text: "test"
    },
    user: '',
    menu: false,
    menuItems: [],
    menuDELETED: [
      //type g = to group && type sg = sub-group && type i = to item  // sub = submenu || subitem
      //layout [  { title: '', menu: '', sub:[{}]}  ] [  {type: 'i', title: '', link: '', href: ''}  ]
      {title: 'Mantenimiento', menu: false, sub: [
         {type: 'i', title: 'Suplidores', link: '/inv_suplidores' },{type: 'i', title: 'Productos', link: '/listprod' }, {type: 'i', title: 'Marcas', link: '/listmarca' },
           {type: 'g', title: 'grupo', sub:[ {type: 'i', title: 'Registro', link: '', href: ''}, {type: 'i', title: 'Modificacion', link: '', href: ''}, {type: 'i', title: 'Consulta', link: '', href: ''}]}
         ] },

      {title: 'Proceso', menu: false, sub:  [ {type: 'i', title: 'Entrada', link: '/Entrada_prod', href: ''}, {type: 'i', title: 'Clientes', link: '/Clientes', href: '', chip: 'fixing'}, {type: 'i', title: 'Facturacion', link: '/Caja_fac', href: '', chip: 'coming soon'}, {type: 'g', title: 'item', sub:  [  {type: 'sg', title: 'item',  sub:  [  {type: 'i', title: 'item', link: '', href: ''}  ]}  ] }  ] },

      {title: 'Consulta y Reporte', menu: false, sub: [  {type: 'i', title: 'Data Credito', link: '', href: 'https://www.datacredito.com.do/', target: '_Blank',chip: 'new'}, {type: 'i', title: 'item', link: '', href: ''}  ] },

      {title: 'Utilidades', menu: false, sub: [  {type: 'i', title: 'item', link: '', href: ''}  ] },

      {title: 'Seguridad', menu: false, sub: [ {type: 'i', title: 'Backup', link: '/Backup', href: '', chip: 'new'}, {type: 'i', title: 'item', link: '', href: ''}  ] },

      {title: 'Ayuda',menu: false, sub: [  {type: 'i', title: 'item', link: '', href: ''}, {type: 'i', title: 'item2', link: '', href: ''}  ] }


    ],
  }),

  created() {
    this.menuItems = this.$store.getters.sistemas[this.$store.getters.currentSis].menu
    this.initialize()
  },

  watch: {
    tableDense(tableDense) {
      this.$store.commit('changeDense', tableDense)
    }
  },

  methods: {
    loadCRUDA(sub){
      const CRUDA = {
        c: sub.c,
        r: sub.r,
        u: sub.u,
        d: sub.d,
        a: sub.a
      }

      this.$store.commit('setCRUDA', CRUDA);
      console.log(CRUDA);
    },
    async initialize() {

      try {
        var result = await axios({
          method: "POST",
          data: {
            query: `
            {
              currentU
            }
                `
          }
        })
      } catch (e) {
        this.alert.type = "error"
        this.alert.text = e
        this.alert.model = true
      } finally {
        this.user = result.data.data.currentU
      }

    },

    async logout() {
      try {
        var token = await axios({
          method: 'POST',
          data: {
            query: `
            {
              logout
            }
                ` ,
          },
        });
      } catch (e) {
        this.alert.type = 'error',
        this.alert.text = e,
        this.alert.model = true
      } finally {
        this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token.data.data.logout;
        this.$router.push('/')

      }
    },


  },
}
</script>

<style lang="css" scoped>
</style>
