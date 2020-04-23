<template>
  <span v-if="isRead">{{ valueLabel }}</span>
  <el-select ref="select" :filterable="filterable" v-else :value="value" @input="handleInput">
    <el-option
      v-for="(item) in options"
      :key="item.value"
      :value="item.value"
      :label="item.label">
    </el-option>
  </el-select>
</template>

<script>
export default {
  data () {
    return {
      options: []
    }
  },
  computed: {
    // eslint-disable-next-line
    valueLabel() {
      const value = this.value
      const options = this.options
      if (value && options) {
        const selected = options.find(function (item) {
          return item.value === value
        })
        if (selected) {
          return selected.label
        }
      }
    }
  },
  props: ['value', 'isRead', 'filterable'],
  methods: {
    handleInput (val) {
      this.$emit('input', val)
      this.$nextTick(() => {
        this.$refs.select.blur()
      })
    }
  },
  created () {
    const isRead = this.isRead
    this.$service.getDictType({ type: 'businessType', isFilter: isRead ? 0 : 1 }).then(data => {
      this.options = data.map(function (item) {
        return {
          label: item.dictCnName,
          value: item.dictId
        }
      })
    })
  }
}
</script>
