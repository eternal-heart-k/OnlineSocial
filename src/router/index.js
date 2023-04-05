import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import UserProfileView from '@/views/UserProfileView.vue';
import MyFollowView from '@/views/MyFollowView.vue';
import MessageView from '@/views/MessageView.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/login/',
        name: 'login',
        component: LoginView
    },
    {
        path: '/user/profile/',
        name: 'userProfile',
        component: UserProfileView
    },
    {
        path: '/hot',
        name: 'hot',
        component: HomeView
    },
    {
        path: '/myfollow',
        name: 'myFollow',
        component: MyFollowView
    },
    {
        path: '/message',
        name: 'message',
        component: MessageView
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;