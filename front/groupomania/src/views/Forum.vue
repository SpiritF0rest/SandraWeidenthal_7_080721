<template>
  <div class="forum">
    <Header />
    <h1>This is a forum page</h1>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
export default {
  name: 'Forum',
    components: { 
        Header 
    },
  
}
</script>

<style lang="scss" scoped>
  div {
    background-color: white;
  }
  h1 {
    color: #091f43;
  }
</style>
