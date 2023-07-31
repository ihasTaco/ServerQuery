<template>
    <div class="center-container">
        <div class="form-container">
            <form @submit.prevent="updateSettings" class="form-content">
                <label>
                    Server Name
                    <TextInput
                        v-model="settings.server_name"
                        placeholder="Enter Server Name"
                        @change="this.updateStatus = null"
                        required
                    >
                    </TextInput>
                </label>
                <label>
                    Channel
                    <DropdownInput
                        v-model="settings.channel_id"
                        :options="guildChannels"
                        placeholder="Select Guild Channel"
                        @change="this.updateStatus = null"
                        required
                    >
                    </DropdownInput>
                </label>
                <label>
                    Refresh Interval <small>(In Seconds)</small>
                    <TextInput
                        v-model="settings.refresh_interval"
                        placeholder="Enter Server Refresh Interval"
                        @change="this.updateStatus = null"
                    >
                    </TextInput>
                </label>
                <button
                    :class="{
                        success: updateStatus === 'success',
                        error: updateStatus === 'error',
                    }"
                    type="submit"
                >
                    <span
                        v-if="updateStatus === 'loading'"
                        class="update-status"
                        >Updating...</span
                    >
                    <span
                        v-else-if="updateStatus === 'success'"
                        class="update-status success"
                        ><i class="bi bi-check2-circle"></i
                    ></span>
                    <span
                        v-else-if="updateStatus === 'error'"
                        class="update-status error"
                        ><i class="bi bi-x-lg"></i
                    ></span>
                    <span v-else class="update-status">Update</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
    import axios from "../../jwtInterceptor";
    import TextInput from '../inputs/textInput'
    import DropdownInput from '../inputs/dropdownInput';

    export default {
        name: "BotSettingsComponent",
        props: ['serverData', 'guildChannels', 'guild_id', 'server_uuid'],
        components: {
            TextInput,
            DropdownInput,
        },
        data() {
            return {
                updateStatus: null,
                settings: {
                    server_name: "",
                    channel_id: "",
                    refresh_interval: '',
                },
            };
        },
        methods: {
            updateSettings() {
                this.updateStatus = "loading";
                axios.post(`${process.env.VUE_APP_BACKEND_URL}api/post/write-bot-settings/${this.guild_id}/${this.server_uuid}`, { settings: this.settings, })
                    .then(response => {
                        this.updateStatus = "success";
                        this.servers = response.data;
                        if (this.servers.length > 0) {
                            this.isSideNavCompressed = false;
                            this.servers.forEach(server => {
                                this.hoverStates[server.id] = false;
                            });
                        }
                        this.$emit('update')
                    })
                    .catch(error => {
                        this.updateStatus = "error";
                        console.log("Error writing bot settings", error);
                    });

                console.log("Settings updated:", this.settings);
            },
        },
        mounted() {
            if (this.serverData && this.serverData.bot_settings) {
                if (this.serverData.bot_settings.server_name) {
                    this.settings.server_name = this.serverData.bot_settings.server_name;
                }
                if (this.serverData.bot_settings.channel_id) {
                    this.settings.channel_id = this.serverData.bot_settings.channel_id;
                }
                if (this.serverData.bot_settings.refresh_interval) {
                    this.settings.refresh_interval = this.serverData.bot_settings.refresh_interval;
                }
            }
        },
    };
</script>

<style src="./settings_styles.css"></style>
