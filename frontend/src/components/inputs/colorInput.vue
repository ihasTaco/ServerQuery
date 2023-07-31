<template>
    <div class="input-container">
        <div :class="['input-wrapper', { 'is-disabled': disabled }]">
            <input
                type="text"
                v-model="color"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                @click="openColorPicker"
            />
            <input
                type="color"
                v-model="color"
                ref="colorPicker"
                :disabled="disabled"
                @input="updateColor"
            />
            <div class="color" 
                :style="{ background: color }"
                :class="{ 'is-disabled': disabled }"
            ></div>
        </div>
    </div>
</template>
  
<script>
    export default {
        name: "ColorInput",
        props: ["modelValue", "placeholder", 'disabled', 'required'],
        data() {
          return {
            color: this.modelValue || "#000000",
          };
        },
        methods: {
            openColorPicker() {
                  this.$refs.colorPicker.click();
            },
            updateColor() {

                    this.$emit('update:modelValue', this.color);
            }
        },
        watch: {
            modelValue(newVal) {
                this.color = newVal;
            },
            color(newVal) {
                this.$emit('update:modelValue', newVal);
            }
        }
    };
  </script>
  

<style scoped>
.input-container {
    position: relative;
    width: 100%;

}

.input-wrapper {
    display: flex;
    align-items: center;
    flex-direction: row;
    border-bottom: 1px solid white;
    height: 37px;
    transition: border-color 0.3s ease;
}

.input-wrapper:focus-within {
    border-color: #7289DA;
}

.input-wrapper.is-disabled {
    border-color: rgba(255, 255, 255, 0.168);
}

.input-container input[type=text] {
    position: relative;
    margin: 0;
    padding: 10px 5px;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    border: none;
    outline: none;
    background: transparent;
    box-sizing: border-box;
    color: white;
}

.input-container input[type=text]::placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
}

.input-container input[type=text]::placeholder .is-disabled {
    color: rgba(255, 255, 255, 0.168) !important;
}

.input-container input[type=color] {
    margin: 0;
    padding: 0;
    width: 0;
    border: none;
    outline: none;
}

.input-container input:disabled {
    color: rgba(255, 255, 255, 0.168);
}

.color {
    width: 50px;
    height: 100%;
    background: black;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border: 1px solid white;
    transition: border-color 0.3s ease;
}

.color.is-disabled {
    border-color: rgba(255, 255, 255, 0.168);
}

.input-container input[type=text]:focus ~ .color {
    border-color: #7289DA;
}

</style>