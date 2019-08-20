<template>
  <v-app style="background-color: rgba(255,255,255,0.0);">


    <v-toolbar flat color="primary" dark max-height="70">
      <v-toolbar-title dark>trasferencia</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>


      <v-dialog v-model="dialog" persistent scrollable max-width="600px" :overlay="false">
        <template v-slot:activator="{ on }">
          <v-btn color="white"  v-on="on" icon v-show="$store.getters.currentC">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>

        <v-card :loading="cardLoading">
          <v-card-title class="headline primary lighten-2" dark>
            <span style="color:white" class="headline">{{ formTitle }}</span>
            <v-spacer></v-spacer>
            <v-btn dark icon @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>


          <v-card-text>

            <v-alert  v-model="alert_dialog.model" border="left" transition="slide-x-transition" :type="alert_dialog.type" class="mb-4 ma-1">
              {{alert_dialog.text}}
            </v-alert>

            <v-container grid-list-md>
              <v-layout wrap>

                <v-flex xs12>
                  <h3>Datos</h3>
                  <v-divider></v-divider>
                </v-flex>


                <v-flex>
                  <v-text-field label="Nombre" v-model="editedItem.nombre" :filled="view" :readonly="view" autofocus></v-text-field>
                </v-flex>

              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions v-if="!view" style="background-color: lightgray;">
            <v-spacer></v-spacer>
            <v-btn text color="red" @click="close">Cancelar</v-btn>
            <v-btn color="primary" @click="save">Guardar</v-btn>
          </v-card-actions>

          <v-card-actions v-else style="background-color: lightgray;">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="close">Aceptar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-spacer></v-spacer>

      <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" color="white" single-line hide-details rounded solo-inverted flat clearable></v-text-field>

    </v-toolbar>

    <v-alert  v-model="alert.model" border="left" transition="slide-x-transition" :type="alert.type" class="mb-4 ma-1">
      {{alert.text}}
    </v-alert>

    <v-container grid-list-xs,sm,md,lg,xl>
      <v-layout row wrap>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="marcas"
            :sort-desc="[false, true]"
            :search="search"
            :dense="this.$store.getters.tableDense"
            :loading="tableLoading"
            multi-sort
            class="elevation-1">

            <template v-slot:item.active="{ item }">
              <v-chip small :color="getColor(item.active)" dark>{{ getActive(item.active) }}</v-chip>
            </template>

            <template v-slot:item.action="{ item }">
              <v-icon
                v-show="$store.getters.currentR"
                small
                class="mr-2"
                @click="viewItem(item)"
              >
                mdi-magnify
              </v-icon>
              <v-icon
                v-show="$store.getters.currentU"
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>

              <template v-if="item.active">
                <v-icon
                  v-show="$store.getters.currentA"
                  small
                  class="mr-2"
                  @click="deleteItem(item)"
                >
                  mdi-delete
                </v-icon>
              </template>

              <template v-else>
                <v-icon
                v-show="$store.getters.currentA"
                small
                class="mr-2"
                @click="restoreItem(item)"
                >mdi-backup-restore</v-icon>
              </template>




            </template>
        </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>

  </v-app>
</template>

<script>
import axios from 'axios';
const { dialog } = require('electron').remote;
import {mask} from 'vue-the-mask';

export default {
  directives: {mask},
  data: () => ({
    alert: {
      type: "info",
      model: false,
      text: ""
    },
    alert_dialog: {
      type: "info",
      model: false,
      text: ""
    },
    tableLoading: false,
    cardLoading: false,
    search: '',
    dialog: false,
    view: false,

    headers: [
      {
        text: 'Nombre',
        value: 'nombre'
      },
      {
        text: 'Actions',
        value: 'action',
        sortable: false
      }
    ],
    marcas: [],
    editedIndex: -1,
    editedItem: {
      _id: '',
      nombre: '',
      active: true,
    },
    defaultItem: {
      _id: '',
      nombre: '',
      active: true,
    }
  }),

    computed: {
      formTitle() {
        if (this.editedIndex === -1) {
          return 'Nuevo Marca'
        } else {
          return this.view === true ? 'Mostrar Marca' : 'Editar Marca'
        }

      }
    },

    watch: {
      dialog(val) {
        val || this.close()
      }
    },

    created() {
      //this.currentCRUDA = this.$store.getters.currentCRUDA;



        this.initialize();

    },

    methods: {

      async initialize() {
        this.tableLoading = true
        try {
          var result;
          if (this.$store.getters.currentA) {
            result = await axios({
              method: "POST",
              data: {
                query: `
                          {
                            marcasAll{
                              _id,
                              nombre,
                              active
                            }
                          }
                    `
              }
            })
          } else {
            result = await axios({
              method: "POST",
              data: {
                query: `
                          {
                            marcas{
                              _id,
                              nombre
                            }
                          }
                    `
              }
            })
          }

        } catch (e) {
          this.alert.type = "error"
          this.alert.text = e
          this.alert.model = true
        } finally {

          if(this.$store.getters.currentA){
            this.headers.splice(1, 0, {
              text: 'Activo',
              value: 'active',
            });
            this.marcas = result.data.data.marcasAll;
          }else {
            this.marcas = result.data.data.marcas
          }


          this.tableLoading = false
        }

      },

      editItem(item) {
        this.view = false,
          this.editedIndex = this.marcas.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      viewItem(item) {
        this.view = true,
          this.editedIndex = this.marcas.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true

      },

      async deleteItem(item){
                  const options = {
              type: 'question',
              buttons: ['Cancelar', 'Si, Seguro'],
              defaultId: 0,
              noLink: true,
              cancelId: 0,
              title: 'Confirmacion',
              message: 'Seguro que quieres inactivar marca',
              detail: 'Para activarlo nuevamente consulte a su administrador',
              //checkboxLabel: 'Remember my answer',
              //checkboxChecked: true,
            };
            dialog.showMessageBox(null, options, async (response/*, checkboxChecked*/) => {
            //console.log(response);
            //console.log(checkboxChecked);

            if(response === 1){
              this.tableLoading = true;

              try {
                //console.log(item);
                var result = await axios({
                              method: "POST",
                              data: {
                                query: `
                                  mutation {
                                    updateMarca(_id: "${item._id}", input: {
                                      active: false
                                    })
                                  }
                                  `
                              }
                            })
                if ( result.data.data.updateMarca ) {
                  const index = this.marcas.indexOf(item)
                  item.active = false;
                  Object.assign(this.marcas[index], item)
                  this.tableLoading = false
                }else {
                  this.tableLoading = false
                  this.alert.type = "error"
                  this.alert.text = result.data.error.errors.message
                  this.alert.model = true
                }
              } catch (e) {
                this.tableLoading = false
                this.alert.type = "error"
                this.alert.text = e
                this.alert.model = true
              }


            }

              });
      },

      async restoreItem(item){
                  const options = {
              type: 'question',
              buttons: ['Cancelar', 'Si, Seguro'],
              defaultId: 0,
              noLink: true,
              cancelId: 0,
              title: 'Confirmacion',
              message: 'Seguro que quieres activar marca',
              detail: 'Para desactivarlo nuevamente consulte a su administrador',
              //checkboxLabel: 'Remember my answer',
              //checkboxChecked: true,
            };
            dialog.showMessageBox(null, options, async (response/*, checkboxChecked*/) => {
            //console.log(response);
            //console.log(checkboxChecked);

            if(response === 1){
              this.tableLoading = true;

              try {
                //console.log(item);
                var result = await axios({
                              method: "POST",
                              data: {
                                query: `
                                  mutation {
                                    updateMarca(_id: "${item._id}", input: {
                                      active: true
                                    })
                                  }
                                  `
                              }
                            })
                if ( result.data.data.updateMarca ) {
                  const index = this.marcas.indexOf(item)
                  item.active = true;
                  Object.assign(this.marcas[index], item)
                  this.tableLoading = false
                }else {
                  this.tableLoading = false
                  this.alert.type = "error"
                  this.alert.text = result.data.error.errors.message
                  this.alert.model = true
                }
              } catch (e) {
                this.tableLoading = false
                this.alert.type = "error"
                this.alert.text = e
                this.alert.model = true
              }


            }

              });
  },

      close() {
        this.view = false,
          this.dialog = false,
          this.alert_dialog.model = false,
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300)
      },

      async save() {
        this.cardLoading = true
        if (this.editedIndex > -1) {
          // edita marca

          try {
            var result;

            if(this.editedItem.active === null || this.editedItem.active === undefined || this.editedItem.active === false){
              result = await axios({
                            method: "POST",
                            data: {
                              query: `
                                mutation {
                                  updateMarca(_id: "${this.editedItem._id}", input: {
                                    nombre: "${this.editedItem.nombre}",
                                    active: false
                                  })
                                }
                                `
                            }
                          })
            }else {
              result = await axios({
                            method: "POST",
                            data: {
                              query: `
                                mutation {
                                  updateMarca(_id: "${this.editedItem._id}", input: {
                                    nombre: "${this.editedItem.nombre}",
                                    active: true
                                  })
                                }
                                `
                            }
                          })
            }

            if ( result.data.data.updateMarca ) {
              Object.assign(this.marcas[this.editedIndex], this.editedItem);
              this.cardLoading = false;
              this.close();
            }else {
              this.cardLoading = false;
              this.alert_dialog.type = "error";
              this.alert_dialog.text = result.data.error.errors.message;
              this.alert_dialog.model = true;
            }
          } catch (e) {
            this.cardLoading = false;
            this.alert_dialog.type = "error";
            this.alert_dialog.text = e;
            this.alert_dialog.model = true;
          }

        } else {

          try {
            var result = await axios({
              method: "POST",
              data: {
                query: `
                  mutation {
                          createMarca(input: {
                            nombre: "${this.editedItem.nombre}",
                            active: true
                          } ){
                            _id,
                            done
                          }
                          }
                  `
              }
            })
            if ( result.data.data.createMarca.done ) {
              this.editedItem._id = result.data.data.createMarca._id;
              this.marcas.push(this.editedItem);
              this.cardLoading = false;
              this.close();
            }else {
              this.cardLoading = false;
              this.alert_dialog.type = "error";
              this.alert_dialog.text = result.data.data.createMarca;
              this.alert_dialog.model = true;
            }
          } catch (e) {
            this.cardLoading = false;
            this.alert_dialog.type = "error";
            this.alert_dialog.text = e;
            this.alert_dialog.model = true;
          }

        }


      },

      getColor (active) {
        if (active) return 'green'
        else return 'red'
      },

      getActive(active){
        if(active) return 'A'
        else return 'I'
      },
    }
}
</script>

<style lang="css" scoped>
</style>
