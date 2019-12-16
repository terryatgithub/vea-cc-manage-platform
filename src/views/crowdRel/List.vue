<template>
  <ContentCard class="content">
    <ContentWrapper
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >

      <div style="margin:10px 0">
        <el-button type="primary" @click="handleCreate">新建</el-button>
        <el-button type="success" @click="handleEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>

      <Table
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
import { ContentWrapper, Table } from 'admin-toolkit'
import BaseList from '@/components/BaseList'
export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper
  },
  data () {
    return {
      resourceType: 'crowdRel',
      filter: {},
      filterSchema: null,
      pagination: {
        currentPage: 1,
        pageSize: 20
      },
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: '策略ID',
            prop: 'policyId'
          },
          {
            label: '策略名',
            prop: 'policyName'
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    fetchData () {
      const filter = this.parseFilter()
      this.$service.crowdRelList(filter).then(data => {
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
    // 查询
    handleFilterChange (type, filter) {
      if (filter) {
        this.filter = filter
      }
      if (this.$validateId(this.filter.pannelId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData()
      }
    },
    // 重置
    handleFilterReset () {
      this.filter = {}
      this.pagination.currentPage = 1
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style lang='stylus' scoped>
.btns {
  margin-bottom: 10px;
}
</style>
