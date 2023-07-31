<template v-slot:field_status="{ index, status_online_emoji, status_offline_emoji, status_online_text, status_offline_text, disable }">
    <div class="center-container">
        <div class="form-container">
            <form @submit.prevent="updateSettings" class="form-content">
                <draggable
                    v-model="embedFieldsArray"
                    ghost-class="ghost"
                    handle=".field-grip"
                    @end="updateOrder"
                >
                <div 
                    v-for="field in embedFieldsArray" 
                    :key="field.name"
                    class="field"
                    :fieldname="field.name"
                >
                    <div class="field-grip">
                        <i class="bi bi-grip-vertical"></i>
                    </div>
                    <div class="field-container">
                        {{ toTitleCase(field.name) }}
                        <div class="field-disable">
                            <label>
                                Disable
                                <CheckInput
                                    class="checkbox"
                                    v-model="settings.embed_fields[field.name].disable"
                                    @update:modelValue="logValue"
                                    @change="this.updateStatus = null"
                                ></CheckInput>
                            </label>
                            <label>
                                Inline
                                <CheckInput
                                    class="checkbox"
                                    v-model="settings.embed_fields[field.name].inline"
                                    :disabled="settings.embed_fields[field.name].disable"
                                    @change="this.updateStatus = null"
                                ></CheckInput>
                            </label>
                        </div>
                        <div class="field-content">
                            <div class="field-input" v-if="'online_emoji' in settings.embed_fields[field.name] || 'offline_emoji' in settings.embed_fields[field.name] || 'emoji' in settings.embed_fields[field.name]">
                                <label v-if="'online_emoji' in settings.embed_fields[field.name]">
                                    Online Emoji
                                    <DropdownInput
                                        v-model="settings.embed_fields[field.name].online_emoji"
                                        :disabled="settings.embed_fields[field.name].disable"
                                        :required="!settings.embed_fields[field.name].disable"
                                        :options="guildEmojis"
                                        placeholder="Select Online Status Emoji"
                                        @change="this.updateStatus = null"
                                    ></DropdownInput>
                                </label>
                                <label v-if="'offline_emoji' in settings.embed_fields[field.name]">
                                    Offline Emoji
                                    <DropdownInput
                                        v-model="settings.embed_fields[field.name].offline_emoji"
                                        :disabled="settings.embed_fields[field.name].disable"
                                        :required="!settings.embed_fields[field.name].disable"
                                        :options="guildEmojis"
                                        placeholder="Select Offline Status Emoji"
                                        @change="this.updateStatus = null"
                                    ></DropdownInput>
                                </label>
                                <label v-if="'emoji' in settings.embed_fields[field.name]">
                                    {{ toTitleCase(field.name) }} Emoji
                                    <DropdownInput
                                        v-model="settings.embed_fields[field.name].emoji"
                                        :disabled="settings.embed_fields[field.name].disable"
                                        :required="!settings.embed_fields[field.name].disable"
                                        :options="guildEmojis"
                                        :placeholder='`Select ${ toTitleCase(field.name) } Emoji`'
                                        @change="this.updateStatus = null"
                                    ></DropdownInput>
                                </label>
                            </div>
                            <div class="field-input" v-if="'online_text' in settings.embed_fields[field.name] || 'offline_text' in settings.embed_fields[field.name] || 'text' in settings.embed_fields[field.name]">
                                <label v-if="'online_text' in settings.embed_fields[field.name]">
                                    Online Text
                                    <TextInput
                                        v-model="settings.embed_fields[field.name].online_text"
                                        :disabled="settings.embed_fields[field.name].disable"
                                        :required="!settings.embed_fields[field.name].disable"
                                        placeholder="Enter Online Status Text"
                                        @change="this.updateStatus = null"
                                    ></TextInput>
                                </label>
                                <label v-if="'offline_text' in settings.embed_fields[field.name]">
                                    Offline Text
                                    <TextInput
                                        v-model="settings.embed_fields[field.name].offline_text"
                                        :disabled="settings.embed_fields[field.name].disable"
                                        :required="!settings.embed_fields[field.name].disable"
                                        placeholder="Enter Offline Status Text"
                                        @change="this.updateStatus = null"
                                    ></TextInput>
                                </label>
                                <label v-if="'text' in settings.embed_fields[field.name]">
                                    {{ toTitleCase(field.name) }} Text
                                    <TextInput
                                        v-model="settings.embed_fields[field.name].text"
                                        :disabled="settings.embed_fields[field.name].disable"
                                        :required="!settings.embed_fields[field.name].disable"
                                        :placeholder='`Enter ${ toTitleCase(field.name) } Text`'
                                        @change="this.updateStatus = null"
                                    ></TextInput>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                </draggable>
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
    import { VueDraggableNext } from 'vue-draggable-next'
    import { reactive } from 'vue';
    import TextInput from '../inputs/textInput'
    import DropdownInput from '../inputs/dropdownInput'
    import CheckInput from '../inputs/checkInput'
    import axios from '../../jwtInterceptor';
    
    export default {
        name: 'EmbedFieldsComponent',
        props: ['serverData', 'guildEmojis', 'guild_id', 'server_uuid'],
        components: {
            TextInput,
            DropdownInput,
            CheckInput,
            draggable: VueDraggableNext,
        },
        data() {
            return {
                updateStatus: null,
                settings: reactive({
                    embed_fields: {
                        status: {
                            disable: false,
                            inline: true,
                            index: 0,
                            online_emoji: ":green_circle:",
                            offline_emoji: ":red_circle:",
                            online_text: "Online",
                            offline_text: "Offline"
                        },
                        connection: {
                            disable: false,
                            inline: true,
                            index: 1,
                            text: "{server_ip}:{server_connection_port}"
                        },
                        location: {
                            disable: false,
                            inline: true,
                            index: 2,
                            emoji: ":flag_us:",
                            text: "US"
                        },
                        game: {
                            disable: false,
                            inline: true,
                            index: 3,
                            text: "{game}"
                        },
                        map: {
                            disable: false,
                            inline: true,
                            index: 4,
                            text: "{map}"
                        },
                        players: {
                            disable: false,
                            inline: true,
                            index: 5,
                            text: "{players_active}/{players_max}"
                        },
                        password_protected: {
                            disable: true,
                            inline: true,
                            index: 6,
                            emoji: ":lock:"
                        },
                        password: {
                            disable: true,
                            inline: true,
                            index: 7,
                            text: "Password123"
                        }
                    }
                }),
            };
        },
        methods: {
            updateSettings() {
                this.updateStatus = 'loading';
                axios.post(`${process.env.VUE_APP_BACKEND_URL}api/post/write-embed-field-settings/${this.guild_id}/${this.server_uuid}`, { settings: this.settings })
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
            updateOrder() {
                this.embedFieldsArray = this.embedFieldsArray
                    .map((field, index) => ({ ...field, index }))
                    .sort((a, b) => a.index - b.index);
            },
            updateFieldArray() {
                let tempEmbedFieldsArray = Object.entries(this.settings.embed_fields)
                    .map(([name, value]) => ({ name, ...value }))
                    .sort((a, b) => a.index - b.index);
                this.settings.embed_fields = tempEmbedFieldsArray.reduce((obj, item, index) => {
                    obj[item.name] = { ...item, index };
                    delete obj[item.name].name;
                    return obj;
                }, {});
            },
            toTitleCase(str) {
                return str.replace(/_/g, ' ').replace(/\w\S*/g, function(txt){
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            },
            logValue(value) {
                console.log(value)
            },
        },
        computed: {
            embedFieldsArray: {
                get() {
                    if (!this.settings || !this.settings.embed_fields) {
                        return [];
                    }
                    return Object.entries(this.settings.embed_fields)
                        .map(([name, value]) => ({ name, ...value }))
                        .sort((a, b) => a.index - b.index);
                },
                set(newArray) {
                    this.settings.embed_fields = newArray.reduce((obj, item, index) => {
                        obj[item.name] = { ...item, index };
                        delete obj[item.name].name;
                        return obj;
                    }, {});
                }
            },
        },
        mounted() {
            if (this.serverData && this.serverData.embed_field_settings && this.serverData.embed_field_settings.embed_fields) {
                const categories = ['status', 'connection', 'location', 'game', 'map', 'players', 'password_protected', 'password'];
            
                for (let category of categories) {
                    if (this.serverData.embed_field_settings.embed_fields[category]) {
                        const fields = Object.keys(this.serverData.embed_field_settings.embed_fields[category]);
                        for (let field of fields) {
                            if (!this.settings.embed_fields[category]) {
                                this.settings.embed_fields[category] = {};
                            }
                            this.settings.embed_fields[category][field] = this.serverData.embed_field_settings.embed_fields[category][field];
                        }
                    }
                }
            }
            this.updateFieldArray();
        }
    }
</script>

<style src="./settings_styles.css"></style>