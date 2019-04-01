<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <div class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addTabInfo">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchDel">批量删除</el-button>
      </div>

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
const tabTypeOption = [
  { label: '请选择', value: '' },
  { label: '第三方版面', value: '4' },
  { label: '专题版面', value: '2' },
  { label: '普通版面', value: '1' }
]
const tabStatusOption = [
  { label: '下架', value: '0' },
  { label: '上架', value: '1' },
  { label: '草稿', value: '2' },
  { label: '待审核', value: '3' },
  { label: '审核通过', value: '4' },
  { label: '审核不通过', value: '5' }
]
export default {
  components: {
    ContentWrapper,
    Table
  },

  data () {
    return {
      filter: {},
      appIdType: undefined,
      filterSchema: null,
      pagination: {
        currentPage: 1,
        rowPages: 15
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
            prop: 'tabName'
          },
          {
            label: '版面属性',
            prop: 'tabType',
            formatter: function (row) {
                const v = row.tabType
                return {'1': '普通版面', '2': '专题版面', '4': '第三方版面'}[v + ''] || '未知版面'
            }
          },
          {
            label: '业务分类',
            prop: 'tabCategory'
          },
          {
            label: '内容源',
            prop: 'tabResource',
            formatter: function (row) {
                const v = row.tabResource
                return {'o_tencent': '腾讯', 'o_iqiyi': '爱奇艺', 'o_voole': '优朋'}[v + ''] || ''
            }
          },
          {
            label: 'AppId',
            prop: 'tabAppid',
            // formatter: function (row) {
            //   console.log(this.appIdType);
            //   return this.appIdType[row.dictEnName]
            // }
          },
          {
            label: '版本/状态',
            prop: 'tabStatus',
            formatter: function(row) {
              const status = row.tabStatus
              const currentVersion = row.currentVersion
              return currentVersion + '/' + tabStatusOption.map(function(item){
                if(status.toString() === item.value){
                  return item.label
                }
              }).join('')
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
        selected: null,
        selectionType: 'mutiple'
      }
    };
  },

  methods: {
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
    handleFilterChange() {

    },
    handleFilterReset() {

    },
    addTabInfo() {

    },
    editData() {

    },
    batchDel() {

    },
    handleRowSelectionAdd() {

    },
    handleRowSelectionRemove() {

    },
    handleAllRowSelectionChange() {
      
    },
    
  },
  created() {
    this.$service.getAppIdType().then(data => {
    this.appIdType = data.reduce(function(result, item){
      result[item.dictEnName] = item.dictCnName
      return result
      }, {})
    })
    this.fetchData()
  }

}
</script>

<style lang='stylus' scoped>
</style>