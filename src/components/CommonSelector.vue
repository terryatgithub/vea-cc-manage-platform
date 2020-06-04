<template>
  <el-radio-group
    v-if="type === 'radio' || type === 'radio-button'"
    :value="value"
    @input="handleInput"
    @change="changeTypeValue"
    :disabled="disabled">
      <template v-for="(item, key) in options">
        <component
          v-if="!hiddenItems.includes(item[valueKey])"
          :is="radioComponent"
          :disabled="item.disabled || disabledItems.includes(item[valueKey])"
          :key="key"
          :label="item[valueKey]">
          {{ item[labelKey] }}
        </component>
      </template>
  </el-radio-group>

  <el-select
    v-else
    ref="elSelect"
    :value="value"
    @input="handleInput"
    :disabled="disabled"
    :placeholder="placeholder || '请选择'"
    :filterable="filterable"
    :clearable="clearable"
    :allow-create="allowCreate">
    <template v-for="(item, key) in options">
      <el-option
        v-if="!hiddenItems.includes(item[valueKey])"
        :disabled="item.disabled || disabledItems.includes(item[valueKey])"
        :key="key"
        :label="item[labelKey]"
        :value="item[valueKey]">
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
    clearable: null,
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
    },
    labelKey: {
      type: String,
      default () {
        return 'label'
      }
    },
    valueKey: {
      type: String,
      default () {
        return 'value'
      }
    }
  },
  computed: {
    radioComponent () {
      return this.type === 'radio-button' ? 'el-radio-button' : 'el-radio'
    }
  },
  methods: {
    handleInput (val) {
      if (val !== this.value) {
        this.$emit('input', val)
        // fix el-select
        const elSelect = this.$refs.elSelect
        if (elSelect) {
          this.$nextTick(() => {
            elSelect.blur()
          })
        }
      }
    },
    changeTypeValue (val) {
      alert(val)
    }
  }
}
</script>

<style>

</style>
