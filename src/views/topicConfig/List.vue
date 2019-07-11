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
            pageName="topicConfig"
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
      resourceType: 'topicConfig',
      activePage: 'topic_config_list',
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
            label: '名称',
            prop: 'topicConfigName',
            render: (h, {row}) => {
              return (
                <el-button 
                  type="text" 
                  onClick={(event) => {
                      event.stopPropagation()
                      this.handleRead(row)
                    }
                  }>
                  { row.topicConfigName }
                </el-button>
              )
            }
          },
          {
            label: '内容源',
            prop: 'source',
            render: (h, {row}) => {
              return this.$consts.sourceText[row.source]
            }
          },
          {
            label: '操作',
            width: '140',
            fixed: 'right'
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
        menuElId: 'topic',
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
      this.$service.topicConfigGetList(filter).then(data => {
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
    this.fetchData()
  }
}
</script>
<style lang = 'stylus' scoped></style>
