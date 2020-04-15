<template>
  <el-radio-group
    v-if="type === 'radio' || type === 'radio-button'"
    :value="value"
    @input="$emit('input', $event)"
    :disabled="disabled">
      <template v-for="(item, key) in options">
        <component
          v-if="!hiddenItems.includes(item.value)"
          :is="radioComponent"
          :disabled="item.disabled || disabledItems.includes(item.value)"
          :key="key"
          :label="item.value">
          {{ item.label }}
        </component>
      </template>
  </el-radio-group>

  <el-select
    v-else
    :value="value"
    @input="$emit('input', $event)"
    :disabled="disabled"
    :placeholder="placeholder || '请选择'"
    :filterable="filterable"
    :allow-create="allowCreate">
    <template v-for="(item, key) in options">
      <el-option
        v-if="!hiddenItems.includes(item.value)"
        :disabled="item.disabled || disabledItems.includes(item.value)"
        :key="key"
        :label="item.label"
        :value="item.value">
      </el-option>
    </template>
  </el-select>

</template>

<script>
export default {
  props: {
    type: null,
    options: Array,
    disabled: null,
    value: null,
    placeholder: null,
    filterable: null,
    allowCreate: null,
    disabledItems: {
      type: Array,
      default () {
        return []
      }
    },
    hiddenItems: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    radioComponent () {
      return this.type === 'radio-button' ? 'el-radio-button' : 'el-radio'
    }
  }
}
</script>

<style>

</style>
