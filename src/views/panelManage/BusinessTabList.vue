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
        pageName='businessTab' 
        @add="addData"
        @edit="editData"
        @delete="batchDel"
        >
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
import { ContentWrapper, Table, utils } from 'admin-toolkit'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
export default {
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage
  },

  data() {
    return {
      tabTypeOption: [
        { label: '第三方版面', value: '4' },
        { label: '专题版面', value: '2' },
        { label: '普通版面', value: '1' }
      ],
      tabStatusOption: [
        { label: '下架', value: '0' },
        { label: '上架', value: '1' },
        { label: '草稿', value: '2' },
        { label: '待审核', value: '3' },
        { label: '审核通过', value: '4' },
        { label: '审核不通过', value: '5' }
      ],
      tabStatus: {},
      filter: {
        tabParentType: 'biz',
        idPrefix: 10
      },
      filterSchema: null,
      pagination: {
        currentPage: 1
      },
      appIdType: [],
      businessType: [],
      tabType: {},
      tabTypeReverse: {},
      selected: [],
      selectedItems: [],
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
            render: (h, { row }) => {
              return this.tabTypeReverse[row.tabType]
            }
          },
          {
            label: '业务分类',
            prop: 'businessCategoryName'
          },
          {
            label: '内容源',
            prop: 'tabResource',
            render: (h, { row }) => {
              return this.$sourceName(row.tabResource)
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
            label: '待审核副本',
            prop: 'duplicateVersion',
            render: (createElement, { row }) => {
              return createElement(
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
            label: '更新时间',
            prop: 'lastUpdateDate'
          },
          {
            label: '审核人',
            prop: 'auditor'
          },
          {
            label: '更新人',
            prop: 'modifierName'
          },
          {
            label: '操作',
            prop: 'oper',
            width: 100,
            render: this.createOperationRender(this)
          }
        ],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },

  methods: {
    createOperationRender(obj) {
      return function render(h, {row}) {
        let btn1 = h('el-button',
            {
              props: {
                type: 'text'
              },
              on: {
                click: () => {
                  obj.handleCopy(row)
                }
              }
            },
            '复制'
          )
        let btn2 = null
        if(row.collected) {
           btn2 =  h('el-button',
            {
              props: {
                type: 'text'
              },
              on: {
                click: () => {
                  obj.cancalCollect(row)
                }
              }
            },
            '取消'
          )
        } else {
            btn2 = h('el-button',
            {
              props: {
                type: 'text'
              },
              on: {
                click: () => {
                  obj.collect(row)
                }
              }
            },
            '收藏'
          )
        }
        return [btn1, btn2]
      }
    },
    handleCopy(row) {
      this.$emit('copy', row.tabId)
    },
    collect(row) {
      this.$service.businessTabCollect({ resourceId: row.tabId }, '收藏成功').then(()=>{
        this.fetchData()
      })
    },
    cancalCollect(row) {
      this.$service.businessTabCancelCollect({ resourceId: row.tabId }, '取消成功').then(()=>{
        this.fetchData()
      })
    },
    handleRead(row, version) {
      this.$emit('read', row.tabId, version)
    },
    /**
     * 新增
     */
    addData() {
      this.$emit('create')
    },
    /**
     * 编辑
     */
    editData() {
      if (this.$isAllowEdit(this.selected)) {
        if (parseInt(this.selectedItems[0].tabStatus) === 2) {
          this.$emit('edit', this.selected[0])
        } else {
          this.$message({
            type: 'error',
            message: '只有草稿状态才能编辑'
          })
        }
      }
    },
    /**
     * 批量删除
     */
    batchDel() {
      if (
        this.$isAllowDelete(this.selected) &&
        window.confirm('确定要删除吗')
      ) {
        this.$service
          .testPolicyConfRemove({ id: this.selected.join(',') }, '删除成功')
          .then(data => {
            this.fetchData()
          })
      }
    },
    /**
     * 获取数据
     */
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.tabInfoList(filter).then(data => {
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
    handleFilterChange(type) {
      if (type !== 'pagination') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = {
        tabParentType: 'biz',
        idPrefix: 10
      }
      this.fetchData()
    },
    getTabType() {
      return this.$service.getTabType().then(data => {
        data.forEach(element => {
          this.tabType[element.label] = element.value
          this.tabTypeReverse[element.value] = element.label
        })
      })
    },
    /**
     * 行选择操作
     */
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.tabId)
      this.selectedItems.push(targetItem)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.tabId
      })
      this.targetItem = this.targetItem.filter(item => {
        return item.tabId !== targetItem.tabId
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionRemove() {
      this.selected = []
      this.selectedItems = []
      this.table.selected = []
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.selectedItems = []
        this.table.selected = []
      }
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.tabId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    getBusinessType() {
      this.$service.getBusinessType().then(data => {
        this.businessType = data
      })
    }
  },
  created() {
    this.tabStatus = this.tabStatusOption.reduce((result, item) => {
      result[item.label] = item.value
      return result
    }, {})
    let filterSchema = _.map({
      tabId: _.o.string.other('form', {
        placeholder: '版面Id'
      }),
      tabName: _.o.string.other('form', {
        placeholder: '版面标题'
      }),
      tabType: _.o.enum(this.tabType).other('form', {
        component: 'Select',
        placeholder: '版面属性'
      }),
      tabStatus: _.o.enum(this.tabStatus).other('form', {
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
    this.getTabType().then(() => {
      this.filterSchema = filterSchema
    })
    this.$service.getAppIdType().then(data => {
      this.appIdType = data
      this.fetchData()
    })
    this.getBusinessType()
  }
}
</script>

<style lang='stylus' scoped>
.btns
  margin-bottom: 30px
</style>