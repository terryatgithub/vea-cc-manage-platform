<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">  
    <el-input v-if="!isReadonly" :value="value" @input="$emit('input', $event)" @change="$emit('change', $event)" />
    <template v-else> {{ value }}</template>
  </el-form-item>
</template>

<script>
import formItemMixin from './formItemMixin'
export default {
  mixins: [formItemMixin],
  data() {
    return {

    }
  }
}
</script>

<style>

</style>
