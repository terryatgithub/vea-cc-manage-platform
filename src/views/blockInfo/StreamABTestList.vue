<template>
     <ContentCard class="content">
        <ContentWrapper
        :filter="filter"
        @filter-change="fetchData"
        :pagination="pagination">
        <template>
            <el-button type="primary" @click="$emit('create')">创建AB实验</el-button>
        </template>
        <Table
            :props="table.props"
            :header="table.header"
            :data="table.data"
        />
        </ContentWrapper>
     </ContentCard>
</template>
<script>
import { ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper
  },
  data () {
    return {
      filter: this.genDefaultFilter(),
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      table: {
        prop: {},
        header: [
          {
            label: '实验ID',
            prop: 'ID'
          },
          {
            label: 'A版本',
            prop: 'VersionA'
          },
          {
            label: 'B版本',
            prop: 'VersionB'
          },
          {
            label: '开始时间',
            prop: 'BeginTime'
          },
          {
            label: '结束时间',
            prop: 'EndTime'
          },
          {
            label: '操作',
            fixed: 'right',
            width: 180,
            render: (h, { row }) => {
              return h('div', [
                h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleShowData(row)
                    }
                  }
                }, '数据'),
                (row.ending) && h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleOpenDialog(row)
                    }
                  }
                }, '结束')
              ])
            }
          }
        ]
      }
    }
  },
  methods: {
    genDefaultFilter () {
      return {
        page: 1,
        rows: 10
      }
    },
    fetchData () {
    //   const filter = this.parseFilter()
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
        filter.scene = this.activeName
      }
      return filter
    },
    handleShowData (row) {},
    handleOpenDialog (row) {
      this.$confirm('关闭AB测试后，将停止数据计算，不可再开启, 是否确认关闭?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
