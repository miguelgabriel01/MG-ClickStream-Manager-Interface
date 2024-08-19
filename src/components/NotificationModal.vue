<template>
    <div v-if="isVisible" class="notification-modal" :class="type">
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotificationModal',
    props: {
      message: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'success' // Pode ser 'success' ou 'error'
      },
      isVisible: {
        type: Boolean,
        default: false
      }
    }
  };
  </script>
  
  <style scoped>
  .notification-modal {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 2rem;
    margin: 15px;
    border-radius: 5px;
    z-index: 1000;
    width: 400px;
    text-align: center;
  }
  
  .notification-modal.success {
    background-color: #98D881;
    color: white;
  }
  
  .notification-modal.error {
    background-color: #FF7474;
    color: white;
  }
  </style>
  