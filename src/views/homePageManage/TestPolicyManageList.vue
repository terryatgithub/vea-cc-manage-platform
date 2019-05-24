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
        pageName="policyConf"
        @add="addData"
        @edit="editData"
        @delete="batchDel"
      ></ButtonGroupForListPage>
      <!-- <div class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addData">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchDel">删除</el-button>
      </div> -->
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
import { Button } from 'element-ui'
import ButtonList from './../../components/ButtonLIst'
import { ContentWrapper, Table, ActionList, utils } from 'admin-toolkit'
import ButtonGroupForListPage from './../../components/ButtonGroupForListPage'
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data() {
    let _this = this
    return {
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {
        pageSize: 5
      },
      selected: [],
      selectedItems: [],
      table: {
        props: {
          rowKey: 'policyId'
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
            width: 150,
            render: (h, { row }) => {
              return h(
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
            prop: 'lastUpdateDate'
          },
          {
            label: '更新人',
            prop: 'modifierName'
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    handleRead(row, version) {
      this.$emit('read', row.policyId, version)
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
        if(parseInt(this.selectedItems[0].policyStatus) === 2){
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
          .policyConfRemove({ id: this.selected.join(',') }, '删除成功')
          .then(data => {
            this.fetchData()
          })
      }
    },
    //表格操作
    handleRowSelectionAdd(targetItem) {
      let obj = this.getIDs(targetItem)
      this.selected = this.selected.concat(obj.ids)
      this.selectedItems = this.selectedItems.concat(obj.items)
      this.updateTableSelected()
    },
    getIDs (item) {
      let ids = []
      let items = []
       if (typeof item.children !== 'undefined') {
        item.children.forEach(e => {
          ids.push(e.policyId)
          items.push(e)
        })
      }
      ids.push(item.policyId)
      items.push(item)
      return {
        ids: ids,
        items: items
      }
    },
    handleRowSelectionRemove(targetItem) {
      let obj = this.getIDs(targetItem)
      let selected = this.selected
      this.selected = this.selected.filter((item, index) => {
        return obj.ids.includes(item) === false
      })
       this.selectedItems = this.selectedItems.filter((item, index) => {
        return obj.ids.includes(selected[index]) === false
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.table.selected = []
      }
    },
    handleAllRowSelectionRemove() {
      this.selected = []
      this.selectedItems = []
      this.table.selected = []
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      let d = table.data.reduce((result, item, index) => {
        result = result.concat(this.getIDs(item).ids)
        return result
      }, [])
      table.selected = d.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    //查询
     handleFilterChange(type) {
      if(this.$isNumber(this.filter.policyId)) {
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
    },
    /**
     * 获取数据
     */
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.getTestPolicyManagePageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created() {
    let filterSchema = _.map({
      policyId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      policyName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '策略名称'
      }),
      policyStatus: _.o
        .enum({
          请选择: '',
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
<style lang = 'stylus' scoped>
.btns
  margin-bottom: 10px
  display: flex
  flex-direction: row
</style>