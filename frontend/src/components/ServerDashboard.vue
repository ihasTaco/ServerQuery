<template>
    <div class="view">
        <div class="discord-login">
            <div class="settings-container">
                <div v-for="(setting, index) in settings" :key="index" :class="['setting', { 'active': activeSetting === index }]">
                    <div class="nav-button" @click="toggleSetting(index)">
                        <span class="nav-button-label">{{ setting.label }}</span>
                    </div>
                    <div v-if="activeSetting === index" :class="['setting-content', { 'active': activeSetting === index }]">
                        <component 
                            @update="getServerSettings()" 
                            :is="setting.component" 
                            :serverData="serverData" 
                            :guildEmojis="guildEmojis"
                            :guildChannels="guildChannels"
                            :guild_id="guild_id"
                            :server_uuid="server_uuid"
                        >
                        </component>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import emojis from './public/emojis.js';
    import { mapState } from 'vuex';
    import axios from '../jwtInterceptor';

    import BotSettingsComponent from './settings/BotSettingsComponent.vue';
    import ServerSettingsComponent from './settings/ServerSettingsComponent.vue';
    import EmbedSettingsComponent from './settings/EmbedSettingsComponent.vue';
    import EmbedFieldsComponent from './settings/EmbedFieldsComponent.vue';
    import GraphSettingsComponent from './settings/GraphSettingsComponent.vue';
    import NotificationSettingsComponent from './settings/NotificationSettingsComponent.vue';

    export default {
        name: 'UserDashboard',
        components: {
            BotSettingsComponent,
            ServerSettingsComponent,
            EmbedSettingsComponent,
            EmbedFieldsComponent,
            GraphSettingsComponent,
            NotificationSettingsComponent,
        },
        data() {
            return {
                guild_id: '',
                server_uuid: '',
                serverData: null,
                guildEmojis: emojis,
                guildChannels: {},
                activeSetting: null,
                settings: [
                    { label: 'Bot Settings', component: 'BotSettingsComponent' },
                    { label: 'Server Settings', component: 'ServerSettingsComponent' },
                    { label: 'Embed Settings', component: 'EmbedSettingsComponent' },
                    { label: 'Embed Fields', component: 'EmbedFieldsComponent' },
                    { label: 'Graph Settings', component: 'GraphSettingsComponent' },
                    { label: 'Notification Settings', component: 'NotificationSettingsComponent' },
                ],
            };
        },
        computed: mapState({
            authenticated: state => state.authenticated,
            user: state => state.user,
            guilds: state => state.guilds,
        }),
        methods: {
            toggleSetting(index) {
                if (this.activeSetting === index) {
                    this.activeSetting = null;
                } else {
                    this.activeSetting = index;
                }
            },
            async getServerSettings(){
                try {
                    const response = await axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/local/servers/${this.guild_id}`)
                    const data = response.data;
                    if (data) {
                        if (data[this.server_uuid]) {
                            this.serverData = data[this.server_uuid];
                        } else {
                            console.error("No data found for UUID: ", this.server_uuid);
                        }
                    } else {
                        console.error("No data received");
                    }
                    this.isLoading = false;
                } catch (error) {
                    console.error(error);
                    this.isLoading = false;
                }
            },
            async getGuildEmojis() {
                axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/discord/guild/${this.guild_id}/emojis/`)
                    .then(response => {
                        if (response.data.length == 0) {
                            return;
                        } else {
                            if (response.data) {
                                const newEmojis = response.data.map(emoji => {
                                    const emojiUrl = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}?size=24`;
                                    return {
                                        value: `<${emoji.id}>`,
                                        label: `:${emoji.name}:`,
                                        image: `${emojiUrl}`,
                                        unicode: ''
                                    };
                                });
                                this.guildEmojis.push(...newEmojis);
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Failed to fetch guild emojis:', error);
                    });
            },
            async getGuildChannels() {
                axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/discord/guild/${this.guild_id}/channels/`)
                    .then(response => {
                        if (response.data.length == 0) {
                            return;
                        } else {
                            if (response.data) {
                                this.guildChannels = response.data
                                    .filter(channel => channel.type == 0)
                                    .map(channel => ({ value: channel.id, label: channel.name }));
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Failed to fetch guild channels:', error);
                    });
            },
        },
        async created() {
            this.guild_id = window.location.pathname.split('/')[2];
            this.server_uuid = window.location.pathname.split('/')[3];
            this.getServerSettings();
            this.getGuildEmojis();
            this.getGuildChannels();
        }
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
    color: white;
}

.settings-container {
    display: flex;
    justify-content: center;
    flex-flow: column;
    width: 100%;
}
.setting {
    flex: 1;
    display: inline-flex;
    flex-flow: column;
    text-align: center;
    background-color: #1c2536;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
.setting.active {
    background: #7289da8a;
}
.nav-button {
    padding: 15px 0;
}
.setting .nav-button-label {
    width: 100%;
}
.setting .setting-content {
    width: 100%;
}
.setting-content .active {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

    
</style>

