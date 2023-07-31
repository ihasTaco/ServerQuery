import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from './jwtInterceptor';

export default createStore({
    plugins: [createPersistedState()],
    state: {
      authenticated: false,
      user: {},
      guilds: [],
    },
    mutations: {
        setAuthenticated(state, value) {
            state.authenticated = value;
        },
        setUser(state, user) {
            state.user = user;
        },
        setGuilds(state, guilds) {
            state.guilds = guilds;
        },
        setGuildInfo(state, payload) {
            if (payload.code === 10004) {
                return payload;
            }
            const guildIndex = state.guilds.findIndex(guild => guild.id === payload.guild.id);
            if (guildIndex !== -1) {
                state.guilds[guildIndex] = Object.assign(state.guilds[guildIndex], payload.guild);
            } else {
                state.guilds.push(payload.guild);
            }
        },
        setBotIcon(state, { guild, icon }) {
            for (const g of state.guilds) {
                if (g.id === guild.id ) {
                    g.icon_url = null;
                    g.icon_url = icon;
                }
            }
        },
        setBotPresence(state, { guild_id, botPresent }) {
            state.guilds = state.guilds.map(guild => {
                if (guild.id === guild_id) {
                    return { ...guild, botPresent: botPresent };
                }
                return guild;
            });
        },
        resetState(state) {
            for (let prop in state) {
                if (state[prop] instanceof Array) {
                    state[prop] = [];
                } else if (state[prop] instanceof Object) {
                    state[prop] = {};
                } else {
                    state[prop] = null;
                }
            }
        },
    },
    actions: {
        async checkAuthentication({ commit }) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/local/authenticatedToken`, { withCredentials: true });
                commit('setAuthenticated', response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    commit('setAuthenticated', false);
                } else {
                    console.error('Error checking authentication:', error);
                }
            }
        },
        async getUserData({ commit }) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/discord/user/`, { withCredentials: true });
                const userData = response.data;
                commit('setUser', userData);
                commit('setAuthenticated', true);
            } catch (error) {
                console.error('Error fetching user data:', error);
                commit('setUser', {});
                commit('setAuthenticated', false);
            }
        },
        async getUserGuilds({ commit, dispatch }) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/discord/user/guilds`, { withCredentials: true });
                const guilds = response.data;
                commit('setGuilds', guilds);
                if (guilds.length > 0) {
                    for (const guild of guilds) {
                        dispatch('getGuildInfo', guild.id);
                        dispatch('getBotPresence', guild.id);
                    }
                }
            } catch (error) {
                console.error('Error fetching user guilds:', error);
            }
        },
        async getGuildInfo({ commit }, guild_id) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/discord/guild/${guild_id}`);
                commit('setGuildInfo', response.data);
            } catch (error) {
                console.error('Error fetching guild:', error);
            }
        },
        async getBotPresence({ commit, state }, guild_id) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/discord/guild/${guild_id}/presence`);
                const botPresent = response.data.botPresent;
                const index = state.guilds.findIndex(s => s.id === guild_id);
                if (index !== -1) {
                    commit('setBotPresence', { guild_id: guild_id, botPresent });
                }
            } catch (error) {
                console.error('Error fetching bot presence:', error);
            }
        },
        async generateGuildIcon({ commit }, guild) {
            function randomColor() {
                let maxVal = 0xFFFFFF;
                let randomNumber = Math.random() * maxVal; 
                randomNumber = Math.floor(randomNumber);
                randomNumber = randomNumber.toString(16);
                let randColor = randomNumber.padStart(6, 0);   
                return `#${randColor.toUpperCase()}`;
            }
          
            function getContrastColor(hexColor) {
                const rgb = hexToRgb(hexColor);
                const brightness = Math.round((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000);
                return brightness > 125 ? '#000000' : '#FFFFFF';
            }
          
            function hexToRgb(hexColor) {
                const hex = hexColor.replace('#', '');
                return {
                    r: parseInt(hex.substring(0, 2), 16),
                    g: parseInt(hex.substring(2, 4), 16),
                    b: parseInt(hex.substring(4, 6), 16),
                };
            }
            if (!guild.icon_url) {
                if (guild.icon) {
                    const icon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`;
                    commit('setBotIcon', { guild: guild, icon });
                } else if (!guild.icon){
    
                    const initials = guild.name
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase())
                        .join('');
        
                    const canvas = document.createElement('canvas');
                    canvas.width = 100;
                    canvas.height = 100;
                    const ctx = canvas.getContext('2d');
        
                    const backgroundColor = randomColor();
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
        
                    ctx.font = '22px "Roboto", sans-serif';
                    const contrastColor = getContrastColor(backgroundColor);
                    ctx.fillStyle = contrastColor;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
        
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
        
                    ctx.fillText(initials, centerX, centerY);
        
                    const icon = canvas.toDataURL();
        
                    commit('setBotIcon', { guild: guild, icon });
                }
            }
        },
        logOut({ commit }) {
            sessionStorage.clear();
            commit('resetState');
        },
    },
});
