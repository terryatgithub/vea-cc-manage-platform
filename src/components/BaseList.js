import resourceFields from '../utlis/resourceFields'
export default {
  data () {
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
      const resourceType = this.resourceType
      const idPrefix = this.$consts.idPrefix
      const field = resourceFields[resourceType]
      const id = item[field.id]
      const status = item[field.status]
      const STATUS = this.$consts.status

      if (resourceType === 'tabInfo') {
        if (item.tabType === 4) {
          return this.$message({
            type: 'error',
            message: '第三方版面不能编辑'
          })
        }
      }

      if (['clickEvent'].indexOf(resourceType) === -1) {
        // 除了个别, 其他资源都需要验证 idPrefix
        if (id.toString().slice(0, 2) !== idPrefix) {
          return this.$message({
            type: 'error',
            message: '无权限编辑该记录'
          })
        }
      }

      if (['crowdRel', 'panelRecommend'].indexOf(resourceType) > -1) {
        // 有些资源审核通过也可以编辑。。
        return this.$emit('edit', item)
      }

      if (['sysPlugin', 'picture', 'layout', 'cornerIcon', 'cornerIconType', 'clickEvent'].indexOf(resourceType) > -1) {
        // 有些资源在待审核状态也能编辑
        if (status === STATUS.accepted) {
          return this.$message({
            type: 'error',
            message: '该状态不允许编辑'
          })
        }
      } else {
        if (status !== STATUS.draft && status !== STATUS.rejected) {
          return this.$message({
            type: 'error',
            message: '该状态不允许编辑'
          })
        }
      }
      this.$emit('edit', item)
    },
    handleDelete () {
      const resourceType = this.resourceType
      const selected = this.selected
      const length = selected.length
      if (length === 0) {
        return this.$message({
          type: 'error',
          message: '未选中记录'
        })
      }
      if (resourceType === 'tabInfo') {
        const thirdPartTab = selected.find(item => item.tabType === 4)
        if (thirdPartTab) {
          return this.$message({
            type: 'error',
            message: `${thirdPartTab.tabName} 为第三方版面，不能删除`
          })
        }
      }
      this.$confirm('确认要删除选中对记录？')
        .then(() => {
          this.$emit('delete', selected)
        })
        .catch(() => {})
    },
    handleCopy (row) {
      const resourceType = this.resourceType
      if (resourceType === 'tabInfo') {
        if (row.tabType === 4) {
          return this.$message({
            type: 'error',
            message: '第三方版面不能复制'
          })
        }
      }
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
    clearSelected () {
      this.selected = []
      this.table.selected = []
      this.updateTableSelected()
    }
  }
}
