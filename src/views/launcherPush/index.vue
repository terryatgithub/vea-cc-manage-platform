<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <div class="el-row">
      <el-form ref="filterForm" :rules="filterFormRules" :model="filter" inline label-width="90px" >
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="品牌"
              clearable
              v-model="filter['brandName']"
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
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="客户"
              clearable
              v-model="filter['customer']"
              @change='selectCustomer(filter.customer)'
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
              placeholder="机芯"
              clearable
              v-model="filter['chip']"
              @change='selectChip(filter.chip)'
            >
              <el-option
                v-for="item in chipOptions"
                :key="item.chip"
                :label="item.chip"
                :value="item.chip"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="机型"
              clearable
              v-model="filter['model']"
              @change='selectModel(filter.model)'
            >
              <el-option
                v-for="item in modelOptions"
                :key="item.model"
                :label="item.model"
                :value="item.model"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-cascader
              placeholder="国家"
              v-model="filter['countryName']"
              :options="countryOptions"
              expand-trigger="hover"
              clearable
              @change="handleChannelChange"
            />
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="版本"
              clearable
              v-model="filter['supportVersion']"
            >
              <el-option
                v-for="item in versionOptions"
                :key="item.versionId"
                :label="item.supportVersion"
                :value="item.supportVersion"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="状态"
              clearable
              v-model="filter['releaseStatus']"
            >
              <el-option value="0" label="未推送"/>
              <el-option value="1" label="推送中"/>
              <el-option value="2" label="已取消"/>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-input placeholder="策略名称" clearable v-model="filter['releaseConfName']" maxlength="99"/>
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-input placeholder="区域名" clearable v-model="filter['ctmDevCtrName']" maxlength="99"/>
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
        title='区域信息'
        :visible.sync = 'dialogFormVisible'
        width = '550px'
        :close-on-click-modal = 'false'
        :show-close = 'showClose'
        v-if = 'dialogFormVisible'
      >
        <RegionDetail :id = 'risId'></RegionDetail>
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
import RegionDetail from '@/components/liteOS/regionDetail2'
import liteOS from '@/assets/liteOS.js'
export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    RegionDetail,
    Table
  },
  watch: {
    $route () { // 监听路由跳转后刷新列表数据
      // this.fetchData()
    }
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
            prop: 'releaseConfId',
            label: '策略ID',
            sortable: true,
            width: 100
          },
          {
            prop: 'releaseConfName',
            label: '策略名称',
            sortable: true,
            width: 100
          },
          {
            prop: 'ctmDevCtrName',
            label: '区域名',
            sortable: true,
            width: 180
          },
          {
            prop: 'ctmDevCtrId',
            label: '区域详情',
            sortable: true,
            width: 100,
            align: 'center',
            render: (h, { row }) => {
              return h('i', {
                attrs: {
                  class: 'el-icon-view',
                  style: 'font-size: 20px; cursor: pointer;'
                },
                on: {
                  click: () => {
                    this.handleDetail(row.ctmDevCtrId)
                  }
                }
              })
            }
          },
          {
            prop: 'priority',
            label: '优先级',
            sortable: true,
            width: 100
          },
          {
            prop: 'supportVersion',
            label: '支持版本',
            sortable: true,
            width: 140
          },
          {
            prop: 'releaseStatus',
            label: '状态',
            sortable: true,
            width: 100,
            render: (h, { row }) => {
              if (row.releaseStatus === 0) {
                return '未推送'
              } else if (row.releaseStatus === 1) {
                return '推送中'
              } else if (row.releaseStatus === 2) {
                return '已取消'
              }
            }
          },
          {
            prop: 'releaseStartTime',
            label: '发布开始时间',
            sortable: true,
            width: 180
          },
          {
            prop: 'releaseEndTime',
            label: '发布结束时间',
            sortable: true,
            width: 180
          },
          {
            prop: 'creator',
            label: '操作用户',
            sortable: true,
            width: 100
          },
          {
            prop: 'lastUpdateTime',
            label: '最近上线时间',
            sortable: true,
            width: 180
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
      countryOptions: [],
      chipOptions: [],
      modelOptions: [],
      customerOptions: [],
      brandOptions: [],
      versionOptions: [],
      typeOptions: [
        { key: '1', typeName: '财务' },
        { key: '2', typeName: '儿童' },
        { key: '3', typeName: '参考' },
        { key: '4', typeName: '工具' },
        { key: '5', typeName: '购物' }
      ],
      dialogFormVisible: false,
      risId: ''
    }
  },

  methods: {
    genDefaultFilter () {
      return {
        brandName: undefined,
        customer: undefined,
        chip: undefined,
        model: undefined,
        countryName: undefined,
        supportVersion: undefined,
        releaseStatus: undefined,
        releaseConfName: undefined,
        ctmDevCtrName: undefined,
      }
    },
    /**
     * 获取数据
     */
    fetchData () {
      const filter = this.parseFilter()
      if (filter.countryName) {
        filter.countryName = filter.countryName.join('/')
      }
      this.$service.queryLauncherPushListPage(filter).then(data => {
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
    // 机芯机型联动
    selectChip (val) {
      this.$service.queryModelChipList({ chip: val, model: '' }).then(data => {
        if (data.code === 0) {
          if (this.filter.model) {
            this.modelOptions = data.data.modelList
          } else {
            this.chipOptions = data.data.chipList
            this.modelOptions = data.data.modelList
          }
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    selectModel (val) {
      this.$service.queryModelChipList({ chip: '', model: val }).then(data => {
        if (data.code === 0) {
          if (this.filter.chip) {
            this.chipOptions = data.data.chipList
          } else {
            this.chipOptions = data.data.chipList
            this.modelOptions = data.data.modelList
          }
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    chipModel (parameter) {
      this.$service.queryModelChipList(parameter).then(data => {
        if (data.code === 0) {
          this.chipOptions = data.data.chipList
          this.modelOptions = data.data.modelList
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 客户品牌联动
    selectCustomer (val) {
      this.$service.queryCustomerBrandsList({ customerName: val, brandName: '' }).then(data => {
        if (data.code === 0) {
          // if (this.filter.brandName) {
          this.brandOptions = data.data.brandList
          // } else {
          //   this.customerOptions = data.data.customerList
          //   this.brandOptions = data.data.brandList
          // }
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
          // if (this.filter.customer) {
          this.customerOptions = data.data.customerList
          // } else {
          //   this.customerOptions = data.data.customerList
          //   this.brandOptions = data.data.brandList
          // }
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
      this.$service.queryAreaCountryListAll().then(data => {
        if (data.code === 0) {
          this.countryOptions = liteOS.areaTransform(data.data)
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
      this.$service.queryVersionList({ version: '' }).then(data => {
        if (data.code === 0) {
          this.versionOptions = data.data
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
      this.chipModel({ chip: '', model: '' })
      this.customerBrand({ customerName: '', brandName: '' })
    },
    // 新增
    handleCreate () {
      this.$router.push({
        path: 'launcherEdit'
      })
    },
    // 区域详情
    handleDetail (val) {
      this.dialogFormVisible = true
      this.risId = val
    },
    // 发布上线
    handleUp (row) {
      this.$confirm('确认发布上线?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          releaseConfId: row.releaseConfId,
          releaseStatus: '1',
          creator: '管理员'
        }
        this.$service.updateLauncherPushStatus(params).then(data => {
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '发布成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            })
          }
          this.fetchData()
        })
      }).catch(() => {})
    },
    // 取消发布
    handleOff (row) {
      this.$confirm('确认取消发布?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          releaseConfId: row.releaseConfId,
          releaseStatus: '2',
          creator: '管理员'
        }
        this.$service.updateLauncherPushStatus(params).then(data => {
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '取消成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            })
          }
          this.fetchData()
        })
      }).catch(() => {})
    },
    // 复制
    handleCopy (row) {
      // this.$confirm('确认复制该策略?', '提示', {
      //   confirmButtonText: '确认',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(async () => {
      //   this.$message({
      //     type: 'success',
      //     message: '复制成功'
      //   })
      // }).catch(() => {})
      this.$router.push({
        path: 'launcherEdit',
        query: {
          releaseConfId: row.releaseConfId,
          handleType: 'copy'
        }
      })
    },
    // 编辑
    handleEdit (row) {
      this.$router.push({
        path: 'launcherEdit',
        query: {
          releaseConfId: row.releaseConfId,
          handleType: 'edit'
        }
      })
    },
    // 删除
    handleDel (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          releaseConfId: row.releaseConfId,
          creator: '管理员'
        }
        this.$service.deleteLauncherPushManage(params).then(data => {
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            })
          }
          this.fetchData()
        })
      }).catch(() => {})
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
                obj.handleUp(row)
              }
            }
          },
          '发布上线'
        )
        let btn2 = h('el-button',
          {
            props: {
              type: 'text'
            },
            on: {
              click: () => {
                obj.handleOff(row)
              }
            }
          },
          '取消发布'
        )
        let btn3 = h('el-button',
          {
            props: {
              type: 'text'
            },
            on: {
              click: () => {
                obj.handleCopy(row)
              }
            }
          },
          '复制'
        )
        let btn4 = h('el-button',
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
        let btn5 = h('el-button',
          {
            props: {
              type: 'text'
            },
            on: {
              click: () => {
                obj.handleDel(row)
              }
            }
          },
          '删除'
        )
        if (row.releaseStatus === 0) {
          return [btn1, btn3, btn4, btn5]
        } else if (row.releaseStatus === 1) {
          return [btn2, btn3]
        } else if (row.releaseStatus === 2) {
          return [btn1, btn3, btn4, btn5]
        }
      }
    }
  },
  created () {
    this.getMediaResourceInfo()
    this.fetchData()
  },
  activated () {
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
