<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">EventDRT</div>

    <v-spacer></v-spacer>
    <div :class="$style.loginName">{{ email }}</div>

    <v-btn
      target="_blank"
      text
      v-if="this.$auth.isAuthenticated"
      @click="logout"
    >
      <span class="tr-0">logout</span>
      <v-icon>mdi-account-switch</v-icon>
    </v-btn>
    <v-btn target="_blank" text v-else @click="login">
      <span class="mr-2">login</span>
      <v-icon>mdi-account-switch</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<style module>
.loginName {
  text-align: right;
  max-width: 60%;
  padding: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<script lang="ts">
import { Mixin, Mixins } from 'vue-mixin-decorator';
import BaseComponent from '@/components/BaseComponent.vue';

@Mixin({})
export default class Header extends Mixins<BaseComponent>(BaseComponent) {
  email = '';

  // ログイン
  private async login() {
    const redirectURL = `${window.location.origin}`;
    await this.$auth.loginWithRedirect({
      redirect_uri: redirectURL
    });
  }
  // ログアウト
  private logout() {
    const redirectURL = `${window.location.origin}`;
    this.$auth.logout({ returnTo: redirectURL });
  }
  //ヘッダが作られるタイミングで、トークンを取得できる場合はしておく
  private async created() {
    const authUser = await this.$auth.getUser();
    const idToken = (await this.$auth.getIdTokenClaims()).__raw as string;
    const accountInfo = {
      idToken: idToken
    };
    this.store.setAccountInfo({ accountInfo: accountInfo });
    this.email = authUser.email;
  }
}
</script>
