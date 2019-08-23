<template>
  <v-app>
<!--
    <v-navigation-drawer permanent  expand-on-hover fixed dark app :src="image.background">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
-->
      <v-img :src="image.background" >
        <router-view></router-view>
      </v-img>

  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { remote } from 'electron';
const win = remote.getCurrentWindow();

export default Vue.extend({
  name: 'App',
  data: () => ({
    image: {
        background: require('./assets/background.jpg'),
      },
        items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard' },
          { title: 'Photos', icon: 'mdi-image' },
          { title: 'About', icon: 'mdi-help-box' },
        ],
        right: null,
      drawer: null,
  }),

  methods: {

    quit() {
      win.close();
    },

    minimize() {
      win.minimize();
    },

    maximize() {
      if (!win.isMaximized()) {
        win.maximize();
      } else {
        win.unmaximize();
      }
    },
  },
});


// gradient="to top right,rgba(0, 0, 0, 0.5), rgba(25,32,72,.7)"
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
