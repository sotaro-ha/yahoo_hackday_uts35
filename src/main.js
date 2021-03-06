import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from "vue-axios"
// ルーティングのために追加
import router from './router'

Vue.config.productionTip = false

// Import the Auth0 configuration
import { domain, clientId ,audience} from "../auth_config.json";

// Import the plugin here
import { Auth0Plugin } from "./auth";

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience
});
Vue.use(VueAxios, axios)

new Vue({
  router, 
  render: h => h(App),
}).$mount('#app')