<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <div class="el-row">
        <el-form ref="filterForm" :rules="filterFormRules" :model="filter" inline label-width="90px" >
          <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-select
                placeholder="来源"
                clearable
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.key"
                  :label="item.typeName"
                  :value="item.key"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="handleFilterChange">查询</el-button>
            <el-button  @click="handleFilterReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog
        :title='dialogTitle'
        :visible.sync = 'dialogEditFormVisible'
        width = '650px'
      >
        <EditPop></EditPop>
      </el-dialog>
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
import BaseList from '@/components/BaseList'
import { cloneDeep } from 'lodash'
import EditPop from './edit'
export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table,
    EditPop
  },

  data () {
    return {
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      pagination: {
        currentPage: 1
      },
      table: {
        props: {},
        data: [],
        header: [
          {
            prop: 'tabId',
            label: '来源ID',
            width: 120,
            sortable: true
          },
          {
            prop: 'auditor',
            label: '来源名称',
            sortable: true,
            width: 180
          },
          {
            prop: 'auditor',
            label: '关联应用',
            sortable: true,
            width: 160
          },
          {
            prop: 'auditor',
            label: '图片',
            sortable: true,
            width: 240
          },
          {
            prop: 'auditor',
            label: '操作用户',
            width: 140,
            sortable: true
          },
          {
            prop: 'lastUpdateDate',
            label: '操作时间',
            width: 180,
            sortable: true
          },
          {
            label: '操作',
            width: 160,
            fixed: 'right',
            render: this.operation(this)
          }
        ]
      },
      filterFormRules: {
        tabId: [
          {
            validator (rule, value, cb) {
              if (value && !/^\d+$/.test(value)) {
                return cb(Error('请输入数字'))
              }
              cb()
            }
          }
        ]
      },
      dialogEditFormVisible: false,
      dialogTitle: '当前来源:xxxx',
      typeOptions: [
        { key: '1', typeName: '财务' },
        { key: '2', typeName: '儿童' },
        { key: '3', typeName: '参考' },
        { key: '4', typeName: '工具' },
        { key: '5', typeName: '购物' }
      ]
    }
  },

  methods: {
    genDefaultFilter () {
      return {
        tabType: 3,
        tabId: undefined,
        tabName: undefined,
        tabStatus: undefined,
        'filmDetailPageInfo.source': undefined,
        'filmDetailPageInfo.channel': [],
        'filmDetailPageInfo.category': undefined,
        'filmDetailPageInfo.product': undefined,
        'filmDetailPageInfo.matchType': undefined,
        'filmDetailPageInfo.videoId': undefined
      }
    },
    /**
     * 获取数据
     */
    fetchData () {
      const filter = this.parseFilter()
      this.$service.tabInfoList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter () {
      const { pagination } = this
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange () {
      this.$refs.filterForm.validate((valid) => {
        if (valid) {
          this.pagination.currentPage = 1
          this.efficientFilter = cloneDeep(this.filter)
          this.fetchData()
        }
      })
    },
    handleFilterReset () {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    // 编辑
    handleEdit () {
      this.dialogEditFormVisible = true
    },
    // 列表操作
    operation (obj) {
      return (h, { row }) => {
        let btn1 = h('el-button',
          {
            props: {
              type: 'text'
            },
            on: {
              click: () => {
                obj.handleEdit(row)
              }
            }
          },
          '编辑'
        )
        return [btn1]
      }
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style lang='stylus' scoped>
.content >>> .el-form-item__content
                width: 100%
                .el-select,.el-cascader
                   width 100%
.content >>> .el-form--inline .el-form-item {
           margin-right: 0px;
}
.content >>> .filter-item
  justify-content: flex-start;
  margin: 10px 0px

</style>
