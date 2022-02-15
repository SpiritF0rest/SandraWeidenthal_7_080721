<template>
  <div class="signUp">
    <h1>Inscription</h1>
      <form class="signUpForm">
        <div class="signUpForm__pseudo">
          <label for="pseudo">Pseudo: </label>
          <input type="text" name="pseudo" id="pseudo" required v-model="formData.pseudo" />
          <p class="pseudoErrorMsg"></p>
        </div>
        <div class="signUpForm__email">
          <label for="email">E-mail: </label>
          <input type="email" name="email" id="email" required v-model="formData.email" />
          <p class="emailErrorMsg"></p>
        </div>
        <div class="signUpForm__password">
          <label for="password">Mot de passe: </label>
          <input type="password" name="password" id="password" required minlength="8" v-model="formData.password" />
          <p class="passwordErrorMsg"></p>
        </div>
        <button type="button" @click="signUp()" :disabled="checkFormData()" id="signUp__submitButton">Envoyer</button>
      </form>
        <div v-if="this.multipassClicked == 0" @click="addMultipassClicked()" class="multipass" >Fonction cachée pour admin/modo, clickez pour activer</div>
        <div v-else class= "multipassOK">
          <label for="passForMoreAccess">Multipass</label>
          <input 
            type="password" name="passForMoreAccess" id="passForMoreAccess"  
            v-model="this.pass" />
        </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignUp',
  components: {
  },
  data() {
    return {
      pass: "",
      multipassWords: [],
      multipassClicked: 0,
      formData: {
        pseudo: "",
        email: "",
        password: ""
      },
    };
  },
  methods: {
    checkFormData : function() {
      if(!this.formData.pseudo || !this.formData.email || !this.formData.password) {
        return true;
      } else if(this.formData.pseudo && this.formData.email && this.formData.password) {
        return false;
      }
    },  
    addMultipassClicked : function() {
      if (this.multipassClicked == 0 ) {
        this.multipassClicked = 1;
      }
    }, 
    createUserData : function() {
      this.multipassWords.push("");
        if (this.pass != "" && !this.checkFormData()) { 
          if (this.pass == process.env.VUE_APP_MULTIPASS_MODERATOR) {
            this.multipassWords.push(this.pass);
          }
          if (this.pass == process.env.VUE_APP_MULTIPASS_ADMIN) {
            this.multipassWords.push(process.env.VUE_APP_MULTIPASS_MODERATOR);
            this.multipassWords.push(this.pass);
          }
          this.formData.roles = this.multipassWords;
        } else if (this.pass == "" && !this.checkFormData()) {
          this.formData.roles = this.multipassWords;
        } 
    },
    signUp : function() {
      this.createUserData();
        axios
          .post("http://localhost:3000/api/auth/signUp", this.formData)
          .then(response => {
            console.log(response);
            this.multipassWords = [];
            this.$router.push("/login")
          })
        .catch(error => console.log(error))
    }
  }

}
</script>

<style scoped lang="scss">
  body {
    background-color: #091f43;
  }
  .signUp {
    background-color: white;
    height: 70vh;
    width: 40vw;
    margin: 15vh auto;
    display: inline-block;
    vertical-align: center;
    border-radius: 1rem 1rem;

    div {
      padding: 2rem;
    }
  }
  .multipass {
    color: white;
  }


</style>