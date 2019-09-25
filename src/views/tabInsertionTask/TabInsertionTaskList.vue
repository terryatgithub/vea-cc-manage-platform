<template>
  <ContentCard>
    <ListLayout
      :pagination="pagination">
      <ActionList 
        slot="actions" 
        @create="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete"
       />
      <Table
        slot="table"
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        :select-on-row-click="true"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange" />
    </ListLayout>
  </ContentCard>
</template>
<script>
import { components } from 'admin-base'
import { Table } from 'admin-toolkit'
import ListLayout from '@/components/ListLayout'
import ActionList from '@/components/ActionList'
export default {
  extends: components.ResourceBaseList,
  components: {
    Table,
    ActionList,
    ListLayout
  },
  data() {
    return {
      selected: [],
      table: {
        props: {},
        selected: [],
        selectionType: 'multiple',
        header: [
          {
            prop: 'source',
            label: '内容源'
          },
          {
            prop: 'taskName',
            label: '任务名称'
          },
          {
            prop: 'tabId',
            label: '版面'
          },
          {
            prop: 'insertIndex',
            label: '强插位置'
          },
        ],
        data: [
        ]
      },
      pagination: {
        currentPage: 1,
        total: 0
      }
    }
  },
  methods: {
    fetchData() {
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
