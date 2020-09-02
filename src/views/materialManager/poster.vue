<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <div class="el-row">
      <el-form ref="filterForm" :rules="filterFormRules" :model="filter" inline label-width="90px">
        <el-form-item label="海报名">
          <div>
            <el-input placeholder="海报名" clearable v-model="filter['materialName']" maxlength="99"/>
          </div>
        </el-form-item>
        <!-- <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="尺寸类型"
              clearable
              v-model="filter['sizeType']"
            >
              <el-option value="1" label="400*400"/>
              <el-option value="2" label="400*900"/>
              <el-option value="3" label="900*1600"/>
            </el-select>
          </div>
        </el-form-item> -->
        <el-form-item label="状态">
          <div>
            <el-select
              placeholder="状态"
              clearable
              v-model="filter['materialState']"
            >
              <el-option value="0" label="失效"/>
              <el-option value="1" label="有效"/>
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
        width = '550px'
        @close = 'close'
      >
        <EditPop :dialogType = 'dialogType' :materialId = 'materialId' @close = 'close' @fetchData = 'fetchData' ref='dialogEdit'></EditPop>
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
            prop: 'materialId',
            label: '海报ID',
            width: 100,
            sortable: true
          },
          {
            prop: 'materialName',
            label: '海报名',
            sortable: true
          },
          {
            prop: 'materialPosterPic',
            label: '海报图',
            sortable: true,
            render: (h, { row }) => {
              return h('img', {
                attrs: {
                  src: row.materialPosterPic,
                  style: 'width:110px; height: 80px'
                }
              })
            }
          },
          // {
          //   prop: 'sizeType',
          //   label: '尺寸类型',
          //   width: 120,
          //   sortable: true
          // },
          {
            prop: 'materialState',
            label: '状态',
            width: 120,
            sortable: true,
            render: (h, { row }) => {
              // if (!this.canEdit) {
              //   return row.seq
              // }
              return h('el-switch', {
                props: {
                  value: row.materialState === 1
                }
                // on: {
                //   input: value => {
                //     row.seq = value
                //   },
                //   blur: () => {
                //     this.$service.updateSeq({ id: row.roleId, seq: row.seq })
                //   }
                // }
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
      dialogTitle: '新增',
      dialogType: '',
      materialId: 0
    }
  },

  methods: {
    genDefaultFilter () {
      return {
        materialName: undefined,
        sizeType: undefined,
        materialState: undefined
      }
    },
    /**
     * 获取数据
     */
    fetchData () {
      const filter = this.parseFilter()
      this.$service.queryPosterManageListPage(filter).then(data => {
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
    // 关闭弹窗
    close () {
      this.dialogEditFormVisible = false
      this.materialId = 0
      this.$refs['dialogEdit'].$refs['posterForm'].clearValidate()
      this.$refs['dialogEdit'].$refs['posterForm'].resetFields()
    },
    // 新增
    handleCreate () {
      this.dialogEditFormVisible = true
      this.dialogTitle = '新增'
      this.dialogType = 'posterCreate'
      this.materialId = 0
    },
    // 编辑
    handleEdit (row) {
      this.dialogEditFormVisible = true
      this.dialogTitle = '编辑'
      this.dialogType = 'posterEdit'
      this.materialId = row.materialId
    },
    // 删除
    handleDel (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          materialId: row.materialId,
          creator: '管理员'
        }
        this.$service.deletePosterManage(params).then(data => {
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
