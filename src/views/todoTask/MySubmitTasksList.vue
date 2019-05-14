<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <Table :props="table.props" :header="table.header" :data="table.data"/>
    </ContentWrapper>
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper
  },
  props: {
    resourceType: String
  },
  data() {
    return {
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'taskId',
            width: '100'
          },
          {
            label: '名称',
            width: '130',
            prop: 'taskName',
            sortable: true,
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
                row.taskName
              )
            }
          },
          {
            label: '待处理的版本',
            prop: 'resourceVersion',
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
                row.taskName
              )
            }
          },
          {
            label: '内容源',
            prop: 'source'
          },
          {
            label: '优先级',
            prop: 'priority',
            render: (h, { row }) => {
              return this.$numToReviewPriority(row.priority)
            }
          },
          {
            label: '任务状态',
            prop: 'taskFlag',
            render: (h, { row }) => {
              return this.$numToTaskStatus(row.taskFlag)
            }
          },
          {
            label: '审核状态',
            prop: 'auditFlag',
            render: (h, { row }) => {
              return this.$numToAuditStatus(row.auditFlag)
            }
          },
          {
            label: '审核人',
            prop: 'currentOperatorName'
          },
          {
            label: '审核意见',
            prop: 'auditDesc'
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: 150,
            sortable: true
          }
        ],
        data: [],
        selected: [],
        selectionType: 'none'
      }
    }
  },
  methods: {
    handleRead(row) {
      this.$emit('read', row, this.resourceType+"Preview")
    },
    handleFilterChange(type) {
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      filter.resourceType = this.resourceType
      this.$service.mySubmitTasksPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created() {
    let filterSchema = _.map({
      taskId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      taskName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '名称'
      }),
      auditFlag: _.o
        .enum({
          审核中: 6,
          待审核: 3,
          审核通过: 4,
          审核不通过: 5
        })
        .other('form', {
          component: 'Select',
          placeholder: '内容源'
        })
    }).other('form', {
      cols: {
        item: 6,
        label: 0,
        wrapper: 20
      },
      layout: 'inline',
      footer: {
        cols: {
          label: 0,
          wrapper: 24
        },
        showSubmit: true,
        submitText: '查询',
        showReset: true,
        resetText: '重置'
      }
    })
    this.filterSchema = filterSchema
    this.fetchData()
  }
}
</script>

