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
                <button type="button">Supprimer</button>    
            </div>
        </div>
        <div class="editProfil" v-else>
            <form>
                <div class="signUpForm__pseudo">
                    <label for="pseudo">Pseudo: </label>
                    <input type="text" name="pseudo" id="pseudo" v-model="formData.pseudo" />
                    <p class="pseudoErrorMsg"></p>
                </div>
                <div class="signUpForm__email">
                    <label for="email">E-mail: </label>
                    <input type="email" name="email" id="email" v-model="formData.email" />
                    <p class="emailErrorMsg"></p>
                </div>
                <div class="signUpForm__lastName">
                    <label for="lastName">Nom: </label>
                    <input type="text" name="lastName" id="lastName" v-model="formData.lastName" />
                    <p class="lastnameErrorMsg"></p>
                </div>
                <div class="signUpForm__firstName">
                    <label for="firstName">Prénom: </label>
                    <input type="text" name="firstName" id="firstName" v-model="formData.firstName" />
                    <p class="firstnameErrorMsg"></p>
                </div>
                <div class="signUpForm__service">
                    <label for="service">Service: </label>
                    <input type="text" name="service" id="service" v-model="formData.service" />
                    <p class="serviceErrorMsg"></p>
                </div>
                <div class="signUpForm__oldPassword">
                    <label for="oldPassword">Ancien mot de passe: </label>
                    <input type="password" name="oldPassword" id="oldPassword" minlength="8" v-model="formData.oldPassword" />
                    <p class="oldPasswordErrorMsg"></p>
                </div>
                <div class="signUpForm__newPassword">
                    <label for="newPassword">Nouveau mot de passe: </label>
                    <input type="password" name="newPassword" id="newPassword" minlength="8" v-model="formData.newPassword" />
                    <p class="newPasswordErrorMsg"></p>
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

export default {
    name: 'Profil',
    components: { 
        Header 
    },
    data() {
        return {
           userData : {},
           formData : {},
           editClick : 0
        };
    },
    beforeMount() {
        if (localStorage.getItem("user")) {
            try {
                this.userData = JSON.parse(localStorage.getItem("user"));
            } catch(e) {
                //localStorage.removeItem("user");
                console.log("Données corrompues");
            }
        }
    },
    mounted() {
        if (!localStorage.getItem("user")) {
            this.$router.push("/login");
        }
    },
    methods : {
        checkFormData() {
            if (!this.formData.pseudo && !this.formData.email && !this.formData.lastName && !this.formData.firstName && !this.formData.service && !this.formData.newPassword) {
                return false;
            } else {
                return true;
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
                    console.log("test");
                    response = response.data;
                    localStorage.setItem("user", JSON.stringify(response));
                    this.editClick = 0;
                })
                .catch(error => console.log(error))           
        },
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