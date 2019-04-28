<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
        <!-- <ButtonGroupForListPage 
        pageName='tab' 
        @add="addUser"
        @edit="editData"
        @delete="batchDel"
        >
        </ButtonGroupForListPage> -->
      <!-- 筛选部分end -->
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
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import { ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage
  },

  data() {
    return {
      selected: [],
      tabTypeOption: {
        '信号源版面': 5,
         '第三方版面': 4,
          '专题版面': 2,
           '普通版面': 1,
      },
      tabStatusOption: {
        '下架': 0,
        '上架': 1,
        '草稿': 2,
        '待审核': 3,
        '审核通过': 4,
        '审核不通过': 5,
      } ,
      businessType: {},
      filter: {
        idPrefix: 10
      },
      appIdType: {},
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
                      this.openReview(row)
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
            render: (h, {row}) =>{
             return this.appIdTypeForList[row.tabAppid]
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
                this.$numToAuditStatus(status)
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
    openReview(row) {
      this.$emit('open-review-page', row)
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
        idPrefix: 10
      }
      this.fetchData()
    },
    addTabInfo() {},
    editData() {},
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
    }
  },
  created() {
    let p1 = this.$service.getAppIdType()
    let p2 = this.$service.getBusinessType()
    Promise.all([p1,p2]).then((result)=>{
      this.appIdType = this.$getFilterSelectField(result[0], 'dictCnName', 'dictEnName')
      this.appIdTypeForList = this.$getFilterSelectField(result[0], 'dictEnName', 'dictCnName')
      this.businessType = this.$getFilterSelectField(result[1], 'dictCnName', 'dictId')
      this.fetchData()
      this.filterSchema = _.map({
      tabId: _.o.string.other('form', {
        component: 'Input',
        placeholder: '版面Id'
      }),
      tabName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '版面标题'
      }),
      tabType: _.o.enum(this.tabTypeOption).other('form', {
        component: 'Select',
        placeholder: '版面属性'
      }),
      hasSubTab: _.o.enum({ 是: 1, 否: 0 }).other('form', {
        component: 'Select',
        placeholder: '是否二级tab'
      }),
      tabCategory: _.o.enum(this.businessType).other('form', {
        component: 'Select',
        placeholder: '业务分类'
      }),
      tabAppid: _.o.enum(this.appIdType).other('form', {
        component: 'Select',
        placeholder: 'AppId'
      }),
      tabStatus: _.o.enum(this.tabStatusOption).other('form', {
        component: 'Select',
        placeholder: '状态'
      })
    }).other('form', {
      cols: {
        item: 6,
        label: 0,
        wrapper: 20
      },
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


    
    })
  }
}
</script>

<style lang='stylus' scoped>
.btns
  margin: 30px 10px 30px
</style>