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
        :select-end-on-dbl-click="false"
        @pagination-change="fetchData"
        @filter-change="handleFilterChange"
        @filter-reset="handleResetFilter"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
        <div slot="filter">
          <el-form :inline="true" :model="filter" @keypress.enter.native.prevent="handleFilterChange">
            <el-form-item>
              <el-input type="number" v-model="filter.id" clearable placeholder="推荐流ID"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="filter.recName" placeholder="推荐流名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilterChange">查询</el-button>
              <el-button @click="handleResetFilter">重置</el-button>
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
            label: '推荐流ID',
            prop: 'id',
            sortable: true,
            width: '200px',
            fixed: 'left'
          },
          {
            label: '推荐流名称',
            prop: 'recName',
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
            label: '适用场景',
            prop: 'scene',
            render: (h, { row }) => {
              var scene = this.handleScene(row)
              return h('div', {}, scene)
            }
          },
          {
            label: '推荐业务来源',
            prop: 'platformName'
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      },
      sceneOption: []
    }
  },
  props: ['title', 'disabled', 'isLive', 'scene', 'source', 'selectionType', 'initSelected'],
  computed: {
  },
  components: {
    RemoteSelectorWrapper,
    BaseSelector
  },
  methods: {
    handleScene (row) {
      let sceneNames = [] // this.sceneNames = [] 错误 render不能操作dom?
      row.scene.split(',').map(item => {
        this.sceneOption.map(element => {
          if (item === element.dictEnName) {
            sceneNames.push(element.dictCnName)
          }
        })
      })
      return (sceneNames.join(','))
    },
    getId (item) {
      return item.id
    },
    genDefaultFilter () {
      return {
        id: '',
        recName: '',
        source: this.source,
        scene: this.scene
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
      this.$service.getNewMediaAutomationList(filter).then(data => {
        this.pagination.total = data.total || 0
        this.table.data = data.rows || []
      })
    },
    fetchMediaSence () {
      this.$service.getMediaSence().then(res => {
        this.sceneOption = res
      })
    }
  },
  created () {
  },
  mounted () {
    this.fetchMediaSence()
  }
}
</script>

<style lang="stylus" scoped>
.selected-item
  margin-right 10px
</style>
