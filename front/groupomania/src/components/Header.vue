<template>
  <header>
    <div class="logo">
    <img alt="Vue logo" src="../assets/logo_groupomania_white.svg">
    </div>
    <nav>
      <ul>
        <div class="nav__bar">
          <li v-if="this.login == true"><router-link to="/"><fa icon="house" /> Home</router-link></li>
          <li v-if="this.login == true"><router-link to="/forum"><fa icon="icons" /> Forum</router-link></li>
          <li v-if="this.login == true && checkRole() == 1"><router-link to="/moderator-board">ModoBoard</router-link></li>
          <li v-if="this.login == true && checkRole() == 2"><router-link to="/admin-board">AdminBoard</router-link></li>
        </div>
        <div class="connexion__bar">
          <li v-if="this.login == false"><router-link to="/signup">Inscription</router-link></li>
          <li v-if="this.login == false"><router-link to="/login">Connexion</router-link></li>
          <li v-if="this.login == true"><router-link to="/profil"><fa icon="user" /> Profil</router-link></li>
          <li v-if="this.login == true"><button type="button" class="powerBtn" @click="logout()"><fa icon="power-off" class="powerBtn__icon" /></button></li>
        </div>
      </ul>
    </nav>

  </header>
</template>

<script>

export default {
  name: 'Header',
  data() {
    return {
      login: false,
    }
  },
  mounted() {
    this.checkLogin(); 
  },
  methods: {
    checkLogin() {
      if (localStorage.getItem("user")) {
        console.log("login");
        this.login = true;
      } else {
        this.login = false;
      }
    },
    checkRole() {
      let user = JSON.parse(localStorage.getItem("user"));
      let moderator = user.data.roles[1];
      let admin = user.data.roles[2]
      if (admin == process.env.VUE_APP_ADMIN_KEY) {//
        return 2;
      } else if (moderator == process.env.VUE_APP_MODO_KEY) {
        return 1;
      }
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push("/login");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
header {
  background-color: #091f43;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}
ul {
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  padding: 0;
    div {
      display: flex;
    }
}
li {
  margin: 0 2rem;
}
a {
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  text-decoration: none;
  
}
a:hover {
  color: #d2d2d2;
}
.powerBtn {
  border-style: none;
  background-color: #091f43;
  cursor: pointer;
  &__icon {
    color: white;
    font-size: 1.3rem;
    &:hover {
      color: #d2d2d2;
    }
  }
}
.logo {
  display: flex;
  align-items: center;
}
img {
  height: 2.5rem;
}
</style>
