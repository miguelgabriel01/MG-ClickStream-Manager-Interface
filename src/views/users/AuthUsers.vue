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
          <h1 class="main-title" style="color: #FF7474;">Conecte-se</h1>
          <img class="icon" :src="require('@/assets/Layer 4.svg')" alt="dashboard icon">
        </div>
        <h2 class="subtitle">agora</h2><br><br>
        <p class="description" style="color: #676767;font-size: 2.31vh">
          Faça seu login para ter acesso a todas as<br>
          funcionalidades da nossa plataforma
        </p>
      </div>
    </div>

    <div class="create-section">
      <form @submit.prevent="handleLogin">
        <input type="email" v-model="email" placeholder="E-mail" required>
        <input type="password" v-model="password" placeholder="Senha" required>
        <button type="submit">ENTRAR</button>
        <router-link to="/createUsers">FAZER CADASTRO</router-link>
      </form>
    </div>
  </section>
  <router-view></router-view>
</template>

<script>
import NotificationModal from '@/components/NotificationModal.vue';

export default {
  name: 'AuthUsers',
  components: {
    NotificationModal
  },
  data() {
    return {
      email: '',
      password: '',
      notification: {
        message: '',
        type: 'success',
        isVisible: false
      }
    };
  },
  methods: {
    async handleLogin() {
      const userData = {
        email: this.email,
        password: this.password,
      };

      try {
        const response = await fetch('http://localhost:3000/v1/users/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const result = await response.json();

          //concatenação do nome do usuario
          let fullName = result.user.firstName + " " + result.user.lastName;

          localStorage.setItem('authToken', result.access_token);
          localStorage.setItem('userEmail', result.user.email);
          localStorage.setItem('userName', fullName);
          localStorage.setItem('userId', result.user.id);
          this.$router.push({ name: 'homeDashboard' });
        } else {
          const error = await response.json();
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
  /* Mantive o estilo inalterado */
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
  }
  
  .create-section {
    height: 100vh;
    width: 50vw;
    background-color: #98D881;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon {
    width: 2.6vw;
    height: 2.6vw;
  }
  
  .title-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0.24vw;
    width: 25vw;
    margin-right: 2.2vw;
  }
  
  .main-title {
    font-size: 3.8vw;
    margin: 0;
  }
  
  .subtitle {
    color: #676767;
    text-align: start;
    width: 26vw;
    font-size: 3.8vw;
  }
  
  .description {
    font-size: 20px;
    text-align: start;
    width: 26vw;
  }
  
  .details {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  form{
    width: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10px;
  }

  input{
    width: 344px;
    height: 60px;
    border: none;
    border-radius: 7px;
    color: #A8A8A8;
    font-size: 18px;
    padding: 10px;
    margin: 18px;
  }

  button{
    width: 344px;
    height: 60px;
    border: none;
    border-radius: 7px;
    color: #FFFFFF;
    font-size: 20px;
    padding: 10px;
    background-color: #307C33;
  }

  a{
    text-decoration: none;
    color: #fff;
    font-size: 20px;
    margin-top: 10px;
  }
  </style>
  