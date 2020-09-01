<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <div class="el-row">
      <el-form ref="filterForm" :rules="filterFormRules" :model="filter" inline label-width="90px">
        <el-form-item label="区域名">
          <div>
            <el-input
              placeholder="区域名"
              v-model="filter['areaName']"
              clearable
              maxlength="99"
            />
          </div>
        </el-form-item>
        <el-form-item label="客户&品牌">
          <div>
            <el-cascader
              placeholder="客户&品牌"
              v-model="filter['brandName']"
              :options="userOptions"
              expand-trigger="hover"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="机芯&机型">
          <div>
            <el-cascader
              placeholder="机芯&机型"
              v-model="filter['device']"
              :options="chipModelOptions"
              expand-trigger="hover"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="国家">
          <div>
            <el-cascader
              placeholder="国家"
              v-model="filter['countryName']"
              :options="areaOptions"
              expand-trigger="hover"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <div>
            <el-select
              v-model="filter['state']"
              placeholder="状态"
              clearable
            >
              <el-option value="1" label="生效"/>
              <el-option value="0" label="失效"/>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item class="btnBox">
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
        :title='dialogTitle'
        center
        :close-on-click-modal = 'false'
        :visible.sync = 'dialogEditFormVisible'
        v-if = 'dialogEditFormVisible'
        width = '450px'
        @close = 'close'
      >
        <EditPop :rlsId = 'rlsId' @close = 'close' @fetchData = 'fetchData' ref = 'dialogEdit'></EditPop>
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
import liteOS from '@/assets/liteOS.js'
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
      userOptions: [],
      chipModelOptions: [],
      areaOptions: [],
      table: {
        props: {},
        data: [],
        header: [
          {
            prop: 'rlsId',
            label: '区域ID',
            sortable: true,
            width: 120
          },
          {
            prop: 'ctmDevCtrName',
            label: '区域名',
            sortable: true
          },
          {
            prop: 'devices',
            label: '机芯&机型',
            sortable: true
          },
          {
            prop: 'countryNames',
            label: '国家',
            sortable: true,
            width: 200
          },
          {
            prop: 'state',
            label: '状态',
            sortable: true,
            width: 100,
            render: (h, { row }) => {
              return h('el-switch', {
                props: {
                  value: row.state === '1'
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
            prop: 'updateTime',
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
      dialogTitle: '新增',
      rlsId: '0',
      list: [
        {
          label: '北京市',
          value: 11,
          children: [
            {
              label: '北京市',
              value: 21,
            }
          ]
        },
        {
          label: '上海市',
          value: 12,
          children: [
            {
              label: '上海市',
              value: 22,
            }
          ]
        },
        {
          label: '深圳市',
          value: 13,
          children: [
            {
              label: '深圳市',
              value: 23,
            }
          ]
        }
      ]
    }
  },

  methods: {
    genDefaultFilter () {
      return {
        areaName: undefined,
        brandName: undefined,
        device: undefined,
        countryName: undefined,
        state: undefined
      }
    },
    /**
     * 获取数据
     */
    fetchData () {
      const filter = this.parseFilter()
      if (filter.brandName) {
        filter.brandName = filter.brandName.join('/')
      }
      if (filter.device) {
        filter.device = filter.device.join('/')
      }
      if (filter.countryName) {
        filter.countryName = filter.countryName.join('/')
      }
      this.$service.queryAreaManageListPage(filter).then(data => {
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
    },
    // 下拉框选择
    // brandNameSel (val) {
    //   debugger
    // },
    // deviceSel (val) {
    //   filter['device'] = val.join('/')
    // },
    // countryNameSel (val) {

    // },
    // 获取查询条件
    getMediaResourceInfo () {
      this.$service.queryCustomerListAllContainBrands().then(data => {
        if (data.code === 0) {
          this.userOptions = liteOS.userTransform(data.data)
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
      this.$service.queryChipAllContainModels().then(data => {
        if (data.code === 0) {
          this.chipModelOptions = liteOS.chipModelTransform(data.data)
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
      this.$service.queryAreaCountryListAll().then(data => {
        if (data.code === 0) {
          this.areaOptions = liteOS.areaTransform(data.data)
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 关闭弹窗
    close () {
      this.dialogEditFormVisible = false
      this.rlsId = '0'
      this.$refs['dialogEdit'].$refs['regionForm'].clearValidate()
      this.$refs['dialogEdit'].$refs['regionForm'].resetFields()
    },
    // 新增
    handleCreate () {
      this.dialogEditFormVisible = true
      this.dialogTitle = '新增'
      this.rlsId = '0'
    },
    // 编辑
    handleEdit (row) {
      this.rlsId = row.rlsId
      this.dialogEditFormVisible = true
      this.dialogTitle = '编辑'
    },
    // 删除
    handleDel (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          rlsId: row.rlsId,
          creator: '管理员'
        }
        this.$service.deleteAreaManage(params).then(data => {
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
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
                obj.handleEdit(row)
              }
            }
          },
          '编辑'
        )
        let btn2 = h('el-button',
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
        return [btn1, btn2]
      }
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
