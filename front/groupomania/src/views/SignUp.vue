<template>
  <div class="signInUp__container">
    <h1>Inscription</h1>
      <form class="signUpForm">
        <div class="signUpForm__input">
          <label for="pseudo"><fa icon="user" /> Pseudo: </label>
          <input type="text" name="pseudo" id="pseudo" placeholder="ex: User01" required v-on:input="checkInput(pseudoRegex, formData.pseudo, 'badPseudo')" v-model="formData.pseudo" />
          <p v-if="this.formData.pseudo && sendErrorMsg('badPseudo')" class="errorMsg">Merci d'entrer un pseudo valide, ex: NeoRed_01.</p>
        </div>
        <div class="signUpForm__input">
          <label for="email"><fa icon="at" /> E-mail: </label>
          <input type="email" name="email" id="email" placeholder="ex: user@example.com" required v-on:input="checkInput(emailRegex, formData.email, 'badEmail')" v-model="formData.email" />
          <p v-if="this.formData.email && sendErrorMsg('badEmail')" class="errorMsg">Merci d'entrer un email valide, ex: matrix@gmail.com.</p>
        </div>
        <div class="signUpForm__input">
          <label for="password"><fa icon="key" /> Mot de passe: </label>
          <input type="password" name="password" id="password" placeholder="ex: p7C_5v69S" required minlength="8" v-on:input="checkInput(passwordRegex, formData.password, 'badPassword')" v-model="formData.password" />
          <p v-if="this.formData.password && sendErrorMsg('badPassword')" class="errorMsg">Minimum requis: 8 Caractères, 1 Maj, 1 Min, 1 Chiffe, 1 Symbole.</p>
        </div>
        <div class="signUpForm__input">
          <label for="passwordConfirmation">Confirmation mot de passe: </label>
          <input type="password" name="passwordConfirmation" id="passwordConfirmation" placeholder="ex: p7C_5v69S" required minlength="8" v-model="formData.passwordConfirmation" />
          <p v-if="formData.password && formData.passwordConfirmation && formData.password != formData.passwordConfirmation" class="errorMsg">Merci d'entrer un mot de passe identique.</p>
        </div>
        <button type="button" @click="signUp()" :disabled="!checkFormData()" class="button__validation">Envoyer</button>
        <p id="loginError"></p>
      </form>
      <p>Déjà un compte, connectez-vous : <span @click="goLogin()">Connexion</span></p>
        <!--<div v-if="this.multipassClicked == 0" @click="addMultipassClicked()" class="multipass" >Fonction cachée pour admin/modo, clickez pour activer</div>
        <div v-else class= "multipassOK">
          <label for="passForMoreAccess">Multipass</label>
          <input 
            type="password" name="passForMoreAccess" id="passForMoreAccess"  
            v-model="this.pass" />
        </div>-->
  </div>
</template>

<script>
import axios from 'axios';
import { pseudoRegex, emailRegex, passwordRegex  } from '../helpers/regex';

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
      badInput: [],
      pseudoRegex: pseudoRegex,
      emailRegex: emailRegex,
      passwordRegex: passwordRegex
    };
  },
  mounted () {
    if (localStorage.getItem("user")) {
      this.$router.push("/");
    }
  },
  methods: {
    checkFormData : function() {
      if(!this.formData.pseudo || !this.formData.email || !this.formData.password || !this.formData.passwordConfirmation) {
        return false;
      } else if(!pseudoRegex.test(this.formData.pseudo) || !emailRegex.test(this.formData.email) || !passwordRegex.test(this.formData.password) || this.formData.password != this.formData.passwordConfirmation ){
        return false;
      } else if(this.formData.pseudo && this.formData.email && this.formData.password && this.formData.passwordConfirmation) {
        if(this.checkPassword()) {
          return true;
        } else {
          return false;
        }
      }
    },  
    checkPassword () {
      if (this.formData.password == this.formData.passwordConfirmation) {
        return true;
      } else {
        return false;
      }
    },
    selectInput (inputId) {
      this.input = document.getElementById(inputId);
    },
    checkInput (regex, data, key) {
      if (data && regex.test(data) == false && !this.badInput.find(element => element == key)) {
        this.badInput.push(key);
      } else if (regex.test(data) == true) {
          const pseudoIndex = this.badInput.findIndex(element => element == key);
          this.badInput.splice(pseudoIndex, 1);
        }
    },
    sendErrorMsg(key) {
      if (this.badInput.find(element => element == key)) {
        return 1;
      } else {
        return 0;
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
        .catch(error => {
          console.log(error);
          const errorMsg = document.getElementById("loginError");
          errorMsg.textContent = "Pseudo ou email déjà utilisé.";
        })
    },
    goLogin() {
      this.$router.push("/login");
    }
  }

}
</script>

<style scoped lang="scss">
  .multipass {
    color: white;
  }
  /*.signInUp__container {
    position: relative
  }*/
  span {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
  .signUpForm__input {
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
  .errorMsg {
    font-size: 0.8rem;
    //grid-column: 1/3;
  }
  .button__validation{
    margin-top: 1.5rem;
  }
  fa {
    color: #091f43;
  }
</style>