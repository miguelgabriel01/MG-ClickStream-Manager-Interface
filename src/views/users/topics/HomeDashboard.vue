<template>
    <h1>TESTE DE LOGIN</h1>
    <button @click="handleLogout">Logout</button>
  </template>
  
  <script>
  export default {
    name: 'HomeDashboard',
    methods: {
      handleLogout() {
        // Remover o token do localStorage
        localStorage.removeItem('authToken');
        // Redirecionar o usuário para a página de login
        this.$router.push('/authUsers');
      },
    },
  };
  </script>
  
  <style>
  /* Estilos permanecem inalterados */
  </style>
  