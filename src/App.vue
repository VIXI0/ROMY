<template>
  <v-app>
<!--
  <v-system-bar color="primary" style="color: black; -webkit-app-region: drag;" app elevation="20">
    <img src="./../build/icons/24x24.png" alt="">
    <span>ROM</span>
    <v-spacer></v-spacer>
    <v-btn @click="minimize" text style="-webkit-app-region: no-drag"><v-icon  style="color: black;">mdi-window-minimize</v-icon></v-btn>
    <v-btn @click="maximize" text style="-webkit-app-region: no-drag"><v-icon style="color: black;">{{maxicon}}</v-icon></v-btn>
    <v-btn color="red darken-4" @click="quit" text  style="-webkit-app-region: no-drag"><v-icon color="black" style="color: black;">mdi-window-close</v-icon></v-btn>
  </v-system-bar>

  <v-content>
    <router-view></router-view>
  </v-content>
-->

    <router-view></router-view>

  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
const { remote } = require('electron');
var win = remote.getCurrentWindow();

export default Vue.extend({
  name: 'App',
  data: () => ({
      maxicon: 'mdi-window-maximize',
  }),

  methods: {

    quit(){
      win.close();
    },

    minimize(){
      win.minimize();
    },

    maximize(){
      if(!win.isMaximized()){
        win.maximize();
        this.maxicon = 'mdi-window-restore';
      }else{
        win.unmaximize();
        this.maxicon = 'mdi-window-maximize';
      }
    }
  }
});


//gradient="to top right,rgba(0, 0, 0, 0.5), rgba(25,32,72,.7)"
</script>

<style media="screen">
button {
-webkit-app-region: no-drag;
}

mainbar {
  -webkit-app-region: drag;
}


::-webkit-scrollbar       {background-color:#fff;width:0px}
::-webkit-scrollbar-track {background-color:#fff}
::-webkit-scrollbar-thumb {background-color:#babac0;border-radius:16px;border:4px solid #fff}
</style>
