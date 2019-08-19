<template>

  <!--

             <input type="file" accept="image/*" @change="uploadPhoto">

-->
<v-app style="background-color: rgba(255,255,255,0.0);">


  <v-toolbar flat color="primary" dark max-height="70">
    <v-toolbar-title dark>Productos</v-toolbar-title>

        <v-progress-linear
      :active="!loading"
      :indeterminate="!loading"
      absolute
      top
      color="deep-purple accent-4"
    ></v-progress-linear>

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
            </v-layout>

            <v-layout row wrap>
              <v-flex md6>
                <v-text-field label="Nombre" v-model="editedItem.nombre" :filled="view" :readonly="view" autofocus></v-text-field>

                <v-autocomplete  :filled="view" :readonly="view" :items="marcas"  item-text="nombre" item-value="_id" label="marca" v-model="editedItem.marca"></v-autocomplete>
              </v-flex>
              <v-flex md6>
<!--
                <v-img :src="getImg(editedItem.image, editedItem._id )" max-height="150px" alt="no_img" >
                </v-img>
-->
                <v-img :src="getImg(editedItem.image, editedItem._id )" max-height="150px" alt="no_img" lazy-src="./../../../assets/loading.jpg"  aspect-ratio="1"  class="grey lighten-2">

                    <input id="upload" type="file" accept="image/*" @change="to_upload" label="Seleccionar Foto" style="height: 150px;" v-show="!view" ref="imgInput">
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular indeterminate color="grey lighten-5" v-show="!foto.new"></v-progress-circular>
                        <p>Loading</p>
                      </v-row>
                    </template>
                </v-img>

              </v-flex>
            </v-layout>

              <v-layout row wrap>
                <v-flex md12>
                  <v-textarea outlined label="Descripcion" v-model="editedItem.descripcion" :filled="view" :readonly="view"></v-textarea>
                </v-flex>
              </v-layout>
              <v-layout wrap>
              <v-flex>
                <v-text-field v-mask="'A - A#- A#'" return-masked-value label="Ubicacion" v-model="editedItem.location" :filled="view" :readonly="view"></v-text-field>
              </v-flex>
              <v-flex>
                <v-autocomplete label="Unidad" :filled="view" :readonly="view" v-model="editedItem.unidad" :items="unidades" item-text="nombre" item-value="nombre"></v-autocomplete>
              </v-flex>

              <v-flex>
                <v-autocomplete v-model="editedItem.Suplidor_primario" :filled="view" :readonly="view" :items="suplidores" item-text="nombre" item-value="_id" label="Suplidor Primario"></v-autocomplete>
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
          :items="productos"
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
import gql from 'graphql-tag';
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
    loading: true,
    tableLoading: false,
    cardLoading: false,
    search: '',
    dialog: false,
    view: false,
    unidades: [
      {nombre: "C/U"},
      {nombre: "Gramo"},
      {nombre: "kilogramo"},
      {nombre: "Miligramo"},
      {nombre: "Libra"},
      {nombre: "Metro"},
      {nombre: "Metro cuadrado"},
      {nombre: "Metro cúbico"},
      {nombre: "Litro"},
      {nombre: "Galon"},
    ],
    headers: [
      {
        text: 'Nombre',
        value: 'nombre'
      },
      /*
      {
        text: 'Marca',
        value: 'marca'
      },
      */
      {
        text: 'Ubicacion',
        value: 'location'
      },
      {
        text: 'Cantidad',
        value: 'cantidad'
      },
      {
        text: 'Unidad',
        value: 'unidad'
      },
      /*
      {
        text: 'Suplidor Primario',
        value: 'Suplidor_primario'
      },
      */
      {
        text: 'Actions',
        value: 'action',
        sortable: false
      }
    ],
    foto: {
      file: new File(["./../../../assets/forest-art.jpg"], "forest-art.jpg"),
      new: false
    },
    productos: [],
    suplidores: [],
    marcas: [],
    editedIndex: -1,
    editedItem: {
      _id: '',
      nombre: '',
      image: 'forest-art.jpg',
      descripcion: '',
      location: '',
      cantidad: 0.0,
      unidad: '',
      Suplidor_primario: '',
      marca: '',
      active: true,
    },
    defaultItem: {
      _id: '',
      nombre: '',
      image: 'forest-art.jpg',
      descripcion: '',
      location: '',
      cantidad: 0.0,
      unidad: '',
      Suplidor_primario: '',
      marca: '',
      active: true,
    }
  }),

    computed: {
      formTitle() {
        if (this.editedIndex === -1) {
          return 'Nuevo Producto'
        } else {
          return this.view === true ? 'Mostrar Producto' : 'Editar Producto'
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
                            ProductosAll{
                              _id,
                              marca,
                              nombre,
                              image,
                              descripcion,
                              location,
                              cantidad,
                              unidad,
                              Suplidor_primario,
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
                            Productos{
                              _id,
                              marca,
                              nombre,
                              image,
                              descripcion,
                              location,
                              cantidad,
                              unidad,
                              Suplidor_primario
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

          if(this.$store.getters.currentA === true){
            this.headers.splice(4, 0, {
              text: 'Activo',
              value: 'active',
            });
          }

          if (this.$store.getters.currentA) {
          this.productos = result.data.data.ProductosAll;
        } else {
          this.productos = result.data.data.Productos;
        }
          this.tableLoading = false;
          this.Load();
        }

      },
      async Load() {

        try {
          var result1 = await axios({
            method: "POST",
            data: {
              query: `
                        {
                          Suplidores{
                            _id,
                            nombre
                          }
                        }
                  `
            }
          })
          var result2 = await axios({
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
        } catch (e) {
          this.alert.type = "error"
          this.alert.text = e
          this.alert.model = true
        } finally {
          this.suplidores = result1.data.data.Suplidores
          this.marcas = result2.data.data.marcas
        }

      },

      editItem(item) {
        this.view = false,
          this.editedIndex = this.productos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      viewItem(item) {
        this.view = true,
          this.editedIndex = this.productos.indexOf(item)
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
              message: 'Seguro que quieres inactivar producto',
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
                                    updateProducto(_id: "${item._id}", input: {
                                      active: false
                                    })
                                  }
                                  `
                              }
                            })
                if ( result.data.data.updateProducto ) {
                  const index = this.productos.indexOf(item)
                  item.active = false;
                  Object.assign(this.productos[index], item)
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
              message: 'Seguro que quieres activar producto',
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
                                    updateProducto(_id: "${item._id}", input: {
                                      active: true
                                    })
                                  }
                                  `
                              }
                            })
                if ( result.data.data.updateProducto ) {
                  const index = this.productos.indexOf(item)
                  item.active = true;
                  Object.assign(this.productos[index], item)
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
        this.dialog = false,

        this.foto.new = false;
        let list = new DataTransfer();
        this.$refs.imgInput.files = list.files;
        this.alert_dialog.model = false,
        this.view = false,
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300)
      },

      async save() {

        if (this.foto.new) {
          this.editedItem.image = this.getFileExtension(this.foto.file.name);
        }

        this.cardLoading = true
        if (this.editedIndex > -1) {
          // edita producto

          try {
            var result;

            if(this.editedItem.active === null || this.editedItem.active === undefined || this.editedItem.active === false){
              result = await axios({
                            method: "POST",
                            data: {
                              query: `
                                mutation {
                                  updateProducto(_id: "${this.editedItem._id}", input: {
                                    nombre: "${this.editedItem.nombre}",
                                    marca: "${this.editedItem.marca}",
                                    image: "${this.editedItem.image}",
                                    descripcion: """${this.editedItem.descripcion}""",
                                    location: "${this.editedItem.location}",
                                    cantidad: ${this.editedItem.cantidad},
                                    unidad: "${this.editedItem.unidad}",
                                    Suplidor_primario: "${this.editedItem.Suplidor_primario}",
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
                                  updateProducto(_id: "${this.editedItem._id}", input: {
                                    nombre: "${this.editedItem.nombre}",
                                    marca: "${this.editedItem.marca}",
                                    image: "${this.editedItem.image}",
                                    descripcion: """${this.editedItem.descripcion}""",
                                    location: "${this.editedItem.location}",
                                    cantidad: ${this.editedItem.cantidad},
                                    unidad: "${this.editedItem.unidad}",
                                    Suplidor_primario: "${this.editedItem.Suplidor_primario}",
                                    active: true
                                  })
                                }
                                `
                            }
                          })
            }

            if ( result.data.data.updateProducto ) {
              Object.assign(this.productos[this.editedIndex], this.editedItem);

              // uploadPhoto
              if (this.foto.new) {
                this.uploadPhoto(this.editedItem._id);
              }

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
                          createProducto(input: {
                            nombre: "${this.editedItem.nombre}",
                            marca: "${this.editedItem.marca}",
                            image: "${this.editedItem.image}",
                            descripcion: """${this.editedItem.descripcion}""",
                            location: "${this.editedItem.location}",
                            cantidad: ${this.editedItem.cantidad},
                            unidad: "${this.editedItem.unidad}",
                            Suplidor_primario: "${this.editedItem.Suplidor_primario}",
                            active: true
                          } )
                          }
                  `
              }
            })
            if ( result.data.data.createProducto ) {
              this.productos.push(this.editedItem);
              this.cardLoading = false;

              // uploadPhoto
              if (this.foto.new) {
              this.uploadPhoto(this.editedItem._id);
              }

              this.close();
            }else {
              this.cardLoading = false;
              this.alert_dialog.type = "error";
              this.alert_dialog.text = result.data.data.createProducto;
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

      getImg(name, _id){



       if (this.editedIndex > -1) {
         if (this.foto.new) {
           return window.URL.createObjectURL(this.foto.file);
         } else {
           let url = this.$http.defaults.baseURL;
           return url.concat('images/').concat(_id).concat('.').concat(name);
         }

        } else {
          if (this.foto.new) {
            return window.URL.createObjectURL(this.foto.file);
          } else {
            let url = this.$http.defaults.baseURL;
            return url.concat('images/');
          }

        }

      },

      to_upload({ target }){
        this.foto.file = target.files[0];
        this.foto.new = true
      },

     getFileExtension(filename){

        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1];

      },

      async uploadPhoto(id) {
        this.loading = false;

        Object.defineProperty(this.foto.file , 'name', {
          writable: true,
          value: id.concat('.').concat(this.getFileExtension(this.foto.file.name)),
        });

        const result = await this.$apollo.mutate({
          mutation: gql`mutation uploadImage($image: Upload!) {
                          uploadImage(image: $image)
                        }`,
          variables: {
            image: this.foto.file
          },
        });
        this.loading = result.data.uploadImage;
      },
    }
}


</script>

<style lang="css" scoped>

</style>
