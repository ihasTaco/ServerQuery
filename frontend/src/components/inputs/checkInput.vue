<template>
    <div class="checkbox-container">
        <input 
            type="checkbox" 
            v-model="inputValue" 
            :disabled="disabled"
            :required="required"
        />
        <label 
            class="checkmark"
            :for="name" 
            :class="{ 'is-disabled': disabled }"
        ></label>
    </div>
</template>

<script>
export default {
    name: 'CheckInput',
    props: ['modelValue', 'name', 'disabled', 'required'],
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
.checkbox-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    user-select: none;
    height: 25px;
    width: 100%;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    height: 100%;
    width: 25px;
}

.checkmark {
    position: relative;
    height: 100%;
    width: 25px;
    background-color: #eee;
    border-radius: 4px;
    pointer-events: none;
    transition: background-color 0.3s ease;
}

.checkbox-container .is-disabled {
    background-color: rgba(255, 255, 255, 0.168);
}

.checkbox-container:hover input ~ .checkmark {
    background-color: #ccc;
    transition: background-color 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark {
    background-color: #2196F3;
    transition: background-color 0.3s ease;
}

.checkbox-container input:checked ~ .checkmark.is-disabled {
    background-color: rgba(255, 255, 255, 0.168);
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
    display: block;
}

.checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}
</style>
