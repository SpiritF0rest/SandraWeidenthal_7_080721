<template>
    <div class="body">
        <Header />
        <div class="profil" v-if="this.editClick == 0">
            <div id="profilImage"><p class="profilImage" v-if="getLetter()">{{ pseudoLetter }}</p></div>
            <div>
                <h1>Bonjour {{ userData.data.pseudo }} !</h1>  
            </div>
            <div>
                <h2>Informations personnelles</h2>
                <div class="userInformations">
                    <p>Nom: <span>{{ userData.data.lastName }}</span></p>
                    <p>Prénom: <span>{{ userData.data.firstName }}</span></p>
                    <p>E-mail: <span>{{ userData.data.email }}</span></p>
                    <p>Service: <span>{{ userData.data.service }}</span></p>
                </div>
            </div>
            <div class="buttons">
                <button type="button" class="button__modify" @click="editProfil()">Modifier</button>
                <button type="button" class="button__validation" @click="deleteUser()">Supprimer</button>    
            </div>
        </div>
        <div class="editProfil" v-else>
            <form>
                <div class="signUpForm">
                    <label for="pseudo">Pseudo: </label>
                    <input type="text" name="pseudo" id="pseudo" placeholder="ex: User01" v-on:input="checkInput(pseudoRegex, formData.pseudo, 'badPseudo')" v-model="formData.pseudo" />
                    <p v-if="this.formData.pseudo && sendErrorMsg('badPseudo')" class="errorMsg">Merci d'entrer un pseudo valide, ex: NeoRed_01.</p>
                </div>
                <div class="signUpForm">
                    <label for="email">E-mail: </label>
                    <input type="email" name="email" id="email" placeholder="ex: user@example.com" v-on:input="checkInput(emailRegex, formData.email, 'badEmail')" v-model="formData.email" />
                    <p v-if="this.formData.email && sendErrorMsg('badEmail')" class="errorMsg">Merci d'entrer un email valide, ex: matrix@gmail.com.</p>
                </div>
                <div class="signUpForm">
                    <label for="lastName">Nom: </label>
                    <input type="text" name="lastName" id="lastName" placeholder="ex: Ketchum" v-on:input="checkInput(alphaRegex, formData.lastName, 'badLastname')" v-model="formData.lastName" />
                    <p v-if="this.formData.lastName && sendErrorMsg('badLastname')" class="errorMsg">Merci d'entrer un nom valide, ex: Anderson.</p>
                </div>
                <div class="signUpForm">
                    <label for="firstName">Prénom: </label>
                    <input type="text" name="firstName" id="firstName" placeholder="ex: Sacha" v-on:input="checkInput(alphaRegex, formData.firstName, 'badFirstname')" v-model="formData.firstName" />
                    <p v-if="this.formData.firstName && sendErrorMsg('badFirstname')" class="errorMsg">Merci d'entrer un prénom valide, ex: Thomas.</p>
                </div>
                <div class="signUpForm">
                    <label for="service">Service: </label>
                    <input type="text" name="service" id="service" v-model="formData.service" />
                </div>
                <div class="signUpForm">
                    <label for="oldPassword">Mot de passe actuel: </label>
                    <input type="password" name="oldPassword" id="oldPassword" minlength="8" v-on:input="checkInput(passwordRegex, formData.oldPassword, 'badOldPassword')" v-model="formData.oldPassword" />
                    <p v-if="this.formData.oldPassword && sendErrorMsg('badOldPassword')" class="errorMsg">Minimum requis: 8 Caractères, 1 Maj, 1 Min, 1 Chiffe, 1 Symbole.</p>
                </div>
                <div class="signUpForm">
                    <label for="newPassword">Nouveau mot de passe: </label>
                    <input type="password" name="newPassword" id="newPassword" minlength="8" v-on:input="checkInput(passwordRegex, formData.password, 'badPassword')" v-model="formData.password" />
                    <p v-if="this.formData.password && sendErrorMsg('badPassword')" class="errorMsg">Minimum requis: 8 Caractères, 1 Maj, 1 Min, 1 Chiffe, 1 Symbole.</p>
                </div>
                <div class="signUpForm">
                    <label for="newPasswordConfirmation">Confirmation nouveau mot de passe: </label>
                    <input type="password" name="newPasswordConfirmation" id="newPasswordConfirmation" minlength="8" v-model="formData.newPasswordConfirmation" />
                    <p v-if="formData.password && formData.newPasswordConfirmation && formData.password != formData.newPasswordConfirmation" class="errorMsg">Merci d'entrer un mot de passe identique.</p>
                </div>
                <div class="buttons"> 
                    <button type="button" class="button__validation" @click="goBackToProfil()">Retour</button>
                    <button type="button" class="button__modify" @click="editData()" :disabled="!checkFormData()" id="editData__submitButton">Enregistrer</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Header from "../components/Header.vue";
import axios from 'axios';
import { alphaRegex, pseudoRegex, emailRegex, passwordRegex  } from '../helpers/regex';
export default {
    name: 'Profil',
    components: { 
        Header 
    },
    data() {
        return {
            userData : {data: {}},
            formData : {},
            editClick : 0,
            badInput: [],
            alphaRegex: alphaRegex,
            pseudoRegex: pseudoRegex,
            emailRegex: emailRegex,
            passwordRegex: passwordRegex,
            pseudoLetter: ""
        };
    },
    beforeMount() {
        if (!localStorage.getItem("user")) {
        this.$router.push("/login");
        }   
    },
    mounted() {
        this.createUserData();
    },
    updated() {
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
        checkFormData() {
            if (!this.formData.pseudo && !this.formData.email && !this.formData.lastName && !this.formData.firstName && !this.formData.service && !this.formData.password) {
                return false;
            } else if(this.checkPassword()){
                return true;
            } else {
                return false;
            }
        },
        checkPassword() {
            if (this.formData.oldPassword || this.formData.password || this.formData.newPasswordConfirmation) {
                if (this.formData.oldPassword && this.formData.password && this.formData.newPasswordConfirmation
                    && this.formData.password == this.formData.newPasswordConfirmation 
                    && this.formData.oldPassword != this.formData.password) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
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
        editProfil() {
            if (this.editClick == 0 ) {
                this.editClick = 1;
            }
        },
        addUserId() {
            this.formData.id = this.userData.data.id;
        },
        goBackToProfil() {
            if (this.editClick == 1) {
                this.editClick = 0;
            }
        },
        editData() {
            this.addUserId();
            axios
                .put("http://localhost:3000/api/auth/" + this.formData.id, this.formData, { headers: {
                    authorization: `Bearer: ${this.userData.data.token}` }})
                .then(response => {
                    response = response.data;
                    localStorage.setItem("user", JSON.stringify(response));
                    this.editClick = 0;
                })
                .catch(error => console.log(error))           
        },
        deleteUser() {
            axios
                .delete("http://localhost:3000/api/auth/" + this.userData.data.id, { headers: {
                    authorization: `Bearer: ${this.userData.data.token}` }})
                .then(response => {
                    console.log(response);
                    localStorage.removeItem('user');
                    this.$router.push("/signup");
                })
                .catch(error => console.log(error))
        },
        getLetter() {
            const userData = JSON.parse(localStorage.getItem("user"));
            if (userData) {
                const userPseudo = userData.data.pseudo;
                this.pseudoLetter = userPseudo.slice(0, 1);
                return true;
            } else {
                return false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.body {
    background-color: white;
    height: 100vh; 
}
.profil {
    margin: 0 auto;
    width: 40vw;
    height: 85vh;
    background: white;
    display: flex;
    flex-direction: column;
}
h1 {
    color: #091f43;
}
.profilImage {
    background-color: #d1515a;
    color: white;
    font-size: 5rem;
    font-weight: 500;
    height: 7rem;
    width: 7rem;
    display: flex;
    align-items: center;
    justify-content: center;   
    border-radius: 50%;
    margin-bottom: 0;
}
#profilImage {
    justify-content: center;
    display: flex;
}
.buttons {
    display: flex;
    justify-content: center;
}
.button__modify {
    margin: 2rem 1rem 0 1rem;
    padding: 0.5rem 2rem;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 1.5rem 1.5rem;
    background: linear-gradient(160deg,#515ad1 ,#091f43 );
    box-shadow: 1px 1px 3px #091f43;
    text-shadow: 2px 1px 3px #163568;
    color: white;
    cursor: pointer;
    &:hover {
      box-shadow: inset 2px 2px 5px #163568;
      text-shadow: 3px 1px 3px #091f43;
    }
}
.button__validation {
    margin: 2rem 1rem 0 1rem;
}
.userInformations {
    display: flex;
    flex-direction: column;
    & p {
        display: flex;
        flex-direction: column;
    }
    & span {
        padding-top: 2rem;
        font-size: 1.3rem;
        font-weight: 500;
    }
}
.editProfil {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 7rem;  
    justify-content: space-evenly; 
    padding-top: 5rem;
    & input {
      border: none;
      border-radius: 0.3rem 0.3rem;
      background-color: #f4d4d6;
      padding: 0.2rem;
      margin: 0.6rem auto 0.7rem auto;
      width: 20rem;
      &:focus-visible {
        outline: 2px solid #dd7d83;
      }
      &::placeholder {
          text-align: center;
      }
    }
}
.signUpForm {
    display: flex;
    flex-direction: column;
    
}
</style>