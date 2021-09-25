<template>
  <div id="app">
    <HelloWorld msg="hey to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/mainPage.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin:0;
  
}
</style>
