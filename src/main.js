// Bootstrap and Bootstrap Icons
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

import 'notyf/notyf.min.css';
import './assets/main.css'

import App from './App.vue'

// PAGES
import HomePage from './pages/HomePage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import LoginPage from './pages/LoginPage.vue';
import WorkoutsPage from './pages/WorkoutsPage.vue'
import AddWorkoutsPage from './pages/AddWorkoutsPage.vue';

// ROUTES
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [

        {
            path: '/',
            name: 'Homepage',
            component: HomePage
        },
        {
            path: '/register',
            name: 'Register',
            component: RegisterPage
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginPage
        },
        {
            path: '/workouts',
            name: 'Workouts',
            component: WorkoutsPage
        },
        {
            path: '/addworkouts',
            name: 'AddWorkouts',
            component: AddWorkoutsPage
        }
    ]
});

const app = createApp(App);

app.use(createPinia());

app.use(router);
app.mount('#app');