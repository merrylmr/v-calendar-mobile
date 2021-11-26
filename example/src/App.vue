<template>
  <div id="app">
    <v-calendar-mobile
        mode="month"
        :change-mode="true"
        @change="dateChangeHandle">
    </v-calendar-mobile>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    dateChangeHandle(date) {
      console.log('dateChangeHandle', date)
    }
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
  height: 100vh;
  background-color: #eeee;
}
</style>
