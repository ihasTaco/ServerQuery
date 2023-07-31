<template>
    <div class="input-container">
        <div :class="['input-wrapper', { 'is-disabled': disabled }]">
            <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                v-model="opacity"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
            />
            <div class="color"
                :style="{ opacity: opacity }"
                :class="{ 'is-disabled': disabled }"
            ></div>
        </div>
    </div>
</template>
  
<script>
    export default {
        name: "OpacitySlider",
        props: ["modelValue", "placeholder", 'disabled', 'required'],
        data() {
          return {
            opacity: this.modelValue || "1.0",
          };
        },
        methods: {
            openOpacitySlider() {
                  this.$refs.opacitySlider.click();
            },
            updateOpacity() {
                    this.$emit('update:modelValue', this.opacity);
            }
        },
        watch: {
            modelValue(newVal) {
                this.opacity = newVal;
            },
            opacity(newVal) {
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

.input-container input[type=number] {
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

.input-container input[type=number]::placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
}

.input-container input[type=number]::placeholder .is-disabled {
    color: rgba(255, 255, 255, 0.168) !important;
}

.input-container input:disabled {
    color: rgba(255, 255, 255, 0.168);
}

.color {
    width: 50px;
    height: 100%;
    background: white;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border: 1px solid white;
    transition: border-color 0.3s ease;
}

.color.is-disabled {
    border-color: rgba(255, 255, 255, 0.168);
}

</style>