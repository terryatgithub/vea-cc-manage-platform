<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <ButtonGroupForListPage 
      pageName="sysPlugin" 
       @edit="handleEdit">
      </ButtonGroupForListPage>
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      />
    </ContentWrapper>
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import BaseList from '@/components/BaseList'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
export default {
   extends: BaseList,
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data() {
    return {
      resourceType: 'blockInfo',
      pluginStatus: {
        下架: 0,
        上架: 1,
        草稿: 2,
        待审核: 3,
        审核通过: 4,
        审核不通过: 5
      },
      source: {
        无: 0,
        腾讯: 1,
        爱奇艺: 2,
        优酷: 3
      },
      channel: {
        影视: 'movie',
        体育: 'sport',
        教育: 'edu',
        少儿: 'child'
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      filter: {
        sort: undefined,
        order: undefined
      },
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'pluginId',
            width: '70'
          },
          {
            label: '功能名称',
            prop: 'pluginName',
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
                row.pluginName
              )
            }
          },
           {
            label: '待审核的版本',
            prop: 'duplicateVersion',
            sortable: true,
            render: (h, { row }) => {
              return h(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.handleRead(row, row.duplicateVersion)
                    }
                  }
                },
                row.duplicateVersion
              )
            }
          },
          {
            label: '内容源',
            prop: 'source',
            render: (createElement, { row }) => {
              switch (row.source) {
                case 0:
                  return '无'
                  break
                case 1:
                  return '腾讯'
                  break
                case 2:
                  return '爱奇艺'
                  break
                 case 3:
                  return '优酷'
                  break
              }
            }
          },
          {
            label: '状态',
            prop: 'pluginStatus',
            render: (createElement, { row }) => {
              switch (row.pluginStatus) {
                case 0:
                  return '下架'
                  break
                case 1:
                  return '上架'
                  break
                case 2:
                  return '草稿'
                  break
                case 3:
                  return '待审核'
                  break
                case 4:
                  return '审核通过'
                  break
                case 5:
                  return '审核不通过'
                  break
              }
            }
          },
          {
            label: '频道',
            prop: 'channel',
            render: (createElement, { row }) => {
              switch (row.channel) {
                case 'movie':
                  return '影视'
                  break
                case 'child':
                  return '少儿'
                  break
                case 'sport':
                  return '体育'
                  break
                case 'edu':
                  return '教育'
                  break
              }
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate'
          }
          // {
          //   label: '操作',
          //   width: '200',
          //   fixed: 'right',
          //   render: utils.component.createOperationRender(this, {
          //     priviewData: '预览'
          //   })
          // }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    /**
     * 获取数据
     */
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.getSysPlugin(filter).then(data => {
        console.log(data)
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    handleEdit () {
      const length = this.selected.length
      if (length === 0) {
        return this.$message({
          type: 'error',
          message: '未选中记录'
        })
      }
      if (length > 1) {
        return this.$message({
          type: 'error',
          message: '只能选择一条记录'
        })
      }
      const item = this.selected[0]
      const idPrefix = this.$consts.idPrefix
      const id = item.pluginId
      const status = item['pluginStatus']
      if (status === 4) {
        return this.$message({
          type: 'error',
          message: '该状态不允许编辑'
        })
      }
      if (id.toString().slice(0, 2) !== idPrefix) {
        return this.$message({
          type: 'error',
          message: '无权限编辑该记录'
        })
      }
      this.$emit('edit', item)
    },
    //查询
     handleFilterChange(type, filter) {
      if (filter) { this.filter = filter}
      if(this.$validateId(this.filter.pluginId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData() 
      }
    },
    //重置
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
      console.log(filter)
    }
  },
  created() {
    let filterSchema = _.map({
      pluginId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      pluginName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '功能名称'
      }),
      source: _.o.enum(this.source).other('form', {
        component: 'Select',
        placeholder: '内容源'
      }),
      channel: _.o.enum(this.channel).other('form', {
        component: 'Select',
        placeholder: '频道'
      }),
      pluginStatus: _.o.enum(this.pluginStatus).other('form', {
        component: 'Select',
        placeholder: '状态'
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
<style lang="stylus" scoped>
.btns
  margin-bottom: 10px
</style>


