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
        </div>
        <button type="button" @click="signUp(e)" :disabled="checkFormData()" id="signUp__submitButton">Envoyer</button>
      </form>
        <div v-if="multipassClicked === 0" @click="addMultipassClicked()" class="multipass" >Fonction cachée pour admin/modo, clickez pour activer</div>
        <div v-else class= "multipassOK">
          <label for="passForMoreAccess">Multipass</label>
          <input 
            type="password" name="passForMoreAccess" id="passForMoreAccess"  
            v-model="this.pass" @keyup.enter="checkMultipass()" />
        </div>
  </div>
</template>

<script>
//import axios from 'axios';

export default {
  name: 'SignUp',
  components: {
  },
  data() {
    return {
      pass: "",
      //multipassWords: [],
      multipassClicked: 0,
      formData: {
        pseudo: "",
        email: "",
        password: ""
      },
    //  userData: {
    //    pseudo: "",
    //    email: "",
    //    password: "",
     //   roles: []
    //  }
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
      if (this.multipassClicked === 0 ) {
        this.multipassClicked += 1;
      }
    }, 
    //checkMultipass : function() {
    //  let multipassWords = [""];
    //  if (this.pass != "") {
    //    multipassWords.push("");
    //    multipassWords.push(this.pass);    
    //  }
    //  console.log(this.multipassWords);
    //  return multipassWords;
    //},
    //@keyup.enter="checkMultipass()"
    createUserData : function() {
      let multipassWords = [];
      let userData = {};
    //  let formDataBis = {};
      console.log("pass:" + this.pass);
      if (this.pass != "") {
        multipassWords.push("");
        multipassWords.push(this.pass);   
      
      if (this.checkFormData() && multipassWords.length >= 1) {
        console.log("test1");
          userData = {
            pseudo: this.formData.pseudo,
            email: this.formData.email,
            //password: this.formData.password,
            roles: multipassWords
          }
          return userData;
        }// else if(!this.checkFormData() && multipassWords.length == 0) {
        //  console.log("test2");
        //  formDataBis = {
         //   pseudo: this.formData.pseudo,
        //    email: this.formData.email,
         //   password: this.formData.password
        //  }
         // return formDataBis;
        //}
        } else {
          console.log("Fuck you!");
        }
      //} //else {
        //const submitButton = document.getElementById("signUp__submitButton");
       // const emptyFormAlert = document.createElement("p");
       // emptyFormAlert.textContent = "Tous les champs doivent être correctement remplis.";
       // submitButton.appendChild(emptyFormAlert);
       // return emptyFormAlert;
     // }
    },
    signUp : function(e) {
      e.preventDefault();
      let formDataFunction = this.createUserData();

      console.log("test function signup:" + formDataFunction);
      //console.log(this.formData);
      //console.log(this.userData);
      if (formDataFunction) {
      /*  axios
        .post("http://localhost:3000/api/auth/signUp", formDataFunction)
        .then(response => {
          console.log(response);

        })
        .catch(error => console.log(error))*/
        //this.$store.dispatch("createUser", this.formData);
      }
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