<template>
  <router-view/>
</template>

<script>
//import { mapState } from "vuex";
export default {

}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,900&display=swap');
#app {
  font-family: Lato, Helvetica, Arial, sans-serif;
  font-weight: 300;
  text-align: center;
  color: #2c3e50;
}
body{
      margin: 0;
}

#nav {
  padding: 30px;

  a {
    color: #2c3e50;

    &.router-link-exact-active {
      color: #d1515a;
    }
  }
}
</style>
