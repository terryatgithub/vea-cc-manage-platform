<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">  
    <template v-if="!isReadonly">
      <slot name="edit"> {{ value }}</slot>
    </template>
    <template v-else>
      <slot name="read"> {{ value }} </slot>
    </template>
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
