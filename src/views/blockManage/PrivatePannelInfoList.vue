<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
        <ButtonGroupForListPage 
          v-if="dataList === undefined"
          pageName='privatePanel' 
          @add="handleCreate"
          @edit="handleEdit"
          @delete="handleDelete">
        </ButtonGroupForListPage>
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        :select-on-row-click="true"
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
import _ from 'gateschema'
import BaseList from '@/components/BaseList'
export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage
  },
  props: {
    dataList: {
      type: Object
    }
  },
  data() {
    return {
      resourceType: 'panelInfo',
      pannelCategories: {},
      pannelStatus: {},
      filter: {
        sort: undefined,
        order: undefined,
        pannelType: 5
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'pannelGroupId',
            width: '90'
          },
          {
            label: '名称',
            prop: 'pannelGroupRemark',
            width: '200',
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
                row.pannelGroupRemark
              )
            }
          },
          {
            label: '业务分类',
            prop: 'categoryName',
            width: '70'
          },
          {
            label: '引用状态',
            prop: 'fullTabName'
          },

          {
            label: '版本/状态',
            prop: 'pannelStatus',
            formatter: row => {
              const status = row.pannelStatus
              const currentVersion = row.currentVersion
              return `${currentVersion}/${this.$consts.statusText[status]}`
            }
          },
          {
            label: '待审核副本',
            prop: 'duplicateVersion',
            width: '90',
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.handleRead(row, row.duplicateVersion)
                    }
                  }
                },
                row.duplicateVersion
              )
            }
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
            prop: 'userName'
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  watch: {
    selected: {
      handler(newVal, oldVal) {
        const table = this.table
        let rows = []
        table.data.map(tableRow => {
          if (newVal.indexOf(tableRow.pannelGroupId) > -1) {
            let row = {
              pannelGroupId: tableRow.pannelGroupId,
              pannelGroupRemark: tableRow.pannelGroupRemark,
              duplicateVersion: tableRow.duplicateVersion,
              pannelType: tableRow.pannelType
              //type: 'PrivatePannelInfo'
            }
             console.log("PrivatePannelInfo")
            rows.push(row)
          }
        })
        this.$emit('input', rows)
      }
    }
  },
  methods: {
    //初始化表格‘
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      if (this.dataList) {
        this.$service.panelPageList(filter).then(data => {
          this.pagination.total = data.total
          this.table.data = data.rows
        })
      } else {
        this.$service.panelPageList(filter).then(data => {
          this.pagination.total = data.total
          this.table.data = data.rows
        })
      }
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter}
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
      if (this.dataList) {
        this.filter = Object.assign({}, this.dataList.filter)
      } else {
        this.filter = {
          sort: undefined,
          order: undefined,
          pannelType: 5
        }
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    //获取业务分类
    getDictType() {
      return this.$service.getDictType({type: 'businessType'}).then(data => {
        data.forEach(element => {
          this.pannelCategories[element.dictCnName] = element.dictId
        })
      })
    }
  },
  created() {
    let filterSchema = _.map({
      pannelId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      pannelName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '名称'
      }),
      pannelTitle: _.o.string.other('form', {
        component: 'Input',
        placeholder: '标题'
      }),
      pannelResource: _.o.enum(this.$consts.sourceEnums).other('form', {
        component: 'Select',
        placeholder: '内容源'
      }),
      pannelCategory: _.o.enum(this.pannelCategories).other('form', {
        component: 'Select',
        placeholder: '业务分类'
      }),
      tabName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '引用状态'
      }),
      pannelStatus: _.o.enum(this.$consts.statusEnums).other('form', {
        component: 'Select',
        placeholder: '状态'
      })
    }).other('form', {
      cols: {
        item: 6,
        label: 0,
        wrapper: 18
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
    const dataList = this.dataList
    if (dataList) {
      this.filter = Object.assign({}, dataList.filter)
      this.table = dataList.table
    }

    this.getDictType().then(() => {
      this.dataList
        ? (this.filterSchema = dataList.filterSchema)
        : (this.filterSchema = filterSchema)
    })
    this.fetchData()
  }
}
</script>
<style lang="stylus" scoped>
.content >>> .el-table .cell
  display flex
  justify-content center
  align-items center
  height 40px
.btns
  margin 20px auto
</style>
