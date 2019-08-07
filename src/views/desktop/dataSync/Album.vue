<template>
  <ContentCard title="待处理业务专辑" @go-back="$emit('go-back')">
    <ContentWrapper
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
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
import { ContentWrapper, Table, utils } from 'admin-toolkit'
import _ from 'gateschema'
const ID = 'pannelGroupId'
export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table
  },
  data () {
    return {
      resourceType: 'panelInfo',
      filter: this.genDefaultFilter(),
      filterSchema: null,
      pagination: {
        currentPage: 1,
        pageSize: 20
      },
      businessType: {},
      table: {
        props: {},
        data: [],
        header: [
          {
            label: 'ID',
            prop: 'pannelGroupId'
          },
          {
            label: '名称',
            minWidth: '180',
            'show-overflow-tooltip': true,
            render: (createElement, { row }) => {
              return createElement('el-button', {
                attrs: {
                  type: 'text'
                },
                on: {
                  click: (event) => {
                    event.stopPropagation()
                    this.handleRead(row)
                  }
                }
              }, row.pannelGroupRemark)
            }
          },
          {
            label: '布局',
            width: '150',
            prop: 'fullLayoutName'
          },
          {
            label: '业务分类',
            prop: 'categoryName'
          },
          {
            label: '内容源',
            prop: 'pannelResource',
            formatter: (row) => {
              return this.$consts.sourceText[row.pannelList[0].pannelResource]
            }
          },
          {
            label: '引用状态',
            prop: 'fullTabName',
            'show-overflow-tooltip': true
          },
          {
            label: '版本/状态',
            prop: 'pannelStatus',
            width: '130',
            formatter: (row) => {
              const status = row.pannelStatus
              const currentVersion = row.currentVersion
              return currentVersion + '/' + this.$consts.statusText[status]
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: '140',
            'show-overflow-tooltip': true
          },
          {
            label: '审核人',
            prop: 'auditor',
            width: '100'
          },
          {
            label: '更新人',
            width: '100',
            prop: 'userName'
          }
        ],
        selected: [],
        selectionType: 'multiple'
      },
      selected: []
    }
  },

  methods: {
    genDefaultFilter() {
      return {
        keyword: 'pannel',
        subCategoryArray: '3',
        idPrefix: '10'
      }
    },
    fetchData() {
      const filter = this.parseFilter()
      this.$service.desktopGetDataSyncList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter }
      if (this.$validateId(this.filter.pannelId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData()
      }
    },
    handleFilterReset() {
      console.log(this.dataList)
      if (this.dataList) {
        this.filter = Object.assign({}, this.dataList.filter)
        console.log(this.filter)
      } else {
        this.filter = this.genDefaultFilter()
      }
      this.pagination.currentPage = 1
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
  }

}
</script>

<style lang='stylus' scoped>
</style>
