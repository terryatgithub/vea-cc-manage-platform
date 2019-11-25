<template>
  <div class="content">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="visible"
      :show="show"
      width="70%"
      @open="handleDialogOpen"
      @close="$emit('update:show', false)"
    >
      <el-form :inline="true" class="filter-form">
        <el-form-item label="推荐位标题">
          <el-select v-model="filter.title" filterable clearable @change="handleSelectTitle">
            <el-option
              v-for="(title, index) in allTitles"
              :key="index"
              :label="title"
              :value="title"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人群">
          <el-select v-model="filter.crowdId" filterable clearable>
            <el-option
              v-for="(crowd, index) in allCrowd"
              :key="index"
              :label="crowd.crowdName"
              :value="crowd.crowdId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- <el-radio-group v-model="uvClickTab" class="tab--container" @change="fetchData">
        <el-radio-button label="dailyClickUv" class="tab--item">点击UV(天)对比</el-radio-button>
        <el-radio-button label="dailyUvctr" class="tab--item">点击UVCTR(天)对比</el-radio-button>
        <el-radio-button label="hourlyClickUv" class="tab--item">点击UV(小时)对比</el-radio-button>
        <el-radio-button label="hourlyUvctr" class="tab--item">点击UVCTR(小时)对比</el-radio-button>
      </el-radio-group> -->

      <div class="chart--wrapper" v-for="(dmpChartData, index) in chartDataArr" :key="index">
        <div class="chart-box--title">{{dmpChartData.title}}</div>
        <VeLine
          :data="handleChartData(dmpChartData)"
          :legend-visible="false"
          :extend="handleChartExtend(dmpChartData)"
          :settings="handleChartSettings(dmpChartData)"
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
      class="extra-dia"
    >
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
  data() {
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
        // triggerEvent: true,
        axisLabel: {
          rotate: 45,
          formatter: function(val) {
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
      // uvClickTab: 'dailyClickUv',
      extraVisible: false,
      extraArr: [], // Array< string > 信息细节
      allTitles: [],
      allCrowd: [],
      filter: {
        title: '',
        crowdId: ''
      }
    }
  },

  watch: {
    show() {
      this.visible = this.show
    }
  },
  computed: {
    dialogTitle () {
      return this.isRealTime ? 'DMP实时数据' : 'DMP'
    }
  },

  props: {
    show: {
      type: Boolean,
      default() {
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
    handleDialogOpen () {
      this.chartDataArr = []
      this.filter = {
        title: '',
        crowdId: ''
      }
      this.allCrowd = []
      const { parentId, position } = this
      this.$service.getVideoDmpTitles({ parentId, position }).then(data => {
        this.allTitles = data.rows
      })
    },
    fetchData() {
      const { parentId, position, filter } = this
      const analyzeMethods = this.isRealTime ? 'getVideoDmpRealTimeChartData' : 'getVideoDmpChartData'
      this.$service[analyzeMethods]({ parentId, position, ...filter }).then(data => {
        this.chartDataArr = data.rows
        if (this.chartDataArr.length === 0) {
          this.$message('暂无数据')
        }
      })
    },
    handleChartData(chartData) {
      return {
        title: chartData.title,
        unit: chartData.unit,
        columns: ['x', 'y'],
        rows: chartData.data
      }
    },
    handleChartExtend(chartData) {
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
    handleChartSettings(chartData) {
      return {
        labelMap: {
          y: chartData.title
        }
      }
    },
    handleSelectTitle (val) {
      const { parentId, position, filter } = this
      this.$service.getVideoDmpCrowds({ parentId, position, title: filter.title }).then(data => {
        this.allCrowd = data.rows
      })
    },
    // 暂时没有extra, e.componentType !== 'xAxis', xAxis: {triggerEvent: false}
    // 故下面的函数暂时不执行
    handleChartEvents (index) {
      let _this = this
      return {
        click: function(e) {
          if (e.componentType === 'xAxis') {
            let xIndex = _this.chartDataArr[index].data.findIndex(item => {
              return item.x === e.value
            })
            const extra = _this.chartDataArr[index].data[xIndex].extra
            if (extra && extra.length !== 0) {
              // 埋点
              _this.$sendEvent({
                type: 'album_version_show'
              })
              // 展示
              _this.extraArr = extra
              _this.extraVisible = true
            }
          }
        }
      }
    }

  },

  created() {}
}
</script>

<style lang="stylus" scoped>
.content >>> .el-dialog__body
  padding 0 20px 30px 20px
.tab--container
  display flex
  justify-content center
  margin 15px
.tab--item >>> .el-radio-button__inner
  width 160px
  height 40px
  text-align center
  line-height 20px
.chart--wrapper
  width auto
  height 380px
  margin 15px
.chart-box--title
  height: 44px
  line-height: 44px
  text-align: center
  font-size: 25px
.extra-dia >>> .el-dialog__body
  padding 0px 20px 20px
.filter-form
  border-bottom 1px solid
</style>
