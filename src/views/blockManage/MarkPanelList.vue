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
        pageName='markPanel'
        @add="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete"/>
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
import _ from 'gateschema'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import { ContentWrapper, Table } from 'admin-toolkit'
import BaseList from '@/components/BaseList'
export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data() {
    return {
      resourceType: 'panelInfo',
      businessTypes: {}, // 业务分类
      filter: this.genDefaultFilter(),
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
            minWidth: '100',
            'show-overflow-tooltip': true,
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
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
            width: '90'
          },
          {
            label: '内容源',
            prop: 'pannelList',
            width: '90',
            render: (createElement, { row }) => {
              const pannelList = row.pannelList
              if (pannelList.length > 0) {
                return this.$consts.sourceText[pannelList[0].pannelResource]
              }
            }
          },
          {
            label: '引用状态',
            prop: 'fullTabName',
            'min-width': '90'
          },
          {
            label: '版本/状态',
            prop: 'pannelStatus',
            width: '120',
            render: (createElement, { row }) => {
              return row.currentVersion + '/' + this.$consts.statusText[row.pannelStatus]
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
                    click: (event) => {
                      event.stopPropagation()
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
            prop: 'lastUpdateDate',
            width: '140'
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    genDefaultFilter() {
      return {
        idPrefix: this.$consts.idPrefix,
        pannelType: 8
      }
    },
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getMarkPanelList(filter).then(data => {
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
    /** 获取业务分类 */
    getBusinessType() {
      return this.$service.getDictType({ type: 'businessType' }).then(data => {
        data.forEach(element => {
          this.businessTypes[element.dictCnName] = element.dictId
        })
        console.log(this.businessTypes)
      })
    },
    // 查询
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter }
      if (this.$validateId(this.filter.pannelId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData()
      }
    },
    // 重置
    handleFilterReset() {
      this.filter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
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
      pannelCategory: _.o.enum(this.businessTypes).other('form', {
        component: 'Select',
        placeholder: '业务分类'
      }),
      pannelResource: _.o.enum(this.$consts.sourceEnums).other('form', {
        component: 'Select',
        placeholder: '内容源'
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
    if (this.$consts.idPrefix !== '10') {
      filterSchema.map({
        idPrefix: _.o.enum({
          '酷开': '10',
          '江苏广电': '11'
        }).other('form', {
          component: 'Select',
          placeholder: '数据来源'
        })
      })
    }
    this.fetchData()
    this.getBusinessType().then(() => {
      this.filterSchema = filterSchema
    })
  }
}
</script>

<style lang = 'stylus' scoped>
.btns {
  margin-bottom: 10px;
}
</style>
