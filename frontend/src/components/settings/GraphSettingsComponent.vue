<template>
    <div class="center-container">
        <div class="form-container">
            <form @submit.prevent="updateSettings" class="form-content">
                <label>
                    Disable Graph
                    <CheckInput
                        name="graph"
                        v-model="settings.disable"
                        @change="this.updateStatus = null"
                    ></CheckInput>
                </label>
                <div class="setting-container">
                    <p>Title Settings</p>
                    <label>
                        Title Text:
                        <TextInput
                            placeholder="Enter Title"
                            v-model="settings.title_settings.text"
                            :disabled="settings.disable"
                            @change="this.updateStatus = null"
                        ></TextInput>
                    </label>
                    <label>
                        Title Color
                        <ColorInput
                            placeholder="Enter Title Color"
                            v-model="settings.title_settings.color"
                            :disabled="settings.disable"
                            @change="this.updateStatus = null"
                        ></ColorInput>
                    </label>
                </div>
                <div class="setting-container">
                    <p>Label Settings</p>
                    <div class="setting-container">
                        <p>X Label Settings</p>
                        <label>
                            Label Text:
                            <TextInput
                                placeholder="Enter Label Text"
                                v-model="settings.x_label_settings.text"
                                :disabled="settings.disable"
                                @change="this.updateStatus = null"
                            ></TextInput>
                        </label>
                        <label>
                            Label Color
                            <ColorInput
                                placeholder="Enter Label Color"
                                v-model="settings.x_label_settings.color"
                                :disabled="settings.disable"
                                @change="this.updateStatus = null"
                            ></ColorInput>
                        </label>
                    </div>
                    <div class="setting-container">
                        <p>Y Label Settings</p>
                        <label>
                            Label Text:
                            <TextInput
                                placeholder="Enter Label Text"
                                v-model="settings.y_label_settings.text"
                                :disabled="settings.disable"
                                @change="this.updateStatus = null"
                            ></TextInput>
                        </label>
                        <label>
                            Label Color
                            <ColorInput
                                placeholder="Enter Label Color"
                                v-model="settings.y_label_settings.color"
                                :disabled="settings.disable"
                                @change="this.updateStatus = null"
                            ></ColorInput>
                        </label>
                    </div>
                </div>
                <div class="setting-container">
                    <p>Tick Settings</p>
                    <label>
                        X Tick Color
                        <ColorInput
                            placeholder="Enter X Tick Color"
                            v-model="settings.tick_settings.x_color"
                            :disabled="settings.disable"
                            @change="this.updateStatus = null"
                        ></ColorInput>
                    </label>
                    <label>
                        Y Tick Color
                        <ColorInput
                            placeholder="Enter Y Tick Color"
                            v-model="settings.tick_settings.y_color"
                            :disabled="settings.disable"
                            @change="this.updateStatus = null"
                        ></ColorInput>
                    </label>
                </div>
                <div class="setting-container">
                    <p>Graph Line Settings</p>
                    <div class="setting-container">
                        <p>Player Settings</p>
                        <label>
                            Disable Player Line
                            <CheckInput
                                name="graph"
                                v-model="settings.graph_line_settings.player_settings.disable"
                                @change="this.updateStatus = null"
                            ></CheckInput>
                        </label>
                        <label>
                            Player Line Color
                            <ColorInput
                                placeholder="Select Player Line Color"
                                v-model="settings.graph_line_settings.player_settings.line_color"
                                :disabled="settings.disable || settings.graph_line_settings.player_settings.disable"
                                @change="this.updateStatus = null"
                            ></ColorInput>
                        </label>
                        <label>
                            Player Fill Color
                            <ColorInput
                                placeholder="Select Player Line Color"
                                v-model="settings.graph_line_settings.player_settings.fill_color"
                                :disabled="settings.disable || settings.graph_line_settings.player_settings.disable"
                                @change="this.updateStatus = null"
                            ></ColorInput>
                        </label>
                        <label>
                            Player Fill Opacity
                            <OpacityInput
                                placeholder="Enter Player Fill Opacity"
                                v-model="settings.graph_line_settings.player_settings.fill_opacity"
                                :disabled="settings.disable || settings.graph_line_settings.player_settings.disable"
                                @change="this.updateStatus = null"
                            ></OpacityInput>
                        </label>
                    </div>
                    <div class="setting-container">
                        <p>Trend Settings</p>
                        <label>
                            Disable Trend Line
                            <CheckInput
                                name="graph"
                                v-model="settings.graph_line_settings.trend_settings.disable"
                                @change="this.updateStatus = null"
                            ></CheckInput>
                        </label>
                        <label>
                            Trend Line Color
                            <ColorInput
                                placeholder="Select Line Color"
                                v-model="settings.graph_line_settings.trend_settings.color"
                                :disabled="settings.disable || settings.graph_line_settings.trend_settings.disable"
                                @change="this.updateStatus = null"
                            ></ColorInput>
                        </label>
                    </div>
                    <div class="setting-container">
                        <p>Grid Settings</p>
                        <label>
                            Disable Grid
                            <CheckInput
                                name="graph"
                                v-model="settings.graph_line_settings.grid_settings.disable"
                                @change="this.updateStatus = null"
                            ></CheckInput>
                        </label>
                        <label>
                            Grid Color
                            <ColorInput
                                placeholder="Select Line Color"
                                v-model="settings.graph_line_settings.grid_settings.color"
                                :disabled="settings.disable || settings.graph_line_settings.grid_settings.disable"
                                @change="this.updateStatus = null"
                            ></ColorInput>
                        </label>
                        <label>
                            Border Opacity
                            <OpacityInput
                                placeholder="Enter Border Opacity"
                                v-model="settings.graph_line_settings.grid_settings.opacity"
                                :disabled="settings.disable || settings.graph_line_settings.grid_settings.disable"
                                @change="this.updateStatus = null"
                            ></OpacityInput>
                        </label>
                    </div>
                </div>
                <div class="setting-container">
                    <p>Legend Settings</p>
                    <label>
                        Disable Legend
                        <CheckInput
                            name="graph"
                            v-model="settings.legend_settings.disable"
                            @change="this.updateStatus = null"
                        ></CheckInput>
                    </label>
                    <div class="setting-container">
                        <p>Background Settings</p>
                        <label>
                            Background Color
                            <ColorInput
                                placeholder="Select Line Color"
                                v-model="settings.legend_settings.background_color"
                                :disabled="settings.disable || settings.legend_settings.disable"
                                @change="this.updateStatus = null"
                            ></ColorInput>
                        </label>
                        <label>
                            Background Opacity
                            <OpacityInput
                                placeholder="Enter Background Opacity"
                                v-model="settings.legend_settings.background_opacity"
                                :disabled="settings.disable || settings.legend_settings.disable"
                                @change="this.updateStatus = null"
                            ></OpacityInput>
                        </label>
                    </div>
                    <div class="setting-container">
                        <p>Background Settings</p>
                        <label>
                            Border Color
                            <ColorInput
                                placeholder="Select Line Color"
                                v-model="settings.legend_settings.border_color"
                                :disabled="settings.disable || settings.legend_settings.disable"
                                @change="this.updateStatus = null"
                            ></ColorInput>
                        </label>
                        <label>
                            Border Opacity
                            <OpacityInput
                                placeholder="Enter Border Opacity"
                                v-model="settings.legend_settings.border_opacity"
                                :disabled="settings.disable || settings.legend_settings.disable"
                                @change="this.updateStatus = null"
                            ></OpacityInput>
                        </label>
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
    import OpacityInput from '../inputs/opacityInput'
    import axios from '../../jwtInterceptor';
    
    export default {
        name: 'EmbedSettingsComponent',
        props: ['serverData', 'guild_id', 'server_uuid'],
        components: {
            TextInput,
            ColorInput,
            CheckInput,
            OpacityInput,
        },
        data() {
            return {
                updateStatus: null,
                settings: {
                    disable: false,
                    title_settings: {
                        text: "",
                        color: "",
                    },
                    x_label_settings: {
                        text: "",
                        color: "",
                    },
                    y_label_settings: {
                        text: "",
                        color: "",
                    },
                    tick_settings: {
                        x_color: "",
                        y_color: "",
                    },
                    graph_line_settings: {
                        player_settings: {
                            disable: false,
                            line_color: "",
                            fill_color: "",
                            fill_opacity: 0.0,
                        },
                        trend_settings: {
                            disable: false,
                            color: "",
                        },
                        grid_settings: {
                            disable: false,
                            color: "",
                            opacity: 0.0,
                        },
                    },
                    legend_settings: {
                        disable: false,
                        background_color: "",
                        background_opacity: 0.0,
                        border_color: "",
                        border_opacity: 0.0,
                    }
                },
            };
        },
        methods: {
            updateSettings() {
                this.updateStatus = 'loading';
                axios.post(`${process.env.VUE_APP_BACKEND_URL}api/post/write-graph-settings/${this.guild_id}/${this.server_uuid}`, { settings: this.settings })
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
            if (this.serverData && this.serverData.graph_settings) {
                this.setupSettings(this.serverData.graph_settings, this.settings);
            }
        },
    }
</script>


<style src="./settings_styles.css"></style>