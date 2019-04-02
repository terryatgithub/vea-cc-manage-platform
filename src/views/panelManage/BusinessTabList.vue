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
import _ from 'gateschema'
import { ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    ContentWrapper,
    Table
  },

  data () {
    return {
      tabTypeOption: [
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
      tabStatus: {},
      filter: {
        tabParentType: 'biz',
        idPrefix: 10
      },
      filterSchema: null,
      pagination: {
        currentPage: 1
      },
      appIdType: [],
      businessType: [],
      tabType: {},
      selected: [],
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
            prop: 'businessCategoryName'
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
            formatter: (row) => {
              return this.appIdType.map((item) => {
                if(row.tabAppid.toString() === item.dictEnName){
                  return item.dictCnName
                }
              })
            }
          },
          {
            label: '版本/状态',
            prop: 'tabStatus',
            formatter: (row) => {
              const status = row.tabStatus
              const currentVersion = row.currentVersion
              return currentVersion + '/' + this.tabStatusOption.map(function(item){
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
        selected: [],
        selectionType: 'multiple'
      }
    };
  },

  methods: {
    addTabInfo() {

    },
    editData() {

    },
    batchDel() {

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
        tabParentType: 'biz',
        idPrefix: 10
      }
      this.fetchData()
    },
    getTabType() {
      return this.$service.getTabType().then(data => {
        data.forEach(element => {
          this.tabType[element.label] = element.value
        });
      })
    },
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
    this.tabStatus = this.tabStatusOption.reduce((result, item) => {
      result[item.label] = item.value
      return result
    }, {})
    let filterSchema = _.map({
      tabId: _.o.string.other('form', {
        placeholder: '版面Id',
        cols: {
          item: 3,
          label: 0
        }
      }),
      tabName: _.o.string.other('form', {
        placeholder: '版面标题',
        cols: {
          item: 3,
          label: 0
        }
      }),
      tabType: _.o.enum(this.tabType).other('form', {
        component: 'Select',
        placeholder: '版面属性',
        cols: {
          item: 3,
          label: 0
        }
      }),
      tabStatus: _.o.enum(this.tabStatus).other('form', {
        component: 'Select',
        placeholder: '状态',
        cols: {
          item: 3,
          label: 0
        }
      })
    }).other('form', {
      layout: 'inline',
      footer: {
        cols: {
          label: 0,
          wrapper: 24
        },
        showSubmit: true,
        submitText: '查询',
        showReset: true,
        resetText: '重置'
      }
    })
    this.getTabType().then(() => {
      this.filterSchema = filterSchema
    })
    this.$service.getAppIdType().then(data => {
      this.appIdType = data
      this.fetchData()
    })
    this.getBusinessType()

  }

}
</script>

<style lang='stylus' scoped>
.btns
  margin-bottom 30px
</style>