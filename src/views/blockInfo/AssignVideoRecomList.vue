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
            label: '指定影片推荐流ID',
            prop: 'id',
            sortable: true
          },
          {
            label: '指定影片推荐流名称',
            prop: 'name',
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
                row.name
              )
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
            label: '源状态',
            prop: 'openStatus',
            render: (h, { row }) => {
              return ['关闭', '开启'][row.openStatus]
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
            label: '影片数量',
            prop: 'videoNum'
          },
          {
            label: "已屏蔽影片数量",
            prop: 'disableVideoNum'
          },
          {
            label: '图片海报尺寸',
            prop: 'picSize'
          },
          {
            label: '最后一次推荐计算完成时间',
            prop: 'lastCalDate'
          },
          {
            label: '操作',
            fixed: 'right',
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
        page: 1,
        rows: 10
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
      this.$service.getMediaAutomationList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created() {
    let filterSchema = _.map({
      id: _.o.oneOf([_.number, _.value('')]).$msg('请输入数字').other('form', {
        component: 'Input',
        placeholder: '影片流ID'
      }),
      name: _.o.string.other('form', {
        component: 'Input',
        placeholder: '影片流名称'
      }),
      source: _.o.enum(this.$consts.sourceOptionsWithNoneEnums).other('form', {
        component: 'Select',
        placeholder: '内容源'
      }),
      openStatus: _.o.enum({'开启': 1, '关闭': 0}).other('form', {
        component: 'Select',
        placeholder: '源状态'
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