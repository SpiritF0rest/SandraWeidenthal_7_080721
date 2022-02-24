<template>
  <div class="signUp">
    <h1>Inscription</h1>
      <form class="signUpForm">
        <div class="signUpForm__pseudo">
          <label for="pseudo">Pseudo: </label>
          <input type="text" name="pseudo" id="pseudo" required v-on:input="checkInput(pseudoRegex, formData.pseudo, 'badPseudo')" v-model="formData.pseudo" />
          <p v-if="this.formData.pseudo && sendErrorMsg('badPseudo')" class="errorMsg">Merci d'entrer un pseudo valide, ex: NeoRed_01.</p>
        </div>
        <div class="signUpForm__email">
          <label for="email">E-mail: </label>
          <input type="email" name="email" id="email" required v-on:input="checkInput(emailRegex, formData.email, 'badEmail')" v-model="formData.email" />
          <p v-if="this.formData.email && sendErrorMsg('badEmail')" class="errorMsg">Merci d'entrer un email valide, ex: matrix@gmail.com.</p>
        </div>
        <div class="signUpForm__password">
          <label for="password">Mot de passe: </label>
          <input type="password" name="password" id="password" required minlength="8" v-on:input="checkInput(passwordRegex, formData.password, 'badPassword')" v-model="formData.password" />
          <p v-if="this.formData.password && sendErrorMsg('badPassword')" class="errorMsg">Minimum requis: 8 Caractères, 1 Maj, 1 Min, 1 Chiffe, 1 Symbole.</p>
        </div>
        <div class="signUpForm__passwordConfirmation">
          <label for="passwordConfirmation">Confirmation mot de passe: </label>
          <input type="password" name="passwordConfirmation" id="passwordConfirmation" required minlength="8" v-model="formData.passwordConfirmation" />
          <p v-if="formData.password && formData.passwordConfirmation && formData.password != formData.passwordConfirmation" class="errorMsg">Merci d'entrer un mot de passe identique.</p>
        </div>
        <button type="button" @click="signUp()" :disabled="!checkFormData()" id="signUp__submitButton">Envoyer</button>
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
  methods: {
    checkFormData : function() {
      if(!this.formData.pseudo || !this.formData.email || !this.formData.password || !this.formData.passwordConfirmation) {
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