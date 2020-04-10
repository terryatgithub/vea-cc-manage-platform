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
        :select-end-on-click="true"
        :table="table"
        :filter="filter"
        :filterSchema="filterSchema"
        :pagination="pagination"
        @pagination-change="fetchData"
        @filter-change="handleFilterChange"
        @filter-reset="handleResetFilter"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
        <div slot="filter">
          <el-form :inline="true" :model="filter" @keypress.enter.native.prevent="handleFilterChange">
            <el-form-item >
              <el-input v-model.trim="filter.model" placeholder="省份">></el-input>
            </el-form-item>
            <el-form-item  >
              <el-input v-model.trim="filter.chip" placeholder="聚合频道名">></el-input>
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
export default {
  data () {
    return {
      options: [],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      filter: this.genDefaultFilter(),
      effectiveFilter: this.genDefaultFilter(),
      filterSchema: null,
      table: {
        data: [],
        selected: [],
        header: [
          {
            label: '聚合频道ID'
          },
          {
            label: '聚合频道名'
          },
          {
            label: '聚合之中的省份'
          }
        ],
        selectionType: 'single',
        props: {
          'tooltip-effect': 'dark'
        }
      }
    }
  },
  props: ['title', 'disabled', 'isLive', 'source', 'selectionType', 'platform', 'freezePlatform', 'initSelected'],
  computed: {
  },
  components: {
    RemoteSelectorWrapper,
    BaseSelector
  },
  methods: {
    getId (item) {
      return `${item.model}-${item.chip}`
    },
    genDefaultFilter () {
      return {
        platform: this.platform || 'tencent',
        chip: undefined,
        model: undefined
      }
    },
    handleInputPlatform (val) {
      const baseSelector = this.$refs.baseSelector
      const selected = baseSelector.selected
      const setPlatform = () => {
        this.filter.platform = val
        this.handleFilterChange()
      }
      if (selected.length > 0) {
        this.$confirm('切换内容源将清除已选中的机型机芯，是否继续切换', '提示')
          .then(() => {
            setPlatform()
            baseSelector.clearSelected()
          })
          .catch(() => {})
      } else {
        setPlatform()
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
      const platform = this.platform
      const selectedPlatform = this.filter.platform
      if (platform && selectedPlatform !== platform) {
        this.$confirm('当前选择的机型机芯内容源与策略原来的机型机芯的内容源不一样, 原来的机型机芯和首页方案将被清空，是否继续操作？', '提示')
          .then(() => {
            this.$emit('select-end', data, { isReset: true, platform: selectedPlatform })
            this.$refs.wrapper.handleSelectEnd()
          })
          .catch(() => {
          })
      } else {
        this.$emit('select-end', data, { platform: selectedPlatform })
        this.$refs.wrapper.handleSelectEnd()
      }
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
      this.$service.getChipAndModelPageList(filter).then(data => {
        this.pagination.total = data.total
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
