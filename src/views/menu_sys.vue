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
        <v-layout align-left justify-left  wrap row>
          <v-flex xs12 sm4 md3 v-for="sistema in sistemas" :key="sistema.sistema" ma-1>
                <v-card>
                  <v-img
                    :src="image[`${sistema.sistema}`]"
                    aspect-ratio="2.75"
                  ></v-img>

                  <v-card-title primary-title>

                      <h3 class="headline mb-0">{{sistema.sistema}}</h3>



                  </v-card-title>

                  <v-card-actions>
                    <v-btn icon @click="show[`${sistema.sistema}`] = !show[`${sistema.sistema}`]">
                      <v-icon>{{ show[`${sistema.sistema}`] ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn text color="blue" @click="LoadSis(sistema.link,sistema.sistema)">Ir a Sistema</v-btn>
                  </v-card-actions>

                  <v-slide-y-transition>
                    <v-card-text v-show="show[`${sistema.sistema}`]">
                      {{descripcion[`${sistema.sistema}`]}}
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
      tempSis: null,
      drawer: null,
      descripcion: {
        Inventario: 'El inventario representa la existencia de bienes almacenados destinados a realizar una operación, sea de compra, alquiler, venta, uso o transformación. Debe aparecer, contablemente, dentro del activo como un activo circulante.',

        Caja: 'La caja es el área donde estarás la mayor parte del tiempo brindando atención a clientes y cobrando por los productos de la tienda.',
      },
      image: {
        background: require('./../assets/background.jpg'),
        Inventario: require('./../assets/manufacturing-inventory.jpg'),
        Caja: require('./../assets/cajera-supermercado.jpg'),
      },
      alert: {
        type: 'info',
        model: false,
        text: '',
      },
      show: {
      Inventario: false,
      Caja: false,
      },

    }),

    created() {
      this.sistemas = this.$store.getters.sistemas;
    },
    methods: {

      checkSis(sistemas) {
        return sistemas.sistema = this.tempSis;
      },

      LoadSis(link, sistema) {
        this.tempSis = sistema;
        const index = this.sistemas.findIndex(this.checkSis);
        this.$store.commit('setCS', index);
        this.$router.push(link);
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
          this.alert.model = true;
        } finally {
          this.$http.defaults.headers.common.Authorization = 'Bearer ' + token.data.data.logout;
          this.$router.push('/');

        }
      },
    },
  };
</script>
