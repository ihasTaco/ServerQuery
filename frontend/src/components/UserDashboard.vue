<template>
    <div class="view">
        <div 
            class="header" 
            :style="{ 
                'background-image': user.banner ? `url(https://cdn.discordapp.com/banners/${user.id}/${user.banner}?size=1024)` : '', 
                'background-color': user.banner ? '' : user.banner_color,
                'border-color': `#${user.accent_color}`,
            }"
        >
            <div class="user-container">
                <img :src="`https://cdn.discordapp.com/avatars/${ user.id }/${ user.avatar }`" alt="User Profile Picture" class="user-avatar" />
                <p class="username">{{ this.user.global_name }}</p>
            </div>
        </div>
        <div class="guild-container">
            <div 
                v-for="guild in guilds" 
                class="server" 
                :key="guild.id" 
                :title="guild.name" 
                @click="navigateToGuildOrAddBot(guild)" 
            >
                <img class="icon" :src="guild.icon_url" :alt="guild.name + '\'s Logo'">
                <p class="title">{{ guild.name }}</p>
                <button v-if="!guild.botPresent">Add ServerQuery to Guild</button>
                <button v-else>Guild Dashboard</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import axios from '../jwtInterceptor';

    export default {
        name: 'UserDashboard',
        data() {
        },
        computed: mapState({
            authenticated: state => state.authenticated,
            user: state => state.user,
            guilds: state => state.guilds,
        }),
        methods: {
            navigateToGuildOrAddBot(guild) {
                if (guild.botPresent) {
                    axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/local/check-server/${guild.id}`)
                        .then((response) => {
                            if (response.data.message === 'Guild added.') {
                                console.log('Guild added');
                            }
                            window.location.href = `${process.env.VUE_APP_FRONTEND_URL}dashboard/${guild.id}/`;
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } else {
                    window.location.href = `${process.env.VUE_APP_BACKEND_URL}api/get/local/invite-bot/${guild.id}`;
                }
            },
        },
    }
</script>

<style scoped>
.view {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 5px;
    box-sizing: border-box;
    overflow: auto;
}

.header {
    position: relative;
    height: 300px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-width: 2px;
    border-style: solid;
    border-radius: 25px;
}

.user-container {
    padding: 0;
    margin: 0;
    position: absolute;
    bottom: -115px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
}

.header img {
    width: 150px;
    height: 150px;
    border-radius: 100px;
    border: 8px solid #161b27
}

.header p {
    padding: 0;
    margin: 0;
    font-size: 20px;
    color: white;
}

.guild-container {
    width: 100%;
    height: auto;
    margin-top: 130px;
    margin-bottom: 5px;
    display: flex;
    flex-direction: row;
    justify-content: center; /* Center the wrapped servers */
    flex-grow: 4;
    flex-wrap: wrap;
}

.server {
    margin: 5px;
    padding: 15px;
    background-color: #42454986;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 250px;
    border-radius: 5px;
}

.server img {
    width: 100px;
    border-radius: 50px;
}

.server button {
    background-color: #7289DA;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-top: 20px;
    color: white;
    cursor: pointer;
}
.server button:hover {
    background-color: #8a9ddf;
}

</style>
