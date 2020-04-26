<template>
  <div>
    <el-dialog
      class="content"
      width="70%"
      :visible.sync="visible"
      :show="show"
      @open="handleDialogOpen"
      @close="$emit('update:show', false)"
    >
      <el-form :inline="true" class="form">
        <el-form-item label="标题筛选">
          <el-select v-model="filter.title" filterable clearable>
            <el-option
              v-for="(title, index) in allTitles"
              :key="index"
              :label="title"
              :value="title"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filter.type" placeholder="类型">
            <el-option v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="chart--wrapper" v-for="(chartData, index) in broadcastChartDataArr" :key="index">
        <div class="chart-box--title">{{chartData.title}}</div>
        <VeLine
          :data="handleChartData(chartData)"
          :legend-visible="false"
          :extend="handleChartExtend(chartData)"
          :settings="handleChartSettings(chartData)"
          :mark-line="markLine"
          :mark-point="markPoint"
        ></VeLine>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import VeLine from 'v-charts/lib/line.common'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
const typeOptions = [
  {
    label: '整体数据',
    value: 'total'
  },
  {
    label: '视频窗数据',
    value: 'video'
  },
  {
    label: '静态图数据',
    value: 'static'
  }
]

export default {
  components: {
    VeLine
  },
  data () {
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
    const extend = {
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

    return {
      filter: this.genDefaultFilter(),
      allTitles: [],
      visible: this.show,
      broadcastChartDataArr: [],
      extend: extend,
      typeOptions
    }
  },
  props: {
    id: Number,
    selectedType: String,
    selectedTitle: String,
    show: {
      type: Boolean,
      default () {
        return false
      }
    },
    isRealTime: {
      type: Boolean,
      default () {
        return false
      }
    }
  },

  computed: {

  },

  watch: {
    show () {
      this.visible = this.show
    }
  },

  methods: {
    genDefaultFilter () {
      return {
        title: this.selectedTitle,
        type: this.selectedType || typeOptions[0].value
      }
    },
    fetchData () {
      const analyzeMethods = this.isRealTime ? 'getBlockRealTimeChartData' : 'getBlockChartData'
      this.$service[analyzeMethods]({ id: this.id, ...this.filter }).then(data => {
        this.broadcastChartDataArr = data.rows
        if (data.rows.length === 0) {
          this.$message('暂无数据')
        }
      })
    },
    handleDialogOpen () {
      this.broadcastChartDataArr = []
      this.filter = this.genDefaultFilter()
      this.$service.getBroadcastDataTitles({ id: this.id }).then(data => {
        this.allTitles = data.rows
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
    handleChartSettings (chartData) {
      return {
        labelMap: {
          y: chartData.title
        }
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
    }
  },
  mounted () {

  }
}
</script>

<style lang="stylus" scoped>
.el-dialog__wrapper{
  &.dialog-fade-leave-active{
    -ms-animation:none;
  }
}
.chart--wrapper
  width auto
  height 380px
  margin 15px
.chart-box--title
  height: 44px
  line-height: 44px
  text-align: center
  font-size: 25px
.content >>> .el-dialog
  min-height 500px
.form
  border-bottom 1px solid
</style>
