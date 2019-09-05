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
        pageName="blockInfo"
        @add="handleCreate"
        @edit="handleEdit"

      ></ButtonGroupForListPage>
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
import BaseList from '@/components/BaseList'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
import ButtonGroupForListPage from './../../components/ButtonGroupForListPage'
import BroadcastSimpleData from './BroadcastSimpleData'

export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage,
    BroadcastSimpleData
  },
  data() {
    return {
      resourceType: 'broadcastBlock',
      filter: this.genDefaultFilter(),
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            width: 70,
            prop: 'id',
            sortable: true
          },
          {
            label: '轮播名称',
            prop: 'containerName',
            sortable: true,
            render: (h, { row }) => {
              return h(
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
                row.containerName
              )
            }
          },
          {
            label: '数据表现',
            width: 300,
            render: (h, {row}) => {
              const id = row.id
              if( id === 10101 || id === 10107 || id ===10109 ) 
              {
                return h(
                  BroadcastSimpleData,
                  {
                    props: { id }
                  }
                )
              }
            }
          },
          {
            label: '待审核的版本',
            prop: 'duplicateVersion',
            sortable: true,
            render: (h, { row }) => {
              return h(
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
            label: '状态',
            prop: 'status',
            sortable: true,
            render: (h, { row }) => {
              return this.$consts.statusText[row.status]
            }
          },
          {
            label: '内容源',
            prop: 'source',
            render: (h, { row }) => {
              return this.$consts.sourceTextWithNone[row.source]
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            sortable: true
          },
          {
            label: '操作',
            render: (h, { row }) => {
              if (row.showContentAuthSettingBtn) {
                return h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleOpenContentAuthManager(row)
                    }
                  }
                }, '内容权限')
              }
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    handleOpenContentAuthManager(row) {
      this.$refs.contentCard.handleShowContentAuthManager({
        id: row.id,
        type: 'block',
        menuElId: 'broadcastBlock'
      })
    },
    genDefaultFilter() {
      return {
      }
    },
    handleFilterChange(type, filter) {
      if (filter) {
        this.filter = filter
      }
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    fetchData() {
      const filter = this.parseFilter()
      this.$service.broadcastBlockPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    toPercent: decimal => {
      return (Math.round(decimal * 10000) / 100.00 + "%")
    },
    getSimpleBrowseData(id) {
      let dataShow = {}
      this.$service.getBlockSimpleBrowseData({id}).then(data => {
        const uvctr = data.rows[0].data[0].uvctr
        dataShow = {
          value: this.toPercent(uvctr.value),
          dailyGrowth: this.toPercent(uvctr.dailyGrowth),
          weeklyGrowth: this.toPercent(uvctr.weeklyGrowth) 
        }
        console.log('data2',dataShow );
      })
      return dataShow
    }
  },
  created() {
    let filterSchema = _.map({
      id: _.o.oneOf([_.number, _.value('')]).$msg('请输入数字').other('form', {
        component: 'Input',
        placeholder: '推荐位ID'
      }),
      containerName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '推荐位名称'
      }),
      status: _.o.enum(this.$consts.statusEnums).other('form', {
        component: 'Select',
        placeholder: '审核状态'
      }),
      source: _.o.enum(this.$consts.sourceOptionsWithNoneEnums).other('form', {
        component: 'Select',
        placeholder: '内容源'
      })
    }).other('form', {
      layout: 'inline',
      cols: {
        item: 5,
        label: 0,
        wrapper: 20
      },
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
    this.filterSchema = filterSchema
    this.fetchData()
  }
}
</script>
<style lang = 'stylus' scoped>
.pics img
  max-width: 350px
  max-height: 500px
.content
  >>> table .imgs
    cursor: pointer
.btns
  margin-bottom: 10px
.checkItemStyle
  margin: 10px
</style>
