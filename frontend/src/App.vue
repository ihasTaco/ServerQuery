<template>
    <div id="app">
        <div class="app-container">
            <div class="sidenav">
                <SideNav class="SideNav" />
            </div>
            <div class="content-container">
                <router-view class="router-view" />
            </div>
        </div>
    </div>
</template>
  
<script>
    import { mapState, mapActions } from 'vuex';

    // Components
    import SideNav from './components/SideNav.vue';

    export default {
        name: 'App',
        data() {
            return {
                isLoading: true,
            };
        },
        components: {
            SideNav,
        },
        computed: mapState({
            authenticated: state => state.authenticated,
            user: state => state.user,
            guilds: state => state.guilds,

        }),
        async created() {
            await this.$store.dispatch('checkAuthentication');

            if (this.authenticated) {
                if (!this.user.global_name || !this.user.id || !this.user.banner || !this.user.banner_color || !this.user.avatar || !this.user.botInGuild) {
                    await this.getUserData();
                }
                if (!this.guilds || this.guilds.length === 0) {
                    await this.getUserGuilds();
                } else {
                    for (let guild of this.guilds) {
                        if (guild.botPresent) {
                            await this.getGuildInfo(guild.id);
                        } else {
                            continue;
                        }
                    }
                }
                for (let guild of this.guilds) {
                    if (guild.id) {
                        this.getBotPresence(guild.id);
                        this.generateGuildIcon(guild);
                    } else {
                        continue;
                    }
                }
            }
            
        },
        methods: {
            ...mapActions([
                'getUserData',
                'getUserGuilds',
                'getGuildInfo',
                'getBotPresence',
                'generateGuildIcon',
                'logOut',
            ]),
        },
    };
</script>
  
<style>
    body {
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #161b27;
        
    }

    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background-color: #161b27;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #2a3652;
        border-radius: 5px;
    }
  
    #app,
    .app-container {
        height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-flow: row ;
        overflow: auto auto;
        margin: 0;
        padding: 0;
    }
  
    .sidenav {
        overflow: hidden auto;
        box-sizing: border-box;
    }
  
    .content-container {
        flex: calc(100% - 82px);
        box-sizing: border-box;
        overflow: hidden;
    }

    .router-view {
        display: block;
        padding: 15px;
        width: 100% !important;
    }
</style>