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
        <el-button type="primary" icon="el-icon-plus" @click="addBroadcastBlock">新增</el-button>
      </div>

      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
      >

      </Table>
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import _ from 'gateschema'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
const statusOption = { '待审核': 3, '审核通过': 4, '审核不通过': 5 }
export default {
  components: {
    ContentWrapper,
    Table
  },

  data () {
    return {
      filter: {},
      filterSchema: null,
      pagination: {},
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            width: 100,
            prop: 'id'
          },
          {
            label: '轮播时间',
            width: 200,
            prop: 'containerName'
          },
          {
            label: '状态',
            width: 120,
            prop: 'status'
          },
          {
            label: '更新时间',
            width: 200,
            prop: 'lastUpdateDate'
          },
          {
            label: '操作',
            width: '150',
            render: utils.component.createOperationRender(this, {
              editData: '编辑'
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
    fetchData() {
      const filter = this.parseFilter()
      this.$service.broadcastBlockPageList(filter).then(data => {
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
    handleFilterChange(type) {
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.fetchData()
    },
    addBroadcastBlock() {

    }
  },
  created() {
    let filterSchema = _.map({
      id: _.o.number.other('form', {
        component: 'Input',
        placeholder: '推荐位ID'
      }),
      containerName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '推荐位名称'
      }),
      status: _.o.enum(statusOption).other('form', {
        component: 'Select',
        placeholder: '请选择'
      })
    }).other('form', {
      layout: 'inline',
      cols: {
        label: 0,
        item: 3,
        wrapper: 24
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
.btns
  margin-bottom 10px
.content >>> .content-list .filter-form .el-form
  justify-content flex-start
  margin-left 5px
</style>