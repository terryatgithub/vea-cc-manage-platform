
<template>
  <ContentCard class="content">
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
         @row-click="rowClick"
        @row-selection-change="rowClick"
      />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import _ from 'gateschema'
import { ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper
  },
  data () {
    return {
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      selected: undefined,
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'commonOnclickId',
            width: '70'
          },
          {
            label: '点击事件名称',
            prop: 'onlickName'
          },
          {
            label: '备注',
            prop: 'remark'
          },
          {
            label: '修改人',
            prop: 'modifierName'
          },
          {
            label: '修改时间',
            prop: 'lastUpdateDate',
            width: '170'
          }
        ],
        data: [],
        selected: [],
        selectionType: 'single'
      }
    }
  },
  methods: {
    rowClick (params) {
      this.$emit('row-click', params)
    },
    /** 获取数据 */
    fetchData () {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.getClickData(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    handleRowSelectionAdd (targetItem) {
      this.selected.push(targetItem.commonOnclickId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.commonOnclickId
      })
      this.updateTableSelected()
    },
    // handleRowSelectionChange(value, index) {
    //   this.table.selected = index
    //     this.$emit('clcik',value)
    // },
    handleAllRowSelectionRemove () {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected () {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.commonOnclickId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    handleFilterChange (type, filter) {
      if (filter) { this.filter = filter }
      if (this.$validateId(this.filter.commonOnclickId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData()
      }
    },
    handleFilterReset () {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    }
  },
  created () {
    let filterSchema = _.map({
      commonOnclickId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID  '
      }),
      onlickName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '点击事件名称'
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
  }
}
</script>
<style lang = 'stylus' scoped>
.btns {
  margin-bottom: 10px;
}
</style>
