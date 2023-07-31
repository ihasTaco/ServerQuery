<template>
    <div class="input-container">
        <div :class="['input-wrapper', { 'is-disabled': disabled }]">
            <input 
                type="text"
                v-model="inputValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                @input="updateValue"
            />
        </div>
    </div>
</template>
  
<script>
    export default {
        name: 'TextInput',
        props: ['modelValue', 'placeholder', 'disabled', 'required'],
        data() {
            return {
                inputValue: this.modelValue,
            };
        },
        watch: {
            inputValue(newVal) {
                this.$emit('update:modelValue', newVal);
            },
            modelValue(newVal) {
                this.inputValue = newVal;
            },
        },
        mounted() {
            if (this.modelValue) {
                this.inputValue = this.modelValue;
            }
        },
    };
</script>

<style scoped>
.input-container {
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;

}

.input-wrapper {
    display: flex;
    align-items: center;
    flex-direction: row;
    border-bottom: 1px solid white;
    transition: border-color 0.3s ease;
}

.input-wrapper:focus-within {
    border-color: #7289DA;
}
.input-wrapper.is-disabled {
    border-color: rgba(255, 255, 255, 0.168);
}

.input-container input {
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
    caret-color: white;
    color: white;
    transition: color 0.3s ease;
}

.input-container input:disabled {
    color: rgba(255, 255, 255, 0.168);
}

.input-container input::placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
}
</style>