<template>
  <div v-if="isShow" class="table-box" :title="`版块ID: ${panelID}`">
    <Table :data="clickUvTable.data" :props="clickUvTable.props" :header="clickUvTable.header" :selection-type="clickUvTable.selectionType"/>
    <Table :data="uvctrTable.data" :props="uvctrTable.props" :header="uvctrTable.header" :selection-type="uvctrTable.selectionType"/>
  </div>
</template>
<script>
import { Table } from 'admin-toolkit'

export default {
  components: {
    Table
  },
  data () {
    return {
      clickUvTable: {
        props: {
          border: true,
          size: 'small',
          'row-style': () => { return 'height: 20px' },
          'cell-style': () => { return 'padding: 0; text-align: center' },
          'header-cell-style': () => { return 'padding: 0; text-align: center' }
        },
        header: [
          {
            label: '',
            prop: 'date',
            width: 40
          },
          {
            label: '点击UV',
            prop: 'clickUv',
            width: 80
          },
          {
            label: '环比',
            prop: 'dailyGrowth',
            width: 80,
            render: (h, { row }) => {
              if (!row.dailyGrowth) return 'N/A'
              let mark = row.dailyGrowth.split(' ').pop() === '↑' ? 0 : 1
              return h(
                'div',
                {
                  style: {
                    color: ['red', '#00AA00'][mark]
                  }
                },
                row.dailyGrowth
              )
            }
          },
          {
            label: '同比',
            prop: 'weeklyGrowth',
            width: 80,
            render: (h, { row }) => {
              if (!row.weeklyGrowth) return 'N/A'
              let mark = row.weeklyGrowth.split(' ').pop() === '↑' ? 0 : 1
              return h(
                'div',
                {
                  style: {
                    color: ['red', '#00AA00'][mark]
                  }
                },
                row.weeklyGrowth
              )
            }
          }
        ],
        data: [],
        selectionType: 'none'
      },
      uvctrTable: {
        props: {
          border: true,
          size: 'small',
          'row-style': () => { return 'height: 20px' },
          'cell-style': () => { return 'padding: 0; text-align: center' },
          'header-cell-style': () => { return 'padding: 0; text-align: center' }
        },
        header: [
          {
            label: '',
            prop: 'date',
            width: 40
          },
          {
            label: 'UVCTR',
            prop: 'uvctr',
            width: 80
          },
          {
            label: '环比',
            prop: 'dailyGrowth',
            width: 80,
            render: (h, { row }) => {
              if (!row.dailyGrowth) return 'N/A'
              let mark = row.dailyGrowth.split(' ').pop() === '↑' ? 0 : 1
              return h(
                'div',
                {
                  style: {
                    color: ['red', '#00AA00'][mark]
                  }
                },
                row.dailyGrowth
              )
            }
          },
          {
            label: '同比',
            prop: 'weeklyGrowth',
            width: 80,
            render: (h, { row }) => {
              if (!row.weeklyGrowth) return 'N/A'
              let mark = row.weeklyGrowth.split(' ').pop() === '↑' ? 0 : 1
              return h(
                'div',
                {
                  style: {
                    color: ['red', '#00AA00'][mark]
                  }
                },
                row.weeklyGrowth
              )
            }
          }
        ],
        data: [],
        selectionType: 'none'
      }
    }
  },
  props: ['panelID', 'isShow'],
  methods: {
    toPercent: decimal => {
      return ((Math.round(decimal * 10000) / 100.00).toFixed(2) + '%')
    },
    toArrowPercent (decimal) {
      const rs = this.toPercent(Math.abs(decimal))
      return rs + (decimal > 0 ? ' ↑' : ' ↓')
    },
    getDateday (date) {
      return date.split('-').pop()
    },
    getPanelSimpleBrowseData () {
      this.$service.getPanelSimpleBrowseData({ id: this.panelID, days: 3 }).then(data => {
        const rows = data.rows[0].data
        let clickUvData = []
        let uvctrData = []
        rows.forEach(item => {
          let clickUvRow = {}
          let uvctrRow = {}
          if (!item.date) {
            clickUvRow = {
              date: '-',
              clickUv: '-',
              dailyGrowth: '-',
              weeklyGrowth: '-'
            }
            uvctrRow = {
              date: '-',
              uvctr: '-',
              dailyGrowth: '-',
              weeklyGrowth: '-'
            }
            clickUvData.push(clickUvRow)
            uvctrData.push(uvctrRow)
            return
          }
          const date = this.getDateday(item.date)
          const clickUv = item.clickUv
          const uvctr = item.uvctr
          clickUvRow = {
            date: date,
            clickUv: clickUv.value,
            dailyGrowth: clickUv.dailyGrowth ? this.toArrowPercent(clickUv.dailyGrowth) : '-',
            weeklyGrowth: clickUv.weeklyGrowth ? this.toArrowPercent(clickUv.weeklyGrowth) : '-'
          }
          uvctrRow = {
            date,
            uvctr: this.toPercent(uvctr.value),
            dailyGrowth: uvctr.dailyGrowth ? this.toArrowPercent(uvctr.dailyGrowth) : '-',
            weeklyGrowth: uvctr.weeklyGrowth ? this.toArrowPercent(uvctr.weeklyGrowth) : '-'
          }
          clickUvData.push(clickUvRow)
          uvctrData.push(uvctrRow)
        })
        this.clickUvTable.data = clickUvData.reverse()
        this.uvctrTable.data = uvctrData.reverse()
      })
    }
  },
  created () {
    this.getPanelSimpleBrowseData()
  }
}
</script>

<style lang="stylus" scoped>
.table-box
  position: absolute
  top: 0%
  right: -300px
.table-box >>> .cc-table-wrapper
  padding: 0
</style>
