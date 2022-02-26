<template>
  <div class="forum">
    <Header />
    <h1>Bienvenue sur votre forum, n'hésitez pas à partager vos passions</h1>
    <div class="createPost">
      <form class="createPost__form">
        <div class="createPost__header"> 
          <div class="profilImage"><p class="profilImage__p" v-if="getLetter()">{{ pseudoLetter }}</p></div>
          <label for="post" aria-label="Texte du post"></label>
          <textarea id="post" name="text" v-model="postData.text" :placeholder="'Quoi de neuf, ' + `${userData.data.pseudo}` +' ?'"></textarea>
        </div>
        <label for="image"><fa icon="images" /> Image</label>
        <input type="file" id="image" name="image" accept="image/png, image/jpeg, image/jpg" @change="uploadImage">
        <button type="button" @click="createPost()" :disabled="!checkFormData(postData.text)" >Publier</button>
      </form>
    </div>
    <div>
      <article v-for="post in allPosts.slice().reverse()" :key="post" class="post">
        <div class="post__header"> 
          <div class="profilImage"><p class="profilImage__p" v-if="getLetter()">{{ pseudoLetter }}</p></div>
          <div class="post__author"> 
            <h2>{{ post.author }}</h2>
            <!--<p>le {{ post.createdAt.slice(8,10) }}/{{ post.createdAt.slice(5,7) }}/{{ post.createdAt.slice(0,4) }} à {{ post.createdAt.slice(11,16) }}.</p>
            <p>le {{ post.createdAt.split(/[-T]/).slice(0,-1).reverse().join("/")}}, à {{ post.createdAt.split(/[T:\.]/).slice(1,-2).join(":") }}.</p>
            <p>le {{ post.createdAt.split(/[\.:]/).slice(0,-2).join(":").split(/[T-]/).reverse().join("/").split("").fill(" à ",5,6).join("").split("à").reverse().join(", à ") }}</p>-->
            <p class="post__date">le {{ post.createdAt.split("T")[0].split("-").reverse().join("/") + ", à " + post.createdAt.split("T")[1].split(":").slice(0,-1).join(":") }} </p>
          </div>
        </div>
        <p>{{ post.text }}</p>
        <div v-if="post.imageUrl"> 
          <img class="post__image" :src="`${post.imageUrl}`" />   
        </div>
        <div class="post__buttons"> 
          <button type="button" v-if="checkUser(post.authorId)" @click="editPost(post.id)"><fa icon="pencil" /> Modifier</button> 
          <button type="button" v-if="checkUserAndModerator(post.authorId)" @click="deletePost(post.id)"><fa icon="trash-can" /> Supprimer</button> 
        </div>
        <button v-if="post.Comments.length > 3" type="button" @click="showMoreComments(post.Comments.length)">Voir plus de commentaires</button>
        <button v-if="commentsLimit == post.Comments.length" type="button" @click="showLessComments()">Réduire les commentaires</button> 
        <div v-for="comment in post.Comments.slice(0, commentsLimit).reverse()" :key="comment" class="comment"> 
          <h3>{{ comment.author }}</h3> 
          <p>{{ comment.createdAt }}</p>
          <p>{{ comment.text }}</p>
          <div v-if="comment.imageUrl"> 
            <img class="comment__image" :src="`${comment.imageUrl}`" />
          </div>
          <button type="button" v-if="checkUser(comment.authorId)" @click="editComment(comment.id)">Modifier</button> 
          <button type="button" v-if="checkUserAndModerator(comment.authorId)" @click="deleteComment(comment.id)">Supprimer</button>
        </div>
        <div>
          <form>
            <label for="comment">Texte</label>
            <textarea id="comment" name="comment" v-model="commentData.text"></textarea>
            <label for="commentImage">Image</label>
            <input type="file" id="commentImage" name="commentImage" accept="image/png, image/jpeg, image/jpg" @change="uploadImage">
            <button type="button" @click="createComment(post.id)" :disabled="!checkFormData(commentData.text)" >Publier</button>
          </form>
        </div>
      </article>
      <div v-if="editClick == 1" class="post__edit">
        <form>
          <label for="postEdit">Texte</label>
          <textarea id="postEdit" name="text" v-model="editedPostData.text"></textarea>
          <label for="imageEdit">Image</label>
          <input type="file" id="imageEdit" name="imageEdit" accept="image/png, image/jpeg, image/jpg" @change="uploadImage">
          <button type="button" @click="goBackToForum()">Retour</button>
          <button type="button" @click="editPostData(postId)" :disabled="!checkFormData(editedPostData.text)">Modifier</button>
        </form>
      </div>
      <div v-if="commentClick == 1" class="comment__edit">
        <form>
          <label for="commentEdit">Texte</label>
          <textarea id="commentEdit" name="textCommentEdit" v-model="editedCommentData.text"></textarea>
          <label for="imageCommentEdit">Image</label>
          <input type="file" id="imageCommentEdit" name="imageCommentEdit" accept="image/png, image/jpeg, image/jpg" @change="uploadImage">
          <button type="button" @click="goBackToForum()">Retour</button>
          <button type="button" @click="editCommentData(commentId)" :disabled="!checkFormData(editedCommentData.text)">Modifier</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import axios from 'axios';
export default {
  name: 'Forum',
    components: { 
        Header 
    },
    data() {
      return {
        userData: {data: {}},
        postData: {},
        commentData: {},
        allPosts: [],
        postImage: "",
        editClick : 0,
        commentClick: 0,
        editedPostData: {},
        editedCommentData: {},
        postId: null,
        commentId: null,
        control: 0,
        commentsLimit: 3,
        pseudoLetter: ""
      }
    },
    beforeMount() {
      if (!localStorage.getItem("user")) {
        this.$router.push("/login");
    }
    },
    mounted() {
      this.createUserData(), 
      this.getAllPosts()
    },
    methods : {
      createUserData() {
        if (localStorage.getItem("user")) {
          try {
              this.userData = JSON.parse(localStorage.getItem("user"));
              console.log(this.userData);
          } catch(e) {
            localStorage.removeItem("user");
            console.log("Données corrompues");
          }
        }
      },
      checkUser(author) {
        if (author == this.userData.data.id) {
          return true;
        } else {
          return false;
        }
      },
      checkUserAndModerator(author) {
        if(this.userData.data.roles[1] || author == this.userData.data.id) {
          return true;
        } else {
          return false;
        }
      },
      checkFormData(data) {
        if(!data && !this.postImage){
          return false;
        } else {
          return true;
        }
      },
      uploadImage(e) {
        this.control = 1;
        const file = e.target.files[0];
        console.log(file);
        this.postImage = file;            //renommer par un terme plus général
      },
      createPost() {
        this.postData.author = this.userData.data.pseudo;
        this.postData.authorId = this.userData.data.id;
        let formData = new FormData();
        if (this.control == 1) {
          formData.append('file', this.postImage, this.postImage.name);
        }
        formData.append('author', this.postData.author);
        formData.append('authorId', this.postData.authorId);
        formData.append('text', this.postData.text);
        axios
          .post("http://localhost:3000/api/posts/", formData)
          .then(response => {
            console.log(response);
            this.postData.text = "";
            this.postImage = "";
            this.control = 0;
            this.getAllPosts();
          })
          .catch(error => console.log(error));
      },
      createComment(postId) {
        this.commentData.author = this.userData.data.pseudo;
        this.commentData.authorId = this.userData.data.id;
        let formData = new FormData();
        if (this.control == 1) {
          formData.append('file', this.postImage, this.postImage.name);
        }
        formData.append('author', this.commentData.author);
        formData.append('authorId', this.commentData.authorId);
        formData.append('text', this.commentData.text);
        formData.append('PostId', postId);
        axios
          .post("http://localhost:3000/api/comments/", formData)
          .then(response => {
            console.log(response);
            this.commentData.text = "";
            this.commentImage = "";
            this.control = 0;
            this.getAllPosts();
          })
          .catch(error => console.log(error));
      },
      editPost(postId) {
        if (this.editClick == 0 ) {
          this.editClick = 1;
          this.postId = postId;
        }
      },
      editComment(commentId) {
        if (this.commentClick == 0 ) {
          this.commentClick = 1;
          this.commentId = commentId;
        }
      },
      goBackToForum() {
        if (this.editClick == 1) {
          this.editClick = 0;
        }
        if (this.commentClick == 1) {
          this.commentClick = 0;
        }
      },
      editPostData(postId) {
        let formData = new FormData();
        if(this.editedPostData.text) {
          formData.append('text', this.editedPostData.text);
        }
        if(this.postImage && this.control == 1) {
          formData.append('file', this.postImage, this.postImage.name);
        }
        axios
            .put("http://localhost:3000/api/posts/" + postId, formData , { headers: {
                authorization: `Bearer: ${this.userData.data.token}` }})
            .then(response => {
                console.log(response);
                this.editClick = 0;
                this.control = 0;
                this.getAllPosts();
            })
            .catch(error => console.log(error))           
      },
      editCommentData(commentId) {
        let formData = new FormData();
        if(this.editedCommentData.text) {
          formData.append('text', this.editedCommentData.text);
        }
        if(this.postImage && this.control == 1) {
          formData.append('file', this.postImage, this.postImage.name);
        }
        axios
            .put("http://localhost:3000/api/comments/" + commentId, formData , { headers: {
                authorization: `Bearer: ${this.userData.data.token}` }})
            .then(response => {
                console.log(response);
                this.commentClick = 0;
                this.control = 0;
                this.getAllPosts();
            })
            .catch(error => console.log(error))           
      },
      getAllPosts() {
        axios
          .get("http://localhost:3000/api/posts/")
          .then(response => {
            if(response.data.length > 0) {
              console.log(response.data);
              this.allPosts = response.data;
            } else {
              console.log("Il n'y a pas encore de Post.");
            }
          })
          .catch(error => console.log(error + "Echec lors de la récupération des posts."))
      },
      deletePost(postId) {
        axios
          .delete("http://localhost:3000/api/posts/" + postId, { headers: {
              authorization: `Bearer: ${this.userData.data.token}` }})
          .then(response => {
              console.log(response);
              location.reload();
          })
          .catch(error => console.log(error))
      },
      deleteComment(commentId) {
        axios
          .delete("http://localhost:3000/api/comments/" + commentId, { headers: {
              authorization: `Bearer: ${this.userData.data.token}` }})
          .then(response => {
              console.log(response);
              this.getAllPosts();
          })
          .catch(error => console.log(error))
      },
      showMoreComments(allComments) {
        this.commentsLimit = allComments;
      },
      showLessComments() {
        this.commentsLimit = 3;
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
  .forum {
    background-color: #f7f7f7;
    min-height: 100vh;
    height: 100%;
  }
  h1 {
    color: #091f43;
  }
  .createPost {
    background: white;
    width: 50vw;
    margin: 0 auto;
    border-radius: 0.5rem 0.5rem;
    margin-bottom: 2rem;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  }
  .createPost__form {
    display: flex;
    flex-direction: column;
  }
  .createPost__header {
    display: flex;
    
  }
  article {
    display: flex;
    flex-direction: column;
    width: 50vw;
    margin: 0 auto;
    color: #091f43;
    background-color: white;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem 0.5rem;
      & h2 {
        font-size: 1.2rem;
        margin: 1rem 0 0.5rem 0;
      }
  }
  .post__header {
    display: flex;
    background-color: white;
    border-radius: 0.5rem 0.5rem;
  }
  .post__date {
    font-size: 0.8rem;
    font-weight: 400;
  }
  .profilImage__p {
    background-color: #d1515a;
    color: white;
    font-size: 1.5rem;
    font-weight: 500;
    height: 3rem;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;   
    border-radius: 50%;
    margin: 0;
}
.profilImage {
    justify-content: center;
    display: flex;
    padding: 1rem;
}
.post__author {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
    & p {
       margin: 0 0 0.5rem 0;
    }
}
.post__buttons {
  display: flex;
  justify-content: center;
  & button {
    background: none;
    border: none;
    color: white;
    &:hover {
      background: #0e48a7;
    }
  }
}
  .post__image {
    height: 15rem;
  }
</style>
