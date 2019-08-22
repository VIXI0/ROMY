<template>
<v-content>

    <v-img :src="image.background" >


      <div>
        <v-stepper v-model="e6" vertical class="ma-5">

          <v-stepper-step :complete="e6 > 1" step="1" editable>
            Select an app
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
            <v-btn color="primary" @click="e6 = 2">Continue</v-btn>
            <v-btn text>Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="e6 > 2" step="2" editable>Configure analytics for this app</v-stepper-step>

          <v-stepper-content step="2">
            <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
            <v-btn color="primary" @click="e6 = 3">Continue</v-btn>
            <v-btn text>Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="e6 > 3" step="3" editable>Select an ad format and name ad unit</v-stepper-step>

          <v-stepper-content step="3">
            <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
            <v-btn color="primary" @click="e6 = 4">Continue</v-btn>
            <v-btn text>Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-step step="4" editable>View setup instructions</v-stepper-step>
          <v-stepper-content step="4">
            <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
            <v-btn color="primary" @click="e6 = 1">Continue</v-btn>
            <v-btn text>Cancel</v-btn>
          </v-stepper-content>
      </v-stepper>
      </div>

    </v-img>
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

    e6: 1,
    loading: false,
    drawer: null,
    alert: {
      type: 'info',
      model: false,
      text: '',
    },
        items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard' },
          { title: 'Photos', icon: 'mdi-image' },
          { title: 'About', icon: 'mdi-help-box' },
        ],
        right: null,
  }),

  methods: {


  },
};
</script>
