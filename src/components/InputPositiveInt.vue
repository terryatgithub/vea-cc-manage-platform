<template>
  <el-input
    ref="input"
    type="text"
    :name="name"
    :autocomplete="autocomplete"
    :clearable="clearable"
    :value="inputValue"
    @input="handleInputValue"
    @blur="$emit('blur')"
    :disabled="disabled"
    :placeholder="placeholder">
    <span
      v-if="prepend"
      slot="prepend">
      {{prepend}}
    </span>
    <span
      v-if="append"
      slot="append">
      {{append}}
    </span>
  </el-input>
</template>

<script>
export default {
  data () {
    return {
      inputValue: undefined
    }
  },
  props: ['value', 'disabled', 'append', 'prepend', 'placeholder', 'name', 'autocomplete', 'clearable', 'regexp'],
  methods: {
    handleInputValue (val) {
      const regexp = this.regexp || /^[1-9]\d*$/
      if (val === '' || regexp.test(val)) {
        this.inputValue = val
        this.$emit('input', val)
      }
    }
  },
  created () {
    this.$watch('value', (val) => {
      if (this.inputValue !== val) {
        this.inputValue = val
      }
    }, {
      immediate: true
    })
  }
}
</script>
