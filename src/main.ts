import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import Auth from '@/plugins/auth';
import { RawLocation } from 'vue-router';
import config from './auth_config.json';

Vue.config.productionTip = false;

// auth0(認証認可)設定
//ユニーバーサルログインでのアカウントの新規登録は不可にしておく(デマンド交通サービスの利用には管理者Web経由の乗客登録が必要なため)
Vue.use(Auth, {
  domain: config.domain,
  clientId: config.clientId,
  audience: config.audience,
  onRedirectCallback: (appState: { targetUrl: RawLocation } | null) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  },
  disableSignUp: true
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
