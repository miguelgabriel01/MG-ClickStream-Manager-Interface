import { createRouter, createWebHistory } from 'vue-router';
import CreateUsers from '../views/users/CreateUsers.vue';
import AuthUsers from '../views/users/AuthUsers.vue';
import HomeDashboard from '../views/users/topics/HomeDashboard.vue';
import HomeError from '../views/errors/HomeError.vue';
import HomePage from '../views/HomePage.vue';

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },
  { path: '/createUsers', name: 'CreateUsers', component: CreateUsers },
  { path: '/authUsers', name: 'authUsers', component: AuthUsers },
  { 
    path: '/homeDashboard', 
    name: 'homeDashboard', 
    component: HomeDashboard,
    meta: { requiresAuth: true } // Adicionando a propriedade requiresAuth
  },
  { path: '/homeError', name: 'homeError', component: HomeError }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// *Navigation Guard* para verificar autenticação
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Verifica se o token existe

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'authUsers' }); // Redireciona para a página de login
    } else {
      next(); // Permite o acesso à rota
    }
  } else {
    next(); // Permite o acesso a rotas que não exigem autenticação
  }
});

export default router;