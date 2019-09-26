<template>
  <ContentCard title="版块个性化推荐反馈" @go-back="$emit('go-back')">
    <span slot="actions"></span>
    <div>
      <el-form :inline="true" @keypress.enter.native.prevent="fetchData" class="filter">
        <el-form-item>
          <el-date-picker type="date" :clearable="false" v-model="filter.time" placeholder="日期" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="filter.tabId" clearable placeholder="版面 ID" />
        </el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form>
      <div class="chart-wrapper" v-if="chartData">
        <div class="tip-empty">
          <p>版面在 {{ parseTime(filter.time) }} 没有版块个性化数据</p>
          <p class="tip-how">至少一天之内起始位置不变才能有数据</p>
        </div>
      </div>
    </div>
  </ContentCard>
</template>
<script>
export default {
  data () {
    return {
      filter: {
        tabId: undefined,
        time: new Date().toISOString()
      },
      chartData: null
    }
  },
  methods: {
    parseTime (time) {
      const datetime = new Date(time)
      const fullYear = datetime.getFullYear()
      const month = datetime.getMonth() + 1
      const date = datetime.getDate()
      const timeFormated = fullYear + '-' +  (month < 10 ? `0${month}` : month) + '-' + (date < 10 ? `0${date}` : date)
      return timeFormated
    },
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
.tip-empty
  font-size 14px
  text-align center
.tip-how
  font-size 12px
</style>