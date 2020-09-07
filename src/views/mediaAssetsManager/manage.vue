<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <div class="el-row">
        <el-form ref="filterForm" :rules="filterFormRules" :model="filter" inline label-width="90px">
          <el-form-item label="来源">
            <div>
              <el-select
                placeholder="来源"
                clearable
                v-model = "filter['mediaSourceName']"
                @click.native='typeOptionsUpdata'
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.supplier"
                  :label="item.supplier"
                  :value="item.supplier"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item class="btnBox">
            <el-button type="primary"  @click="handleFilterChange">查询</el-button>
            <el-button  @click="handleFilterReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog
        :title='dialogTitle'
        :close-on-click-modal = 'false'
        :visible.sync = 'dialogEditFormVisible'
        width = '400px'
        @close = 'close'
        v-if = 'dialogEditFormVisible'
      >
        <EditPop
          ref = 'dialogEdit'
          :mediaSourceId = 'mediaSourceId'
          :mediaSourceName = 'mediaSourceName'
          :mediaSourcePic = 'mediaSourcePic'
          @close = 'close'
          @fetchData = 'fetchData'
        ></EditPop>
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
        currentPage: 1,
        pageSize: 10
      },
      table: {
        props: {},
        data: [],
        header: [
          {
            prop: 'mediaSourceId',
            label: '来源ID',
            width: 120,
            sortable: true
          },
          {
            prop: 'mediaSourceName',
            label: '来源名称',
            sortable: true
          },
          {
            prop: 'flag',
            label: '关联应用',
            sortable: true
          },
          {
            prop: 'mediaSourcePic',
            label: '图片',
            sortable: true,
            render: (h, { row }) => {
              return h('img', {
                attrs: {
                  src: row.mediaSourcePic,
                  style: 'width:110px; height: 80px'
                }
              })
            }
          },
          {
            prop: 'creator',
            label: '操作用户',
            sortable: true
          },
          {
            prop: 'lastUpdateTime',
            label: '操作时间',
            sortable: true
          },
          {
            label: '操作',
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
      dialogTitle: '关联图片',
      mediaSourceId: '',
      mediaSourceName: '',
      mediaSourcePic: '',
      typeOptions: []
    }
  },

  methods: {
    genDefaultFilter () {
      return {
        mediaSourceName: undefined
      }
    },
    /**
     * 获取数据
     */
    fetchData () {
      const filter = this.parseFilter()
      this.$service.querySourceListPage(filter).then(data => {
        this.pagination.total = data.data.total
        this.table.data = data.data.results
      })
    },
    parseFilter () {
      const { pagination } = this
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      if (pagination) {
        filter.page = pagination.currentPage
        filter.size = pagination.pageSize
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
    handleEdit (row) {
      this.mediaSourceId = row.mediaSourceId
      this.mediaSourceName = row.mediaSourceName
      this.mediaSourcePic = row.mediaSourcePic
      this.dialogEditFormVisible = true
    },
    // 关闭弹窗
    close () {
      this.dialogEditFormVisible = false
      this.$refs['dialogEdit'].$refs['formInline'].clearValidate()
      this.$refs['dialogEdit'].$refs['formInline'].resetFields()
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
          '关联图片'
        )
        return [btn1]
      }
    },
    // 下拉框每次更新数据
    typeOptionsUpdata () {
      this.$service.querySourceAll().then(data => {
        if (data.code === 0) {
          this.typeOptions = data.data
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 获取查询条件
    getMediaResourceInfo () {}
  },
  created () {
    this.getMediaResourceInfo()
    this.fetchData()
  }
}
</script>

<style lang='stylus' scoped>
.content >>> .el-form-item__content
                
                .el-select,.el-cascader
                   width 100%
.content >>> .el-form--inline .el-form-item {
           margin-right: 0px;
}
.content >>> .filter-item
  justify-content: flex-start;
  margin: 10px 0px

</style>
<style lang="scss">
.btnBox {
  margin-left: 15px;
  .el-form-item__content {
    width: 100%!important;
  }
}
</style>
