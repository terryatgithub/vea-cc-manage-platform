<template>
  <ab-tab-page-wrapper :active="activePage">
    <ab-tab-page name="default">
      <ContentCard title="版块个性化推荐反馈" @go-back="$emit('go-back')">
        <span slot="actions"></span>
        <div>
          <el-form :inline="true" @submit.native.prevent="" @keypress.enter.native.prevent="$refs.submit.$el.click()" class="filter">
            <el-form-item>
              <el-date-picker type="date" :clearable="false" v-model="filter.dayTime" placeholder="日期" />
            </el-form-item>
            <el-form-item>
              <InputPositiveInt name="tabId" autocomplete="on" v-model="filter.tabId" clearable placeholder="版面 ID" />
            </el-form-item>
            <el-button ref="submit" type="primary" native-type="submit" @click="fetchData">查询</el-button>
          </el-form>
          <div>
            <div class="tip-empty" v-if="table.isNoData === true">
              <p>该版面在那天没有版块个性化数据</p>
              <p class="tip-how">至少一天之内起始位置不变才能有数据</p>
            </div>
            <div v-else-if="table.isNoData === false">
              <p class="tab-info">
                {{ tabInfo.tabName }} ({{ tabInfo.tabId }}) : {{ parseTime(filter.dayTime) }}  推荐流从第 {{ tabInfo.recommendIndex }} 开始
                <!-- <el-button type="primary" @click="handleExport">导出</el-button> -->
              </p>
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
    </ab-tab-page>
    <ab-tab-page name="panel-preview">
      <PanelInfo
        v-if="panelPreview.id"
        title-prefix="版块个性化推荐反馈"
        :init-mode="panelPreview.initMode"
        :id="panelPreview.id"
        :version="panelPreview.version"
        @upsert-end="handlePreviewPanelEnd"
        @go-back="handlePreviewPanelEnd"
      />
    </ab-tab-page>
  </ab-tab-page-wrapper>
</template>
<script>
import { Table } from 'admin-toolkit'
import { cloneDeep } from 'lodash'
import PanelInfo from '../panelInfo/PanelInfo'
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  components: {
    Table,
    PanelInfo,
    InputPositiveInt
  },
  data () {
    return {
      activePage: 'default',
      panelPreview: {
        initMode: 'read',
        id: undefined,
        version: undefined
      },
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
            prop: 'panelId',
            render: (h, { row }) => {
              return (
                <el-button type="text" onclick={() => this.handlePreviewPanel(row)}>{ row.panelId }</el-button>
              )
            }
          },
          {
            label: '版块名称',
            prop: 'panelName',
            render: (h, { row }) => {
              return (
                <el-button type="text" onclick={() => this.handlePreviewPanel(row)}>{ row.panelName }</el-button>
              )
            }
          },
          {
            label: '曝光次数',
            prop: 'pvNum'
          },
          {
            label: '点击次数',
            prop: 'clickNum'
          },
          {
            label: 'PVCTR',
            prop: 'pvctr'
          },
          {
            label: '曝光次数排名',
            prop: 'pvRank'
          },
          {
            label: 'PVCTR排名',
            prop: 'pvctrRank'
          }
        ],
        selectionType: 'none',
        selected: []
      },
      tabInfo: {
        tabId: undefined,
        tabName: undefined,
        recommendIndex: undefined
      }
    }
  },
  methods: {
    handlePreviewPanel (row) {
      const panelPreview = this.panelPreview
      panelPreview.id = row.panelId
      panelPreview.version = row.panelVersion
      this.activePage = 'panel-preview'
    },
    handlePreviewPanelEnd () {
      const panelPreview = this.panelPreview
      panelPreview.id = undefined
      panelPreview.version = undefined
      this.activePage = 'default'
    },
    handleExport () {
      this.$message.error('导出接口还没做好')
    },
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

      if (!filter.tabId) {
        return this.$message.error('请输入版面 id')
      }

      this.$service.getPanelRecommandFeedback(filter).then(result => {
        const {total, rows, extra} = result
        this.pagination.total = total
        this.tabInfo = {
          ...this.tabInfo,
          ...extra
        }
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
.tab-info
  font-size 14px
  >>> .el-button
    margin-left 20px
</style>