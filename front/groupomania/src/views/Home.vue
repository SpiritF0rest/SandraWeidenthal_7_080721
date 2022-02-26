<template>
<div>
  <Header />
  <h1>Groupomania vous souhaite une agréable journée {{ userData.data.firstName }}.</h1>
</div>
</template>

<script>
// @ is an alias to /src
import Header from '../components/Header.vue'
export default {
  name: 'Home',
  components: {
    Header,
  },
  data() {
    return {
      userData: {data:{}}
    }
  },
  beforeMount() {
    if (!localStorage.getItem("user")) {
            this.$router.push("/login");
    }
  },
  mounted() {
    this.createUserData();
  },
  methods : {
    createUserData() {
      if (localStorage.getItem("user")) {
        try {
          this.userData = JSON.parse(localStorage.getItem("user"));
        } catch(e) {
          //localStorage.removeItem("user");
          console.log("Données corrompues");
        }
      }
    },
  }
}
</script>
<style scoped lang="scss">
  div {
    background-color: white;
  }
</style>
