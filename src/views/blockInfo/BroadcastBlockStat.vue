<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :show="show"
      width="70%"
      @close="$emit('update:show', false)"
      @open="fetchData">
      <div class="loading-text" v-if="isShowLoadTip">数据搬运中，请稍候。。。</div>
      <div v-for="(simpleChartData, index) in chartDataArr" :key="index">
        <div class="chart-box--title">{{simpleChartData.title}}</div>
        <VeLine
          :data="handleChartData(simpleChartData)"
          :legend-visible="false"
          :extend="handleChartExtend(simpleChartData)"
          :settings="handleChartSettings(simpleChartData)"
          :events="handleChartEvents(index)"
          :mark-line="markLine"
          :mark-point="markPoint"
        ></VeLine>
      </div>
    </el-dialog>

    <el-dialog
      title="推荐位标题变化"
      :visible.sync="extraVisible"
      width="30%"
      class="extra-dia">
      <p v-for="(extra, index) in extraArr" :key="index">{{extra}}</p>
    </el-dialog>
  </div>
</template>

<script>
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
import VeLine from 'v-charts/lib/line.common'

export default {
  components: {
    VeLine
  },
  data () {
    this.extend = {
      grid: {
        top: '10%',
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
        triggerEvent: true,
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
    this.markLine = {
      data: [
        {
          name: '平均线',
          type: 'average'
        }
      ]
    }
    this.markPoint = {
      data: [
        {
          name: '最大值',
          type: 'max'
        },
        {
          name: '最小值',
          type: 'min'
        }
      ]
    }
    return {
      visible: this.show,
      chartDataArr: [],
      extraVisible: false,
      extraArr: [], // Array< string > 信息细节
      isShowLoadTip: false,
      cacheParentId: undefined,
      cachePosition: undefined,
      cacheIsRealTime: undefined
    }
  },

  watch: {
    show () {
      this.visible = this.show
    }
  },

  computed: {
  },

  props: {
    title: null,
    show: {
      type: Boolean,
      default () {
        return false
      }
    },
    parentId: Number,
    position: [String, Number],
    isRealTime: {
      type: Boolean,
      default () {
        return false
      }
    }
  },

  methods: {
    fetchData () {
      const originParentId = this.cacheParentId
      const originPosition = this.cachePosition
      const originIsRealTime = this.cacheIsRealTime
      const { parentId, position, isRealTime } = this
      // 获取缓存数据
      if (originParentId === parentId && originPosition === position && originIsRealTime === isRealTime) {
        return
      } else {
        this.cacheParentId = parentId
        this.cachePosition = position
        this.cacheIsRealTime = isRealTime
      }
      this.chartDataArr = []
      this.isShowLoadTip = true
      const analyzeMethods = this.isRealTime ? 'getVideoRealTimeChartData' : 'getVideoChartData'
      this.$service[analyzeMethods]({ parentId, position }).then(data => {
        this.isShowLoadTip = false
        this.chartDataArr = data.rows
        if (this.chartDataArr.length === 0) {
          this.$message('暂无数据')
        }
      })
    },
    handleChartData (chartData) {
      return {
        title: chartData.title,
        unit: chartData.unit,
        columns: ['x', 'y'],
        rows: chartData.data
      }
    },
    handleChartExtend (chartData) {
      const yAxis = {
        axisLabel: {
          formatter: '{value}%'
        }
      }
      const extend = Object.assign({}, this.extend)
      return chartData.unit === '%'
        ? Object.assign(extend, {
          yAxis
        })
        : extend
    },
    handleChartSettings (chartData) {
      return {
        labelMap: {
          y: chartData.title
        }
      }
    },
    handleChartEvents (index) {
      let _this = this
      return {
        click: function (e) {
          if (e.componentType === 'xAxis') {
            let xIndex = _this.chartDataArr[index].data.findIndex(item => {
              return item.x === e.value
            })
            const extra = _this.chartDataArr[index].data[xIndex].extra
            if (extra && extra.length !== 0) {
              // 埋点
              _this.$sendEvent({
                type: 'panel_chart_version_show'
              })
              // 展示
              _this.extraArr = extra
              _this.extraVisible = true
            } else {
              _this.$message({
                message: '暂无推荐位标题变化数据哦！',
                type: 'warning'
              })
            }
          }
        }
      }
    }
  },

  created () {}
}
</script>

<style lang="stylus" scoped>
.chart-box--title
  height 44px
  line-height 44px
  text-align center
  font-size 25px
.extra-dia >>> .el-dialog__body
  padding 0px 20px 20px
.loading-text
  color red
</style>
