<template>
  <section class="homepage">
    <div class="info-section">
      <div class="details">
        <div class="title-container">
          <h1 class="main-title" style="color: #FF7474;">ClickStream</h1>
          <img class="icon" :src="require('@/assets/Layer 4.svg')" alt="dashboard icon">
        </div>
        <h2 class="subtitle">Manager</h2><br><br>
        <p class="description" style="color: #676767;">
          Plataforma de análise e gerenciamento<br>
          de cliques em Interfaces
        </p>
      </div>
    </div>

    <div class="image-section">
      <img class="dashboard-image" :src="require('@/assets/dash02.webp')" alt="dashboard">
    </div>
  </section>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.homepage {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.info-section {
  height: 100vh;
  width: 50vw;
 /* border: 2px solid red;*/
}

.image-section {
  height: 100vh;
  width: 50vw;
  background-color: #B8D4FF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-image {
  /*border: 1px solid red;*/
  width: 31.25vw;
  height: 55.56vh;
}

.icon {
  width: 2.6vw;
  height: 2.6vw;
   /* border: 2px solid blue;*/
}

.title-container {
  /*border: 2px solid blue;*/
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.24vw;
  width: 25vw;
  margin-right: 2.2vw;
}

.main-title {
  font-size: 3.8vw;
 /* border: 1px solid greenyellow;*/
  margin: 0;
}

.subtitle {
  color: #676767;
  text-align: start;
  /*border: 2px solid red;*/
  width: 26vw;
  font-size: 3.8vw;
}

.description {
  font-size: 1.3vw;
  text-align: start;
  /*border: 2px solid orange;*/
  width: 26vw;
}

.details {
 /* border: 2px solid greenyellow;*/
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
