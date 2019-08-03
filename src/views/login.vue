<template>

    <v-img :src="image.background" >
  <v-menu
v-model="menu"
:close-on-content-click="false"
:nudge-width="300"

offset-y left
>
<template v-slot:activator="{ on }">
 <v-btn
   color="primary darken-3"
   text
   icon
   v-on="on"
 >
   <v-icon>mdi-gas-station</v-icon>
 </v-btn>
</template>

<v-card color='primary lighten-4'>

 <v-card-text>
   <v-text-field v-model="baseURL" label="GAS" outlined></v-text-field>
     <v-divider></v-divider>
 </v-card-text>

 <v-card-actions>
   <v-spacer></v-spacer>
   <v-btn text @click="cancelBaseURL">Cancel</v-btn>
   <v-btn color="warning" text @click="viewBaseURL">view</v-btn>
   <v-btn color="primary" text @click="setBaseURL">Set</v-btn>
   <v-spacer></v-spacer>
 </v-card-actions>

</v-card>
</v-menu>

    <v-container
      fluid
      fill-height
    >
      <v-layout
        align-center
        justify-center
      >
        <v-flex
          xs12
          sm8
          md4
        >
          <v-card class="elevation-12" :loading="loading">
            <v-toolbar
              color="primary"
              dark
              text
            >
              <v-toolbar-title>Iniciar sesión</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    href="https://github.com/VIXI0"
                    icon
                    large
                    target="_blank"
                    v-on="on"
                  >
                    <v-icon>mdi-code-tags</v-icon>
                  </v-btn>
                </template>
                <span>Creador</span>
              </v-tooltip>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    large
                    href="https://vixi0.github.io/core_power_updates/"
                    target="_blank"
                    v-on="on"
                  >
                    <v-icon>mdi-book</v-icon>
                  </v-btn>
                </template>
                <span>Manual</span>
              </v-tooltip>
            </v-toolbar>
            <div class="ma-1">
              <v-alert  v-model="alert.model" border="left" transition="slide-x-transition" :type="alert.type" class="mb-4">
                {{alert.text}}
              </v-alert>
            </div>
            <v-card-text>
              <v-form>
                <v-text-field
                 @keyup.enter="login"
                  label="Usuario"
                  name="Usuario"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="cred.user"
                ></v-text-field>

                <v-text-field
                @keyup.enter="login"
                  label="Contraseña"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="cred.password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="login">Entrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    </v-img>

</template>

<script>
import axios from 'axios'

export default {
  props: {
    source: String,
  },
  data: () => ({

    image: {
      background: require('./../assets/background.jpg')
    },
    loading: false,
    menu: false,
    baseURL: '',
    drawer: null,
    cred: {
      user: "",
      password: ""
    },
    alert: {
      type: "info",
      model: false,
      text: ""
    },
  }),

  methods: {

    async setRole(){
      try {
        var result = await axios({
          method: "POST",
          data: {
            query: `
            {
              getRole{
                nombre,
                permisos{
                  sistema,
                  link,
                  menu{
                    titulo,
                    menu,
                    sub{
                      tipo,
                      titulo,
                      link,
                      href,
                      target,
                      c,
                      r,
                      u,
                      d,
                      a,
                      sub{
                         tipo,
                        titulo,
                        link,
                        href,
                        target,
                        c,
                        r,
                        u,
                        d,
                        a,
                        sub{
                          tipo,
                          titulo,
                          link,
                          href,
                          target,
                          c,
                          r,
                          u,
                          d,
                          a
                        }
                      }
                    }
                  }
                }
              }
            }
                `
          }
        });

          this.$store.commit('setRole', result.data.data.getRole);
          console.log(this.$store.getters.role);

        return true;

      } catch (e) {
        return e
      }
    },
    async login() {
      try {
        this.alert.model = false
        this.loading = true
        var token = await axios({
          method: "POST",
          data: {
            query: `
            mutation{
              login(input: {user:"${this.cred.user}",password:"${this.cred.password}"})
            }
                `
          }
        })
      } catch (e) {
        this.loading = false
        this.alert.type = "error"
        this.alert.text = e
        this.alert.model = true
      } finally {
        this.loading = false
        if(token.data.data.login === "Contraseña incorrecta" || token.data.data.login ===  "Usuario no existente" || token.data.data.login === "Usuario inactivo"){
          this.alert.type = "error"
          this.alert.text = token.data.data.login
          this.alert.model = true
        }else {
          this.$http.defaults.headers.common['Authorization'] = 'Bearer '+ token.data.data.login
          const setR = await this.setRole();
          if(setR === true ){
            this.$router.push('/menu_sys')
          }else {
            this.alert.type = "error"
            this.alert.text = setR
            this.alert.model = true
          }

        }
      }
    },
    viewBaseURL(){
      this.baseURL = this.$http.defaults.baseURL
    },
    setBaseURL(){
      this.$http.defaults.baseURL = this.baseURL
      this.menu = false
      this.loading = false
    },
    cancelBaseURL(){
      this.baseURL =  ''
      this.menu = false
    }
  },
}
</script>
