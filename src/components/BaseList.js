import resourceFields from '../utlis/resourceFields'
export default {
  data() {
    return {
      resourceType: undefined
    }
  },
  watch: {
    'table.data': 'clearSelected'
  },
  methods: {
    handleRead (item, version) {
      this.$emit('read', item, version)
    },
    handleCreate () {
      this.$emit('create')
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
      const field = resourceFields[this.resourceType]
      const id = item[field.id]
      const status = item[field.status]
      const STATUS = this.$consts.status
      if (status !== STATUS.draft || status !== STATUS.rejected) {
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
    handleDelete () {
      const selected = this.selected
      const length = selected.length
      if (length === 0) {
        return this.$message({
          type: 'error',
          message: '未选中记录'
        })
      }
      this.$confirm('确认要删除选中对记录？')
        .then(() => {
          this.$emit('delete', selected)
        })
        .catch(() => {})
    },
    handleCopy(row) {
      this.$emit('copy', row)
    },
    handleRowSelectionAdd (targetItem) {
      this.selected.push(targetItem)
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      const idField = resourceFields[this.resourceType].id
      this.selected = this.selected.filter(item => {
        return item[idField] !== targetItem[idField]
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
      const idField = resourceFields[this.resourceType].id
      const table = this.table
      const newSelectedIndex = this.selected.reduce((result, item) => {
        result[item[idField]] = true
        return result
      }, {})
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex[item[idField]]) {
          result.push(index)
        }
        return result
      }, [])
    },
    clearSelected() {
      this.selected = []
      this.table.selected = []
      this.updateTableSelected()
    }
  }
}
