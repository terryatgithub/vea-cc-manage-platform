<template>
  <PageWrapper>
    <PageContentWrapper>
      <ContentCard ref="contentCard"  class="content">
        <ContentWrapper
          :filter="filter"
          :filterSchema="filterSchema"
          :pagination="pagination"
          @filter-change="handleFilterChange"
          @filter-reset="handleFilterReset"
        >
          <ButtonGroupForListPage
            pageName="topic"
            @add="handleCreate"
            @edit="handleEdit"
            @delete="handleDelete"
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
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import _ from 'gateschema'
import { Button } from 'element-ui'
import { ContentWrapper, Table, ActionList, utils } from 'admin-toolkit'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import BaseList from '@/components/BaseList'

export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper,
    PageWrapper,
    PageContentWrapper,
    ButtonGroupForListPage
  },
  data() {
    let _this = this
    return {
      resourceType: 'topic',
      activePage: 'topic_list',
      filter: {
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {
        },
        header: [
          {
            label: 'ID',
            prop: 'id'
          },
          {
            label: '话题名',
            prop: 'topicName',
            minWidth: 150,
            render: (h, { row }) => {
              return h(Button,
                {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleRead(row)
                    }
                  }
                }, row.topicName)
            }
          },
          {
            label: '话题类型',
            prop: 'type',
            render: (h, { row }) => {
              return this.$consts.topicTypesText[row.type]
            }
          },
          {
            label: '短视频源',
            prop: 'source',
            width: 140,
            render: (h, { row }) => {
              return this.$consts.sourceText[row.source]
            }
          },
          {
            label: '话题状态',
            prop: 'status',
            render: (h, { row }) => {
              return `${row.currentVersion}/${this.$consts.statusText[row.status]}`
            }
          },
          {
            label: '待审核副本',
            prop: 'duplicateVersion',
            render: (h, { row }) => {
              const duplicateVersion = row.duplicateVersion
              if (duplicateVersion) {
                return <el-button type="text" onClick={
                  (event) => {
                    event.stopPropagation()
                    this.handleRead(row, duplicateVersion)
                  }
                }
                >
                  { duplicateVersion }
                </el-button>
              }
            }
          },
          {
            label: '操作',
            width: '140',
            fixed: 'right',
            render: (h, { row }) => {
              if (row.showContentAuthSettingBtn) {
                return (
                  <div>
                    <el-button type="text" onClick={(event) => {
                      event.stopPropagation()
                      this.handleOpenContentAuthManager(row)
                    }}>
                      内容权限
                    </el-button>
                  </div>
                )
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
  computed: {
  },
  methods: {
    handleOpenContentAuthManager(row) {
      this.$refs.contentCard.handleShowContentAuthManager({
        id: row.homepageId,
        type: 'topic',
        menuElId: 'topic'
      })
    },
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter }
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    // 重置
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
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
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      this.$service.topicGetList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
    /**
     * 获取menuInfoTree
     */
    // getSysMenuInfo () {
    //   return this.$service.getHomePageInfoMenu().then(data => {
    //     this.buttonList = data
    //   })
    // }
  },
  created() {
    this.filterSchema = _.map({
      topicName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '话题名',
        label: ' '
      }),
      type: _.o.enum(this.$consts.topicTypesEnum).other('form', {
        component: 'Select',
        placeholder: '话题类型',
        label: ' ',
        clearable: true
      }),
      source: _.o.enum(this.$consts.sourceEnums).other('form', {
        component: 'Select',
        placeholder: '内容源',
        label: ' ',
        clearable: true
      })
    }).other('form', {
      cols: {
        item: 3,
        label: 0,
        wrapper: 23
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
    this.fetchData()
  }
}
</script>
<style lang = 'stylus' scoped></style>
