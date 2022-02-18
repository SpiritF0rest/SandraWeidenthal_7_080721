<template>
    <div>
        <Header />
        <h1>Welcome Moderator</h1>
        <div>
            <h2>Liste des utilisateurs</h2>
            <ul>
                <li v-for="user in parsedUser" :key="user" class="user">
                        {{ user.id }} - {{ user.pseudo }} - {{ user.lastName }} - {{ user.firstName }} - {{ user.email }}  
                        <button type="button" @click="deleteUser(user)">Supprimer</button>
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

        };
    },
    beforeMount() {
        this.getAllUsers();
    },
    computed : {
        parsedUser: function() {
            return this.users.filter(element => !element.Roles[1]);
        }
    },
    methods : {
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
        deleteUser(user) {
            this.getModoToken();
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
</script>

<style lang="scss" scoped>
    * {
        color: #091f43;
    }
    div {
        background-color: white;
    }
    li {
        list-style: none;
    }

</style>