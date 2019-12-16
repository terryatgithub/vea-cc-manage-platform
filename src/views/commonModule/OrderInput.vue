<template>
  <el-input v-model="inputValue" @blur="$emit('blur')" />
</template>

<script>
export default {
  data () {
    return {
      inputValue: undefined
    }
  },
  props: ['value'],
  watch: {
    inputValue: 'handleInputValue',
    value: (val) => {
      this.inputValue = val
    }
  },

  methods: {
    handleInputValue (val) {
      this.$emit('input', val)
    }
  },
  created () {
    this.inputValue = this.value
  }
}
</script>
