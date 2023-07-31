<template>
    <div class="center-container">
        <div class="form-container">
            <form @submit.prevent="updateSettings" class="form-content">
                <label>
                    Embed Color
                    <ColorInput
                        placeholder="Enter Embed Color"
                        v-model="settings.embed_color"
                        @change="this.updateStatus = null"
                        required
                    >
                    </ColorInput>
                </label>
                <label>
                    Embed Title
                    <TextInput
                        placeholder="Enter Embed Title"
                        v-model="settings.embed_title"
                        @change="this.updateStatus = null"
                        required
                    >
                    </TextInput>
                </label>
                <label>
                    Embed Description
                    <TextInput
                        placeholder="Enter Embed Title"
                        v-model="settings.embed_description"
                        @change="this.updateStatus = null"
                        required
                    >
                    </TextInput>
                </label>
                <label>
                    Disable Timestamp
                    <CheckInput
                        name="timestamp"
                        v-model="settings.disable_timestamp"
                        @change="this.updateStatus = null"
                    >
                    </CheckInput>
                </label>
                <label>
                    Disable Player Names
                    <CheckInput
                        name="Player name"
                        v-model="settings.disable_player_names"
                        @change="this.updateStatus = null"
                    >
                    </CheckInput>
                </label>
                <div class="setting-container">
                    <p>Thumbnail Settings</p>
                    <label>
                        Disable Thumbnail
                        <CheckInput
                            name="thumbnail"
                            v-model="settings.thumbnail_settings.disable_thumbnail"
                            @change="this.updateStatus = null"
                        >
                        </CheckInput>
                    </label>
                    <label>
                        Thumbnail URL
                        <TextInput
                            placeholder="Enter Thumbnail URL"
                            v-model="settings.thumbnail_settings.thumbnail_url"
                            :disabled="settings.thumbnail_settings.disable_thumbnail"
                            :required="!settings.thumbnail_settings.disable_thumbnail"
                            @change="this.updateStatus = null"
                        >
                        </TextInput>
                    </label>
                </div>
                <div class="setting-container">
                    <p>Footer Settings</p>
                    <label>
                        Disable Footer
                        <CheckInput
                            name="footer"
                            v-model="settings.footer_settings.disable_footer"
                            @change="this.updateStatus = null"
                        >
                        </CheckInput>
                    </label>
                    <label>
                        Footer Text
                        <TextInput
                            placeholder="Enter Footer Text"
                            v-model="settings.footer_settings.footer_text"
                            :disabled="settings.footer_settings.disable_footer"
                            :required="!settings.footer_settings.disable_footer"
                            @change="this.updateStatus = null"
                        >
                        </TextInput>
                    </label>
                    <label>
                        Footer URL
                        <TextInput
                            placeholder="Enter Footer URL"
                            v-model="settings.footer_settings.footer_url"
                            :disabled="settings.footer_settings.disable_footer"
                            :required="!settings.footer_settings.disable_footer"
                            @change="this.updateStatus = null"
                        >
                        </TextInput>
                    </label>
                </div>
                <button 
                    :class="{'success': updateStatus === 'success', 'error': updateStatus === 'error'}" 
                    type="submit"
                >
                    <span v-if="updateStatus === 'loading'" class="update-status">Updating...</span>
                    <span v-else-if="updateStatus === 'success'" class="update-status success"><i class="bi bi-check2-circle"></i></span>
                    <span v-else-if="updateStatus === 'error'" class="update-status error"><i class="bi bi-x-lg"></i></span>
                    <span v-else class="update-status">Update</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
    import axios from '../../jwtInterceptor';

    import TextInput from '../inputs/textInput'
    import ColorInput from '../inputs/colorInput'
    import CheckInput from '../inputs/checkInput'

    export default {
        name: 'EmbedSettingsComponent',
        props: ['serverData', 'guild_id', 'server_uuid'],
        components: {
            TextInput,
            ColorInput,
            CheckInput,
        },
        data() {
            return {
                updateStatus: null,
                settings: {
                    embed_color: '#f99345',
                    embed_title: '{game} | {map}',
                    embed_description: 'Connect: steam://connect/{ip}:{connection_port}',
                    disable_timestamp: false,
                    disable_player_names: false,
                    thumbnail_settings: {
                        disable_thumbnail: false,
                        thumbnail_url: 'https://royalproductions.xyz/images/logo/RP_Logo_Outline.png'
                    },
                    footer_settings: {
                        disable_footer: false,
                        footer_text: 'ServerQuery by Royal Productions',
                        footer_url: "https://images-ext-2.discordapp.net/external/TAMDK-zRCVaPLqqGxFWpXE_rcA4H100VGINWKrVs5aU/https/cdn.discordapp.com/icons/1049010929968357446/537ca892b5537302bcefa30fac5b3e15.webp",
                    }
                },
            };
        },
        methods: {
            updateSettings() {
                this.updateStatus = 'loading';
                axios.post(`${process.env.VUE_APP_BACKEND_URL}api/post/write-embed-settings/${this.guild_id}/${this.server_uuid}`, { settings: this.settings })
                    .then((response) => {
                        this.updateStatus = 'success';
                        this.servers = response.data;
                        if (this.servers.length > 0) {
                            this.isSideNavCompressed = false;
                            this.servers.forEach((server) => {
                                this.hoverStates[server.id] = false;
                            });
                        }
                        this.$emit('update')
                    })
                    .catch((error) => {
                        this.updateStatus = 'error';
                        console.log('Error writing bot settings', error);
                    });
            },
            setupSettings(embedSettings, settings) {
                Object.keys(settings).forEach(key => {
                    if (key in embedSettings) {
                        settings[key] = embedSettings[key];
                    }
                });
            }
        },
        mounted() {
            if (this.serverData && this.serverData.embed_settings) {
                this.setupSettings(this.serverData.embed_settings, this.settings);
            }
        },
    }
</script>


<style src="./settings_styles.css"></style>