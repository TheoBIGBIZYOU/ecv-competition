import { createRouter, createWebHistory } from 'vue-router';

// Components
import HomePage from '../views/HomePage.vue';
import RegisterScreen from '../views/RegisterScreen.vue';
import LoginScreen from '../views/LoginScreen.vue';
import TransactionScreen from '../views/TransactionScreen.vue';
import TransactionDetails from '../views/transaction/_id.vue';

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
    },
    {
        path: '/transaction',
        name: 'Transaction',
        component: TransactionScreen
    },
    {
        path: '/transaction/:id',
        component: TransactionDetails
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router