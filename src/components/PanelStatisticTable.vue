<template>
  <div v-if="isShow" class="table-box">
    <vue-lazy-component @init="init">
      <Table :data="clickUvTable.data" :props="clickUvTable.props" :header="clickUvTable.header" :selection-type="clickUvTable.selectionType"/>
      <Table :data="uvctrTable.data" :props="uvctrTable.props" :header="uvctrTable.header" :selection-type="uvctrTable.selectionType"/>
    </vue-lazy-component>
  </div>
</template>
<script>
  import { component as VueLazyComponent } from '@xunlei/vue-lazy-component'
  import { Table } from 'admin-toolkit'

  export default {
    components: {
      Table,
      'vue-lazy-component': VueLazyComponent
    },
    data() {
      return {
        clickUvTable: {
          props: {
            border: true,
            size: 'small',
            'row-style': () => { return "height: 20px" },
            'cell-style': () => { return "padding: 0; text-align: center" },
            'header-cell-style': () => { return "padding: 0" }
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
                if(!row.dailyGrowth) return 'N/A'
                let mark = row.dailyGrowth.split(' ').pop() == '↑' ? 0 : 1
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
                if(!row.weeklyGrowth) return 'N/A'
                let mark = row.weeklyGrowth.split(' ').pop() == '↑' ? 0 : 1
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
            'row-style': () => { return "height: 20px" },
            'cell-style': () => { return "padding: 0" },
            'header-cell-style': () => { return "padding: 0" }
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
                if(!row.dailyGrowth) return 'N/A'
                let mark = row.dailyGrowth.split(' ').pop() == '↑' ? 0 : 1
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
                if(!row.weeklyGrowth) return 'N/A'
                let mark = row.weeklyGrowth.split(' ').pop() == '↑' ? 0 : 1
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
      };
    },
    props: ['panelID', 'isShow'],
    methods: {
      toPercent: decimal => {
        return ((Math.round(decimal * 10000) / 100.00).toFixed(2) + "%")
      },
      toArrowPercent (decimal) {
        const rs = this.toPercent(Math.abs(decimal))
        return rs + (decimal>0 ? ' ↑' : ' ↓')
      },
      getDateday(date) {
        return date.split('-').pop()
      },
      getPanelSimpleBrowseData(){
        this.$service.getPanelSimpleBrowseData({id: this.panelID, days: 3}).then(data => {
          const rows = data.rows[0].data
          let clickUvData = []
          let uvctrData = []
          rows.map(item => {
            let clickUvRow = {}
            let uvctrRow = {}
            const date = this.getDateday(item.date)
            const clickUv = item.clickUv
            const uvctr = item.uvctr
            clickUvRow = {
              date: date,
              clickUv: clickUv.value,
              dailyGrowth: this.toArrowPercent(clickUv.dailyGrowth),
              weeklyGrowth: this.toArrowPercent(clickUv.weeklyGrowth)
            }
            uvctrRow = {
              date,
              uvctr: this.toPercent(uvctr.value),
              dailyGrowth: this.toArrowPercent(uvctr.dailyGrowth),
              weeklyGrowth: this.toArrowPercent(uvctr.weeklyGrowth)
            }
            clickUvData.push(clickUvRow)
            uvctrData.push(uvctrRow)
          })
          this.clickUvTable.data = clickUvData.reverse()
          this.uvctrTable.data = uvctrData.reverse()
        })
      },
      // 懒加载组件
      init() {
        if(this.clickUvTable.data.length !== 0) {
          return 
        }
        this.$watch('panelID', this.getPanelSimpleBrowseData, {
          immediate: true
        })
      }
    }
  };
</script>


<style lang="stylus" scoped>
.table-box 
  position: absolute 
  top: 0% 
  right: -300px
.table-box >>> .cc-table-wrapper
  padding: 0
</style>