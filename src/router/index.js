import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView';
import LoginView from '../views/LoginView';

const routes = [
    {
        path: '/home',
        name: 'home',
        component: HomeView
    },
    {
        path: '/',
        name: 'login',
        component: LoginView
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;