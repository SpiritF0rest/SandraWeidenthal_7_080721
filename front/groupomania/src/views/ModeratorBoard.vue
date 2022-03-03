<template>
    <div class="body">
        <Header />
        <h1>Welcome Moderator</h1>
        <div>
            <h2>Liste des utilisateurs</h2>
            <label for="userSearch">Rechercher un utilisateur: </label>
            <input type="search" id="userSearch" name="userSearch" placeholder="Entrer un pseudo" v-model="searchUser" >
            <button class="searchButton" :disabled="!searchUser" @click="getUser()"><fa icon="magnifying-glass" class="icon" /></button>
            <button class="searchButton searchButton--red" v-if="catchUser" @click="getUser()"><fa icon="xmark" class="icon" /></button>
            <ul class="users">
                <li v-for="user in parsedUser()" :key="user" class="user">
                    <ul class="user__data">
                        <li><span>ID: </span>{{ user.id }}</li>
                        <li><span>Pseudo: </span>{{ user.pseudo }}</li>
                        <li><span>Nom: </span>{{ user.lastName }}</li>
                        <li><span>Prénom: </span>{{ user.firstName }}</li>
                        <li><span>E-mail: </span>{{ user.email }}</li>
                    </ul> 
                    <button type="button" class="delete__button" @click="deleteUser(user)" title="supprimer" aria-label="supprimer"><fa icon="trash-can" class="icon" /></button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from "../components/Header.vue";
export default {
    name : "ModeratorBoard",
    components : {
        Header
    },
    data() {
        return {
            users : [],
            moderatorToken : "",
            searchUser: "",
            catchUser: 0
        };
    },
    beforeMount() {
        if (!localStorage.getItem("user") || JSON.parse(localStorage.getItem("user")).data.roles[1] != process.env.VUE_APP_MODO_KEY) {
        this.$router.push("/login");
    }
    },
    mounted() {
        this.getAllUsers();
    },
    methods : {
        parsedUser: function() {
            if(!this.catchUser) {
                return this.users.filter(element => !element.Roles[1]);
            } else if(this.catchUser) {
                return this.users.filter(element => element.pseudo == this.searchUser && !element.Roles[1])
            }
        },
        getModoToken() {
            if (localStorage.getItem("user")) {
                try {
                    const moderatorData = JSON.parse(localStorage.getItem("user"));
                    this.moderatorToken = moderatorData.data.token;
                } catch(error) {
                    console.log(error + "Données corrompues");
                }
            }
        },
        getAllUsers () {
            this.getModoToken();
            axios
                .get("http://localhost:3000/api/auth/", { headers: {
                    authorization: `Bearer: ${this.moderatorToken}` }})
                .then(response => {
                    this.users = response.data;
                    console.log(this.users);
                })
                .catch(error => console.log(error + "Echec lors de la récupération des utilisateurs."))
        },
        getUser() {
            if(!this.catchUser) {
                this.catchUser = 1;
            } else if(this.catchUser) {
                this.catchUser = 0;
                this.searchUser = "";
            }
        },
        deleteUser(user) {
            this.getModoToken();
            if(window.confirm("Etes-vous sûr de vouloir supprimer ce compte ?")) {
                axios
                    .delete("http://localhost:3000/api/auth/" + user.id, { headers: {
                        authorization: `Bearer: ${this.moderatorToken}` }})
                    .then(response => {
                        console.log(response);
                        alert(response);
                        this.getAllUsers();
                    })
                    .catch(error => console.log(error))
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    * {
        color: #091f43;
    }
    .body {
       background-color: #f7f7f7; 
       min-height: 100vh;
    }
    li {
        list-style: none;
    }
    .users {
        padding: 0;
    }
    .delete__button {
        background-color: #d1515a;
        border: none;
        border-radius: 0.7rem;
        margin: 0 2.5rem 0 2rem;
        padding: 0.5rem 0.8rem;
        font-size: 0.8rem;
        font-weight: bold;
        cursor: pointer;
            &:hover {
                background-color: #b7474f;
                transform: scale(1.05);
            }
            & .icon {
                color: white;
            }
    }
    .searchButton {
        background-color: #515ad1;
        cursor: pointer;
        border: none;
        width: 2rem;
        height: 1.3rem;
        border-radius: 0.5rem;
        padding: 0.2rem 0.3rem;
        margin: 0 0.5rem 0 0;
        &:disabled {
            cursor: not-allowed;
            background: #909090;
        }
        &--red {
            padding: 0.2rem 0.45rem;
            background-color: #d1515a;
        }
        & .icon {
                color: white;
            }
    }
    .user {
        background-color: #eaeaea;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
        border-radius: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 50%;
        margin: 0 auto 1rem auto;
        margin-bottom: 1rem;
            &__data {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                & li {
                    display: flex;
                    width: 100%;
                    align-items: center;
                }
                & span {
                    font-weight: 500;
                    justify-content: center;
                    padding: 0.5rem 0.5rem 0.5rem 0;
                }
            }
    } 
    #userSearch {
        border: none;
        border-radius: 0.3rem 0.3rem;
        background-color: #eaeaea;
        padding: 0.2rem;
        margin: 0.5rem 0.5rem 0 0.5rem;
            &:focus-visible {
                outline: 2px solid #dd7d83;
            }
    }
    

</style>