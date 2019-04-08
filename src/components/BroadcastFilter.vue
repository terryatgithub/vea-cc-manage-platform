<template>
  <ContentWrapper
    :filter="filter"
    :filterSchema="filterSchema"
    :pagination="pagination"
    @filter-change="handleFilterChange"
    @filter-reset="handleFilterReset"
  >
    <Table
      :props="table.props"
      :header="table.header"
      :data="table.data"
      :selected="table.selected"
      :selection-type="table.selectionType"
      @row-selection-change="handleRowChange"
    />
  </ContentWrapper>
</template>

<script>
import _ from 'gateschema'
import { RemoteSelect, ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    RemoteSelect,
    ContentWrapper,
    Table
  },

  data() {
    return {
      filter: {
        resType: 'operation',
        dataType: 'rotate',
        levelType: 'rotateSta',
        callback: 'result',
        page: 1,
        rows: 10
      },
      filterSchema: null,
      pagination: {},
      selected: null,
      table: {
        props: {},
        header: [
          {
            label: '轮播入口ID',
            prop: 'id',
            sortable: true
          },
          {
            label: '轮播入口名称',
            prop: 'title'
          }
        ],
        data: [],
        selected: {},
        selectionType: 'single'
      }
    }
  },

  watch: {
    selected: function(value) {
      this.$emit('input', value)
    }
  },

  methods: {
    fetchData: function() {
      const filter = this.parseFilter()
      this.$service.getMediaVideoInfos(filter).then(result => {
        let data = JSON.parse(result.slice(7, -1))
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter () {
      const { filter, pagination } = this
      filter.code = filter.id
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterReset () {
      this.filter= {
        resType: 'operation',
        dataType: 'rotate',
        levelType: 'rotateSta',
        callback: 'result',
        page: 1,
        rows: 10
      },
      this.fetchData()
    },
    handleFilterChange (type) {
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    // table操作
    handleRowChange(row, index) {
      this.table.selected = index
      this.selected = row
    }
  },
  created() {
    let filterSchema = _.map({
      id: _.o.number.other('form', {
        component: 'Input',
        placeholder: '轮播入口ID',
        label: '轮播入口ID',
        cols: {
          item: 3,
          label: 0
        }
      }),
      title: _.o.string.other('form', {
        component: 'Input',
        placeholder: '轮播入口名称',
        label: '轮播入口名称',
        cols: {
          item: 3,
          label: 0
        }
      })
    })
    .other('form', {
        layout: 'inline',
        footer: {
          cols: {
            label: 0,
            wrapper: 24
          },
          showSubmit: true,
          submitText: '查询',
          showReset: true,
          resetText: '重置',
        }
      })
    this.filterSchema = filterSchema
    this.fetchData()
  }
}
</script>

<style lang='stylus' scoped>
</style>