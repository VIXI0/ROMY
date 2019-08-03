<template>
  <v-app id="inspire">
      <v-img :src="image.background" >
        <v-toolbar
          color="primary"
          dark
          text
        >
        <v-toolbar-title>Menu de Sistemas</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              large
              v-on="on"
              @click="logout"
            >
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
          <span>Cerrar sesión</span>
        </v-tooltip>
      </v-toolbar>

      <div class="mx-1">
        <v-alert  v-model="alert.model" border="top"  :type="alert.type" class="mb-4">
          {{alert.text}}
        </v-alert>
      </div>

    <v-content>
      <v-container fluid fill-height>
        <v-layout align-left justify-left>
          <v-flex xs12 sm4 md3 v-for="sistema in sistemas" :key="sistema.sistema">
                <v-card>
                  <v-img
                    :src="image[`${sistema.sistema}`]"
                    aspect-ratio="2.75"
                  ></v-img>

                  <v-card-title primary-title>

                      <h3 class="headline mb-0">{{sistema.sistema}}</h3>



                  </v-card-title>

                  <v-card-actions>
                    <v-btn icon @click="show = !show">
                      <v-icon>{{ show ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn text color="blue" to="/inv_main">Ir a Sistema</v-btn>
                  </v-card-actions>

                  <v-slide-y-transition>
                    <v-card-text v-show="show">
                      {{sistema.descripcion}}
                    </v-card-text>
                  </v-slide-y-transition>
                </v-card>
              </v-flex>

        </v-layout>
      </v-container>
    </v-content>
  </v-img>
  </v-app>
</template>

<script>
import axios from 'axios';

  export default {

    props: {
      source: String,
    },
    data: () => ({
      sistemas: [],
      drawer: null,
      image: {
        background: require('./../assets/background.jpg'),
        Inventario: require('./../assets/manufacturing-inventory.jpg'),
      },
      alert: {
        type: 'info',
        model: false,
        text: '',
      },
      show: false,

    }),

    created() {
      this.sistemas = this.$store.getters.sistemas;
    },
    methods: {

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
          this.alert.model = true;
        } finally {
          this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token.data.data.logout;
          this.$router.push('/');

        }
      },
    },
  };
</script>
