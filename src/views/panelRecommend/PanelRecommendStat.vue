<template>
  <ContentCard title="版块个性化推荐核心指标" @go-back="$emit('go-back')">
    <span slot="actions"></span>
    <div>
      <el-form :inline="true" @keypress.enter.native.prevent="fetchData" class="filter">
        <el-form-item>
          <el-input v-model="filter.tabId" clearable placeholder="版面 ID" />
        </el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form>
      <div class="chart-wrapper" v-if="chartData">
        该版面在过去 30 天没有配置过版块个性化推荐
      </div>
    </div>
  </ContentCard>
</template>
<script>
export default {
  data () {
    return {
      filter: {
        tabId: undefined
      },
      chartData: null
    }
  },
  methods: {
    fetchData () {
      console.log('fetchData')
      const filter = this.filter
      this.chartData = null
      this.$service
      this.chartData = {}
    }
  }
}
</script>
<style lang="stylus" scoped>
.filter
  border-bottom 1px solid #ccc
.chart-wrapper
  padding 20px 0
</style>