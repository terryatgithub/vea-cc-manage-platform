<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="handleFilterChange">
      <!-- 筛选部分 -->
      <el-form inline ref="form" v-model="filter" label-width="90px" size="mini">
        <el-form-item label="版面ID">
          <el-input v-model="filter.tabId"/>
        </el-form-item>
        <el-form-item label="版面标题">
          <el-input v-model="filter.tabName"/>
        </el-form-item>
        <el-form-item label="版面属性">
          <el-select v-model="filter.tabType">
            <el-option value>请选择</el-option>
            <el-option
              v-for="(item, index) in tabTypeOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否二级tab">
          <el-select v-model="filter.hasSubTab">
            <el-option value>请选择</el-option>
            <el-option value="1">是</el-option>
            <el-option value="0">否</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务分类">
          <el-select v-model="filter.tabCategory">
            <el-option value>请选择</el-option>
            <el-option
              v-for="(item, index) in businessType"
              :key="index"
              :label="item.dictCnName"
              :value="item.dictId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="AppId">
          <el-select v-model="filter.tabAppid">
            <el-option value>请选择</el-option>
            <el-option
              v-for="item in appIdType"
              :key="item.dictEnName"
              :label="item.dictCnName"
              :value="item.dictEnName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filter.tabStatus">
            <el-option value>请选择</el-option>
            <el-option
              v-for="item in tabStatusOption"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilterChange">查询</el-button>
          <el-button icon="el-icon-delete" @click="handleFilterReset">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 筛选部分end -->
      <!-- <div class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addTabInfo">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchDel">批量删除</el-button>
      </div> -->
         <ButtonGroupForListPage 
        pageName='tab' 
        @add="addTabInfo"
        @edit="editData"
        @delete="batchDel"
        >
        </ButtonGroupForListPage>
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import { ContentWrapper, Table } from 'admin-toolkit'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
export default {
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage
  },

  data() {
    return {
      selected: [],
      tabTypeOption: [
        { label: '信号源版面', value: '5' },
        { label: '第三方版面', value: '4' },
        { label: '专题版面', value: '2' },
        { label: '普通版面', value: '1' }
      ],
      tabStatusOption: [
        { label: '下架', value: '0' },
        { label: '上架', value: '1' },
        { label: '草稿', value: '2' },
        { label: '待审核', value: '3' },
        { label: '审核通过', value: '4' },
        { label: '审核不通过', value: '5' }
      ],
      businessType: [],
      filter: {
        idPrefix: 10
      },
      appIdType: [],
      filterSchema: null,
      pagination: {
        currentPage: 1
      },
      table: {
        props: {},
        data: [],
        header: [
          {
            label: 'ID',
            prop: 'tabId'
          },
          {
            label: '名称',
            prop: 'tabName',
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.handleRead(row)
                    }
                  }
                },
                row.tabName
              )
            }
          },
          {
            label: '版面属性',
            prop: 'tabType',
            formatter: function(row) {
              const v = row.tabType
              return (
                {
                  '1': '普通版面',
                  '2': '专题版面',
                  '4': '第三方版面',
                  '5': '信号源版面'
                }[v + ''] || '未知版面'
              )
            }
          },
          {
            label: '业务分类',
            prop: 'businessCategoryName'
          },
          {
            label: '内容源',
            prop: 'tabResource',
            formatter: function(row) {
              const v = row.tabResource
              return (
                { o_tencent: '腾讯', o_iqiyi: '爱奇艺', o_voole: '优朋' }[
                  v + ''
                ] || ''
              )
            }
          },
          {
            label: 'AppId',
            prop: 'tabAppid',
            formatter: row => {
              return this.appIdType.map(item => {
                if (row.tabAppid.toString() === item.dictEnName) {
                  return item.dictCnName
                }
              })
            }
          },
          {
            label: '版本/状态',
            prop: 'tabStatus',
            formatter: row => {
              const status = row.tabStatus
              const currentVersion = row.currentVersion
              return (
                currentVersion +
                '/' +
                this.tabStatusOption
                  .map(function(item) {
                    if (status.toString() === item.value) {
                      return item.label
                    }
                  })
                  .join('')
              )
            }
          },
          {
            label: '待审核副本',
            prop: 'duplicateVersion'
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate'
          },
          {
            label: '审核人',
            prop: 'auditor'
          },
          {
            label: '更新人',
            prop: 'modifierName'
          },
          {
            label: '操作',
            prop: 'oper'
          }
        ],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },

  methods: {
    handleRead(row) {
      this.$emit('read', row)
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      this.$service.tabInfoList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange(type) {
      if (type !== 'pagination') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = {
        idPrefix: this.$consts.idPrefix
      }
      this.fetchData()
    },
    addTabInfo() {
      this.$emit('create')
    },
    editData() {
      const table = this.table
      const selected = this.table.selected
      const target = table.data[selected[0]]
      this.$emit('edit', target)
    },
    batchDel() {},
    /**
     * 行选择操作
     */
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.tabId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.tabId
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.table.selected = []
      }
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.tabId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    getBusinessType() {
      this.$service.getBusinessType().then(data => {
        this.businessType = data
      })
    }
  },
  created() {
    this.$service.getAppIdType().then(data => {
      this.appIdType = data
      this.fetchData()
    })
    this.getBusinessType()
  }
}
</script>

<style lang='stylus' scoped>
.btns {
  margin: 30px 10px 30px;
}
</style>