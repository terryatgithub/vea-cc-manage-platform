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
        :cell-style="cellStyle"
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
      />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import { ContentWrapper, Table, utils } from 'admin-toolkit'
import _ from '../../utlis/gateschema'

export default {
  components: {
    ContentWrapper,
    Table
  },

  data () {
    return {
      filterSchema: null,
      filter: {
        sort: undefined,
        order: undefined
      },
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: '自增ID',
            prop: 'id',
            fit: true
          },
          {
            label: '操作者ID',
            prop: 'userId',
            fit: true
          },
          {
            label: '操作名称',
            prop: 'userName',
            fit: true
          },
          {
            label: '菜单名称',
            prop: 'menuName',
            fit: true
          },
          {
            label: '菜单Elid',
            prop: 'menuElid',
            fit: true
          },
          {
            label: '执行的方法',
            prop: 'execMethod',
            fit: true
          },
          {
            label: '操作的数据',
            prop: 'opData',
            fit: true,
            // render: utils.component.createOperationRender(this, {
            //   showOpData: 'data'
            // })
          },
          {
            label: '操作耗时',
            prop: 'elapsedTime',
            fit: true
          },
          {
            label: '操作时间',
            prop: 'createTime',
            fit: true
          },
          {
            label: '操作',
            width: '60',
            fixed: 'right',
            render: utils.component.createOperationRender(this, {
              editData: '复制'
            })
          }
        ],
        data: [],
        selected: [],
        selectionType: 'none'
      }
    };
  },

  methods: {
    /**
     * 获取数据
     */
    fetchData () {
      const filter = this.parseFilter()
      this.$service.sysLogOpPageList(filter).then(data => {
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
    // 表单重设
    handleFilterReset () {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.fetchData()
    },
    handleFilterChange (type) {
      if (type === 'filter') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    cellStyle (row) {
      return {
        'height': '50px'
      }
    }
  },
  created() {
    const filterSchema = _.map({
      id: _.o.number.other("form", {
        label: "自增ID"
      }),
      userId: _.o.number.other("form", {
        label: "操作者ID"
      }),
      userName: _.o.string.other("form", {
        label: "操作者名称"
      }),
      menuName: _.o.string.other("form", {
        label: "菜单名称"
      }),
      menuElid: _.o.string.other("form", {
        label: "菜单Elid"
      }),
      execMethod: _.o.string.other("form", {
        label: "执行的方法"
      }),
      opData: _.o.string.other("form", {
        label: "操作的数据"
      }),
      elapsedTime: _.o.number.other("form", {
        label: "操作耗时"
      }),
      createTime: _.o.string.other("form", {
        label: "操作时间"
      }),
    }).other("form", {
      cols: {
        item: 10,
        wrapper: 10,
        label: 3
      },
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

<style lang='stylus' scoped>
</style>