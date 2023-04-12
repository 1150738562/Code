<template>
  <div id = "app">
    <RouterView/>
  </div>
</template>

<script setup name = "app">
import { RouterView } from 'vue-router';

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px 0px 0px 0px;
}
</style>
