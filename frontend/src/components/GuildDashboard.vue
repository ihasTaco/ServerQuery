<template>
    <div class="view">
        <div 
            class="header" 
            :style="{ 
                'background-image': guild.banner ? `url(https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}?size=1024)` : '', 
                'background-color': banner_color,
                'border-color': `#${user.accent_color}`,
            }"
        >
            <div class="user-container">
                <img :src="guild.icon_url" alt="User Profile Picture" class="user-avatar" />
                <p class="username">{{ this.guild.name }}</p>
            </div>
        </div>
        <div class="guild-container">
            <div 
                v-for="(serverData, serverUUID) in servers"
                :key="serverUUID"
                class="server"
                :title="serverData"
                @click="navigateToServer(serverUUID)" 
            >
                <div class="content-container">
                    <div class="content" v-if="serverData.bot_settings && serverData.bot_settings.server_name !== ''">
                        <h4>Server Name</h4>
                        <p>{{ serverData.bot_settings.server_name }}</p>
                    </div>
                    <div class="content">
                        <h4>UUID</h4>
                        <p>{{ serverUUID }}</p>
                    </div>
                    <div class="content" v-if="serverData.server_settings && serverData.server_settings.game">
                        <h4>Game</h4>
                        <p>{{ serverData.server_settings.game }}</p>
                    </div>
                </div>
                <div class="footer">
                    <button>Server Dashboard</button>
                    <button @click="deleteServer(guild.id, serverUUID)" @click.stop="deleteServer(guild.id, serverUUID)" class="delete" title="Delete Server"><i class="bi bi-trash-fill"></i></button>
                </div>
            </div>
            <button @click="addNewServer" class="add-server-btn">
                <p>Add New Server</p>
                <i class="bi bi-plus-lg"></i>
            </button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
    import axios from '../jwtInterceptor';

    export default {
        name: 'UserDashboard',
        data() {
            return {
                guild_id: "",
                guild: [],
                servers: [],
                banner_color: '',
            }
        },
        computed: mapState({
            authenticated: state => state.authenticated,
            user: state => state.user,
            guilds: state => state.guilds,
        }),
        methods: {
            navigateToServer(uuid) {
                window.location.href = `${process.env.VUE_APP_FRONTEND_URL}dashboard/${this.guild_id}/${uuid}`;
            },
            getGuildServers() {
                axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/local/servers/${this.guild_id}`)
                    .then((response) => {
                        this.servers = response.data
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            getAverageColor(url) {
                return new Promise((resolve, reject) => {
                    let img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = url;
                    
                    img.onload = () => {
                        let canvas = document.createElement("canvas");
                        let context = canvas.getContext("2d");
                        
                        canvas.width = img.width;
                        canvas.height = img.height;
                        
                        context.drawImage(img, 0, 0, img.width, img.height);
                        
                        let imageData = context.getImageData(0, 0, img.width, img.height);
                        let data = imageData.data;
                        let r = 0;
                        let g = 0;
                        let b = 0;
                        
                        for (let i = 0, l = data.length; i < l; i += 4) {
                            r += data[i];
                            g += data[i + 1];
                            b += data[i + 2];
                        }
                      
                        r = Math.floor(r / (data.length / 4));
                        g = Math.floor(g / (data.length / 4));
                        b = Math.floor(b / (data.length / 4));
                      
                        let rgb = `rgb(${r},${g},${b})`;
                        let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                      
                        resolve({rgb, hex});
                    };
                  
                    img.onerror = err => {
                        reject(err);
                    };
                });
            },
            async addNewServer() {
                await axios.get(`${process.env.VUE_APP_BACKEND_URL}api/get/local/generate-uuid/${this.guild_id}`)
                    .then((response) => {
                        window.location.href = `${process.env.VUE_APP_FRONTEND_URL}dashboard/${this.guild_id}/${response.data.server_uuid}`;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            async deleteServer(guild_id, server_uuid) {
                try {
                    const response = await axios.delete(`${process.env.VUE_APP_BACKEND_URL}api/post/delete-server`, {
                        data: { guild_id, server_uuid }
                    });

                    if (response.status === 200) {
                        window.location.reload();
                    } else {
                        console.log(`Failed to delete server UUID: ${response.data.error}`);
                        window.location.reload();
                    }
                } catch (err) {
                    console.error(`Failed to delete server UUID: ${err}`);
                    window.location.reload();
                }
            },
        },
        created() {
            this.guild_id = window.location.pathname.split('/')[2];

            for (let g of this.guilds) {
                if (g.id == this.guild_id){
                    this.guild = g;
                }
            }

            this.getAverageColor(this.guild.icon_url)
                .then(color => {
                    this.banner_color = color.hex;
                })
                .catch(err => {
                    console.error(err);
                });

            this.servers = this.getGuildServers(this.guild_id);
        },
        mounted() {
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
}

.header {
    position: relative;
    height: 300px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 25px;
    box-sizing: border-box;
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
    justify-content: center;
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
    justify-content: space-between;
    align-items: center;
    width: 250px;
    border-radius: 5px;
}

.content-container {
    flex: 1;  /* This is the new line, it makes this element to expand and take up any remaining space */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.server button {
    background-color: #7289DA;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-top: 20px;
    color: white;
    cursor: pointer;
    margin: 2px;
}

.delete {
    background-color: transparent !important;
    border: 1px solid rgb(176, 53, 53) !important;
    border-radius: 5px;
    padding: 10px;
    margin-top: 20px;
    color: rgb(176, 53, 53) !important;
    cursor: pointer;
    font-size: 15px;
    font-weight: 50;
    transition: color 0.3s ease;
    transition: border-color 0.3s ease;
    transition: background-color 0.3s ease;
}

.delete:hover {
    background-color: rgb(176, 53, 53) !important;
    color: white !important;
    border: 1px solid rgb(176, 53, 53) !important;
}

.server button:hover {
    background-color: #8a9ddf;
}

.content {
    width: 100%;
    text-align: center;
    margin: 2px;
    padding: 0;
    background-color: #6666669d;
    border-radius: 5px;
}

.content h3 {
    margin: 0;
    padding: 0;
}

.content p {
    margin: 0;
    padding: 0 0 15px 0;
}

.add-server-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-flow: column;
    margin: 5px;
    padding: 15px;
    background-color: #42454986;
    color: white;
    width: 250px;
    border: none;
    border-radius: 5px;
}

.add-server-btn i {
    font-size: 30px;
}

.title {
    padding: 0;
    margin: 0;
    font-size: 20px;
    color: white;
    text-align: center;
}

.footer {
    height: 59px;
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>
