import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import UserProfileView from '@/views/UserProfileView.vue';
import MyFollowView from '@/views/MyFollowView.vue';
import MessageView from '@/views/MessageView.vue';

const routes = [
    {
        path: '/onlinesocial',
        name: 'home',
        component: HomeView
    },
    {
        path: '/onlinesocial/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/onlinesocial/user/profile',
        name: 'userProfile',
        component: UserProfileView
    },
    {
        path: '/onlinesocial/hot',
        name: 'hot',
        component: HomeView
    },
    {
        path: '/onlinesocial/myfollow',
        name: 'myFollow',
        component: MyFollowView
    },
    {
        path: '/onlinesocial/message',
        name: 'message',
        component: MessageView
    },
    {
        path: '/onlinesocial/:catchAll(.*)',
        redirect: '/onlinesocial'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;