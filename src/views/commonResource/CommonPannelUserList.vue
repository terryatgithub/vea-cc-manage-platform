<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
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
import { ContentWrapper, Table ,utils} from 'admin-toolkit'
import _ from 'gateschema'
export default {
  components: {
    ContentWrapper,
    Table
  },
  props: {
    // 影片详情页中添加版块
    dataList: {
      type: Object
    }
  },
  data () {
    return {
      pannelStatusOption: [
        { label: '下架', value: '0' },
        { label: '上架', value: '1' },
        { label: '草稿', value: '2' },
        { label: '待审核', value: '3' },
        { label: '审核通过', value: '4' },
        { label: '审核不通过', value: '5' }
      ],
      pannelStatus: {},
      filter: {
         sort: undefined,
        order: undefined,
        idPrefix: 10
      },
      filterSchema: null,
      pagination: {
        currentPage: 1
      },
      businessType: {},
      table: {
        props: {},
        data: [],
        header: [
          {
            label: 'ID',
            prop: 'pannelGroupId'
          },
          {
            label: '名称',
            prop: 'pannelGroupRemark',
            render: (createElement, { row }) => {
              return createElement('el-button', {
                attrs:{
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handleRead(row) 
                  }
                }
              },row.pannelGroupRemark)
            }
          },
          {
            label: '布局',
            prop: 'fullLayoutName'
          },
          {
            label: '业务分类',
            prop: 'categoryName'
          },
          {
            label: '引用状态',
            prop: 'fullTabName',
            'show-overflow-tooltip': true
          },
          {
            label: '版本/状态',
            prop: 'pannelStatus',
            formatter: (row) => {
              const status = row.pannelStatus
              const currentVersion = row.currentVersion
              return currentVersion + '/' + this.pannelStatusOption.map(function(item){
                if(status.toString() === item.value){
                  return item.label
                }
              }).join('')
            }
          },
          {
            label: '待审核副本',
            prop: 'duplicateVersion',
            render: (createElement, { row }) => {
              return createElement('el-button', {
                attrs:{
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handleRead(row, row.duplicateVersion) 
                  }
                }
              },row.duplicateVersion)
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            'show-overflow-tooltip': true
          },
          {
            label: '审核人',
            prop: 'auditor'
          },
          {
            label: '更新人',
            prop: 'userName'
          },
           {
              label: '操作',
              width: '100',
              fixed: 'right',
               render: utils.component.createOperationRender(this, {
                handleCopy: '复制',
                cancalCollect: '取消收藏'
              })
            }
        ],
        selected: [],
        selectionType: 'multiple'
      },
      selected: []
    };
  },

  watch: {
    selected: {
      handler(newVal, oldVal) {
        const table = this.table
        let rows = []
        table.data.map(tableRow => {
          if(newVal.indexOf(tableRow.pannelGroupId) > -1) {
            let row = {
              pannelGroupId: tableRow.pannelGroupId,
              pannelGroupRemark: tableRow.pannelGroupRemark,
              duplicateVersion: tableRow.duplicateVersion
            }
            rows.push(row)
          }
        })
        this.$emit('input', rows)
      }
    }
  },

  methods: {
    handleCopy({row}) {
      this.$emit('copy', row.pannelGroupId)
    },
    cancalCollect({row}) {
      this.$service.collectCancel({ type: 'pannel', data: {resourceId: row.pannelGroupId }}, '取消成功').then(()=>{
        this.fetchData()
      })
    },
    handleRead(row, version) {
      this.$emit('read', row.pannelGroupId, version)
    },
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
        this.$service.commonPannelUserList(filter).then(data => {
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
      if(this.$validateId(this.filter.pannelId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData() 
      }
    },
    handleFilterReset() {
      console.log(this.dataList);
      if(this.dataList) {
        this.filter = Object.assign({}, this.dataList.filter)
        console.log(this.filter);
      }else {
        this.filter = {
           sort: undefined,
        order: undefined,
        idPrefix: 10
        }
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    getBusinessType() {
      return this.$service.getDictType({type: 'businessType'}).then(data => {
        data.forEach((item) => {
          this.businessType[item.dictCnName] = item.dictId
        })
      })
    },
    /**
     * 行选择操作
     */
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.pannelGroupId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.pannelGroupId
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
     handleAllRowSelectionRemove() {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.pannelGroupId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    // 按钮操作
    addTabInfo() {

    },
    editData() {

    },
    batchDel() {

    },
  },

  created() {
    this.pannelStatus = this.pannelStatusOption.reduce((result, item) => {
      result[item.label] = item.value
      return result
    }, {})
    let filterSchema = _.map({
      pannelCategory: _.o.enum(this.businessType).other('form', {
        placeholder: '业务分类',
        component: 'Select'
      }),
      pannelId: _.o.string.other('form', {
        placeholder: 'ID',
        component: 'Input'
      }),
      pannelName: _.o.string.other('form', {
        placeholder: '版块名称',
        component: 'Input'
      }),
      pannelTitle: _.o.string.other('form', {
        placeholder: '版块标题',
        component: 'Input'
      }),
      tabName: _.o.string.other('form', {
        placeholder: '引用状态',
        component: 'Input'
      }),
      pannelResource: _.o.enum({'腾讯': 'o_tencent', '爱奇艺': 'o_iqiyi', '优酷': 'o_youku'}).other('form', {
        placeholder: '内容源',
        component: 'Select'
      }),
      pannelStatus: _.o.enum(this.pannelStatus).other('form', {
        placeholder: '状态',
        component: 'Select'
      }),
      pannelType: _.o.enum({'影视推荐版块': 6, '定向版块': 7, '常规版块': 1}).other('form', {
        placeholder: '版块类别',
        component: 'Select'
      })
    })
    .other('form', {
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
    this.getBusinessType().then(() => {
      this.dataList ? this.filterSchema = dataList.filterSchema : this.filterSchema = filterSchema
    })
    // 影片详情页中的版块
    const dataList = this.dataList
    if(dataList) {
      this.filter = Object.assign({}, dataList.filter)
      this.table = dataList.table
    }
    this.fetchData()
  }

}
</script>

<style lang='stylus' scoped>
.content >>> .el-table .cell
  display flex
  justify-content center
  align-items center
  height 40px
.btns
  margin 20px auto
</style>