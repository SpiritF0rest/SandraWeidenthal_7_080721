<template>
  <div class="signInUp__container">
    <div class="logo"> 
      <img alt="Vue logo" src="../assets/icon-above-font.png" />
    </div>
    <h1>Connexion</h1>
    <form class="loginForm">
      <div class="loginForm__input">
        <label for="pseudo"><fa icon="user" /> Pseudo: </label>
        <input type="text" name="pseudo" id="pseudo" placeholder="ex: User01" required v-model="formData.pseudo" />
      </div>
      <div class="loginForm__input">
        <label for="password"><fa icon="key" /> Mot de passe: </label>
        <input type="password" name="password" id="password" placeholder="ex: p7C_5v69S" required minlength="8" v-model="formData.password" />
      </div>
      <button @click="login()" type="button" :disabled="checkFormData()" class="button__validation">Connexion</button>
      <p id="loginError"></p>
    </form>
    <p class="info">Pas encore de compte, créez en un : <span @click="goSignUp()">Inscription</span></p>
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
  mounted() { 
    if (localStorage.getItem("user")) {
      this.$router.push("/");
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
  .loginForm__input {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    padding: 0.5rem 7rem;
    justify-content: space-evenly;
    & input {
      border: none;
      border-radius: 0.3rem 0.3rem;
      background-color: #eaeaea;
      padding: 0.2rem;
      margin-top: 0.5rem;
      text-align: center;
      &:focus-visible {
        outline: 2px solid #dd7d83;
      }
    }
  }
  span {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
  .info {
    margin-top: 2rem;
  }
  .logo { 
    height: 15vh;
    width: 15vw;
    margin: 0 auto;
    & img{
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 2rem;
  }
  }
</style>