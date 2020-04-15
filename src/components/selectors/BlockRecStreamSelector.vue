<template>
  <RemoteSelectorWrapper
    ref="wrapper"
    :title="title"
    custom-class="resource-selector"
    :disabled="disabled"
    :is-live="isLive"
    @select-start="handleSelectStart">
    <template slot="content" slot-scope="{isShow}">
      <BaseSelector
        v-if="isLive ? true : isShow"
        ref="baseSelector"
        :id-field="getId"
        :selection-type="selectionType"
        :table="table"
        :filter="filter"
        :filterSchema="filterSchema"
        :pagination="pagination"
        :select-end-on-dbl-click="true"
        @pagination-change="fetchData"
        @filter-change="handleFilterChange"
        @filter-reset="handleResetFilter"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
        <div slot="filter">
          <el-form :inline="true" :model="filter" @keypress.enter.native.prevent="handleFilterChange">
            <el-form-item>
              <InputPositiveInt v-model="filter.id" clearable placeholder="ID"></InputPositiveInt>
            </el-form-item>
            <el-form-item>
              <el-input v-model="filter.name" placeholder="名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="filter.type" placeholder="类型" clearable>
                <el-option v-for="item in $consts.blockRecStreamTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilterChange">查询</el-button>
              <el-button type="primary" @click="handleResetFilter">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </BaseSelector>
    </template>
  </RemoteSelectorWrapper>
</template>

<script>
import RemoteSelectorWrapper from '../SelectorWrapper'
import BaseSelector from '../BaseSelector'
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  data () {
    return {
      provinceOptions: [],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      filter: this.genDefaultFilter(),
      effectiveFilter: this.genDefaultFilter(),
      filterSchema: null,
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'id',
            sortable: true,
            width: '100px',
            fixed: 'left'
          },
          {
            label: '指定影片推荐流名称',
            prop: 'name',
            fixed: 'left'
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
            label: '流类型',
            prop: 'type',
            formatter: row => {
              return this.$consts.blockRecStreamTypeText[row.type] || '普通'
            }
          },
          {
            label: '版本/状态',
            prop: 'status',
            formatter: (row) => {
              const status = row.status
              const currentVersion = row.currentVersion
              return currentVersion + '/' + this.$consts.statusText[status]
            }
          },
          {
            label: '影片数量',
            prop: 'videoNum'
          },
          {
            label: '已屏蔽影片数量',
            prop: 'disableVideoNum'
          },
          {
            label: '图片海报尺寸',
            prop: 'picSize'
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  props: ['title', 'disabled', 'isLive', 'source', 'selectionType', 'initSelected'],
  computed: {
  },
  components: {
    RemoteSelectorWrapper,
    BaseSelector,
    InputPositiveInt
  },
  methods: {
    getId (item) {
      return item.id
    },
    genDefaultFilter () {
      return {
        openStatus: 1,
        id: '',
        name: '',
        type: '',
        source: this.source
      }
    },
    handleSelectStart () {
      this.$emit('select-start')
      if (!this.isLive) {
        this.handleResetFilter()
      } else {
        this.fetchData()
      }
      const initSelected = this.initSelected
      if (initSelected) {
        this.$nextTick(() => {
          const $baseSelector = this.$refs.baseSelector
          $baseSelector.selected = initSelected.filter(item => this.getId(item))
          $baseSelector.updateTableSelected()
        })
      }
    },
    handleSelectCancel () {
      this.$refs.wrapper.handleSelectCancel()
    },
    handleSelectEnd (data) {
      this.$emit('select-end', data)
      this.$refs.wrapper.handleSelectEnd()
    },
    handleRowSelectionRemove (item) {
      this.$refs.baseSelector.handleTableRowSelectionRemove(item)
    },
    handleFilterChange () {
      this.effectiveFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleResetFilter () {
      this.filter = this.genDefaultFilter()
      this.effectiveFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData () {
      const filter = JSON.parse(JSON.stringify(this.effectiveFilter))
      const pagination = this.pagination
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      this.$service.getMediaAutomationList(filter).then(data => {
        this.pagination.total = data.total
        data.rows = data.rows.map(item => {
          item.picSize = item.picSize.join(',')
          return item
        })
        this.table.data = data.rows
      })
    }
  },
  created () {
  }
}
</script>

<style lang="stylus" scoped>
.selected-item
  margin-right 10px
</style>
