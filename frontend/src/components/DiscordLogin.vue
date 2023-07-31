<template>
    <div class="view">
        <div class="discord-login">
            <h1 class="login-heading">Login with Discord</h1>
            <button class="login-button" @click="login">Login</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'DiscordLogin',
        data() {
          return {
            isLoggingIn: false,
            isImageLoaded: false,
          };
        },
        methods: {
            login() {
                if (this.isLoggingIn) {
                  return;
                }
            
                this.isLoggingIn = true;
            
                window.location.href = `${process.env.VUE_APP_BACKEND_URL}login`;
            }
        }
    }
</script>

<style scoped>
    .view {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .discord-login {
        font-family: 'Roboto', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: auto;
        color: #FFF;
    }

    .login-heading {
        font-size: 24px;
        margin-bottom: 20px;
    }

    .login-button {
        padding: 10px 20px;
        background-color: #7289DA;
        color: #FFF;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
    }

    .login-button:hover {
        background-color: #677BC4;
    }
</style>
