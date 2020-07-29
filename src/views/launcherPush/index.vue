<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <div class="el-row">
      <el-form ref="filterForm" :rules="filterFormRules" :model="filter" inline label-width="90px" >
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="机芯"
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
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="机型"
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
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-cascader
              placeholder="国家"
              v-model="filter['filmDetailPageInfo.channel']"
              :options="channelOptions"
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
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="品牌"
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
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              placeholder="客户"
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
        <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-input placeholder="策略名称" clearable/>
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
        :title='dialogTitle'
        center
        :visible.sync = 'dialogEditFormVisible'
        width = '450px'
      >
        <EditPop :type = 'type'></EditPop>
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
      channelOptions: [],
      table: {
        props: {},
        data: [],
        header: [
          {
            prop: 'tabId',
            label: 'Id',
            sortable: true,
            width: 80
          },
          {
            prop: 'auditor',
            label: '客户',
            sortable: true,
            width: 100
          },
          {
            prop: 'modifierName',
            label: '品牌',
            sortable: true,
            width: 100
          },
          {
            prop: 'auditor',
            label: '机芯',
            sortable: true,
            width: 100
          },
          {
            prop: 'modifierName',
            label: '机型',
            sortable: true,
            width: 100
          },
          {
            prop: 'modifierName',
            label: '国家',
            sortable: true,
            width: 120
          },
          {
            prop: 'auditor',
            label: '区域',
            sortable: true,
            width: 120
          },
          {
            prop: 'modifierName',
            label: '状态',
            sortable: true,
            width: 100
          },
          {
            prop: 'auditor',
            label: '操作用户',
            sortable: true
          },
          {
            prop: 'lastUpdateDate',
            label: '操作时间',
            sortable: true
          },
          {
            label: '操作',
            width: 120,
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
      type: 'brand',
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
      const channel = filter['filmDetailPageInfo.channel'][1]
      if (channel) {
        filter['filmDetailPageInfo.channel'] = channel
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
    // 获取查询条件
    getMediaResourceInfo () {
      return this.$service.getMediaResourceInfo().then(data => {
        var movieData = JSON.parse(decodeURI(data.slice(5, -1)))
        var videoItemModels = movieData.videoItemModels
        // 频道->爱奇艺channelOptions
        var channelQiyi = {
          label: '爱奇艺',
          value: 'iqiyi',
          children: []
        }
        channelQiyi.children = videoItemModels[0].categoryList.reduce(
          (result, item) => {
            return result.concat({
              label: item.category_name,
              value: item.cc_category_id
            })
          },
          []
        )
        var channelTent = {
          label: '腾讯',
          value: 'qq',
          children: []
        }
        channelTent.children = videoItemModels[1].categoryList.reduce(
          (result, item) => {
            return result.concat({
              label: item.category_name,
              value: item.cc_category_id
            })
          },
          []
        )
        var channelYouku = {
          label: '优酷',
          value: 'youku',
          children: []
        }
        channelYouku.children = videoItemModels[2].categoryList.reduce(
          (result, item) => {
            return result.concat({
              label: item.category_name,
              value: item.cc_category_id
            })
          },
          []
        )
        this.channelOptions.push(channelQiyi)
        this.channelOptions.push(channelTent)
        this.channelOptions.push(channelYouku)
      })
    },
    handleChannelChange (value) {
      this.filter['filmDetailPageInfo.source'] = value[0]
    },
    // 新增
    handleCreate () {
      this.dialogEditFormVisible = true
      this.dialogTitle = '新增'
    },
    // 编辑
    handleEdit () {
      this.dialogEditFormVisible = true
      this.dialogTitle = '编辑'
    },
    // 删除
    handleDel () {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$message({
          type: 'success',
          message: '删除成功'
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
    this.getMediaResourceInfo().then(() => {})
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
