<template>
  <section class="homepage">
    <NotificationModal 
      :message="notification.message" 
      :type="notification.type" 
      :isVisible="notification.isVisible" 
    />
    
    <div class="info-section">
      <div class="details">
        <div class="title-container">
          <h1 class="main-title" style="color: #FF7474;">Cadastre-se</h1>
          <img class="icon" :src="require('@/assets/Layer 4.svg')" alt="dashboard icon">
        </div>
        <h2 class="subtitle">agora</h2><br><br>
        <p class="description" style="color: #676767;font-size: 2.31vh">
          Finalize seu cadastro para ter acesso a todas<br>
          as funcionalidades da nossa plataforma
        </p>
      </div>
    </div>

    <div class="create-section">
      <form @submit.prevent="handleSubmit">
        <input type="text" v-model="firstName" placeholder="Nome" required>
        <input type="text" v-model="lastName" placeholder="Sobrenome" required>
        <input type="email" v-model="email" placeholder="E-mail" required>
        <input type="password" v-model="password" placeholder="Senha" required>
        <input type="password" v-model="confirmPassword" placeholder="Repetir senha" required>
        <button type="submit">CADASTRAR</button>
        <router-link to="/authUsers">ENTRAR NO SISTEMA</router-link>
      </form>
    </div>
  </section>
  <router-view></router-view>
</template>

<script>
import NotificationModal from '@/components/NotificationModal.vue';

export default {
  name: 'CreateUsers',
  components: {
    NotificationModal
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      notification: {
        message: '',
        type: 'success',
        isVisible: false
      }
    };
  },
  methods: {
    async handleSubmit() {
      if (this.password !== this.confirmPassword) {
        this.showNotification('As senhas não coincidem.', 'error');
        return;
      }

      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      };

      try {
        const response = await fetch('http://localhost:3000/v1/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          this.showNotification('Cadastro realizado com sucesso!', 'success');
          this.$router.push({ name: 'authUsers' });
        } else {
          const error = await response.json();
          // Remove prefixo "Erro: " da mensagem de erro
          const errorMessage = error.message.startsWith('Erro: ') 
            ? error.message.replace('Erro: ', '') 
            : error.message;
          this.showNotification(errorMessage, 'error');
        }
      } catch (error) {
        this.showNotification('Erro na comunicação com a API.', 'error');
      }
    },
    showNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.isVisible = true;

      setTimeout(() => {
        this.notification.isVisible = false;
      }, 5000); // Oculta o modal após 5 segundos
    }
  }
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

.create-section {
  height: 100vh;
  width: 50vw;
  background-color: #98D881;
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
