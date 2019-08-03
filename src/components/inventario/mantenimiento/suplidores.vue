<template>
  <v-app style="background-color: rgba(255,255,255,0.0);">


    <v-toolbar flat color="primary" dark max-height="70">
      <v-toolbar-title dark>Suplidores</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>


      <v-dialog v-model="dialog" persistent scrollable max-width="600px" :overlay="false">
        <template v-slot:activator="{ on }">
          <v-btn color="white"  v-on="on" icon :disabled="currentCRUDA.c">
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
                <v-flex>
                  <v-text-field label="Direccion" v-model="editedItem.direccion" :filled="view" :readonly="view"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-mask="'(###) ### - ####'" label="Telefono" v-model="editedItem.telefono" :filled="view" :readonly="view"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-mask="'### - ##### - #'" label="RNC" :filled="view" :readonly="view" v-model="editedItem.rnc"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-mask="'A##########'" label="Numero Comprobante Fiscal (NCF)" v-model="editedItem.ncf" :filled="view" :readonly="view"></v-text-field>
                </v-flex>


                <v-flex xs12>
                  <h3>Representante</h3>
                  <v-divider></v-divider>
                </v-flex>


                <v-flex>
                  <v-text-field label="Nombre" v-model="editedItem.Representante" :filled="view" :readonly="view"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-mask="'(###) ### - ####'" label="Telefono" v-model="editedItem.telefonor" :filled="view" :readonly="view"></v-text-field>
                </v-flex>


                <v-flex xs12>
                  <h3>Anotaciones</h3>
                  <v-divider></v-divider>
                </v-flex>


                <v-flex>
                  <v-textarea v-model="editedItem.anotaciones" outlined name="input-7-4" label="Anotaciones" value="" :filled="view" :readonly="view" @keyup.enter="pushEnter"></v-textarea>
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
            :items="Suplidores"
            :sort-desc="[false, true]"
            :search="search"
            :dense="this.$store.getters.tableDense"
            :loading="tableLoading"
            multi-sort
            class="elevation-1">
            <template v-slot:item.action="{ item }">
              <v-icon
                v-if="currentCRUDA.r"
                small
                class="mr-2"
                @click="viewItem(item)"
              >
                mdi-magnify
              </v-icon>
              <v-icon
                v-if="currentCRUDA.u"
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                v-if="currentCRUDA.a"
                small
                class="mr-2"
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
              <v-icon
              v-if="currentCRUDA.a"
              small
              class="mr-2"
              @click="restoreItem(item)"
              >mdi-backup-restore</v-icon>
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
    currentCRUDA: {
      c: false,
      r: false,
      u: false,
      d: false,
      a: false,
    },
    headers: [{
        text: 'Nombre',
        align: 'left',
        sortable: true,
        value: 'nombre'
      },
      {
        text: 'Direccion',
        value: 'direccion'
      },
      /*{
        text: 'Telefono',
        value: 'telefono'
      },*/
      {
        text: 'NCF',
        value: 'ncf'
      },
      {
        text: 'Representante',
        value: 'Representante'
      },
      /*{
        text: 'Telefono',
        value: 'telefonor'
      },*/
      {
        text: 'Actions',
        value: 'action',
        sortable: false
      }
    ],
    Suplidores: [],
    editedIndex: -1,
    editedItem: {
      nombre: '',
      direccion: '',
      telefono: "",
      rnc: '',
      ncf: '',
      Representante: '',
      telefonor: "",
      anotaciones:""
    },
    defaultItem: {
      nombre: '',
      direccion: '',
      telefono: "",
      rnc: '',
      ncf: '',
      Representante: '',
      telefonor: "",
      anotaciones: ""
    }
  }),

    computed: {
      formTitle() {
        if (this.editedIndex === -1) {
          return 'Nuevo Suplidor'
        } else {
          return this.view === true ? 'Mostrar Suplidor' : 'Editar Suplidor'
        }

      }
    },

    watch: {
      dialog(val) {
        val || this.close()
      }
    },

    created() {
      this.initialize()
      this.currentCRUDA = this.$store.getters.currentCRUDA
    },

    methods: {

      async initialize() {
        this.tableLoading = true
        try {
          var result = await axios({
            method: "POST",
            data: {
              query: `
                        {
                          Suplidores{
                            _id,
                            nombre,
                            direccion,
                            telefono,
                            rnc,
                            ncf,
                            Representante,
                            telefonor,
                            anotaciones
                          }
                        }
                  `
            }
          })
        } catch (e) {
          this.alert.type = "error"
          this.alert.text = e
          this.alert.model = true
        } finally {
          this.Suplidores = result.data.data.Suplidores
          this.tableLoading = false
        }

      },

      editItem(item) {
        this.view = false,
          this.editedIndex = this.Suplidores.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      viewItem(item) {
        this.view = true,
          this.editedIndex = this.Suplidores.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true

      },

      deleteItem(item){
                  const options = {
              type: 'question',
              buttons: ['Cancelar', 'Si, Seguro'],
              defaultId: 0,
              noLink: true,
              cancelId: 0,
              title: 'Confirmacion',
              message: 'Seguro que quieres inactivar suplidor',
              detail: 'Para activarlo nuevamente consulte a su administrador',
              //checkboxLabel: 'Remember my answer',
              //checkboxChecked: true,
            };
            dialog.showMessageBox(null, options, (response/*, checkboxChecked*/) => {
            //console.log(response);
            //console.log(checkboxChecked);
              });
      },

      restoreItem(item){
                  const options = {
              type: 'question',
              buttons: ['Cancelar', 'Si, Seguro'],
              defaultId: 0,
              noLink: true,
              cancelId: 0,
              title: 'Confirmacion',
              message: 'Seguro que quieres activar suplidor',
              detail: 'Para desactivarlo nuevamente consulte a su administrador',
              //checkboxLabel: 'Remember my answer',
              //checkboxChecked: true,
            };
            dialog.showMessageBox(null, options, (response/*, checkboxChecked*/) => {
            //console.log(response);
            //console.log(checkboxChecked);
              });
  },

      close() {
        this.view = false,
          this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      async save() {
        this.cardLoading = true
        if (this.editedIndex > -1) {
          // edita Suplidor

          var result = await axios({
                        method: "POST",
                        data: {
                          query: `
                            mutation {
                              updateSuplidor(_id: "${this.editedItem._id}", input: {
                                nombre: "${this.editedItem.nombre}",
                                direccion: "${this.editedItem.direccion}",
                                telefono: ["${this.editedItem.telefono}"],
                                rnc: "${this.editedItem.rnc}",
                                ncf: "${this.editedItem.ncf}",
                                Representante: "${this.editedItem.Representante}",
                                telefonor: ["${this.editedItem.telefonor}"],
                                anotaciones: """${this.editedItem.anotaciones}"""
                              })
                            }
                            `
                        }
                      })
          if ( result.data.data.updateSuplidor ) {
            Object.assign(this.Suplidores[this.editedIndex], this.editedItem)
            this.cardLoading = false
            this.close()
          }else {
            this.cardLoading = false
            this.alert_dialog.type = "error"
            this.alert_dialog.text = result.data.error.errors.message
            this.alert_dialog.model = true
          }

        } else {

          var result = await axios({
            method: "POST",
            data: {
              query: `
                mutation {
                        createSuplidor(input: {
                          nombre: "${this.editedItem.nombre}",
                          direccion: "${this.editedItem.direccion}",
                          telefono: ["${this.editedItem.telefono}"],
                          rnc: "${this.editedItem.rnc}",
                          ncf: "${this.editedItem.ncf}",
                          Representante: "${this.editedItem.Representante}",
                          telefonor: ["${this.editedItem.telefonor}"],
                          anotaciones: """${this.editedItem.anotaciones}""",
                          active: true
                        } )
                        }
                `
            }
          })
          if ( result.data.data.createSuplidor ) {
            this.Suplidores.push(this.editedItem)
            this.cardLoading = false
            this.close()
          }else {
            this.cardLoading = false
            this.alert_dialog.type = "error"
            this.alert_dialog.text = result.data.data.createSuplidor
            this.alert_dialog.model = true
          }

        }


      },
      pushEnter(){
        this.editedItem.anotaciones.concat("");
      }
    }
}
</script>

<style lang="css" scoped>
</style>
