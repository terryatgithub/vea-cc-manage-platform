<template>
  <el-form-item :label="label" :prop="prop" :rules="rules">  
    <template v-if="!isReadonly">
      <el-radio-group
        v-if="type === 'radio'"
        :value="value"
        @input="handleInputVal"
        @change="$emit('change', $event)"
        :disabled="disabled">
          <el-radio
            v-for="(item, key) in options"
            :disabled="item.disabled"
            :key="key"
            :label="item.value">
            {{ item.label }}
          </el-radio>
      </el-radio-group>

      <el-select
        v-else
        :value="value"
        @input="handleInputVal"
        @change="$emit('change', $event)"
        :disabled="disabled"
        :placeholder="placeholder || '请选择'"
        :filterable="filterable"
        :allow-create="allowCreate">
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
    
    <template v-else> {{ getLabel(value) }}</template>
    <slot></slot>
  </el-form-item>
</template>

<script>
import formItemMixin from './formItemMixin'
export default {
  mixins: [formItemMixin],
  data() {
    return {

    }
  },
  props: ['type', 'options', 'filterable', 'allowCreate', 'confirm'],
  methods: {
    getLabel(val) {
      const options = this.options || []
      const selected = options.find(({value}) => value === val)
      if (selected) {
        return selected.label
      }
    },
    handleInputVal(val) {
      const confirm = this.confirm
      if (confirm) {
        let title
        let content
        if (typeof confirm === 'string') {
          title = '提示'
          content = confirm
        } else {
          title = confirm.title
          content = confirm.content
        }
        this.$confirm(content, title).then(() => {
          this.$emit('input', val)
        }).catch(() => {})
      } else {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style>

</style>

