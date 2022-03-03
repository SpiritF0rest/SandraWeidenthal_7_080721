<template>
  <div class="body">
    <Header />
    <h1>Welcome Master</h1>
    <div>
      <label for="userSearch">Rechercher un utilisateur: </label>
      <input type="search" id="userSearch" name="userSearch" placeholder="Entrer un pseudo" v-model="searchUser" >
      <button class="searchButton" @click="getUser()"><fa icon="magnifying-glass" class="icon" /></button>
      <button class="searchButton searchButton--red" @click="getUser()"><fa icon="xmark" class="icon" /></button>
      <h2>Liste des modérateurs</h2>
      <ul class="users">
        <li v-for="user in parsedModerator()" :key="user" class="user">
          <ul class="user__data">
            <li><span>ID: </span>{{ user.id }}</li>
            <li><span>Pseudo: </span>{{ user.pseudo }}</li>
            <li><span>Nom: </span>{{ user.lastName }}</li>
            <li><span>Prénom: </span>{{ user.firstName }}</li>
            <li><span>E-mail: </span>{{ user.email }}</li>
          </ul> 
        <div class="buttons"> 
          <button type="button" class="button button--blue" title="supprimer" :disabled="!checkRole(user.Roles)"  @click="modifyRole(user.id, 'User')">User</button>
          <button type="button" class="button button--blue" title="supprimer" :disabled="checkRole(user.Roles)"  @click="modifyRole(user.id, 'Moderator')">Moderator</button>
        </div>
        <button type="button" class="button" @click="deleteUser(user)" title="supprimer" aria-label="supprimer"><fa icon="trash-can" class="icon" /></button>
        </li>
      </ul>
    </div>
    <div>
      <h2>Liste des utilisateurs</h2>
      <ul class="users">
        <li v-for="user in parsedUser()" :key="user" class="user">
          <ul class="user__data">
            <li><span>ID: </span>{{ user.id }}</li>
            <li><span>Pseudo: </span>{{ user.pseudo }}</li>
            <li><span>Nom: </span>{{ user.lastName }}</li>
            <li><span>Prénom: </span>{{ user.firstName }}</li>
            <li><span>E-mail: </span>{{ user.email }}</li>
          </ul> 
          <div class="buttons"> 
            <button type="button" class="button button--blue" title="supprimer" :disabled="!checkRole(user.Roles)" @click="modifyRole(user.id, 'User')">User</button>
            <button type="button" class="button button--blue" title="supprimer" :disabled="checkRole(user.Roles)" @click="modifyRole(user.id, 'Moderator')">Moderator</button>
          </div>
          <button type="button" class="button" @click="deleteUser(user)" title="supprimer" aria-label="supprimer"><fa icon="trash-can" class="icon" /></button>
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
      searchUser: "",
      catchUser: 0,
      role: ""
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
    parsedModerator: function() {
      if(!this.catchUser) {
        return this.users.filter(element => element.Roles[1] && !element.Roles[2]);
      } else if(this.catchUser) {
        return this.users.filter(element => element.pseudo == this.searchUser && element.Roles[1] && !element.Roles[2])
      }
    },
    getUser() {
      if(!this.catchUser) {
        this.catchUser = 1;
      } else if(this.catchUser) {
        this.catchUser = 0;
        this.searchUser = "";
      }
    },
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
        })
        .catch(error => console.log(error + "Echec lors de la récupération des utilisateurs."))
    },
    deleteUser(user) {
      this.getAdminToken();
      if(window.confirm("Etes-vous sûr de vouloir supprimer ce compte ?")) {
        axios
          .delete("http://localhost:3000/api/auth/" + user.id, { headers: {
            authorization: `Bearer: ${this.adminToken}` }})
          .then(() => {
            this.getAllUsers();
          })
          .catch(error => console.log(error))
      }
    },
    checkRole(rolesArray) {
      if (rolesArray[1]) {
        return Object.values(rolesArray[1]).findIndex(pass => pass == process.env.VUE_APP_MULTIPASS_MODERATOR) >= 0 ? true : false;
      } else if (rolesArray[0] && !rolesArray[1]) {
        return false;
      }
    },
    modifyRole(userId, role) {
      let roles = [];
      if(role == "User") {   
        roles.push("");
      } else if(role == "Moderator") {
        roles.push("");
        roles.push(process.env.VUE_APP_MULTIPASS_MODERATOR);
      }
      let user = { roles : roles };
      axios
        .put(`http://localhost:3000/api/auth/roles/${userId}` ,  user,  { headers: {
          authorization: `Bearer: ${this.adminToken}` }})
        .then(() => {
          this.getAllUsers(); 
        })
        .catch(error => console.log(error))           
    }
  }
}
</script>

<style lang="scss" scoped>
  h1 {
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
  .button {
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
    &--blue {
      color: white;
      background-color: #515ad1;
      margin: 0.5rem;
      &:hover {
        background-color: #676fd7;
      }
      &:disabled {
        cursor: not-allowed;
        background-color: #909090;
        &:hover {
          background-color: #909090;
          transform: scale(1); 
        }
      }  
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
  .buttons {
    display: flex;
    flex-direction: column;
  }
  .user {
    background-color: #eaeaea;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
    border-radius: 1.5rem;
    display: grid;
    grid-template-columns: 4fr 1fr 1fr;
    align-items: center;
    width: 50%;
    margin: 0 auto 1rem auto;
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
  @media screen and (min-width: 768px) and (max-width: 991px) {
    .user {
      width: 70%;
    }
  }
  @media screen and (max-width: 767px) {
    .user {
      width: 100%;
      border-radius: 0;
      &__data {
        padding-left: 1rem;    
      }
    }
    .button {
      margin: 0.5rem 1rem;
    }
  }
</style>