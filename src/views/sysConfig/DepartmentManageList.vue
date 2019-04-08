<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <div class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addUser">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchDel">批量删除</el-button>
      </div>

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
import { ContentWrapper, Table, utils } from 'admin-toolkit'
import { Input } from 'element-ui'
import _ from 'gateschema'

export default {
  components: {
    ContentWrapper,
    Table
  },
  
  data() {
    return {
      filterSchema: null,
      filter: {
        sort: undefined,
        order: undefined
      },
      pagination: {
        currentPage: 1,
        pageSize: 15
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
            sortable: true
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
              return h(Input, 
                { 
                  ref: 'input',
                  props: { value: row.seq },
                  on: {
                    change: (value) => {
                      this.$service.sysDeptUpdateSeq({id: row.deptId, seq: value})
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
    fetchData() {
      const filter = this.parseFilter()
      this.$service.sysDeptPageList(filter).then(data => {
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
    //新增页面
    addUser() {
      this.$emit('open-add-page', null)
    },
    //编辑页面
    editData() {
      if( this.$isAllowEdit(this.selected)) {
         this.$emit('open-add-page',this.selected[0])
      }
    },
    // 表单重设
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.fetchData()
    },
    handleFilterChange(type) {
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
    batchDel() {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      }
      if (window.confirm('确定要删除吗')) {
        this.$service
          .sysDeptRemove({ id: this.selected.join(',') }, '删除成功')
          .then(data => {
            this.fetchData()
            this.table.selected = []
          })
      }
    },
    /**
     * 行选择操作
     */
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.deptId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.deptId
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
    updateTableSelected() {
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

  created() {
    let filterSchema = _.map({
      deptName: _.o.string.other('form', {
        placeholder: '部门名称',
        cols: {
          item: 3,
          label: 0
        }
      }),
      deptTel: _.o.string.other('form', {
        placeholder: '部门电话',
        cols: {
          item: 3,
          label: 0
        }
      }),
      deptFax: _.o.string.other('form', {
        placeholder: '部门传真',
        cols: {
          item: 3,
          label: 0
        }
      }),
      remark: _.o.string.other('form', {
        placeholder: '备注',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pid: _.o.number.other('form', {
        placeholder: '部门父编号',
        cols: {
          item: 3,
          label: 0
        }
      }),
      disabled: _.o.enum({ 否: 0, 是: 1 }).other('form', {
        component: 'Select',
        placeholder: '是否禁用',
        cols: {
          item: 3,
          label: 0
        }
      })
    }).other('form', {
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
.btns {
  margin-bottom: 10px;
}
</style>