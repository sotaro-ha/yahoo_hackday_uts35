import Vue from 'vue'
import App from './App.vue'

// ルーティングのために追加
import router from './router'

Vue.config.productionTip = false

new Vue({
  router, // ルーティングのために追加
  render: h => h(App),
}).$mount('#app')