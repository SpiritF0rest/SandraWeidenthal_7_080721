<template>
<div class="login">
    <h1>Connexion</h1>
      <form class="loginForm">
        <div class="loginForm__pseudo">
          <label for="pseudo">Pseudo: </label>
          <input type="text" name="pseudo" id="pseudo" required v-model="formData.pseudo" />
        </div>
        <div class="loginForm__password">
          <label for="password">Mot de passe: </label>
          <input type="password" name="password" id="password" required minlength="8" v-model="formData.password" />
        </div>
        <button @click="login()" type="button" :disabled="checkFormData()">Connexion</button>
        <p id="loginError"></p>
      </form>
      <p>Pas encore de compte, créez en un : <span @click="goSignUp()">Inscription</span></p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Login',
  components: {
  },
  data() {
    return {
      formData : {
        pseudo: "", 
        password: ""
      }
    }
  },
  methods : {
    checkFormData : function() {
      if(!this.formData.pseudo || !this.formData.password) {
        return true;
      } else if(this.formData.pseudo && this.formData.password) {
        return false;
      }
    }, 
        goSignUp : function() {
          this.$router.push("/signup");
    }, 
    login : function() {
      axios
        .post("http://localhost:3000/api/auth/login", this.formData)
        .then(response => {
          localStorage.setItem("user", JSON.stringify(response));
          this.$router.push("/");
        })
        .catch(error => {
          console.log(error)
          const errorMsg = document.getElementById("loginError");
          errorMsg.textContent = "Le pseudo ou le mot de passe est incorrect.";
        })
    }
  }
}
</script>

<style scoped lang="scss">
  body {
    background-color: #091f43;
  }
  .login {
    background-color: white;
    height: 70vh;
    width: 40vw;
    margin: 15vh auto;
    display: inline-block;
    vertical-align: center;
    border-radius: 1rem 1rem;
  }
  .login__form {
    div {
      padding: 2rem;
    }
}

</style>