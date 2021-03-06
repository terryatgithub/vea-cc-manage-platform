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
        v-if="dataList === undefined "
        pageName='albumPanel'
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
import BaseList from '@/components/BaseList'
import { ContentWrapper, Table } from 'admin-toolkit'
import _ from 'gateschema'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'

export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage

  },

  props: {
    // 影片详情页中添加版块
    dataList: {
      type: Object
    }
  },

  data () {
    return {
      canAdd: false,
      resourceType: 'panelInfo',
      businessType: {},
      pannelStatus: {},
      filter: this.genDefaultFilter(),
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
            prop: 'pannelGroupId'
          },
          {
            label: '名称',
            prop: 'pannelGroupRemark',
            minWidth: 180,
            'show-overflow-tooltip': true,
            render: (createElement, { row }) => {
              return createElement('el-button', {
                attrs: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handleRead(row)
                  }
                }
              }, row.pannelGroupRemark)
            }
          },
          {
            label: '布局',
            width: '150',
            prop: 'fullLayoutName'
          },
          {
            label: '业务分类',
            prop: 'categoryName'
          },
          {
            label: '内容源',
            prop: 'pannelResource',
            formatter: (row) => {
              return this.$consts.sourceText[row.pannelList[0].pannelResource]
            }
          },
          {
            label: '引用状态',
            prop: 'fullTabName',
            'show-overflow-tooltip': true
          },
          {
            label: '版本/状态',
            prop: 'pannelStatus',
            width: '130',
            formatter: (row) => {
              const status = row.pannelStatus
              const currentVersion = row.currentVersion
              return currentVersion + '/' + this.$consts.statusText[status]
            }
          },
          {
            label: '待审核副本',
            width: '100',
            prop: 'duplicateVersion',
            render: (h, { row }) => {
              return h('el-button', {
                attrs: {
                  type: 'text'
                },
                on: {
                  click: (event) => {
                    event.stopPropagation()
                    this.handleRead(row, row.duplicateVersion)
                  }
                }
              }, row.duplicateVersion)
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: '140',
            'show-overflow-tooltip': true
          },
          {
            label: '审核人',
            prop: 'auditor',
            width: '100'
          },
          {
            label: '更新人',
            prop: 'userName',
            width: '100'
          },
          {
            label: '操作',
            fixed: 'right',
            width: 140,
            render: (h, { row }) => {
              return h('div', [
                this.canAdd && h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleCopy(row)
                    }
                  }
                }, '复制'),
                h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleToggleCollect(row)
                    }
                  }
                }, [
                  h('el-icon', { class: row.collected ? 'el-icon-star-on' : 'el-icon-star-off' }),
                  row.collected ? '取消' : '收藏'
                ]),
                (!!row.showContentAuthSettingBtn) && h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleOpenContentAuthManager(row)
                    }
                  }
                }, '内容权限')
              ])
            }
          }
        ],
        selected: [],
        selectionType: 'multiple'
      },
      selected: []
    }
  },

  watch: {
    selected: {
      handler (newVal, oldVal) {
        const table = this.table
        let rows = []
        table.data.map(tableRow => {
          if (newVal.indexOf(tableRow.pannelGroupId) > -1) {
            let row = {
              pannelGroupId: tableRow.pannelGroupId,
              pannelGroupRemark: tableRow.pannelGroupRemark,
              duplicateVersion: tableRow.duplicateVersion,
              pannelType: tableRow.pannelType
            //  type: 'AlbumPannelInfo'
            }
            console.log('AlbumPannelInfo')
            rows.push(row)
          }
        })
        this.$emit('input', rows)
      }
    }
  },

  methods: {
    handleOpenContentAuthManager (row) {
      this.$refs.contentCard.handleShowContentAuthManager({
        id: row.pannelGroupId,
        menuElId: 'albumPannelInfo',
        type: 'pannel'
      })
    },
    genDefaultFilter () {
      return {
        idPrefix: this.$consts.idPrefix,
        pannelType: 3
      }
    },
    fetchData () {
      const filter = this.parseFilter()
      if (this.dataList) {
        this.$service.panelDataList(filter).then(data => {
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
      if (this.$validateId(this.filter.pannelId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData()
      }
    },
    handleFilterReset () {
      console.log(this.dataList)
      if (this.dataList) {
        this.filter = Object.assign({}, this.dataList.filter)
        console.log(this.filter)
      } else {
        this.filter = this.genDefaultFilter()
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    getBusinessType () {
      return this.$service.getDictType({ type: 'businessType' }).then(data => {
        data.forEach((item) => {
          this.businessType[item.dictCnName] = item.dictId
        })
      })
    },
    handleToggleCollect (row) {
      if (row.collected) {
        this.$service.collectCancel({ type: 'pannel', data: { resourceId: row.pannelGroupId } }, '取消收藏成功')
          .then(() => {
            this.$set(row, 'collected', false)
          })
      } else {
        this.$service.collect({ type: 'pannel', data: { resourceId: row.pannelGroupId } }, '收藏成功')
          .then(() => {
            this.$set(row, 'collected', true)
          })
      }
    }
  },
  created () {
    const filterSchema = _.map({
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
      vDataListName: _.o.string.other('form', {
        placeholder: '关联专辑名',
        component: 'Input'
      }),
      tabName: _.o.string.other('form', {
        placeholder: '引用状态',
        component: 'Input'
      }),
      pannelResource: _.o.enum(this.$consts.sourceEnums).other('form', {
        placeholder: '内容源',
        component: 'Select'
      }),
      pannelStatus: _.o.enum(this.$consts.statusEnums).other('form', {
        placeholder: '状态',
        component: 'Select'
      }),
      type: _.o.enum({ '默认': -1, '置顶': 1, '下沉': 0 }).other('form', {
        placeholder: '智能化推荐',
        component: 'Select'
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
    this.getBusinessType().then(() => {
      this.dataList ? this.filterSchema = dataList.filterSchema : this.filterSchema = filterSchema
    })
    // 影片详情页中的版块
    const dataList = this.dataList
    if (dataList) {
      this.filter = Object.assign({}, dataList.filter)
      this.table = dataList.table
    }
    this.fetchData()
    this.$service.getButtonGroupForPageList('albumPanel').then(data => {
      this.canAdd = data.some(item => item.runComm === 'add')
    })
  }

}
</script>

<style lang='stylus' scoped>
</style>
