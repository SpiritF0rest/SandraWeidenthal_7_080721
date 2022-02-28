<template>
<div class="container">
  <router-view/>
</div>
</template>

<script>

export default {

}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Varela+Round&display=swap');
#app {

  .container {
    font-family: Ubuntu, Helvetica, Arial, sans-serif;
    font-weight: 300;
    text-align: center;
    color: #2c3e50;
    background-color: #091f43;
    max-width: 1400px;
    margin: 0 auto;
  }
}
body{
      margin: 0;
      background-color: #091f43;
}
#nav {
  padding: 30px;

  a {
    color: #2c3e50;

    &.router-link-exact-active {
      color: #d1515a;
    }
  }
}
.button__validation {
    margin-top: 2rem ;
    padding: 0.5rem 2rem;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 1.5rem 1.5rem;
    background-color: #d1515a;
    box-shadow: 1px 1px 3px #341416;
    text-shadow: 2px 1px 3px #4e1e22;
    color: white;
    cursor: pointer;
    &:hover {
      box-shadow: inset 2px 2px 5px #4e1e22;
      text-shadow: 3px 1px 3px #341416;
      &:disabled {
        box-shadow: none;
        text-shadow: none;
        background: #909090;
        cursor: not-allowed;
      }
    }
    &:disabled {
      box-shadow: none;
        text-shadow: none;
        background: #909090;
    }
  }
  .signInUp__container {
    background-color: #f7f7f7;
    height: 90vh;
    width: 35vw;
    margin: 5vh auto;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    border-radius: 1rem 1rem;
  }
</style>
