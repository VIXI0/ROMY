<template>
<v-content>




      <div>
        <v-stepper v-model="e6" vertical class="ma-5">
          <v-stepper-step :complete="e6 > 1" step="1" editable>
            Selección de paneles
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-card class="d-flex align-stretch mb-12" height="200px" flat tile>

              <v-card  class="pa-2" tile flat>
                <v-text-field
                  v-model="CM"
                  label="Consumo Mensual"
                  rounded
                  outlined
                  prepend-icon="mdi-lightbulb-on-outline"
                  suffix="KW"
                  shaped
                  type="number"
                ></v-text-field>

                <v-autocomplete
                  v-model="PP"
                  label="Paneles"
                  rounded
                  outlined
                  prepend-icon="mdi-solar-panel-large"
                  suffix="W"
                  shaped
                  type="number"
                  :items="paneles"
                ></v-autocomplete>
              </v-card>

              <v-card class="pa-2" tile flat>


                      <v-autocomplete
                        v-model="HP"
                        label="Horas Pico"
                        rounded
                        outlined
                        prepend-icon="mdi-timer-sand"
                        suffix="Hrs"
                        shaped
                        type="number"
                        :items="hora_pico"
                      ></v-autocomplete>

                        <v-autocomplete
                          v-model="FS1"
                          label="Factor De Seguridad"
                          rounded
                          outlined
                          prepend-icon="mdi-shield-half-full"
                          suffix="%"
                          shaped
                          type="number"
                          :items="factorS"
                        ></v-autocomplete>
              </v-card>


            </v-card>
            <v-btn color="primary" @click="calcularPaneles()">Continuar</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="e6 > 2" step="2" editable>
            Selección de baterias
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-card class="d-flex align-stretch mb-12" height="200px" flat tile>
              <v-card  class="pa-2" tile flat>
                <v-autocomplete
                  v-model="TB"
                  label="Tensión Bateria"
                  rounded
                  outlined
                  prepend-icon="mdi-car-battery"
                  suffix="V"
                  shaped
                  type="number"
                  :items="bateria"
                ></v-autocomplete>

                <v-text-field
                  v-model="AU"
                  label="Autonomia"
                  rounded
                  outlined
                  prepend-icon="mdi-av-timer"
                  suffix="Dias"
                  shaped
                  type="number"
                ></v-text-field>
              </v-card>

              <v-card class="pa-2" tile flat>

                        <v-autocomplete
                          v-model="FS2"
                          label="Factor De Seguridad"
                          rounded
                          outlined
                          prepend-icon="mdi-shield-half-full"
                          suffix="%"
                          shaped
                          type="number"
                          :items="factorS"
                        ></v-autocomplete>
              </v-card>
            </v-card>
            <v-btn color="primary" @click="calcularBaterias()">Continuar</v-btn>
            <v-btn text @click="e6 = 1">Atras</v-btn>
          </v-stepper-content>

          <v-stepper-step step="3">Resultado</v-stepper-step>
          <v-stepper-content step="3">
            <v-card color="grey lighten-1" class="d-flex align-stretch mb-12" height="200px" flat tile>

              <v-card class="pa-2 ma-1" tile flat>
                <v-card-title primary-title>
                  PANELES
                </v-card-title>
                <v-card-text>
                  Cantidad: {{ resultado.paneles.cantidad }}<br>
                  Potencia: {{ resultado.paneles.potencia }} W<br>
                </v-card-text>
              </v-card>

              <v-card class="pa-2 ma-1" tile flat>
                <v-card-title primary-title>
                  BATERIAS
                </v-card-title>
                <v-card-text>
                  Cantidad: {{ resultado.baterias.cantidad }}<br>
                  Tension:  {{ resultado.baterias.tension }} A<br>
                  Autonomia: {{ AU }} Dias<br>
                </v-card-text>
              </v-card>

              <v-card class="pa-2 ma-1" tile flat>
                <v-card-title primary-title>
                  INVERSOR
                </v-card-title>
                <v-card-text>
                  Cantidad: {{resultado.inversor.cantidad}}<br>
                  Potencia: >= {{ resultado.inversor.potencia }} Kva<br>
                </v-card-text>
              </v-card>

            </v-card>
            <v-btn color="primary" @click="Imprimir()">Imprimir</v-btn>
            <v-btn text @click="Restart()">Reiniciar</v-btn>
          </v-stepper-content>
      </v-stepper>
      </div>

</v-content>
</template>

<script>

export default {
  props: {
    source: String,
  },
  data: () => ({

    image: {
      background: require('./../assets/background.jpg'),
    },
    paneles: [285, 290, 295, 325, 327, 330, 335, 345, 360],
    hora_pico: [1, 2, 3, 4, 5, 6, 7, 8],
    factorS: [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5],
    bateria: [24, 48],
    e6: 1,
    loading: false,
    drawer: null,
    alert: {
      type: 'info',
      model: false,
      text: '',
    },
    CM: 0,
    PP: 0,
    HP: 0,
    FS1: 0,
    FS2: 0,
    TB: 0,
    AU: 0,
    resultado: {

      paneles: {
        cantidad: 0,
        Potencia: 0,
      },
      baterias: {
        cantidad: 0,
        Tension: 0,
      },
      inversor: {
        cantidad: 1,
        potencia: 0,
      },
    }
  }),

  methods: {

    Restart() {
      this.CM = 0;
      this.PP = 0;
      this.HP = 0;
      this.FS1 = 0;
      this.FS2 = 0;
      this.TB = 0;
      this.AU = 0;
      this.resultado = {

        paneles: {
          cantidad: 0,
          Potencia: 0,
        },
        baterias: {
          cantidad: 0,
          Tension: 0,
        },
        inversor: {
          cantidad: 1,
          potencia: 0,
        },
      };
      this.e6 = 1;
    },

    calcularPaneles() {

      this.resultado.paneles.potencia = this.PP;
      const CD = (this.CM / 30) * 1000;
      this.resultado.paneles.cantidad = Math.ceil((CD * this.FS1)/(this.HP * this.PP));
      this.e6 = 2;

    },

    calcularBaterias() {

      const CD = (this.CM / 30) * 1000;
      const AP = CD/this.TB;
      const CB = (this.AU * AP)/this.FS2;

      this.resultado.baterias.tension = Math.ceil(AP);

      if (this.TB === 48) {
        this.resultado.baterias.cantidad = Math.ceil(CB/400);
      }else if (this.TB === 24) {
        this.resultado.baterias.cantidad = Math.ceil(CB/200);
      }
      this.e6 = 3;
    },

    calcularInversor() {
      const w = this.resultado.paneles.cantidad * this.PP;
      this.resultado.inversor.potencia = Math.ceil(W/1000);

    },

    Imprimir() {},

  },
};
</script>
