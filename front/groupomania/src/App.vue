<template>
<div class="container">
  <router-view/>
</div>
</template>

<script>

export default {

}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,900&display=swap');
#app {

  .container {
    font-family: Lato, Helvetica, Arial, sans-serif;
    font-weight: 300;
    text-align: center;
    color: #2c3e50;
    background-color: #091f43;
  }
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
