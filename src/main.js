import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'

// Components
import HomePage from './components/HomePage.vue';
import RegisterScreen from './components/RegisterScreen.vue';
import LoginScreen from './components/LoginScreen.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterScreen
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginScreen
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');
