<template>
  <ContentCard title="待处理版面" @go-back="$emit('go-back')">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        :select-on-row-click="true"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import BaseList from '@/components/BaseList'
import { ContentWrapper, Table } from 'admin-toolkit'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage,
    InputPositiveInt
  },

  data() {
    return {
      resourceType: 'tabInfo',
      selected: [],
      tabTypeOption: [
        { label: '信号源版面', value: '5' },
        { label: '第三方版面', value: '4' },
        { label: '专题版面', value: '2' },
        { label: '普通版面', value: '1' }
      ],
      tabStatusOption:
      [
        { label: '下架', value: '0' },
        { label: '上架', value: '1' },
        { label: '草稿', value: '2' },
        { label: '待审核', value: '3' },
        { label: '审核通过', value: '4' },
        { label: '审核不通过', value: '5' }
      ],
      businessType: [],
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      appIdType: [],
      filterSchema: null,
      pagination: {
        currentPage: 1,
        pageSize: 20
      },
      table: {
        props: {},
        data: [],
        header: [
          {
            label: 'ID',
            prop: 'tabId'
          },
          {
            label: '名称',
            prop: 'tabName',
            'show-overflow-tooltip': true,
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.handleRead(row)
                    }
                  }
                },
                row.tabName
              )
            }
          },
          {
            label: '版面属性',
            prop: 'tabType',
            formatter: function(row) {
              const v = row.tabType
              return (
                {
                  '1': '普通版面',
                  '2': '专题版面',
                  '4': '第三方版面',
                  '5': '信号源版面'
                }[v + ''] || '未知版面'
              )
            }
          },
          {
            label: '业务分类',
            prop: 'businessCategoryName'
          },
          {
            label: '内容源',
            prop: 'tabResource',
            formatter: function(row) {
              const v = row.tabResource
              return (
                { o_tencent: '腾讯', o_iqiyi: '爱奇艺', o_voole: '优朋' }[
                  v + ''
                ] || ''
              )
            }
          },
          {
            label: 'AppId',
            prop: 'tabAppid',
            formatter: row => {
              return this.appIdType.map(item => {
                if (row.tabAppid.toString() === item.dictEnName) {
                  return item.dictCnName
                }
              })
            }
          },
          {
            label: '版本/状态',
            prop: 'tabStatus',
            formatter: row => {
              const status = row.tabStatus
              const currentVersion = row.currentVersion
              return (
                currentVersion +
                '/' +
                this.tabStatusOption
                  .map(function(item) {
                    if (status.toString() === item.value) {
                      return item.label
                    }
                  })
                  .join('')
              )
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: 140
          },
          {
            label: '审核人',
            prop: 'auditor',
            width: 100
          },
          {
            label: '更新人',
            prop: 'modifierName',
            width: 100
          }
        ],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },

  methods: {
    genDefaultFilter() {
      return {
        idPrefix: '10',
        keyword: 'tab',
        subCategoryArray: '1,2'
      }
    },
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      if (filter.tabId && !/^\d+$/.test(filter.tabId)) {
        return this.$message({
          type: 'error',
          message: 'ID 必须为正整数'
        })
      }
      this.$service.desktopGetDataSyncList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter() {
      const pagination = this.pagination
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange() {
      this.pagination.currentPage = 1
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    addTabInfo() {
      this.$emit('create')
    },
    editData() {
      const table = this.table
      const selected = this.table.selected
      const target = table.data[selected[0]]
      this.$emit('edit', target)
    },
    getBusinessType() {
      this.$service.getDictType({ type: 'businessType' }).then(data => {
        this.businessType = data
      })
    },
    handleToggleCollect(row) {
      if (row.collected) {
        this.$service.collectCancel({ type: 'tab', data: { resourceId: row.tabId } }, '取消收藏成功')
          .then(() => {
            this.$set(row, 'collected', false)
          })
      } else {
        this.$service.collect({ type: 'tab', data: { resourceId: row.tabId } }, '收藏成功')
          .then(() => {
            this.$set(row, 'collected', true)
          })
      }
    }
  },
  created() {
    this.$service.getDictType({ type: 'appIdType' }).then(data => {
      this.appIdType = data
      this.fetchData()
    })
    this.getBusinessType()
  }
}
</script>

<style lang = 'stylus' scoped>
.form >>>.el-form-item__content
  width: 83.33333%
  .el-select
    width: 100%
.form >>>.el-form-item
  margin-right: 0px
.el-form-item-submit
  width: 200px
</style>
