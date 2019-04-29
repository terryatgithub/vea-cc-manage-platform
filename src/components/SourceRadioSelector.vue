<template>
  <el-radio-group 
      :value="value" 
      @input="$emit('input', $event)"
      :disabled="disabled"
  >
      <el-radio 
        v-for="(item, key) in $consts.sourceOptions" 
        :key="key" 
        :label="item.value" 
      >
        {{ item.label }}
      </el-radio>
  </el-radio-group>
</template>

<script>
export default {
  props: ['value', 'disabled']
}
</script>

<style>

</style>
