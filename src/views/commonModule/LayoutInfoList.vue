<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset">
      <div class="btns">
        <ButtonGroupForListPage
        pageName='layout'
        :not-contain-btns="notContainBtns"
        @add="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete"
        >
        </ButtonGroupForListPage>
      </div>
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
import _ from 'gateschema'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
import ButtonGroupForListPage from './../../components/ButtonGroupForListPage'
import BaseList from '@/components/BaseList'
export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data() {
    return {
      resourceType: 'layout',
      notContainBtns: [ 'audit', 'batchAudit'],
      layoutType: {
        '主页6.0': 1,
        '影视V2': 2
      },
      layoutIsTitle: {
        '带标题': 1,
        '不带标题': 0
      },
      filter: this.genDefaultFilter(),
      filterSchema: null,
      pagination: {},
      selected: [],
      selectedRows: {},
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'layoutId',
            width: '70'
          },
          {
            label: '名称',
            width: '200',
            prop: 'layoutName',
            sortable: true,
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
              }, row.layoutName)
            }
          },
          {
            label: '分类',
            prop: 'layoutType',
            width: '80',
            render: (createElement, { row }) => {
              if (row.layoutType === 1) {
                return '主页6.0'
              } else {
                return '影视V2'
              }
            }
          },
          {
            label: '布局标题',
            prop: 'layoutIsTitle',
            width: '80',
            render: (createElement, { row }) => {
              if (row.layoutIsTitle === 1) {
                return '带标题'
              } else {
                return '不带标题'
              }
            }
          },
          {
            label: '扩展方式',
            prop: 'layoutFlag',
            width: '80',
            render: (createElement, { row }) => {
              if (typeof row.layoutFlag === 'undefined') {
                return '无'
              } else {
                switch (row.layoutFlag) {
                  case 0:
                    return '横向扩展'
                    break
                  case 1:
                    return '纵向扩展'
                    break
                }
              }
            }
          },
          // {
          //   label: '间距',
          //   prop: 'space',
          //   width: 70,
          //   sortable:true
          // },
          // {
          //   label: '高度',
          //   prop: 'height',
          //    width: 70,
          //   sortable: true
          // },
          //  {
          //   label: '宽度',
          //   prop: 'width',
          //   width: 70,
          //   sortable: true
          // },
          {
            label: '状态',
            prop: 'layoutStatus',
            width: 70,
            render: (createElement, { row }) => {
              return this.$consts.statusText[row.layoutStatus]
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            sortable: true
          },
          {
            label: '更新人',
            prop: 'modifierName',
            render: (createElement, { row }) => {
              return row.modifierName
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    genDefaultFilter() {
      return {}
    },
    handleFilterChange(type, filter) {
      if (filter) {
        this.filter = filter
      }
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = this.genDefaultFilter()
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
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getLayoutInforPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created() {
    let filterSchema = _.map({
      layoutName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '布局名称'
      }),
      layoutType: _.o.enum(this.layoutType).other('form', {
        component: 'Select',
        placeholder: '布局分类'
      }),
      layoutIsTitle: _.o.enum(this.layoutIsTitle).other('form', {
        component: 'Select',
        placeholder: '布局标题'
      }),
      layoutStatus: _.o.enum(this.$consts.statusEnums).other('form', {
        component: 'Select',
        placeholder: '状态'
      })
    }).other('form', {
      cols: {
        item: 5,
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
<style lang = 'stylus' scoped>
.pics img
  max-width: 350px
  max-height: 500px
.content
  >>> table .imgs
    cursor: pointer
.btns
  margin-bottom: 10px
.checkItemStyle
  margin: 10px
</style>
