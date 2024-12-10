<template>
  <div>
    <!-- Notification Modal -->
    <NotificationModal 
      :message="notification.message" 
      :type="notification.type" 
      :isVisible="notification.isVisible" 
    />
    
    <nav>
      <div class="logo">
        <h2 style="color:#FF7474;">CS</h2>
        <h2 style="color: #676767;">Manager</h2>
        <img :src="require('@/assets/Layer 4.svg')" alt="dashboard icon">
      </div>
      <div class="infoUserInitial">
        <p>{{ userName }}</p>
        <button class="logout" @click="handleLogout">Sair</button>
      </div>
    </nav>
    <section class="buttonsOptions">
      <button class="buttonCreateTopic" @click="showModal = true">CRIAR TÓPICO</button>
      <button class="buttonListTopic" @click="showTableModal = true">LISTAR TÓPICOS</button>
    </section>

    <!-- Passa as propriedades de exibição do modal para o TableNameTopics -->
    <TableNameTopics :showTableModal="showTableModal" @closeModal="showTableModal = false"/>

    <!-- Modal para criar um tópico -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <form @submit.prevent="createTopic">
          <input type="text" v-model="topicName" placeholder="Nome do tópico" required>
          <button type="submit" style="background:#98D881;">SALVAR</button>
          <button @click="showModal = false" style="background: #F58DA4;">CANCELAR</button>
        </form>
      </div>
    </div>
  </div>

  <div class="dashboarddata">
    <!-- Dashboard de Ações por Jogo -->
    <div class="dashlist">
      <canvas id="actionsPerGameChart"></canvas>
    </div>

    <!-- Dashboard de Controle Preferido (Teclado/Controle) -->
    <div class="dashlist">
      <canvas id="preferredControlChart"></canvas>
    </div>

    <!-- Novo Dashboard de Ações por Hora -->
    <div class="dashlist">
      <canvas id="actionsPerHourChart"></canvas>
    </div>

    <!-- Novo Dashboard de Ações por Data -->
    <div class="dashlist">
      <canvas id="actionsPerDateChart"></canvas>
    </div>
  </div>
</template>

<script>
import NotificationModal from '@/components/NotificationModal.vue';
import TableNameTopics from '@/components/TableNameTopics.vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'HomeDashboard',
  components: {
    NotificationModal,
    TableNameTopics
  },
  data() {
    return {
      userName: 'Miguel',
      showModal: false,
      showTableModal: false,
      topicName: '',
      notification: {
        message: '',
        type: '',
        isVisible: false
      }
    };
  },
  methods: {
    async handleLogout() {
      localStorage.removeItem('authToken');
      this.$router.push('/authUsers');
    },
    async createTopic() {
      const token = localStorage.getItem('authToken');
      const userName = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId'); 

      if (!token || !userName || !userId || !this.topicName) {
        this.showNotification('Todos os campos são obrigatórios.', 'error');
        return;
      }

      const topicNameWithUser = this.topicName;

      try {
        const response = await fetch('http://localhost:3000/users/createTopics', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            topicName: topicNameWithUser
          })
        });

        const result = await response.json();
        if (response.ok) {
          this.showNotification('Tópico criado com sucesso', 'success');
          this.showModal = false;
          this.topicName = '';
        } else {
          this.showNotification(`Erro ao criar tópico: ${result.message}`, 'error');
        }
      } catch (error) {
        console.error('Erro ao criar tópico:', error);
        this.showNotification('Ocorreu um erro ao criar o tópico.', 'error');
      }
    },
    showNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.isVisible = true;

      setTimeout(() => {
        this.notification.isVisible = false;
      }, 5000);
    },
    createActionsPerGameChart() {
      const lastAnalysisData = JSON.parse(localStorage.getItem('lastAnalysisData'));
      if (!lastAnalysisData || !lastAnalysisData.payloads) return;

      const actionCounts = {};

      lastAnalysisData.payloads.forEach(payload => {
        if (payload.caminhoPecorrido && Array.isArray(payload.caminhoPecorrido)) {
          payload.caminhoPecorrido.forEach(action => {
            actionCounts[action] = (actionCounts[action] || 0) + 1;
          });
        }
      });

      const labels = Object.keys(actionCounts);
      const data = Object.values(actionCounts);

      const ctx = document.getElementById('actionsPerGameChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#70BCBC', '#60A5B5', '#FF7474', '#98D881', '#FFC107', '#FF5722', '#8BC34A', '#03A9F4']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Ações Realizadas' }
          }
        }
      });
    },

    createPreferredControlChart() {
      const lastAnalysisData = JSON.parse(localStorage.getItem('lastAnalysisData'));
      if (!lastAnalysisData || !lastAnalysisData.payloads) return;

      const actionCounts = {};

      lastAnalysisData.payloads.forEach(payload => {
        if (payload.caminhoPecorrido && Array.isArray(payload.caminhoPecorrido)) {
          payload.caminhoPecorrido.forEach(action => {
            actionCounts[action] = (actionCounts[action] || 0) + 1;
          });
        }
      });

      const labels = Object.keys(actionCounts);
      const data = Object.values(actionCounts);

      const ctx = document.getElementById('preferredControlChart').getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#FF7474', '#60A5B5', '#70BCBC', '#98D881', '#FFC107', '#FF5722', '#8BC34A', '#03A9F4']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Ações Realizadas' }
          }
        }
      });
    },

    createActionsPerHourChart() {
      const lastAnalysisData = JSON.parse(localStorage.getItem('lastAnalysisData'));
      if (!lastAnalysisData || !lastAnalysisData.payloads) return;

      const hourCounts = {};

      lastAnalysisData.payloads.forEach(payload => {
        const hour = payload.hora.split(':')[0]; // Pega a hora da string de hora
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      const labels = Object.keys(hourCounts);
      const data = Object.values(hourCounts);

      const ctx = document.getElementById('actionsPerHourChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Ações por Hora',
            data: data,
            backgroundColor: '#70BCBC'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Ações por Hora' }
          }
        }
      });
    },

    createActionsPerDateChart() {
      const lastAnalysisData = JSON.parse(localStorage.getItem('lastAnalysisData'));
      if (!lastAnalysisData || !lastAnalysisData.payloads) return;

      const dateCounts = {};

      lastAnalysisData.payloads.forEach(payload => {
        const date = payload.data.split('T')[0]; // Pega a data no formato YYYY-MM-DD
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      });

      const labels = Object.keys(dateCounts);
      const data = Object.values(dateCounts);

      const ctx = document.getElementById('actionsPerDateChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Ações por Data',
            data: data,
            fill: false,
            borderColor: '#98D881',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Ações por Data' }
          }
        }
      });
    }
  },
  mounted() {
    this.createActionsPerGameChart();
    this.createPreferredControlChart();
    this.createActionsPerHourChart();
    this.createActionsPerDateChart();
  }
};
</script>

<style>
/* Estilos permanecem inalterados */
nav{
  width: 100%;
  height: 90px;
  background: #F3FDFD;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
}

.logo{
  width: 155px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
}

h2{
  font-size: 21px;
}

img{
  width: 27px;
  height: 29px;
}

.logout{
    width: 77px;
    height: 45px;
    border: none;
    border-radius: 7px;
    color: #FFFFFF;
    font-size: 20px;
    padding: 10px;
    background-color: #FF7474;
    cursor: pointer;
}

.infoUserInitial{
  width: 200px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
}

.buttonsOptions{
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.buttonCreateTopic{
  width: 344px;
  height: 60px;
  border: none;
  border-radius: 7px;
  color: #FFFFFF;
  font-size: 20px;
  padding: 10px;
  background-color: #70BCBC;
  margin: 5px;
}

.buttonListTopic{
  width: 344px;
  height: 60px;
  border: none;
  border-radius: 7px;
  color: #FFFFFF;
  font-size: 20px;
  padding: 10px;
  background-color: #60A5B5;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: rgb(240, 240, 240);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 700px;
  text-align: center;
}

.modal-content button {
  margin-top: 20px;
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

.dashboarddata{
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding: 10px;
}

.dashlist{
  width: 700px;
  height: 600px;
  margin: 10px;
}
</style>
