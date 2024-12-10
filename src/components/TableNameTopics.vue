<template>
  <div>
    <!-- Modal para listar tópicos -->
    <div v-if="showTableModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <!-- Conteúdo da lista de tópicos -->
        <h2>Lista de Tópicos</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Nome do Tópico</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(topic) in topics" :key="topic._id">
              <td>{{ topic.topicName }}</td>
              <td style="display:flex;align-items: center;justify-content: center;align-content: center;margin-top: 2px;" id="td">
                <!-- Botões de ação para cada tópico -->
                <button class="btnOptions" style="background:#82D6A8" @click="downloadData(topic._id, topic.topicName)">Baixar Dados</button>
                <button class="btnOptions" style="background:#70BCBC" @click="analyzeTopic(topic._id)">Analisar</button>
                <button class="btnOptions" style="background:#D984A3" @click="deleteTopic(topic._id)">Deletar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableNameTopics',
  props: {
    showTableModal: Boolean
  },
  data() {
    return {
      topics: [] // Array para armazenar os tópicos
    };
  },
  methods: {
    closeModal() {
      this.$emit('closeModal'); // Emite o evento para fechar o modal
    },
    async fetchTopics() {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/users/listTopics`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          this.topics = result;
          console.log(this.topics);
        } else {
          console.error('Erro ao listar tópicos:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar tópicos:', error);
      }
    },

    // Função para baixar dados de um tópico específico
    async downloadData(topicId, topicName) {
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch(`http://localhost:3000/users/listTopics/${topicId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          this.generateCSV(data, topicName); // Chama a função para gerar o CSV
        } else {
          console.error('Erro ao baixar dados do tópico:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do tópico:', error);
      }
    },

    // Função para gerar e baixar o CSV
    generateCSV(data, topicName) {
      let csvContent = "Data,Hora,Caminho Percorrido\n";

      data.payloads.forEach(row => {
        const data = row.data;
        const hora = row.hora;
        const caminhoPecorrido = Array.isArray(row.caminhoPecorrido) 
          ? row.caminhoPecorrido.join(" -> ") 
          : "N/A";

        csvContent += `${data},${hora},"${caminhoPecorrido}"\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${topicName}.csv`;
      link.click();
    },

    // Função para analisar um tópico e salvar o último dado no localStorage
    async analyzeTopic(topicId) {
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch(`http://localhost:3000/users/listTopics/${topicId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Dados para análise:', data);

          // Remover o último dado salvo
          localStorage.removeItem('lastAnalysisData');
          
          // Salvar o novo dado como o último dado analisado
          localStorage.setItem('lastAnalysisData', JSON.stringify(data));
          alert("Dados analisados e salvos no localStorage.");
        } else {
          console.error('Erro ao analisar dados do tópico:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do tópico:', error);
      }
    },

    deleteTopic(topicId) {
      console.log(`Deletar tópico com ID: ${topicId}`);
    }
  },
  watch: {
    showTableModal(newVal) {
      if (newVal) {
        this.fetchTopics();
      }
    }
  }
};
</script>


  <style>
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
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th{
    padding: 10px;
  }
  .table td {
    border: 0.4px solid rgb(230, 230, 230);
    align-items: center;
    border-left: none; 
    border-right: none; 
    text-align: start;
  }
  .btnOptions {
    width: 120px;
    height: 35px;
    border: none;
    border-radius: 5px;
    color: #FFFFFF;
    font-size: 14px;
    cursor: pointer;
    margin: 5px 5px 17px 5px;
  }


  </style>
  