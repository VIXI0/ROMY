<template>
<v-app style="background-color: rgba(255,255,255,0.0);">

    <v-alert  v-model="alert.model" border="left" transition="slide-x-transition" :type="alert.type" class="mb-4 ma-1">
      {{alert.text}}
    </v-alert>

  <v-toolbar flat color="primary" dark max-height="70">
    <v-toolbar-title dark>Bienvenido {{user}}</v-toolbar-title>
    <v-divider class="mx-2" inset vertical></v-divider>
    Resumen de Reportes
  </v-toolbar>

  <v-container grid-list-xs,sm,md,lg,xl>
    <v-layout row wrap>
      <v-flex md6>
        <v-card
        class="mx-auto text-xs-center"
        color="green"
        dark
        max-width="600"
      >
        <v-card-text>
          <v-sheet color="rgba(0, 0, 0, .12)">
            <v-sparkline
              :value="value"
              color="rgba(255, 255, 255, .7)"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
            >
              <template v-slot:label="item">
                ${{ item.value }}
              </template>
            </v-sparkline>
          </v-sheet>
        </v-card-text>

        <v-card-text>
          <div class="display-1 font-weight-thin">Sales Last 24h</div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="justify-center">
          <v-btn block text>Go to Report</v-btn>
        </v-card-actions>
      </v-card>
      </v-flex>

      <v-flex md6>
        <v-card
         class="mt-3 mx-auto"
         max-width="400"
       >
         <v-sheet
           class="v-sheet--offset mx-auto"
           color="cyan"
           elevation="12"
           max-width="calc(100% - 32px)"
         >
           <v-sparkline
             :labels="labels"
             :value="value"
             color="white"
             line-width="2"
             padding="16"
           ></v-sparkline>
         </v-sheet>

         <v-card-text class="pt-0">
           <div class="title font-weight-light mb-2">User Registrations</div>
           <div class="subheading font-weight-light grey--text">Last Campaign Performance</div>
           <v-divider class="my-2"></v-divider>
           <v-icon
             class="mr-2"
             small
           >
             mdi-clock
           </v-icon>
           <span class="caption grey--text font-weight-light">last registration 26 minutes ago</span>
         </v-card-text>
       </v-card>

      </v-flex>
    </v-layout>
  </v-container>

</v-app>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    alert: {
      type: "info",
      model: false,
      text: ""
    },
    user: '',
    labels: [
'12am',
'3am',
'6am',
'9am',
'12pm',
'3pm',
'6pm',
'9pm'
],
    value: [
  423,
  446,
  675,
  510,
  590,
  610,
  760
],
  }),

  created() {
    this.initialize()
  },
  methods: {
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

    }
  }
}
</script>

<style lang="css" scoped>
</style>
