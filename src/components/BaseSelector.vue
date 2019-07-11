<template>
  <div class="remote-selector-main">
    <div class="remote-selector-main__filter">
      <slot name="filter">
        <GateSchemaForm
          v-if="filterSchema"
          v-model="viewFilter"
          :schema="filterSchema"
          @submit="handleFilter"
          @reset="handleResetFilterForm"
        />
      </slot>
    </div>
    <div ref="selectorContent" class="remote-selector-main__content">
      <slot name="item-list">
        <Table
          :key="Math.random().toString()"
          :data="table.data"
          :header="table.header"
          :selected="tableSelected"
          :props="tableProps"
          :selection-type="selectionType || table.selectionType"
          :select-on-row-click="true"
          @row-selection-add="handleTableRowSelectionAdd"
          @row-selection-remove="handleTableRowSelectionRemove"
          @row-selection-change="handleTableRowSelectionChange"
          @all-row-selection-change="handleTableAllRowSelectionChange"
          @row-dblclick="handleRowDblClick"
        />
      </slot>
    </div>
    <div class="remote-selector-main__footer">
      <div class="remote-selector-main__pagination">
        <slot name="pagination">
          <el-pagination
              v-if="pagination"
              @size-change="handlePageSizeChange"
              @current-change="handlePageChange"
              :current-page="pagination.currentPage"
              :page-sizes="[15, 20, 30, 50, 100, 200]"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total">
          </el-pagination>
        </slot>
      </div>
      <div class="remote-selector-main__actions">
        <slot name="actions">
            <el-button type="primary" @click="handleSelectEnd">
              确定
            </el-button>
            <el-button @click="handleSelectCancel">
              取消
            </el-button>
        </slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { Table } from 'admin-toolkit'
export default {
  components: {
    Table
  },
  data() {
    return {
      tableHeight: undefined,
      selected: [],
      tableSelected: [],
      inputFilter: {},
      viewFilter: {}
    }
  },
  props: ['idField', 'filter', 'filterSchema', 'table', 'pagination', 'selectionType', 'selectEndOnDblClick'],
  computed: {
    tableProps() {
      const originProps = this.table.Props || {}
      if (!originProps.height) {
        return { ...originProps, height: this.tableHeight }
      }
      return originProps
    }
  },
  watch: {
    'table.data': 'updateTableSelected'
  },
  methods: {
    setViewFilter(filter) {
      // 如果外面传进来的 filter 与 inputFilter 不一样
      if (this.inputFilter !== filter) {
        this.inputFilter = filter || {}
        this.viewFilter = filter ? JSON.parse(JSON.stringify(filter)) : {}
      }
    },
    clearSelected() {
      this.selected = []
      this.tableSelected = []
    },
    handleSelectEnd () {
      if (this.selected.length === 0) {
        return this.$message({
          type: 'error',
          message: '请选择数据'
        })
      }
      this.$emit('select-end', this.selected.slice())
    },
    handleSelectCancel () {
      this.$emit('select-cancel')
      this.tableSelected = []
      this.selected = []
    },
    handleFilter (err) {
      if (!err || err.length === 0) {
        this.inputFilter = JSON.parse(JSON.stringify(this.viewFilter))
        this.$set(this.pagination, 'currentPage', 1)
        // 把生效的 filter emit 出去
        this.$emit('filter-change', this.inputFilter)
      }
    },
    handlePageSizeChange (size) {
      this.$set(this.pagination, 'pageSize', size)
      this.$emit('pagination-change')
    },
    handlePageChange (page) {
      this.$set(this.pagination, 'currentPage', page)
      this.$emit('pagination-change')
    },
    handleResetFilterForm () {
      this.$emit('filter-reset')
    },
    handleTableRowSelectionChange(item, index) {
      this.selected = [item]
      this.tableSelected = index
    },
    handleTableRowSelectionAdd(targetItem) {
      this.selected = this.selected.concat(targetItem)
      this.updateTableSelected()
    },
    handleTableRowSelectionRemove(targetItem) {
      const ID = this.idField
      this.selected = this.selected.filter(item => {
        return item[ID] !== targetItem[ID]
      })
      this.updateTableSelected()
    },
    handleTableAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleTableRowSelectionAdd)
      } else {
        this.table.data.forEach(this.handleTableRowSelectionRemove)
      }
    },
    updateTableSelected() {
      const ID = this.idField
      const table = this.table
      const newSelectedIndex = this.selected.map(item => item[ID])
      this.tableSelected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item[ID]) > -1) {
          result.push(index)
        }
        return result
      }, [])
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    },
    setTableHeight() {
      this.tableHeight = this.$refs.selectorContent.clientHeight + 'px'
    },
    handleRowDblClick() {
      if (this.selectEndOnDblClick && this.selectionType === 'single') {
        this.handleSelectEnd()
      }
    }
  },
  created() {
    // 保存一个引用
    this.$watch('filter', this.setViewFilter, {
      immediate: true
    })
  },
  mounted() {
    window.addEventListener('resize', this.setTableHeight)
    this.setTableHeight()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight)
  }
}
</script>

<style lang="stylus" scoped>
.remote-selector-main
  height 100%
  display flex
  flex-direction column
.remote-selector-main__content
  overflow auto
  margin 10px 0
  border-top 1px solid #EBEEF5
  border-bottom 1px solid #EBEEF5
  flex 1
.remote-selector-main__footer
  height 35px
  padding 10px 0
.remote-selector-main__pagination
  display inline-block
.remote-selector-main__actions
  display inline-block
  float right
</style>
