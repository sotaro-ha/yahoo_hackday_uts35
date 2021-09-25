import AuthClient from '@/plugins/auth/authClient';

export default {
  install(Vue: any, options: any) {
    Vue.prototype.$auth = AuthClient.Instance(options);
  }
};
