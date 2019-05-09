<template>
  <el-radio-group
    v-if="type === 'radio'"
    :value="value" 
    @input="$emit('input', $event)"
    :disabled="disabled">
      <el-radio 
        v-for="(item, key) in options"
        :key="key" 
        :label="item.value">
        {{ item.label }}
      </el-radio>
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
  props: ['type', 'options', 'disabled', 'value', 'placeholder', 'filterable', 'allowCreate']
}
</script>

<style>

</style>
