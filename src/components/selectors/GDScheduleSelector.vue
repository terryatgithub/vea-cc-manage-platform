<template>
  <remote-selector-wrapper
    ref="wrapper"
    title="选择节目"
    @select-start="handleSelectStart"
  >
    <BaseSelector
      slot="content"
      ref="baseSelector"
      id-field="thirdScheduleId"
      :selection-type="selectionType"
      :table="table"
      :pagination="pagination"
      :select-end-on-dbl-click="true"
      @pagination-change="fetchData"
      @filter-reset="handleFilterReset"
      @select-cancel="handleSelectCancel"
      @select-end="handleSelectEnd">
      <el-form slot="filter" :inline="true" v-model="filter" label-width="72px">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="filter.startTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyyMMdd"
            :picker-options="startTimePickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-button size="small" type="primary" @click="handleFilterChange">查询</el-button>
        <el-button size="small" type="warning" @click="handleFilterReset">重置</el-button>
      </el-form>
    </BaseSelector>
    <slot></slot>
  </remote-selector-wrapper>
</template>

<script>
import BaseSelector from '../BaseSelector'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'

export default {
  components: {
    BaseSelector,
    RemoteSelectorWrapper
  },
  data () {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      filter: this.getDefaultFilter(),
      efficientFilter: this.getDefaultFilter(),
      table: {
        props: {},
        header: [
          {
            label: '节目标题',
            prop: 'thirdScheduleTitle',
            width: '70'
          },
          {
            label: '节目id',
            prop: 'thirdScheduleId',
            width: '150'
          },
          {
            label: '第三方频道Id',
            prop: 'thirdChannelId'
          },
          {
            label: '频道Id',
            prop: 'ccChannelId'
          },
          // {
          //   label: '频道描述',
          //   prop: 'scheduleDesc'
          // },
          // {
          //   label: '介绍',
          //   prop: 'scheduleDescHead'
          // },
          {
            label: '时长',
            width: 120,
            render: (h, { row }) => {
              return this.secondToTimeStr(row.duration)
            }
          },
          {
            label: '节目开始时间',
            prop: 'startTime'
          },
          {
            label: '节目结束时间',
            prop: 'endTime'
          }
        ],
        data: [],
        selected: [],
        selectionType: 'single'
      },
      selected: [],
      startTimePickerOptions: {
        disabledDate (time) {
          return time.getTime() > (Date.now() - 3600 * 1000 * 24)
        }
      }
    }
  },
  props: {
    selectionType: {
      type: String,
      default () {
        return 'single'
      }
    },
    provincesCode: String,
    channelId: String
  },
  methods: {
    secondToTimeStr (seconds) {
      if (seconds) {
        const hour = Math.floor(seconds / 3600)
        const min = Math.floor((seconds - 3600 * hour) / 60)
        const sec = seconds - 3600 * hour - 60 * min
        return `${hour}小时${min}分${sec}秒`
      }
    },
    handleSelectStart () {
      const baseSelector = this.$refs.baseSelector
      if (baseSelector) {
        baseSelector.clearSelected()
      }
      this.handleFilterReset()
    },
    handleSelectCancel () {
      this.$refs.wrapper.handleSelectCancel()
    },
    getDefaultFilter () {
      const startTime = new Date(Date.now() - 3600 * 1000 * 24).toISOString().slice(0, 10).replace(/-/g, '')
      return {
        provincesCode: this.provincesCode,
        channelId: this.channelId,
        startTime
      }
    },
    getFilter () {
      const pagination = this.pagination
      const filter = { ...this.efficientFilter }
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange () {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = this.getDefaultFilter()
      this.efficientFilter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.table.data = []
      this.fetchData()
    },
    fetchData () {
      const filter = this.getFilter()
      this.$service.mediaGetGDSchedulelList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows || []
      })
    },
    handleSelectEnd () {
      this.$refs.wrapper.handleSelectEnd()
      this.$emit('select-end', ...arguments)
    }
  },
  created () {
  }
}
</script>

<style lang='stylus' scoped>
</style>
