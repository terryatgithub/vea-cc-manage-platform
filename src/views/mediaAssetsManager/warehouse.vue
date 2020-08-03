<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <div class="el-row">
        <el-form ref="filterForm" :rules="filterFormRules" :model="filter" inline label-width="90px" >
          <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-input placeholder="媒资名称" clearable/>
            </div>
          </el-form-item>
          <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-select
                placeholder="状态"
                clearable
              >
                <el-option value="0" label="失效"/>
                <el-option value="1" label="有效"/>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-select
                placeholder="类型"
                clearable
              >
                <el-option value="1" label="Movies电影"/>
                <el-option value="2" label="TV Series电视剧"/>
                <el-option value="3" label="TV Variety Show综艺"/>
                <el-option value="4" label="Trailer预告片"/>
                <el-option value="5" label="Short Film短片"/>
                <el-option value="6" label="Live直播"/>
                <el-option value="7" label="Music Video音乐录像"/>
                <el-option value="8" label="Music Audio音频"/>
                <el-option value="9" label="Videos视频"/>
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
        center
        :visible.sync = 'dialogEditFormVisible'
        width = '550px'
      >
        <EditPop :dialogType = 'dialogType'></EditPop>
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
            label: '媒资ID',
            width: 120,
            sortable: true
          },
          {
            prop: 'tabName',
            label: '媒资名称',
            width: 300
          },
          {
            prop: 'modifierName',
            label: '类型',
            sortable: true,
            width: 160
          },
          {
            prop: 'auditor',
            label: '图片',
            sortable: true,
            width: 300
          },
          {
            prop: 'auditor',
            label: '来源',
            sortable: true,
            width: 160
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
      }
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
    // 查询
    handleFilterChange () {
      this.$refs.filterForm.validate((valid) => {
        if (valid) {
          this.pagination.currentPage = 1
          this.efficientFilter = cloneDeep(this.filter)
          this.fetchData()
        }
      })
    },
    // 重置
    handleFilterReset () {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    // 查看
    handleLook (row) {
      this.$router.push({
        path: 'mediaAssetsDetail',
        query: {
          id: row.tabId
        }
      })
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
                obj.handleLook(row)
              }
            }
          },
          '查看'
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
