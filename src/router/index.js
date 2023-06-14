import { createRouter, createWebHistory } from 'vue-router';

// Components
import HomePage from '../views/HomePage.vue';
import RegisterScreen from '../views/RegisterScreen.vue';

const routes = [
    {
        path: '/homepage',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/',
        name: 'Register',
        component: RegisterScreen
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router