<template>
  <el-select
    :value="value"
    @input="$emit('input', $event)"
    filterable
    remote
    reserve-keyword
    name="tabId"
    autocomplete="on"
    :placeholder="placeholder"
    :remote-method="fetchData"
    :loading="loading">
    <el-option
      v-for="item in tabList"
      :key="item.tabId"
      :label="item.tabCnTitle"
      :value="item.tabId">
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: ['value', 'placeholder'],
  data () {
    return {
      tab: null,
      loading: false,
      tabList: []
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$service.tabInfoGetListByKeyword().then(data => {
        this.tabList = data.rows
        this.loading = false
      })
    }
  }
}
</script>
