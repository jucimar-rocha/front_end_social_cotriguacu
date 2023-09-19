<template>
  <v-text-field
      v-model="model"
      density="compact"
      variant="outlined"
      @:input="onInput"
      @:blur="removeSpacesEnd"
  ></v-text-field>
</template>


<script>
export default {
  name: "InputField",
  props: {
    modelValue: String,
    isUppercase: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      model: '',
    };
  },
  mounted() {
    this.model = this.modelValue;
  },
  methods: {
    onInput() {
      this.model = this.model.replace(/^\s+/g, '');

      if (this.isUppercase) {
        this.model = this.model.toUpperCase();
      }
      this.$emit('update:modelValue', this.model);
    },
    removeSpacesEnd() {
      this.model = this.model.trimEnd();
      this.$emit('update:modelValue', this.model);
    }
  },
}
</script>

<style>
input {
  text-transform: none !important;
}
</style>
