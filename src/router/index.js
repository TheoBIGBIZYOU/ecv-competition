import { createRouter, createWebHistory } from 'vue-router';

// Components
import HomePage from '../views/HomePage.vue';
import RegisterScreen from '../views/RegisterScreen.vue';
import LoginScreen from '../views/LoginScreen.vue';
import TransactionScreen from '../views/TransactionScreen.vue';
import TransactionDetails from '../views/transaction/_id.vue';
import DefineGoal from '../views/DefineGoal.vue';
import QuestionnaireScreen from '../views/QuestionnaireScreen.vue';
import ProfilScreen from '../views/Profil.vue';
import RewardsScreen from '../views/RewardsScreen.vue';
import ChallengesScreen from '../views/Challenges.vue';
import HistoryScreen from '../views/HistoryScreen.vue';
import ActivityScreen from '../views/ActivityScreen.vue';


const routes = [
    {
        path: '/home',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterScreen
    },
    {
        path: '/',
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
        name: 'SingleTransaction',
        component: TransactionDetails
    },
    {
        path: '/define-goal',
        name: 'DefineGoal',
        component: DefineGoal
    },
    {
        path: '/questionnaire',
        name: 'Questionnaire',
        component: QuestionnaireScreen
    },
    {
        path: '/profil',
        name: 'Profil',
        component: ProfilScreen
    },
    {
        path: '/rewards',
        name: 'Rewards',
        component: RewardsScreen
    },
    {
        path: '/challenges',
        name: 'Challenges',
        component: ChallengesScreen
    },
    {
        path: '/history',
        name: 'History',
        component: HistoryScreen
    },
    {
        path: '/activity',
        name: 'Activity',
        component: ActivityScreen
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router