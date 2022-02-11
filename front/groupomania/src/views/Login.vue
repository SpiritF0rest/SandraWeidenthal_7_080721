<template>
<div class="login">
    <h1>Connexion</h1>
      <form class="loginForm">
        <div class="loginForm__pseudo">
          <label for="pseudo">Pseudo: </label>
          <input type="text" name="pseudo" id="pseudo" required />
        </div>
        <div class="loginForm__password">
          <label for="password">Mot de passe: </label>
          <input type="password" name="password" id="password" required minlength="8" />
        </div>
        <button type="submit">Connexion</button>
      </form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  components: {

}
}
</script>

<style scoped lang="scss">
  body {
    background-color: #091f43;
  }
  .login {
    background-color: white;
    height: 70vh;
    width: 40vw;
    margin: 15vh auto;
    display: inline-block;
    vertical-align: center;
    border-radius: 1rem 1rem;
  }
  .login__form {
    div {
      padding: 2rem;
    }
}

</style>