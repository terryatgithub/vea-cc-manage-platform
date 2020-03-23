<template>
  <ContentCard ref="contentCard" class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <ButtonGroupForListPage
        pageName='businessTab'
        @add="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete"
        >
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
import _ from 'gateschema'
import { ContentWrapper, Table } from 'admin-toolkit'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import BaseList from '@/components/BaseList'
export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage
  },

  data () {
    return {
      canAdd: false,
      resourceType: 'tabInfo',
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
      filter: this.genDefaultFilter(),
      filterSchema: null,
      pagination: {
        currentPage: 1
      },
      appIdType: [],
      businessType: [],
      tabType: {},
      tabTypeReverse: {},
      selected: [],
      selectedItems: [],
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
            'show-overflow-tooltip': true,
            minWidth: 180,
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
            width: 120,
            render: (h, { row }) => {
              return this.tabTypeReverse[row.tabType]
            }
          },
          {
            label: '业务分类',
            prop: 'businessCategoryName'
          },
          {
            label: '内容源',
            prop: 'tabResource',
            render: (h, { row }) => {
              return this.$sourceName(row.tabResource)
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
            width: 110,
            formatter: row => {
              const status = row.tabStatus
              const currentVersion = row.currentVersion
              return (
                currentVersion +
                '/' +
                this.tabStatusOption
                  .map(function (item) {
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
            prop: 'duplicateVersion',
            width: 90,
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
            prop: 'lastUpdateDate',
            width: 140
          },
          {
            label: '审核人',
            prop: 'auditor',
            width: 100
          },
          {
            label: '更新人',
            prop: 'modifierName',
            width: 100
          },
          {
            label: '操作',
            width: 180,
            fixed: 'right',
            render: this.createOperationRender(this)
          }
        ],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },

  methods: {
    handleOpenContentAuthManager (row) {
      this.$refs.contentCard.handleShowContentAuthManager({
        id: row.tabId,
        type: 'tab',
        menuElId: 'tabInfo'
      })
    },
    createOperationRender (obj) {
      return (h, { row }) => {
        let btn1 = this.canAdd && h('el-button',
          {
            props: {
              type: 'text'
            },
            on: {
              click: () => {
                obj.handleCopy(row)
              }
            }
          },
          '复制'
        )
        let btn2 = null
        if (row.collected) {
          btn2 = h('el-button',
            {
              props: {
                type: 'text'
              },
              on: {
                click: () => {
                  obj.cancalCollect(row)
                }
              }
            },
            '取消'
          )
        } else {
          btn2 = h('el-button',
            {
              props: {
                type: 'text'
              },
              on: {
                click: () => {
                  obj.collect(row)
                }
              }
            },
            '收藏'
          )
        }
        const contentAuthBtn = (!!row.showContentAuthSettingBtn) && h('el-button', {
          props: { type: 'text' },
          on: {
            click: (event) => {
              event.stopPropagation()
              this.handleOpenContentAuthManager(row)
            }
          }
        }, '内容权限')
        return [btn1, btn2, contentAuthBtn]
      }
    },
    collect (row) {
      this.$service.collect({ type: 'tab', data: { resourceId: row.tabId } }, '收藏成功').then(() => {
        this.fetchData()
      })
    },
    cancalCollect (row) {
      this.$service.collectCancel({ type: 'tab', data: { resourceId: row.tabId } }, '取消成功').then(() => {
        this.fetchData()
      })
    },
    /**
     * 获取数据
     */
    fetchData () {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.tabInfoList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    genDefaultFilter () {
      return {
        tabParentType: 'biz',
        idPrefix: this.$consts.idPrefix
      }
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange (type, filter) {
      if (filter) { this.filter = filter }
      if (type === 'query') {
        this.pagination.currentPage = 1
      }
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    getTabType () {
      return this.$service.getTabType({ tabParentType: 'biz' }).then(data => {
        data.forEach(element => {
          this.tabType[element.dictCnName] = element.dictEnName
          this.tabTypeReverse[element.dictEnName] = element.dictCnName
        })
      })
    },
    getBusinessType () {
      this.$service.getDictType({ type: 'businessType' }).then(data => {
        this.businessType = data
      })
    }
  },
  created () {
    this.tabStatus = this.tabStatusOption.reduce((result, item) => {
      result[item.label] = item.value
      return result
    }, {})
    let filterSchema = _.map({
      tabId: _.o.oneOf([_.value(''), _.number]).$msg('请输入数字').other('form', {
        component: 'InputPositiveInt',
        placeholder: 'ID'
      }),
      tabName: _.o.string.other('form', {
        placeholder: '版面标题'
      }),
      tabType: _.o.enum(this.tabType).other('form', {
        component: 'Select',
        placeholder: '版面属性'
      }),
      tabStatus: _.o.enum(this.tabStatus).other('form', {
        component: 'Select',
        placeholder: '状态'
      })
    }).other('form', {
      cols: {
        item: 5,
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
    this.getTabType().then(() => {
      this.filterSchema = filterSchema
    })
    this.$service.getDictType({ type: 'appIdType' }).then(data => {
      this.appIdType = data
      this.fetchData()
    })
    this.getBusinessType()
    this.$service.getButtonGroupForPageList('businessTab').then(data => {
      this.canAdd = data.some(item => item.runComm === 'add')
    })
  }
}
</script>

<style lang='stylus' scoped>
</style>
