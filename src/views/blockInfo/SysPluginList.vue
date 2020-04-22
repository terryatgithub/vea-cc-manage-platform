<template>
  <ContentCard ref="contentCard" class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="null"
      :pagination="pagination"
      @filter-change="fetchData">
      <el-form :inline="true"
        @submit.native.prevent="handleFilterChange"
        @reset.native.prevent="handleFilterReset">
        <el-form-item>
          <InputPositiveInt clearable v-model="filter.pluginId" placeholder="状态栏ID" title="状态栏ID"></InputPositiveInt>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="filter.pluginName" placeholder="状态栏名称" title="状态栏名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select filterable clearable v-model="filter.channel" placeholder="频道" title="频道">
            <el-option
              v-for="(item, index) in channelOptions"
              :key="index"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select filterable clearable v-model="filter.pluginStatus" placeholder="状态" title="状态">
            <el-option
              v-for="(item, index) in $consts.statusOptions"
              :key="index"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item-submit">
          <el-button type="primary" native-type="submit">查询</el-button>
          <el-button native-type="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <ButtonGroupForListPage
        pageName="sysPlugin"
        @edit="handleEdit">
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
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import InputPositiveInt from '@/components/InputPositiveInt'
import { ContentWrapper, Table } from 'admin-toolkit'
export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage,
    InputPositiveInt
  },
  data () {
    return {
      resourceType: 'sysPlugin',
      channelOptions: [
        {
          label: '影视',
          value: 'movie'
        },
        {
          label: '体育',
          value: 'sport'
        },
        {
          label: '教育',
          value: 'edu'
        },
        {
          label: '少儿',
          value: 'child'
        }
      ],
      channel: {
        影视: 'movie',
        体育: 'sport',
        教育: 'edu',
        少儿: 'child'
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      table: {
        props: {},
        header: [
          {
            label: '状态栏ID',
            prop: 'pluginId',
            width: '100'
          },
          {
            label: '状态栏名称',
            prop: 'pluginName',
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
                row.pluginName
              )
            }
          },
          {
            label: '待审核的版本',
            prop: 'duplicateVersion',
            sortable: true,
            width: 140,
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
          // {
          //   label: '内容源',
          //   prop: 'source',
          //   render: (createElement, { row }) => {
          //     return this.$consts.sourceNumberText[row.source]
          //   }
          // },
          {
            label: '状态',
            prop: 'pluginStatus',
            width: 140,
            render: (createElement, { row }) => {
              return this.$consts.statusText[row.pluginStatus]
            }
          },
          {
            label: '版面',
            render: (h, { row }) => {
              const rlsTabs = row.rlsTabs || []
              return rlsTabs.map(item => item.tabName).join('、')
            }
          },
          {
            label: '频道',
            prop: 'channel',
            width: 120,
            render: (createElement, { row }) => {
              switch (row.channel) {
                case 'movie':
                  return '影视'
                case 'child':
                  return '少儿'
                case 'sport':
                  return '体育'
                case 'edu':
                  return '教育'
              }
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate'
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
    handleOpenContentAuthManager (row) {
      this.$refs.contentCard.handleShowContentAuthManager({
        id: row.pluginId,
        menuElId: 'sysPlugin',
        type: 'systemPlugin'
      })
    },
    genDefaultFilter () {
      return {
        pluginId: '',
        pluginName: '',
        pluginStatus: ''
      }
    },
    fetchData () {
      const filter = this.parseFilter()
      this.$service.getSysPlugin(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    handleFilterChange (type, filter) {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter () {
      const { pagination } = this
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
<style lang="stylus" scoped>
.btns
  margin-bottom: 10px
</style>
