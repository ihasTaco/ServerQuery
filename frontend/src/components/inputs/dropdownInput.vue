<template>
    <div class="input-container">
        <div class="input-wrapper" :class="['input-wrapper', { 'is-disabled': disabled }]">
            <div v-if="selectedOption" class="selected-display" :disabled="disabled">
                <span v-if="selectedOption.unicode" :class="{ 'is-disabled': disabled }">{{selectedOption.unicode}}</span>
                <img v-if="selectedOption.image" :src="selectedOption.image" alt="Selected Image" :class="{ 'is-disabled': disabled }">
            </div>
            <input 
                ref="inputField"
                type="text"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                v-model="searchText"
                @click="toggleDropdown($event)"
            />
            <span v-show="searchText || selectedOption" @click="clearInput" class="clear-input" :class="{ 'is-disabled': disabled }"><i class="bi bi-x"></i></span>
            <span class="dropdown-caret" :class="{ 'caret-up': dropdownOpen, 'is-disabled': disabled }"><i class="bi bi-caret-down"></i></span>
        </div>
        <div v-if="dropdownOpen" class="dropdown-container">
            <div 
                class="dropdown-content"
                v-for="option in filteredOptions"
                :key="option.value"
                @click="selectOption(option)"
            >
                <span>
                    {{option.unicode}}
                    {{option.label}}
                </span>
            </div>
        </div>
    </div>
</template>
  
<script>
    export default {
        name: 'DropdownInput',
        props: ['modelValue', 'options', 'placeholder', 'disabled', 'required'],
        data() {
            return {
                selectedOption: this.modelValue,
                searchText: "",
                dropdownOpen: false,
            };
        },
        computed: {
            filteredOptions() {
                if (!this.searchText) {
                    return this.options;
                }
                const lowerSearchText = this.searchText.toLowerCase();
                return this.options.filter(option => option.label.toLowerCase().includes(lowerSearchText));
            },
        },
        methods: {
            selectOption(option) {
                if (this.disabled) {
                    return;
                }
                this.selectedOption = option;
                this.searchText = option.label;
                this.dropdownOpen = false;
                this.$emit('update:modelValue', option.value);
                this.$emit('change', option);
            },
            clearInput() {
                this.selectedOption = null;
                this.searchText = "";
                this.dropdownOpen = false;
                this.$emit('update:modelValue', null);
                this.$emit('change', null);
            },
            toggleDropdown(event) {
                if (this.disabled) {
                    return;
                }
                event.stopPropagation();
                this.dropdownOpen = !this.dropdownOpen;
            },
            closeDropdown(event) {
                if (this.$refs.inputField !== document.activeElement && 
                    !this.$el.contains(event.target) && 
                    event.target !== this.$refs.inputField) {
                    this.dropdownOpen = false;
                }
            },
            findOption(value) {
                let option = this.options.find(option => option.value === value);
                return option;
            },
        },
        watch: {
            modelValue(newVal) {
                this.selectedOption = this.findOption(newVal);
                if (this.selectedOption) {
                    this.searchText = this.selectedOption.label;
                }
            },
        },
        beforeUnmount() {
            document.removeEventListener('click', this.closeDropdown);
        },
        mounted() {
            document.addEventListener('click', this.closeDropdown);

            if (this.modelValue) {
                const defaultOption = this.findOption(this.modelValue);
                this.selectedOption = defaultOption;
                this.searchText = defaultOption.label;
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

.selected-display {
    overflow: hidden;
    transition: width 0.3s ease;
    white-space: nowrap;
}

.selected-display img,
.selected-display span {
    font-size: 25px;
    transition: color 0.3s ease;
}

.selected-display img.is-disabled,
.selected-display span.is-disabled {
    color: rgba(255, 255, 255, 0.168);
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

.dropdown-caret,
.clear-input {
    transition: color 0.3s ease;
}

.dropdown-caret {
    height: 100%;
    padding: 0 5px;
}

.caret-up {
    transform: rotate(180deg);
}

.dropdown-caret.is-disabled,
.clear-input.is-disabled {
    color: rgba(255, 255, 255, 0.168);
}

.dropdown-container {
    margin: 0;
    padding: 5px;
    width: 100%;
    max-height: 175px;
    overflow: hidden auto;
    box-sizing: border-box;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: rgba(40, 40, 41, 0.959);
    z-index: 1;
}

.dropdown-content {
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.dropdown-content span {
    margin: 0;
    padding: 5px;
    width: 100%;
    max-width: 100%;
    display: flex;
    align-items: center;
    height: 50px;
    text-overflow: ellipsis;
    white-space: nowrap
}

.dropdown-content span:hover {
    background-color: rgba(58, 58, 58, 0.879);
}
</style>