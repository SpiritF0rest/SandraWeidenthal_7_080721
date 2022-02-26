<template>
    <div>
        <Header />
        <h1>Welcome Master</h1>
        <div>
            <h2>Liste des modérateurs</h2>
            <ul>
                <li v-for="user in parsedModerator" :key="user" class="user">
                        {{ user.id }} - {{ user.pseudo }} - {{ user.lastName }} - {{ user.firstName }} - {{ user.email }}  
                        <button type="button" @click="deleteUser(user)">Supprimer</button>
                </li>
            </ul>
        </div>
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
import Header from "../components/Header.vue";
import axios from 'axios';
export default {
    name : "AdminBoard",
    components : {
        Header
    },
    data() {
        return {
            users : [],
            adminToken : "",
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
    computed : {
        parsedUser: function() {
            return this.users.filter(element => !element.Roles[1]);
        },
        parsedModerator: function() {
            return this.users.filter(element => element.Roles[1] && !element.Roles[2]);
        }
    },
    methods : {
        getAdminToken() {
            if (localStorage.getItem("user")) {
                try {
                    const adminData = JSON.parse(localStorage.getItem("user"));
                    this.adminToken = adminData.data.token;
                } catch(error) {
                    console.log(error + "Données corrompues");
                }
            }
        },
        getAllUsers () {
            this.getAdminToken();
            axios
                .get("http://localhost:3000/api/auth/", { headers: {
                    authorization: `Bearer: ${this.adminToken}` }})
                .then(response => {
                    this.users = response.data;
                    console.log(this.users);
                })
                .catch(error => console.log(error + "Echec lors de la récupération des utilisateurs."))
        },
        deleteUser(user) {
            this.getAdminToken();
            axios
                .delete("http://localhost:3000/api/auth/" + user.id, { headers: {
                    authorization: `Bearer: ${this.adminToken}` }})
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
    div {
        background-color: white;
    }
    h1 {
        color: #091f43;
    }
    li {
        list-style: none;
    }
</style>