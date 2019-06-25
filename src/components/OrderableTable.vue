<template>
  <Table
    style="margin-top: 10px"
    :data="value"
    :header="tableHeader"
    :props="{border: true}"
    selectionType="none"
  />
</template>
<script>
import { Table } from 'admin-toolkit'
import InputOrder from '@/components/InputOrder'
export default {
  data() {
    return {
      table: {
        props: {
          border: true
        }
      }
    }
  },
  components: {
    Table,
    InputOrder
  },
  computed: {
    tableHeader() {
      const header = (this.header || []).slice()
      const orderHeader = {
        label: '排序',
        width: 100,
        render: (h, { $index }) => {
          if (this.readonly) {
            return $index + 1
          }
          return h(InputOrder, {
            key: $index + Math.random().toString(),
            props: {
              value: $index + 1
            },
            on: {
              input: (order) => {
                this.handleChangeOrder($index, order)
              }
            }
          })
        }
      }
      const actionHeader = {
        label: '操作',
        width: 80,
        render: (h, { $index, row }) => {
          return h('el-button', {
            props: {
              type: 'text'
            },
            on: {
              click: () => {
                this.handleRemoveRow($index)
              }
            }
          }, '删除')
        }
      }
      header.unshift(orderHeader)
      if (!this.hideAction) {
        header.push(actionHeader)
      }
      return header
    }
  },
  props: ['value', 'header', 'hideAction', 'readonly'],
  methods: {
    handleChangeOrder(index, order) {
      const dataList = this.value
      if (order > dataList.length) {
        order = dataList.length
      }
      const newIndex = order - 1
      const oldIndex = index
      const item = dataList[oldIndex]
      dataList.splice(oldIndex, 1)
      this.$emit('input', [].concat(dataList.slice(0, newIndex), item, dataList.slice(newIndex)))
    },
    handleRemoveRow(index) {
      const value = this.value.slice()
      value.splice(index, 1)
      this.$emit('input', value)
    },
    handleAppendData(data, idField) {
      const originSelectedList = this.value
      const selectedList = data
      const selectedListIndexed = data.reduce(function(result, item, index) {
        result[item[idField]] = index
        return result
      }, {})
      let newList = []
      originSelectedList.forEach(function(item) {
        const index = selectedListIndexed[item[idField]]
        if (index !== undefined) {
          newList.push(item)
          selectedList[index] = undefined
        }
      })
      this.$emit('input', newList.concat(selectedList.filter(function(item) { return item })))
    }
  }
}
</script>

<style>

</style>
