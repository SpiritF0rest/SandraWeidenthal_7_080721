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
          <div class="createPost__image"> 
            <label for="getPostFile" class="forumButton" aria-label="ajouter une image" title="Ajouter une image." ><fa icon="images" /></label>
            <input type="file" id="getPostFile" name="image" accept="image/png, image/jpeg, image/jpg" @change="uploadImage">
          </div>
        </div>
        <div class="createPost__button">
          <button type="button" class="forumButton" @click="createPost()" :disabled="!checkFormData(postData.text)" >Publier</button>
        </div>
      </form>
    </div>
    <div>
      <article v-for="post in allPosts.slice().reverse()" :key="post" class="post">
        <div class="post__header"> 
          <div class="profilImage"><p class="profilImage__p" v-if="getLetterPost(post.author)">{{ authorLetter }}</p></div>
          <div class="post__author"> 
            <h2>{{ post.author }}</h2>
            <p class="post__date">le {{ post.createdAt.split("T")[0].split("-").reverse().join("/") + ", à " + post.createdAt.split("T")[1].split(":").slice(0,-1).join(":") }} </p>
          </div>
        </div>
        <div class="post__content"> 
          <p v-if="post.text && post.text != 'undefined'" class="post__text">{{ post.text }}</p>
          <div v-if="post.imageUrl"> 
            <img class="post__image" :src="`${post.imageUrl}`" />   
          </div>
        </div>
        <div class="post__buttons"> 
          <button type="button" class="forumButton" v-if="checkUser(post.authorId)" @click="editPost(post.id)"><fa icon="pencil" /> Modifier</button> 
          <button type="button" class="forumButton forumButton--red" v-if="checkUserPower(post.authorId, post.author)" @click="deletePost(post.id)"><fa icon="trash-can" /> Supprimer</button> 
        </div>
        <div v-if="editClick == 1 && post.id == postId" class="postEdit">
          <form class="postEdit__form">
            <div class="postEdit__header"> 
              <label for="postEdit" aria-label="Texte de post à modifier"></label>
              <textarea id="postEdit" name="text" :placeholder="'Modifiez votre post...'" v-model="editedPostData.text"></textarea>
              <div class="postEdit__image"> 
                <label for="imageEdit" class="forumButton" aria-label="ajouter une image" title="Ajouter une image"><fa icon="images" /></label>
                <input type="file" id="imageEdit" name="imageEdit" accept="image/png, image/jpeg, image/jpg" @change="uploadImage">
              </div>
            </div>
            <div class="postEdit__buttons"> 
              <button type="button" class="forumButton forumButton--red" @click="goBackToForum()"><fa icon="reply" /></button>
              <button type="button" class="forumButton" @click="editPostData(postId)" :disabled="!checkFormData(editedPostData.text)">Modifier</button>
            </div>
          </form>
        </div>
        <button v-if="post.Comments.length > commentsLimit" class="showButton showButton__more" type="button" @click="showMoreComments(post.Comments.length)"><fa icon="chevron-down" /></button>
        <button v-if="post.Comments.length > 3 && showComments == 1" class="showButton showButton__less" type="button" @click="showLessComments()"><fa icon="chevron-up" /></button> 
        <div v-for="(comment) in post.Comments.slice(0, commentsLimit).reverse()" :key="comment" class="comment"> 
          <div class="profilImage"><p class="profilImage__p" v-if="getLetterPost(comment.author)">{{ authorLetter }}</p></div>
          <div class="comment__block"> 
            <div class="comment__blockUp"> 
              <div class="comment__header">  
                  <h3 class="comment__author">{{ comment.author }}</h3> 
                  <p class="comment__date">le {{ comment.createdAt.split("T")[0].split("-").reverse().join("/") + ", à " + comment.createdAt.split("T")[1].split(":").slice(0,-1).join(":") }}</p>
              </div> 
              <div class="comment__content"> 
                <p class="comment__text" v-if="comment.text && comment.text != 'undefined'" >{{ comment.text }}</p>
                <div v-if="comment.imageUrl"> 
                  <img class="comment__image" :src="`${comment.imageUrl}`" />
                </div>
              </div>
            </div>
            <div class="comment__buttons"> 
              <button type="button" class="forumButton" v-if="checkUser(comment.authorId)" @click="editComment(comment.id)"><fa icon="pencil" /></button> 
              <button type="button" class="forumButton forumButton--red" v-if="checkUserPower(comment.authorId, comment.author)" @click="deleteComment(comment.id)"><fa icon="trash-can" /></button>
            </div>    
          </div>
          <div v-if="commentClick == 1 && comment.id == commentId" class="commentEdit">
            <form class="commentEdit__form">
              <div class="commentEdit__header"> 
                <div class="profilImage"><p class="profilImage__p" v-if="getLetter()">{{ pseudoLetter }}</p></div>
                <label for="commentEdit" aria-label="Texte de commentaire à modifier"></label>
                <textarea id="commentEdit" name="textCommentEdit" v-model="editedCommentData.text" :placeholder="'Modifiez votre commentaire...'"></textarea>
                <div class="commentEdit__image"> 
                  <label for="imageCommentEdit" class="forumButton" aria-label="ajouter une image" title="Ajouter une image."><fa icon="images" /></label>
                  <input type="file" id="imageCommentEdit" name="imageCommentEdit" accept="image/png, image/jpeg, image/jpg" @change="uploadImage">
                </div>
              </div>
              <div class="commentEdit__buttons"> 
                <button type="button" class="forumButton forumButton--red" @click="goBackToForum()" title="annuler la modification" aria-label="annuler la modification"><fa icon="reply" /></button>
                <button type="button" class="forumButton" @click="editCommentData(commentId)" :disabled="!checkFormData(editedCommentData.text)"><fa icon="pencil" /></button>
              </div>
            </form>
          </div>
        </div>
        <div class="createComment">
          <form class="createComment__form">
            <div class="createComment__header"> 
              <div class="profilImage"><p class="profilImage__p" v-if="getLetter()">{{ pseudoLetter }}</p></div>
              <label for="comment" aria-label="Texte du commentaire"></label>
              <textarea id="comment" name="comment" v-model="commentText[post.id]" :placeholder="'Écrivez un commentaire...'" ></textarea>
              <div class="createComment__image"> 
                <label for="commentImage" class="forumButton" aria-label="ajouter une image" title="Ajouter une image."><fa icon="images" /></label>
                <input type="file" id="commentImage" name="commentImage" accept="image/png, image/jpeg, image/jpg" @change="uploadImage">
              </div>
            </div>
            <div class="createComment__button"> 
              <button type="button" class="forumButton" @click="createComment(post.id), commentText = []" :disabled="!checkFormData(commentText[post.id])" >Publier</button>
            </div>
          </form>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import axios from 'axios';
export default {
  name: 'Home',
  components: {
    Header,
  },
  data() {
      return {
        userData: {data: {}},
        postData: {},
        commentData: {},
        commentText: [],
        allPosts: [],
        postImage: "",
        editClick : 0,
        commentClick: 0,
        editedPostData: {},
        editedCommentData: {},
        postId: null,
        commentId: null,
        postCommentId: null,
        control: 0,
        commentsLimit: 3,
        showComments: 0,
        pseudoLetter: "",
        authorLetter: ""
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
        } catch(e) {
          localStorage.removeItem("user");
          console.log("Données corrompues");
        }
      }
    },
    checkUser(authorId) {
      if (authorId == this.userData.data.id) {
        return true;
      } else {
        return false;
      }
    },
    checkUserPower(authorId, author) {
      if(author == "Admin") {
        if(authorId == this.userData.data.id) {
          return true;
        } else {
          return false;
        }
      } else {
        if(authorId == this.userData.data.id || this.userData.data.roles[1]) {
          return true;
        } else {
          return false;
        }
      }
    },
    /*checkModerator() {
      if(this.userData.data.roles[1]) {
        return true;
      } else {
        return false;
      }
    },
    checkAdmin(author) {
      if(author == "Admin" && author == this.userData.data.pseudo) {
        return true;
      } else {
        return false;
      }
    },*/
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
        .then(() => {
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
      formData.append('text', this.commentText[postId]);
      formData.append('PostId', postId);
      axios
        .post("http://localhost:3000/api/comments/", formData)
        .then(() => {
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
        this.editedPostData.text = "";
      }
      if (this.commentClick == 1) {
        this.commentClick = 0;
        this.etitedCommentData.text = "";
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
          .then(() => {
              this.editClick = 0;
              this.control = 0;
              this.editedPostData = "";
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
        .then(() => {
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
        .then(() => {
            location.reload();
        })
        .catch(error => console.log(error))
    },
    deleteComment(commentId) {
      axios
        .delete("http://localhost:3000/api/comments/" + commentId, { headers: {
            authorization: `Bearer: ${this.userData.data.token}` }})
        .then(() => {
            this.getAllPosts();
        })
        .catch(error => console.log(error))
    },
    showMoreComments(allComments) {
      this.commentsLimit = allComments;
      this.showComments = 1;
    },
    showLessComments() {
      this.commentsLimit = 3;
      this.showComments = 0;
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
    },
    getLetterPost(author) {
      if (author) {
        this.authorLetter = author.slice(0, 1);
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
  .createPost__header, .comment__header, .createComment__header {
    display: flex;
    align-items: center;
  }
  .createComment {
    margin: 0 2rem 2rem 2rem;
    border-top: 1px solid #E4E6EB
  }
  .comment {
    display: grid;
    grid-template-columns: 1fr 14fr;
    margin: 0 2rem 1rem 2rem;
    &__author {
      font-size: 1rem;
    }
    &__date {
      font-size: 0.8rem;
      padding-left: 1rem;
    }
    &__block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    &__blockUp {
      background-color: #f7f7f7;
      border-radius: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-right: 2rem;
      width: 100%;
    }
    &__header {
      width: 100%;
      padding-left: 0.5rem;
    }
    &__buttons {
      margin-top: 0.5rem;
    }
    &__buttons button {
      font-size: 0.7rem;
      padding: 0.3rem 0.7rem;
      margin-right: 0.5rem;
    }
    &__content {
      padding: 0 0.5rem;
    }
    &__text {
      text-align: start;
      margin-top: 0;
    }
    &__image {
      width: 100%;
      height: 30vh;
      object-fit: contain;
      align-items: center;
    }
  }
  .createPost__image {
    padding-right: 1rem;
  }
  #getPostFile, #commentImage, #imageCommentEdit, #imageEdit {
    display: none;
  }
  .postEdit {
    margin: 0 2rem 1rem 2rem;
    border-bottom: 1px solid #E4E6EB;
    &__header {
      display: flex;
      align-items: center;
    }
    &__buttons {
      text-align: start;
      margin-bottom: 1rem;
      & button {
        margin-right: 1rem;
      }
    }
  }
  .commentEdit {
    display: flex;
    flex-direction: row;
    grid-column: 1 / 3;
    &__form {
      width: 100%;
    }
    &__header {
      display: flex;
      align-items: center;
    }
    &__buttons {
      text-align: start;
      margin-left: 3.3rem;
      & button {
        margin-right: 0.5rem;
        padding: 0.3rem 0.7rem;
      }
    }
  }
  .forumButton {
    border: none;
    background-color: #515ad1;
    border-radius: 1rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    color: white;
    &:disabled {
      cursor: not-allowed;
      background: #909090;
      &:hover {
        transform: scale(1);
        background: #909090;
      }
    }
    &:hover {
      background-color: #676fd7;
      transform: scale(1.05);
    }
    &--red {
      background-color: #d1515a;
      &:hover {
        background-color: #d7676f;
        transform: scale(1.05);
      }
    }
  }
  .showButton {
    border: none;
    padding: 0.3rem;
    margin: 0 2rem 1rem 2rem;
    border-radius: 1.5rem;
    cursor: pointer;
  }
  textarea {
    border: none;
    border-radius: 2rem;
    background-color: #f7f7f7;
    width: 100%;
    margin: 1rem 1rem 1rem 0;
    padding: 1.3rem 0.5rem 0.5rem 0.5rem;
    resize: none;
    &::placeholder {
      padding: 0.15rem 0 0 0.2rem;
    }
    &:focus-visible {
      outline: 2px solid #dd7d83;
    }
  }
  .createPost__button {
    border-top: 1px solid #E4E6EB;
    margin: 0 2rem;
    padding: 1rem 0;
    display: flex;
    justify-content: space-evenly;
  }
  article {
    display: flex;
    flex-direction: column;
    width: 50vw;
    margin: 0 auto 2rem auto;
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
  .post__content {
    border-top: 1px solid #E4E6EB;
    border-bottom: 1px solid #E4E6EB;
    margin: 0 2rem;
  }
  .post__text {
    text-align: start;
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
  .comment {
    & .profilImage {
      padding: 0.5rem 0 1rem 0;
      display: block;
    }
    & .profilImage__p {
      height: 2.2rem;
      width: 2.2rem;
      font-size: 1rem;
      margin-right: 1rem;
    }
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
    padding: 1rem 0;
    & .forumButton {
      margin: 0 3rem;
    }
  }
  .post__image {
    height: 15rem;
    object-fit: contain;
    width: 100%;
  }
  @media screen and (min-width: 768px) and (max-width: 1199px) {
    .createPost, .post {
      margin : 0 2vw 2vw 2vw;
      width: 96vw;
    }
  }
  @media screen and (max-width: 767px) {
    .createPost, .post {
      width: 100vw;
      border-radius: 0;
    }
  }
</style>
