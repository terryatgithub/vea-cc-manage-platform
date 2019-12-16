<template>
  <ContentCard ref="contentCard" class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="fetchData"
      @filter-reset="handleFilterReset"
    >
      <!-- 筛选部分 -->
      <el-form inline ref="form" v-model="filter" label-width="0px" class="form">
        <el-form-item class="el-col-6">
          <el-input v-model="filter.pluginId" placeholder="ID"/>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-input v-model="filter.pluginName" placeholder="功能名称"/>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select v-model="filter.pluginParentType" placeholder="父功能分类" @change="getPluginType">
            <el-option
              v-for="(item, index) in parentTypes"
              :key="index"
              :label="item.dictCnName"
              :value="item.dictEnName"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select v-model="filter.pluginType" placeholder="功能分类">
            <el-option
              v-for="(item, index) in pluginType"
              :key="index"
              :label="item.dictCnName"
              :value="item.dictEnName"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select v-model="filter.pluginStatus" placeholder="状态">
            <el-option
              v-for="(item, index) in $consts.statusOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select v-model="filter.source" placeholder="内容源">
            <el-option
              v-for="(item, index) in $consts.sourceNumberOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item-submit">
          <el-button type="primary" @click="handleFilterChange">查询</el-button>
          <el-button @click="handleFilterReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div></div>
      <!-- 筛选部分end -->
      <ButtonGroupForListPage
        pageName="multiFunctionBlock"
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
</template>

<script>
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
  data () {
    return {
      resourceType: 'blockInfo',
      pluginType: [],
      parentTypes: [],
      childTypes: {}, // 功能分类
      filter: {},
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'pluginId',
            width: '70'
          },
          {
            label: '功能名称',
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
            label: '内容源',
            prop: 'source',
            render: (createElement, { row }) => {
              return this.$consts.sourceNumberText[row.source]
            }
          },
          {
            label: '状态',
            prop: 'pluginStatus',
            render: (createElement, { row }) => {
              return this.$consts.statusText[row.pluginStatus]
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
        menuElId: 'multiFunctionBlock',
        type: 'systemPlugin'
      })
    },
    getPluginType () {
      this.$service
        .getPluginType({ pluginParentType: this.filter.pluginParentType })
        .then(data => {
          this.pluginType = data
        })
    },
    // 获取table数据
    fetchData () {
      const filter = this.parseFilter()
      this.$service.getMultiBlockList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    // 获取功能父分类
    getPluginParentTypes () {
      this.$service.getPluginParentTypes().then(data => {
        this.parentTypes = data
      })
    },
    handleFilterChange () {
      if (this.$validateId(this.filter.pluginId)) {
        this.pagination.currentPage = 1
        this.fetchData()
      }
    },
    handleFilterReset () {
      this.filter = {
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    }
  },
  created () {
    this.getPluginParentTypes()
    this.fetchData()
  }
}
</script>
<style lang = 'stylus' scoped>
.checkItemStyle
  margin: 10px
.form >>>.el-form-item__content
  width: 83.33333%
  .el-select
    width: 100%
.form >>>.el-form-item
  margin-right: 0px
.el-form-item-submit
  width: 200px
</style>
