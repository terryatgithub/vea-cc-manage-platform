<template>
  <span v-if="isRead">{{ valueLabel }}</span>
  <el-select v-else :value="value" @input="$emit('input', $event)">
    <el-option
      v-for="(item, index) in options"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      options: []
    }
  },
  computed: {
    valueLabel() {
      const value = this.value
      const options = this.options
      if (value && options) {
        const selected = options.find(function(item) {
          return item.value === value
        })
        if (selected) {
          return selected.label
        }
      }
    }
  },
  props: ['value', 'isRead'],
  methods: {},
  created() {
    this.$service.getDictType({ type: 'businessType' }).then(data => {
      this.options = data.map(function(item) {
        return {
          label: item.dictCnName,
          value: item.dictId
        }
      })
    })
  }
}
</script>
