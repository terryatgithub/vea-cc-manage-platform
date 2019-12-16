<template>
  <ContentCard title="版块个性化推荐核心指标" @go-back="$emit('go-back')">
    <span slot="actions"></span>
    <div>
      <el-form :inline="true" @submit.native.prevent="" @keypress.enter.native.prevent="$refs.submit.$el.click()" class="filter">
        <el-form-item>
          <InputPositiveInt name="tabId" autocomplete="on" v-model="filter.tabId" clearable placeholder="版面 ID" />
        </el-form-item>
        <el-button ref="submit" type="primary" native-type="submit" @click="fetchData">查询</el-button>
      </el-form>
      <div v-if="chartList">
        <el-select v-show="!!chartList.length" v-model="currentChart" style="width: 100%">
          <el-option
            v-for="item in chartList"
            :key="item.id"
            :label="item.id"
            :value="item.id">
          </el-option>
        </el-select>
        <div class="chart-box--none" v-if="chartList.length === 0">
          该版面在过去 30 天没有配置过版块个性化推荐
        </div>
        <div v-else>
          <div v-for="(chart, index) in chartDataList" class="chart-box" :key="index">
            <p class="chart-box__title">{{ chart.title }}</p>
            <VeLine
              :data="chart.data"
              :legend-visible="false"
              :extend="chart.extend"
              :settings="chart.settings">
            </VeLine>
          </div>
        </div>
      </div>
    </div>
  </ContentCard>
</template>
<script>
import VeLine from 'v-charts/lib/line.common'
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  components: {
    VeLine,
    InputPositiveInt
  },
  data () {
    return {
      filter: {
        tabId: undefined
      },
      currentChart: undefined,
      chartList: null,
      chartDataList: null
    }
  },
  watch: {
    currentChart: 'fetchChart'
  },
  methods: {
    fetchData () {
      const filter = this.filter
      this.currentChart = undefined
      this.chartList = null
      this.chartDataList = null
      if (!filter.tabId) {
        return this.$message.error('请输入版面id')
      }
      this.$service.getPanelRecommandStat(filter)
        .then((result) => {
          const chartList = result.rows
          if (chartList.length > 0) {
            chartList.forEach(item => {
              item.id = `${item.tabName}(${item.tabId}) / ${item.startDate} - ${item.endDate} / 从第 ${item.recommendIndex} 个开始`
            })
            this.currentChart = chartList[0].id
          }
          this.chartList = chartList
        })
    },
    fetchChart () {
      this.chartData = null
      const currentChart = this.currentChart
      if (currentChart) {
        const filter = this.filter
        const chartInfo = this.chartList.find(({ id }) => id === currentChart)
        const data = {
          tabId: filter.tabId,
          startDate: chartInfo.startDate,
          endDate: chartInfo.endDate,
          recommendIndex: chartInfo.recommendIndex
        }
        this.$service.getPanelRecommandChart(data).then((result) => {
          this.chartDataList = this.parseChartDataList(result.rows)
          console.log(this.chartDataList)
        })
      }
    },
    parseChartDataList (chartDataList = []) {
      return chartDataList.map(item => {
        const title = item.title
        const data = {
          title,
          unit: item.unit,
          columns: ['x', 'y'],
          rows: item.data
        }
        const settings = {
          labelMap: {
            y: title
          }
        }
        const extend = {
          grid: {
            top: '2%',
            left: '5%',
            right: '5%',
            bottom: '10%',
            containLabel: true
          },
          series: v => {
            v[0].smooth = false
            return v
          },
          xAxis: {
            axisLabel: {
              rotate: 45,
              formatter: function (val) {
                let mark = val.indexOf('(')
                if (mark === -1) {
                  return val
                } else {
                  let version = val.slice(mark - val.length)
                  let date = val.slice(0, mark)
                  return [`{a|${version}}`, date].join('')
                }
              },
              rich: {
                a: { color: 'red' }
              }
            }
          },
          color: ['#1E90FF ', '#2f4554']
        }

        if (data.unit === '%') {
          extend.yAxis = {
            axisLabel: {
              formatter: '{value}%'
            }
          }
        }

        return {
          title,
          data,
          settings,
          extend
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.filter
  border-bottom 1px solid #ccc
.chart-box--none
  padding 20px 0
.chart-box
  margin-top 10px
.chart-box__title
  font-size 16px
  text-align center
</style>
