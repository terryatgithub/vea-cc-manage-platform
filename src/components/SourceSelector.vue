<template>
  <el-select
      :value="value"
      @input="$emit('input', $event)"
      :disabled="disabled"
      :placeholder="placeholder"
  >
      <el-option
        v-for="(item, key) in sourceOptions"
        :disabled="freeze && item.value !== value"
        :key="key"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
  </el-select>
</template>

<script>
export default {
  props: ['value', 'disabled', 'freeze', 'allowEmpty', 'placeholder'],
  computed: {
    sourceOptions() {
      const $consts = this.$consts
      if (this.allowEmpty) {
        return $consts.sourceOptionsWidthEmpty
      }
      return $consts.sourceOptions
    }
  }
}
</script>

<style>

</style>
