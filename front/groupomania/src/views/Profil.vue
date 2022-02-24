<template>
    <div class="body">
        <Header />
        <div class="profil" v-if="this.editClick == 0">
            <div>
                <h1>Bonjour {{ userData.data.pseudo }} !</h1>  
            </div>
            <div>
                <h2>Informations personnelles</h2>
                <p>Nom: {{ userData.data.lastName }}</p>
                <p>Prénom: {{ userData.data.firstName }}</p>
                <p>E-mail: {{ userData.data.email }}</p>
                <p>Service: {{ userData.data.service }}</p>
            </div>
            <div>
                <button type="button" @click="editProfil()">Modifier</button>
                <button type="button" @click="deleteUser()">Supprimer</button>    
            </div>
        </div>
        <div class="editProfil" v-else>
            <form>
                <div class="signUpForm__pseudo">
                    <label for="pseudo">Pseudo: </label>
                    <input type="text" name="pseudo" id="pseudo" v-on:input="checkInput(pseudoRegex, formData.pseudo, 'badPseudo')" v-model="formData.pseudo" />
                    <p v-if="this.formData.pseudo && sendErrorMsg('badPseudo')" class="errorMsg">Merci d'entrer un pseudo valide, ex: NeoRed_01.</p>
                </div>
                <div class="signUpForm__email">
                    <label for="email">E-mail: </label>
                    <input type="email" name="email" id="email" v-on:input="checkInput(emailRegex, formData.email, 'badEmail')" v-model="formData.email" />
                    <p v-if="this.formData.email && sendErrorMsg('badEmail')" class="errorMsg">Merci d'entrer un email valide, ex: matrix@gmail.com.</p>
                </div>
                <div class="signUpForm__lastName">
                    <label for="lastName">Nom: </label>
                    <input type="text" name="lastName" id="lastName" v-on:input="checkInput(alphaRegex, formData.lastName, 'badLastname')" v-model="formData.lastName" />
                    <p v-if="this.formData.lastName && sendErrorMsg('badLastname')" class="errorMsg">Merci d'entrer un nom valide, ex: Anderson.</p>
                </div>
                <div class="signUpForm__firstName">
                    <label for="firstName">Prénom: </label>
                    <input type="text" name="firstName" id="firstName" v-on:input="checkInput(alphaRegex, formData.firstName, 'badFirstname')" v-model="formData.firstName" />
                    <p v-if="this.formData.firstName && sendErrorMsg('badFirstname')" class="errorMsg">Merci d'entrer un prénom valide, ex: Thomas.</p>
                </div>
                <div class="signUpForm__service">
                    <label for="service">Service: </label>
                    <input type="text" name="service" id="service" v-model="formData.service" />
                </div>
                <div class="signUpForm__oldPassword">
                    <label for="oldPassword">Ancien mot de passe: </label>
                    <input type="password" name="oldPassword" id="oldPassword" minlength="8" v-on:input="checkInput(passwordRegex, formData.oldPassword, 'badOldPassword')" v-model="formData.oldPassword" />
                    <p v-if="this.formData.oldPassword && sendErrorMsg('badOldPassword')" class="errorMsg">Minimum requis: 8 Caractères, 1 Maj, 1 Min, 1 Chiffe, 1 Symbole.</p>
                </div>
                <div class="signUpForm__newPassword">
                    <label for="newPassword">Nouveau mot de passe: </label>
                    <input type="password" name="newPassword" id="newPassword" minlength="8" v-on:input="checkInput(passwordRegex, formData.password, 'badPassword')" v-model="formData.password" />
                    <p v-if="this.formData.password && sendErrorMsg('badPassword')" class="errorMsg">Minimum requis: 8 Caractères, 1 Maj, 1 Min, 1 Chiffe, 1 Symbole.</p>
                </div>
                <div class="signUpForm__newPasswordConfirmation">
                    <label for="newPasswordConfirmation">Confirmation nouveau mot de passe: </label>
                    <input type="password" name="newPasswordConfirmation" id="newPasswordConfirmation" minlength="8" v-model="formData.newPasswordConfirmation" />
                    <p v-if="formData.newPassword && formData.newPasswordConfirmation && formData.newPassword != formData.newPasswordConfirmation" class="errorMsg">Merci d'entrer un mot de passe identique.</p>
                </div>
                <button type="button" @click="goBackToProfil()">Retour</button>
                <button type="button" @click="editData()" :disabled="!checkFormData()" id="editData__submitButton">Enregistrer</button>
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
            userData : {},
            formData : {},
            editClick : 0,
            badInput: [],
            alphaRegex: alphaRegex,
            pseudoRegex: pseudoRegex,
            emailRegex: emailRegex,
            passwordRegex: passwordRegex
        };
    },
    beforeMount() {
        this.createUserData();
    },
    mounted() {
        if (!localStorage.getItem("user")) {
            this.$router.push("/login");
        }
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
        }
    }
}
</script>

<style lang="scss" scoped>
.body {
    background-color: white;
}
h1 {
    color: #091f43;
}
</style>