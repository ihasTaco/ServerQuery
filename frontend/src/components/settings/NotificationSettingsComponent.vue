<template>
    <div class="center-container">
        <div class="form-container">
            <form @submit.prevent="updateSettings" class="form-content">
                <label>
                    Disable Notifications
                    <CheckInput
                        name="graph"
                        v-model="settings.disable"
                        @change="this.updateStatus = null"
                    ></CheckInput>
                </label>
                <label>
                    Disable Timestamp
                    <CheckInput
                        name="graph"
                        v-model="settings.disable_timestamp"
                        :disabled="settings.disable"
                        @change="this.updateStatus = null"
                    ></CheckInput>
                </label>
                <label>
                    Notification Channel ID:
                    <DropdownInput
                        placeholder="Select Guild Channel"
                        v-model="settings.channel_id"
                        :options="guildChannels"
                        :disabled="settings.disable"
                        @change="this.updateStatus = null"
                    ></DropdownInput>
                </label>
                <div class="setting-container">
                    <p>Embed Settings</p>
                    <label>
                        Embed Title
                        <TextInput
                            placeholder="Enter Embed Title"
                            v-model="settings.embed_settings.embed_title"
                            :disabled="settings.disable"
                            :required="!settings.disable"
                            @change="this.updateStatus = null"
                        ></TextInput>
                    </label>
                    <label>
                        Embed Description
                        <TextInput
                            placeholder="Enter Embed Description"
                            v-model="settings.embed_settings.embed_description"
                            :disabled="settings.disable"
                            @change="this.updateStatus = null"
                        ></TextInput>
                    </label>
                    <div class="setting-container">
                        <p>Color Settings</p>
                        <label>
                            Offline Color
                            <ColorInput
                                placeholder="Enter Offline Color"
                                v-model="settings.embed_settings.offline_color"
                                :disabled="settings.disable"
                                :required="!settings.disable"
                                @change="this.updateStatus = null"
                            ></ColorInput>
                        </label>
                        <label>
                            Online Color
                            <ColorInput
                                placeholder="Enter Online Color"
                                v-model="settings.embed_settings.online_color"
                                :disabled="settings.disable"
                                :required="!settings.disable"
                                @change="this.updateStatus = null"
                            ></ColorInput>
                        </label>
                    </div>
                    <div class="setting-container">
                        <p>Thumbnail Settings</p>
                        <label>
                            Disable Thumbnail
                            <CheckInput
                                name="graph"
                                v-model="settings.embed_settings.thumbnail_settings.disable"
                                :disabled="settings.disable"
                                @change="this.updateStatus = null"
                            ></CheckInput>
                        </label>
                        <label>
                            Thumbnail URL
                            <TextInput
                                placeholder="Enter Thumbnail URL"
                                v-model="settings.embed_settings.thumbnail_settings.thumbnail_url"
                                :disabled="settings.disable || settings.embed_settings.thumbnail_settings.disable"
                                :required="!settings.disable || settings.embed_settings.thumbnail_settings.disable"
                                @change="this.updateStatus = null"
                            ></TextInput>
                        </label>
                    </div>
                    <div class="setting-container">
                        <p>Footer Settings</p>
                        <label>
                            Disable Footer
                            <CheckInput
                                name="graph"
                                v-model="settings.embed_settings.footer_settings.disable"
                                :disabled="settings.disable"
                                @change="this.updateStatus = null"
                            ></CheckInput>
                        </label>
                        <label>
                            Footer Text
                            <TextInput
                                placeholder="Enter Footer Text"
                                v-model="settings.embed_settings.footer_settings.footer_text"
                                :disabled="settings.disable || settings.embed_settings.footer_settings.disable"
                                :required="!settings.disable || settings.embed_settings.footer_settings.disable"
                                @change="this.updateStatus = null"
                            ></TextInput>
                        </label>
                        <label>
                            Footer URL
                            <TextInput
                                placeholder="Enter Footer URL"
                                v-model="settings.embed_settings.footer_settings.footer_url"
                                :disabled="settings.disable || settings.embed_settings.footer_settings.disable"
                                @change="this.updateStatus = null"
                            ></TextInput>
                        </label>
                    </div>
                    <div class="setting-container">
                        <p>Ping Settings</p>
                        <label>
                            Disable Pings
                            <CheckInput
                                name="graph"
                                v-model="settings.embed_settings.ping_settings.disable"
                                :disabled="settings.disable"
                                @change="this.updateStatus = null"
                            ></CheckInput>
                        </label>
                        <label>
                            Ping User/Role ID
                            <TextInput
                                placeholder="Enter User or Role ID"
                                v-model="settings.embed_settings.ping_settings.ping"
                                :disabled="settings.disable || settings.embed_settings.ping_settings.disable"
                                :required="!settings.disable || settings.embed_settings.ping_settings.disable"
                                @change="this.updateStatus = null"
                                title="To get a Users or Role ID, turn on Discords Developer mode, and right click the user and select 'Copy User ID' or go to your guild settings and then 'Roles' and then right click the role and select 'Copy Role ID'"
                            ></TextInput>
                        </label>
                    </div>
                </div>
                <div class="setting-container">
                    <p>Field Settings</p>
                    <div class="setting-container">
                        <p>Status</p>
                        <label>
                            Disable
                            <CheckInput
                                class="checkbox"
                                v-model="settings.field_settings.status.disable"
                                :disabled="settings.disable"
                                @change="this.updateStatus = null"
                            ></CheckInput>
                        </label>
                        <div class="setting-container">
                            <p>Emojis</p>
                            <div class="field-content">
                                <div class="field-input">
                                    <label>
                                        Offline Emoji
                                        <DropdownInput
                                            v-model="settings.field_settings.status.offline_emoji"
                                            :disabled="settings.disable || settings.field_settings.status.disable"
                                            :required="!settings.disable || !settings.field_settings.status.disable"
                                            :options="guildEmojis"
                                            placeholder="Select Offline Status Emoji"
                                            @change="this.updateStatus = null"
                                        ></DropdownInput>
                                    </label>
                                </div>
                                <div class="field-input">
                                    <label>
                                        Online Emoji
                                        <DropdownInput
                                            v-model="settings.field_settings.status.online_emoji"
                                            :disabled="settings.disable || settings.field_settings.status.disable"
                                            :required="!settings.disable || !settings.field_settings.status.disable"
                                            :options="guildEmojis"
                                            placeholder="Select Online Status Emoji"
                                            @change="this.updateStatus = null"
                                        ></DropdownInput>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="setting-container">
                            <p>Emojis</p>
                            <div class="field-input">
                                <label>
                                    Online Text
                                    <TextInput
                                        v-model="settings.field_settings.status.online_text"
                                        :disabled="settings.disable || settings.field_settings.status.disable"
                                        :required="!settings.disable || !settings.field_settings.status.disable"
                                        placeholder="Enter Online Status Text"
                                        @change="this.updateStatus = null"
                                    ></TextInput>
                                </label>
                            </div>
                            <div class="field-input">
                                <label>
                                    Offline Text
                                    <TextInput
                                        v-model="settings.field_settings.status.offline_text"
                                        :disabled="settings.disable || settings.field_settings.status.disable"
                                        :required="!settings.disable || !settings.field_settings.status.disable"
                                        placeholder="Enter Offline Status Text"
                                        @change="this.updateStatus = null"
                                    ></TextInput>
                                </label>
                            </div>
                        </div>
                    </div>
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
    import TextInput from '../inputs/textInput'
    import CheckInput from '../inputs/checkInput'
    import ColorInput from '../inputs/colorInput'
    import DropdownInput from '../inputs/dropdownInput';
    import axios from '../../jwtInterceptor';
    
    export default {
        name: 'NotificationSettingsComponent',
        props: ['serverData', 'guildChannels', 'guildEmojis', 'guild_id', 'server_uuid'],
        components: {
            TextInput,
            ColorInput,
            CheckInput,
            DropdownInput,
        },
        data() {
            return {
                updateStatus: null,
                settings: {
                    disable: false,
                    disable_timestamp: false,
                    channel_id: "",
                    embed_settings: {
                        embed_title: "{server_name} is now {server_status}",
                        embed_description: "",
                        embed_color: {
                            offline_color: "#d23232",
                            online_color: "#28c332",
                        },
                        thumbnail_settings: {
                            disable: false,
                            thumbnail_url: "",
                        },
                        footer_settings: {
                            disable: false,
                            footer_text: "ServerQuery by Royal Productions",
                            footer_url: "https://images-ext-2.discordapp.net/external/TAMDK-zRCVaPLqqGxFWpXE_rcA4H100VGINWKrVs5aU/https/cdn.discordapp.com/icons/1049010929968357446/537ca892b5537302bcefa30fac5b3e15.webp",
                        },
                        ping_settings: {
                            disable: true,
                            ping: "",
                        }
                    },
                    field_settings: {
                        status: {
                            disable: false,
                            index: 0,
                            offline_emoji: ":red_circle:",
                            online_emoji: ":green_circle:",
                            online_text: "Online",
                            offline_text: "Offline",
                        }
                    },
                },
            };
        },
        methods: {
            updateSettings() {
                this.updateStatus = 'loading';
                axios.post(`${process.env.VUE_APP_BACKEND_URL}api/post/write-notification-settings/${this.guild_id}/${this.server_uuid}`, { settings: this.settings })
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
            setupSettings(notifSettings, settings) {
                Object.keys(settings).forEach(key => {
                    if (key in notifSettings) {
                        settings[key] = notifSettings[key];
                    }
                });
            }
        },
        mounted() {
            if (this.serverData && this.serverData.notification_settings) {
                this.setupSettings(this.serverData.notification_settings, this.settings);
            }
        },
    }
</script>


<style src="./settings_styles.css"></style>