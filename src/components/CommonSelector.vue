<template>
  <el-radio-group
    v-if="type === 'radio' || type === 'radio-button'"
    :value="value"
    @input="$emit('input', $event)"
    :disabled="disabled">
      <component
        :is="radioComponent"
        v-for="(item, key) in options"
        :disabled="item.disabled"
        :key="key"
        :label="item.value">
        {{ item.label }}
      </component>
  </el-radio-group>

  <el-select
    v-else
    :value="value"
    @input="$emit('input', $event)"
    :disabled="disabled"
    :placeholder="placeholder || '请选择'"
    :filterable="filterable"
    :allow-create="allowCreate"
  >
    <el-option
      v-for="(item, key) in options"
      :disabled="item.disabled"
      :key="key"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>

</template>

<script>
export default {
  props: ['type', 'options', 'disabled', 'value', 'placeholder', 'filterable', 'allowCreate'],
  computed: {
    radioComponent () {
      return this.type === 'radio-button' ? 'el-radio-button' : 'el-radio'
    }
  }
}
</script>

<style>

</style>
