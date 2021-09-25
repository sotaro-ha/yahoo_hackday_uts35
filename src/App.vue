<template>
  <v-app>
    <Header> </Header>
    <v-main>
      <MainView />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import MainView from '@/views/MainView.vue';
import Header from '@/components/Header.vue';

export default Vue.extend({
  name: 'App',

  components: {
    MainView,
    Header
  },

  data: () => ({
    //
  })
});
</script>
