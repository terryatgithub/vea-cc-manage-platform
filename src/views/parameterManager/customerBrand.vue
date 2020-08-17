<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <div class="el-row">
      <el-form ref="filterForm" :rules="filterFormRules" :model="filter" inline label-width="90px" >
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="请选择客户"
              v-model="filter['customerName']"
              clearable
              @change='selectCustomer(filter.customerName)'
            >
              <el-option
                v-for="item in customerOptions"
                :key="item.customerId"
                :label="item.customerName"
                :value="item.customerName"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="请选择品牌"
              v-model="filter['brandName']"
              clearable
              @change='selectBrand(filter.brandName)'
            >
              <el-option
                v-for="item in brandOptions"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandName"
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
      <el-button
        class="filter-item"
        style="margin-buttom: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-dialog
        title='新增'
        center
        :visible.sync = 'dialogEditFormVisible'
        width = '450px'
      >
        <EditPop :dialogType = 'dialogType' @close = 'close' @fetchData = 'fetchData'></EditPop>
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
      customerOptions: [],
      brandOptions: [],
      table: {
        props: {},
        data: [],
        header: [
          {
            prop: 'brandId',
            label: 'brandId',
            sortable: true,
            width: 120
          },
          {
            prop: 'customerName',
            label: '客户',
            sortable: true
          },
          {
            prop: 'brandName',
            label: '品牌',
            sortable: true
          },
          {
            prop: 'creator',
            label: '操作用户',
            sortable: true
          },
          {
            prop: 'updateTime',
            label: '操作时间',
            sortable: true
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
      dialogType: 'brand'
    }
  },

  methods: {
    genDefaultFilter () {
      return {
        brandId: undefined,
        customerId: undefined
      }
    },
    /**
     * 获取数据
     */
    fetchData () {
      const filter = this.parseFilter()
      this.$service.queryBrandListPage(filter).then(data => {
        if (data.code === 0) {
          this.pagination.total = data.data.total
          this.table.data = data.data.results
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
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
      this.getMediaResourceInfo()
    },
    // 客户品牌联动
    selectCustomer (val) {
      this.$service.queryCustomerBrandsList({ customerName: val, brandName: '' }).then(data => {
        if (data.code === 0) {
          this.brandOptions = data.data.brandList
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    selectBrand (val) {
      this.$service.queryCustomerBrandsList({ customerName: '', brandName: val }).then(data => {
        if (data.code === 0) {
          this.customerOptions = data.data.customerList
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    customerBrand (parameter) {
      this.$service.queryCustomerBrandsList(parameter).then(data => {
        if (data.code === 0) {
          this.customerOptions = data.data.customerList
          this.brandOptions = data.data.brandList
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 获取查询条件
    getMediaResourceInfo () {
      this.customerBrand({ customerName: '', brandName: '' })
    },
    // 新增
    handleCreate () {
      this.dialogEditFormVisible = true
    },
    // 关闭弹窗
    close () {
      this.dialogEditFormVisible = false
    }
  },
  created () {
    this.getMediaResourceInfo()
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
<style lang="scss">
.el-select-dropdown {
  max-width: 270px
}
</style>
