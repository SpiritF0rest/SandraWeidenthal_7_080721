<template>
  <div>
   <h1>Erreur 404: Impossible d'accéder à cette page !</h1>
   <p>Oups ! Il semblerait que la page a été supprimée ou bien n'existe pas.</p> 
   <button class="button__validation" @click="goBack()">Retour</button>
  </div>
</template>

<script>

export default {
  name: 'PageNotFound',
  methods : {
    goBack() {
      this.$router.push("/")
    }
  }
}

</script>

<style lang="scss" scoped>
  h1, p {
    color: white;
  }
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: auto;
    height: 100vh;
  }
</style>
