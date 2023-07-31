<template>
    <div>
        <div class="Side-Nav">
            <div class="nav-header">
                <div class="logo-container">
                    <img :src="`https://cdn.discordapp.com/avatars/${ user.id }/${ user.avatar }`" alt="User Profile Picture" class="user-pfp" v-if="authenticated" @click="navigateToUserDashboard()"/>
                    <img src="../assets/mobile-logo.png" alt="User Profile Picture" class="user-pfp" v-if="!authenticated"/>
                </div>
            </div>
            <div class="nav-buttons">
                <div 
                    v-for="guild in guilds" 
                    :key="guild.id" 
                    class="nav-button" 
                    :title="guild.name" 
                    @click="navigateToGuildOrAddBot(guild)" 
                    @mouseover="hoverStates[guild.id] = true" 
                    @mouseleave="hoverStates[guild.id] = false"
                >
                    <div class="guild-icon-wrapper" v-if="!guild.botPresent">
                        <div class="guild-icon-overlay"></div>
                        <img class="nav-button-image" :src="guild.icon_url" :alt="guild.name + '\'s Logo'">
                        <span class="add-bot-icon">+</span>
                    </div>
                    <img v-else class="nav-button-image" :src="guild.icon_url" :alt="guild.name + '\'s Logo'">
                </div>
            </div>
            <div class="nav-footer" v-if="authenticated">
                <span class="logout-button nav-button" @click="logout"><i class="bi bi-box-arrow-left"></i></span>
            </div>
        </div>
    </div>
</template>
  
<script>
    import { mapState, mapActions } from 'vuex';
    import axios from '../jwtInterceptor';

    export default {
        name: 'SideNav',
        data() {
          return {
            guildIconUrls: {},
            hoverStates: [],
          }
        },
        computed: mapState({
            authenticated: state => state.authenticated,
            user: state => state.user,
            guilds: state => state.guilds,
        }),
        methods: {
            ...mapActions([
                'logOut'
            ]),
            navigateToGuildOrAddBot(guild) {
                if (guild.botPresent) {
                    axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/local/check-server/${guild.id}`)
                        .then((response) => {
                            if (response.data.message === 'Server added.') {
                                console.log('Server added');
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
            navigateToUserDashboard(){
                window.location.href = `${process.env.VUE_APP_FRONTEND_URL}dashboard`;
            },
            logout() {
                this.logOut();
                window.location.href = `${process.env.VUE_APP_BACKEND_URL}logout`;
            },
        },
    };
</script>

<style scoped>
    .Side-Nav {
        width: 70px;
        height: 98.5vh;
        transition: width 0.3s ease;
        top: 0;
        left: 0;
        background-color: #1c2536;
        box-sizing: content-box;
        margin: 5px;
        display: fixed;
        border-radius: 5px;
        
        display: flex;
        flex-direction: column;
        justify-content: flex-start; 
    }

    .nav-header {
        height: 59px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid;
        border-image: linear-gradient(90deg, transparent, orange, transparent) 1;
    }

    .logo-container {
        display: flex;
        width: 44px;
        height: 44px;
    }

    .user-pfp {
        width: 44px;
        height: 44px;
        margin: 0;
        padding: 0;
        border-radius: 22px;
        cursor: pointer;
    }

    .nav-buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        margin-top: 3px;
        flex: 1;
    }

    .nav-button {
        display: flex;
        justify-content: center;
        overflow: hidden;
        cursor: pointer;
        padding: 5px;
        margin-top: 2px;
        box-sizing: border-box;
        width: 60px;
        border-radius: 5px;
    }

    .nav-button:hover {
        background-color: #2a3652;
    }

    .nav-button-image {
        width: 44px;
        height: 44px;
        border-radius: 22px;
        z-index: 1;
    }

    .nav-button-label {
        font-family: "Roboto", sans-serif;
        color: #b1c4c8;
        font-size: 18px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 15px;
        z-index: 0;
    }

    .guild-icon-wrapper {
        align-items: center;
        position: relative;
        display: inline-block;
        width: 44px;
        height: 44px;
    }

    .guild-icon-overlay {
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 22px;
    }

    .add-bot-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 24px;
    }

    .guild-icon-overlay,
    .add-bot-icon {
        display: none;
    }

    .nav-button:hover .guild-icon-overlay,
    .nav-button:hover .add-bot-icon {
        display: block;
    }
    
    .add-bot-label-hover {
        display: none;
    }

    .nav-button:hover .add-bot-label {
        display: none;
    }

    .nav-button:hover .add-bot-label-hover {
        display: inline;
    }

    .nav-footer {
        height: 59px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .logout-button {
        color: white;
        border: none;
        cursor: pointer;
        text-align: center;
        justify-content: center;
        font-size: 20px;
    }
    .logout-button:hover {
        color: red;
        border: none;
        cursor: pointer;
        text-align: center;
        justify-content: center;
        font-size: 20px;
    }
</style>