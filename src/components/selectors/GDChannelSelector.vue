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
            <el-form-item >
              <el-select
                placeholder="省份"
                v-model="filter.provincesCode"
                filterable
                clearable>
                <el-option
                  v-for="item in provinceOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="filter.ccChannelTitle" clearable placeholder="聚合频道名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilterChange">查询</el-button>
              <el-button @click="handleResetFilter">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </BaseSelector>

      <GDScheduleSelector
        ref="gdChannelSelector"
        :provincesCode="currentProvincesCode"
        :channelId="currentChannelId"
        @select-end="handleSelectScheduleEnd" >
        <span></span>
      </GDScheduleSelector>

    </template>
  </RemoteSelectorWrapper>
</template>

<script>
import RemoteSelectorWrapper from '../SelectorWrapper'
import BaseSelector from '../BaseSelector'
import GDScheduleSelector from './GDScheduleSelector'
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
        data: [],
        selected: [],
        header: [
          {
            label: '聚合频道ID',
            prop: 'ccChannelId'
          },
          {
            label: '聚合频道名',
            prop: 'ccChannelTitle'
          },
          {
            label: '聚合之中的省份',
            prop: 'provincesName',
            render: (h, { row }) => {
              const provincesNameList = row.provincesName.split(',').map(province => {
                return h('el-button', {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      row.activeProvince = province
                    }
                  }
                }, province)
              })
              if (provincesNameList.length === 1) {
                row.activeProvince = row.provincesName
              }
              return h('div', provincesNameList)
            }
          },
          {
            label: '已选省份',
            width: '105',
            prop: 'activeProvince'
          },
          {
            prop: 'segment',
            label: '已选节目',
            type: 'specialBut',
            width: '105',
            mouseStyle: 'hover',
            fixed: 'right',
            render: (h, { row }) => {
              const ccChannelId = row.ccChannelId
              const selectedSchedules = this.selectedSchedules
              if (selectedSchedules[ccChannelId]) {
                return h('el-button', {
                  attrs: {
                    type: 'primary',
                    text: '已选节目',
                    value: '已选节目',
                    title: selectedSchedules[ccChannelId].thirdScheduleTitle
                  } }, '已选节目')
              }
            }
          },
          {
            prop: 'but',
            label: '操作',
            width: '105',
            fixed: 'right',
            render: (h, { row }) => {
              if (this.hasSchedule === undefined) {
                return
              }
              return h('el-button', {
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    this.handleSelectScheduleStart(row)
                  }

                }
              }, '选择节目')
            }
          }
        ],
        selectionType: 'single',
        props: {
          'tooltip-effect': 'dark'
        }
      },
      currentChannelId: undefined,
      currentProvincesCode: undefined,
      selectedSchedules: {} // 已选节目映射表
    }
  },
  props: ['title', 'disabled', 'isLive', 'source', 'selectionType', 'initSelected', 'hasSchedule'],
  computed: {
  },
  components: {
    RemoteSelectorWrapper,
    BaseSelector,
    GDScheduleSelector
  },
  methods: {
    getId (item) {
      return item.ccChannelId
    },
    genDefaultFilter () {
      return {
        ccChannelTitle: '',
        provincesCode: ''
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
      if (this.hasSchedule !== undefined) {
        const isSomeNotSchedule = data.some(e => this.selectedSchedules[e.ccChannelId] === undefined)
        if (isSomeNotSchedule) {
          return this.$message.error('请选择节目')
        }
      }
      data = data.map((e) => {
        e.selectedSchedules = this.selectedSchedules[e.ccChannelId]
        return e
      })
      this.$emit('select-end', data)
      this.$refs.wrapper.handleSelectEnd()
    },
    handleSelectScheduleStart (row) {
      if (!row.activeProvince) {
        this.$message.error('请点击聚合之中的省份，选择一个省份')
      }
      this.currentChannelId = row.ccChannelId
      this.currentProvincesCode = (this.provinceOptions.find(item => item.label === row.activeProvince) || {}).value + ''
      this.$nextTick(() => {
        this.$refs.gdChannelSelector.$refs.wrapper.handleSelectStart()
      })
    },
    handleSelectScheduleEnd (schedules) {
      const currentChannelId = this.currentChannelId
      this.$set(this.selectedSchedules, currentChannelId, schedules[0])
      // 自动勾选当前影片
      const tableData = this.table.data
      const index = tableData.findIndex(item => item.ccChannelId === currentChannelId)
      const channel = tableData[index]
      const baseSelector = this.$refs.baseSelector
      if (this.selectionType === 'single') {
        if (baseSelector.tableSelected !== index) {
          baseSelector.handleTableRowSelectionChange(channel, index)
        }
      } else if (this.selectionType === 'multiple') {
        if (baseSelector.tableSelected.indexOf(index) === -1) {
          baseSelector.handleTableRowSelectionAdd(channel, index)
        }
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
      this.$service.mediaGetGDChannelList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    getProvinceOptions () {
      this.$service.mediaGetChannelProvinceOptions().then(result => {
        this.provinceOptions = result
      })
    }
  },
  created () {
    this.getProvinceOptions()
  }
}
</script>

<style lang="stylus" scoped>
.selected-item
  margin-right 10px
</style>
