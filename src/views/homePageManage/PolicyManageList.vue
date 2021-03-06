<template>
  <ContentCard ref="contentCard" class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <ButtonGroupForListPage
        pageName="policyConf"
        @add="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete"
      ></ButtonGroupForListPage>
      <Table
        class="policy-list"
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
import { ContentWrapper, Table } from 'admin-toolkit'
import ButtonGroupForListPage from './../../components/ButtonGroupForListPage'
import BaseList from '@/components/BaseList'
export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data () {
    return {
      resourceType: 'policy',
      filter: {
      },
      filterSchema: null,
      pagination: {
        pageSize: 10
      },
      selected: [],
      selectedItems: [],
      table: {
        props: {
          rowKey: 'policyId',
          treeProps: { children: 'children' }
        },
        header: [
          {
            label: 'ID',
            prop: 'policyId',
            width: 70
          },
          {
            label: '策略名称',
            prop: 'policyName',
            minWidth: 150,
            'show-overflow-tooltip': true,
            render: (h, { row }) => {
              const icon = h('i', {
                class: row.children ? 'el-icon-folder' : 'el-icon-document'
              })
              const link = h(
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
                row.policyName
              )
              return h('div', null, [
                icon,
                link
              ])
            }
          },
          {
            label: '策略优先级',
            prop: 'priority'
          },
          {
            label: '关联首页方案',
            width: 150,
            prop: 'relationHomepageName'
          },
          {
            label: '机型',
            prop: 'model'
          },
          {
            label: '机芯',
            prop: 'chip'
          },
          {
            label: '版本',
            prop: 'currentVersion'
          },
          {
            label: '状态',
            prop: 'policyStatus',
            render: (h, { row }) => {
              return this.$numToAuditStatus(row.policyStatus)
            }
          },

          {
            label: '待审核副本',
            prop: 'duplicateVersion',
            align: 'center',
            render: (h, { row }) => {
              if (row.duplicateVersion === '') {
                return ''
              } else {
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
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: 140
          },
          {
            label: '更新人',
            prop: 'modifierName'
          },
          {
            label: '操作',
            render: (h, { row }) => {
              if (row.showContentAuthSettingBtn) {
                return h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleOpenContentAuthManager(row)
                    }
                  }
                }, '内容权限')
              }
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
    handleOpenContentAuthManager (row) {
      this.$refs.contentCard.handleShowContentAuthManager({
        id: row.policyId,
        type: 'policy',
        menuElId: 'policyConf'
      })
    },
    // 查询
    handleFilterChange (type, filter) {
      if (filter) { this.filter = filter }
      if (type === 'query') {
        this.pagination.currentPage = 1
      }
      this.fetchData()
    },
    // 重置
    handleFilterReset () {
      this.filter = {
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter () {
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
    fetchData () {
      const filter = this.parseFilter()
      this.$service.getPolicyManagePageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows || []
      })
    },
    expandItem (item) {
      if (item.children) {
        return [item, ...item.children]
      }
      return [item]
    },
    handleRowSelectionAdd (targetItem) {
      this.selected = this.selected.concat(this.expandItem(targetItem))
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      const idField = 'policyId'
      const index = this.expandItem(targetItem).reduce((result, item) => {
        result[item[idField]] = true
        return result
      }, {})
      this.selected = this.selected.filter(item => {
        return !index[item[idField]]
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange (value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.table.selected = []
      }
    },
    updateTableSelected () {
      const idField = 'policyId'
      const table = this.table
      const newSelectedIndex = this.selected.reduce((result, item) => {
        result[item[idField]] = true
        return result
      }, {})
      const tableData = table.data.reduce((result, item) => {
        return result.concat(this.expandItem(item))
      }, [])
      table.selected = tableData.reduce((result, item, index) => {
        if (newSelectedIndex[item[idField]]) {
          result.push(index)
        }
        return result
      }, [])
    }
  },
  created () {
    let filterSchema = _.map({
      policyId: _.o.oneOf([_.value(''), _.number]).$msg('请输入数字').other('form', {
        component: 'InputPositiveInt',
        placeholder: 'ID'
      }),
      policyName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '策略名称'
      }),
      policyStatus: _.o
        .enum({
          下架: '0',
          上架: '1',
          草稿: '2',
          待审核: '3',
          审核通过: '4',
          审核不通过: '5'
        })
        .other('form', {
          component: 'Select',
          placeholder: '状态'
        }),
      chipModel: _.o.string.other('form', {
        component: 'Input',
        placeholder: '机型/机芯'
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
<style lang='stylus' scoped>
.policy-list >>> .el-table__row .el-table__expand-icon
  position absolute
  left 3px
  line-height 25px
  color #000
</style>
