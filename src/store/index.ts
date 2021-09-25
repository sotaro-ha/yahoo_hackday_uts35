import Vue from 'vue';
import Vuex from 'vuex';
import {
  Module,
  Mutation,
  VuexModule,
  getModule
} from 'vuex-module-decorators';

Vue.use(Vuex);

export interface AccountInfoState {
  accountInfo: AccountInfo;
}
export interface AccountInfo {
  idToken: string;
}

type RootState = AccountInfoState;

const store = new Vuex.Store<RootState>({});

@Module({ dynamic: true, store, name: 'StoreModule', namespaced: true })
class StoreModule extends VuexModule implements RootState {
  accountInfo = {
    idToken: ''
  };

  @Mutation
  public setAccountInfo(payload: AccountInfoState) {
    Vue.set(this, 'accountInfo', payload.accountInfo);
  }
}

export default getModule(StoreModule);
