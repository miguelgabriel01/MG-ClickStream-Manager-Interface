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
              <td style="border: 1px solid red;">
                <!-- Botões de ação para cada tópico -->
                <button class="btnOptions" style="background:#82D6A8" @click="downloadData(topic._id, topic.topicName)">Baixar Dados</button>
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
        const response = await fetch(`http://localhost:3333/users/listTopics`, {
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
        const response = await fetch(`http://localhost:3333/users/listTopics/${topicId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
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
      // Cabeçalho das colunas
      let csvContent = "Data,Hora,Caminho Percorrido\n";

      // Iterar sobre os payloads e formatar os dados para o CSV
      data.payloads.forEach(row => {
        const data = row.data;
        const hora = row.hora;
        const caminhoPecorrido = Array.isArray(row.caminhoPecorrido) 
          ? row.caminhoPecorrido.join(" -> ") 
          : "N/A"; // Usar "N/A" caso não seja um array válido

        // Adicionar a linha formatada ao CSV
        csvContent += `${data},${hora},"${caminhoPecorrido}"\n`;
      });

      // Criar um Blob do conteúdo CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${topicName}.csv`; // Nome do arquivo CSV baseado no nome do tópico
      link.click();
    },

    // Função para deletar um tópico (apenas um exemplo, você pode implementar o delete real)
    deleteTopic(topicId) {
      console.log(`Deletar tópico com ID: ${topicId}`);
      // Aqui você pode implementar a lógica de deletar o tópico
    }
  },
  watch: {
    showTableModal(newVal) {
      if (newVal) {
        this.fetchTopics(); // Busca os tópicos quando o modal for exibido
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
    margin: 0 5px;
  }


  </style>
  