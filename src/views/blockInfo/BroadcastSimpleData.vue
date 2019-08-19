<template>
  <div>
    <div @click="handleClick">
      位置0：昨日UVCTR <span>{{uvctr.value}}</span>,
      日环比<span :class="judgeColor(uvctr.dailyGrowth)">{{dailyGrowthShow}}</span>；
      周同比<span :class= "judgeColor(uvctr.weeklyGrowth)">{{weeklyGrowthShow}}</span>
    </div>

    <el-dialog title="数据表现" :visible.sync="isShowChart" width="70%">
      <div v-for="broadcastChartData in broadcastChartDataArr">
        <div class="chart-box--title">{{broadcastChartData.title}}</div>
        <VeLine :data="handleChartData(broadcastChartData)" :legend-visible="false" :extend="handleChartExtend(broadcastChartData)" :settings="handleChartSettings(broadcastChartData)"></VeLine>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import VeLine from 'v-charts/lib/line.common'
export default {
  components: {
    VeLine
  },
  data() {
    const extend = {
      grid: {
        top: "2%",
        left: "5%",
        right: "5%",
        bottom: "10%",
        containLabel: true
      },
      series: v => {
        v[0].smooth = false
        return v
      },
      xAxis: {
        axisLabel: {
          rotate: 45,
          formatter: function(val) {
            let mark = val.indexOf('(')
            if(mark === -1)
            {
              return val
            }else {
              let version = val.slice(mark-val.length)
              let date = val.slice(0, mark)
              return [`{a|${version}}`, date].join('')
            }
          },
          rich: {
            a: { color: 'red' }
          }
        }
      },
      color: ['#1E90FF ','#2f4554'],
    }

    return {
      uvctr: {
        value: '',
        dailyGrowth: '',
        weeklyGrowth: ''
      },
      isShowChart: false,
      broadcastChartDataArr: [],
      extend: extend
    };
  },
  props: ['id'],
  computed: {
    dailyGrowthShow: function(val) {
      const dailyGrowth = this.uvctr.dailyGrowth
      if(dailyGrowth.charAt(0) === '-') {
        return '下降' + dailyGrowth.slice(1)
      }else if(dailyGrowth === 'N/A') {
        return dailyGrowth
      }else {
        return '上升' + dailyGrowth
      }
    },
    weeklyGrowthShow:function(val) {
      const weeklyGrowth = this.uvctr.weeklyGrowth
      if(weeklyGrowth.charAt(0) === '-') {
        return '下降' + weeklyGrowth.slice(1)
      }else if(weeklyGrowth === 'N/A') {
        return weeklyGrowth
      }else {
        return '上升' + weeklyGrowth
      }
    }
  },
  methods: {
    toPercent: decimal => {
      return (Math.round(decimal * 10000) / 100.00 + "%")
    },
    judgeColor(percentStr) {
      return percentStr === 'N/A' ? '' : (percentStr.charAt(0) === '-' ? 'data-down' : 'data-up')
    },
    handleClick() {
      if(this.broadcastChartDataArr.length === 0) {
        this.$service.getBlockChartData({id: this.id}).then(data => {
          this.broadcastChartDataArr = data.rows
        })
      }
      this.isShowChart = true
    },
    handleChartData(chartData) {
      return {
        title: chartData.title,
        unit: chartData.unit,
        columns: ['x', 'y'],
        rows: chartData.data
      }
    },
    handleChartSettings(chartData) {
      return {
        labelMap: {
          y: chartData.title
        }
      }
    },
    handleChartExtend(chartData) {
      const yAxis = {
        axisLabel: {
          formatter: '{value}%'
        }
      }
      const extend = Object.assign({}, this.extend)
      return chartData.unit === '%' ? 
      Object.assign(extend, {
        yAxis
      })
      : extend
    },
    getBlockSimpleBrowseData() {
      this.$service.getBlockSimpleBrowseData({id: this.id}).then(data => {
      const uvctr = data.rows[0].data[0].uvctr
      this.uvctr = {
        value: uvctr.value ? this.toPercent(uvctr.value) : 'N/A',
        dailyGrowth: uvctr.dailyGrowth ? this.toPercent(uvctr.dailyGrowth) : 'N/A',
        weeklyGrowth: uvctr.weeklyGrowth ? this.toPercent(uvctr.weeklyGrowth) : 'N/A'
        }
      })
    }
  },
  created() {
    this.$watch('id', this.getBlockSimpleBrowseData, {
      immediate: true
    })
  }
};
</script>

<style lang="stylus" scoped>
.chart-box--title
  height: 44px
  line-height: 44px
  text-align: center
  font-size: 25px
.data-up
  color: red
.data-down
  color: #00AA00
.el-dialog__wrapper{
  &.dialog-fade-leave-active{
    -ms-animation:none;
  }
}
</style>