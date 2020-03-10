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
      pageName="sysDept"
      @add="addDep"
      @edit="editData"
      @delete="batchDel">
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
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import { ContentWrapper, Table } from 'admin-toolkit'
import { Input } from 'element-ui'
import _ from 'gateschema'

export default {
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage
  },

  data () {
    return {
      canEdit: false,
      filterSchema: null,
      filter: {
        sort: undefined,
        order: undefined
      },
      pagination: {
      },
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: '部门名称',
            prop: 'deptName',
            fit: true,
            sortable: true
          },
          {
            label: '部门电话',
            prop: 'deptTel',
            fit: true,
            sortable: true
          },
          {
            label: '部门传真',
            prop: 'deptFax',
            fit: true,
            sortable: true
          },
          {
            label: '是否禁用',
            prop: 'disabled',
            fit: true,
            sortable: true,
            render: (h, { row }) => {
              return h(
                'div',
                {
                  style: {
                    color: ['red', 'green'][row.disabled]
                  }
                },
                ['否', '是'][row.disabled]
              )
            }
          },
          {
            label: '备注',
            prop: 'remark',
            fit: true,
            sortable: true
          },
          {
            label: '排序',
            prop: 'seq',
            width: 100,
            sortable: true,
            render: (h, { row }) => {
              if (!this.canEdit) {
                return row.seq
              }
              return h(Input, {
                ref: 'input',
                props: { value: row.seq },
                on: {
                  input: value => {
                    row.seq = value
                  },
                  blur: value => {
                    this.$service.sysDeptUpdateSeq({
                      id: row.deptId,
                      seq: row.seq
                    })
                  }
                }
              })
            }
          },
          {
            label: '部门父编号',
            prop: 'pid',
            fit: true,
            sortable: true
          }
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
    fetchData () {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.sysDeptPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    // 新增页面
    addDep () {
      this.$emit('open-add-page', null)
    },
    // 编辑页面
    editData () {
      if (this.$isAllowEdit(this.selected)) {
        this.$emit('open-add-page', this.selected[0])
      }
    },
    // 表单重设
    handleFilterReset () {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterChange (type, filter) {
      if (filter) { this.filter = filter }
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    /**
     * 批量删除
     */
    batchDel () {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service
          .sysDeptRemove({ id: this.selected.join(',') }, '删除成功')
          .then(data => {
            this.handleAllRowSelectionRemove()
            this.fetchData()
          })
      })
    },
    /**
     * 行选择操作
     */
    handleRowSelectionAdd (targetItem) {
      this.selected.push(targetItem.deptId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.deptId
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
    handleAllRowSelectionRemove () {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected () {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.deptId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    }
  },

  created () {
    let filterSchema = _.map({
      deptName: _.o.string.other('form', {
        placeholder: '部门名称'
      }),
      deptTel: _.o.string.other('form', {
        placeholder: '部门电话'
      }),
      deptFax: _.o.string.other('form', {
        placeholder: '部门传真'
      }),
      remark: _.o.string.other('form', {
        placeholder: '备注'
      }),
      pid: _.o.number.other('form', {
        placeholder: '部门父编号'
      }),
      disabled: _.o.enum({ 否: 0, 是: 1 }).other('form', {
        component: 'Select',
        placeholder: '是否禁用'
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
    this.$service.getButtonGroupForPageList('sysDept').then(data => {
      this.canEdit = data.some(item => item.runComm === 'edit')
    })
  }
}
</script>

<style lang="stylus" scoped>
.btns
  margin-bottom: 10px
</style>
