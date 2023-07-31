import { createRouter, createWebHistory } from 'vue-router';
import DiscordLogin from '../components/DiscordLogin.vue';
import UserDashboard from '../components/UserDashboard.vue';
import GuildDashboard from '../components/GuildDashboard.vue';
import ServerDashboard from '../components/ServerDashboard.vue';


import axios from '../jwtInterceptor';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/dashboard/:guild_id/:uuid/',
            name: 'ServerDashboard',
            component: ServerDashboard,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/dashboard/:guild_id/',
            name: 'GuildDashboard',
            component: GuildDashboard,
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/login',
            name: 'DiscordLogin',
            component: DiscordLogin,
        },
        {
            path: '/dashboard',
            name: 'UserDashboard',
            component: UserDashboard,
            meta: {
                requiresAuth: true,
            },
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/local/authenticatedToken`, { withCredentials: true });
            const authenticatedToken = response.data;
  
            if (authenticatedToken === true) {
                next()
            } else {
                window.location.href = `${process.env.VUE_APP_BACKEND_URL}login`;
            }
        } catch (error) {
            console.log(error);
           
            window.location.href = `${process.env.VUE_APP_BACKEND_URL}login`;
        }
    } else {
        next();
    }
});

export default router;
