<template>
  <ContentCard title="版块个性化推荐反馈" @go-back="$emit('go-back')">
    <span slot="actions"></span>
    <div>
      <el-form :inline="true" @keypress.enter.native.prevent="fetchData" class="filter">
        <el-form-item>
          <el-date-picker type="date" :clearable="false" v-model="filter.dayTime" placeholder="日期" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="filter.tabId" clearable placeholder="版面 ID" />
        </el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form>
      <div>
        <div class="tip-empty" v-if="table.isNoData === true">
          <p>版面在 {{ parseTime(filter.dayTime) }} 没有版块个性化数据</p>
          <p class="tip-how">至少一天之内起始位置不变才能有数据</p>
        </div>
        <div v-else-if="table.isNoData === false">
          <p>爱奇艺精选版面<el-button type="primary">导出</el-button></p>
          <Table
            :props="table.props"
            :header="table.header"
            :data="table.data"
            :selected="table.selected"
            :selection-type="table.selectionType"
          />
        </div>
      </div>
    </div>
  </ContentCard>
</template>
<script>
import { Table } from 'admin-toolkit'
import { cloneDeep } from 'lodash'
export default {
  components: {
    Table
  },
  data () {
    return {
      filter: {
        tabId: undefined,
        dayTime: new Date().toISOString()
      },
      pagination: {
        currentPage: 1
      },
      table: {
        props: {},
        data: [],
        isNoData: undefined,
        header: [
          {
            label: '版块ID',
            prop: 'panelId'
          },
          {
            label: '版块名称',
            prop: 'panelName'
          },
          {
            label: '曝光次数',
            prop: 'CVNum'
          },
          {
            label: '点击次数',
            prop: 'clickNum'
          },
          {
            label: 'PVCTR',
            prop: 'PVCTR'
          },
          {
            label: '曝光次数排名',
            prop: 'PVRank'
          },
          {
            label: 'PVCTR排名',
            prop: 'PVCTRRank'
          }
        ],
        selectionType: 'none',
        selected: []
      }
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
      const filter = cloneDeep(this.filter)
      filter.dayTime = this.parseTime(filter.dayTime)
      this.$service.getPanelRecommandFeedback(filter).then(result => {
        const {total, rows} = result
        this.pagination.total = total
        this.table.data = rows
        this.table.isNoData = rows.length === 0
      })
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