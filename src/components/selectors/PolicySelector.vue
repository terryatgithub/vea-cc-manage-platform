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
        id-field="id"
        :selection-type="selectionType"
        :select-end-on-click="true"
        :table="table"
        :filter="filter"
        :pagination="pagination"
        @pagination-change="fetchData"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">

        <el-form
          inline
          slot="filter"
          ref="form"
          v-model="filter"
          @keypress.enter.native.prevent="handleFilterChange"
          @submit.native.prevent="handleFilterChange">
          <el-form-item>
            <InputPositiveInt name="id" autocomplete="on" v-model="filter.id" placeholder="策略组ID" />
          </el-form-item>
          <el-form-item>
            <el-input name="policyGroupName" autocomplete="on" v-model="filter.policyGroupName" placeholder="策略组名称" />
          </el-form-item>
          <el-form-item>
            <el-input name="model" autocomplete="on" v-model="filter.model" placeholder="机型" />
          </el-form-item>
          <el-form-item>
            <el-input name="chip" autocomplete="on" v-model="filter.chip" placeholder="机芯" />
          </el-form-item>
          <el-form-item>
            <InputPositiveInt name="homepageId" autocomplete="on" v-model="filter.homepageId" placeholder="首页方案ID" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">查询</el-button>
            <el-button  @click="handleResetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </BaseSelector>
    </template>
  </RemoteSelectorWrapper>
</template>

<script>
import RemoteSelectorWrapper from '../SelectorWrapper'
import BaseSelector from '../BaseSelector'
import InputPositiveInt from '@/components/InputPositiveInt'
import _ from 'gateschema'
export default {
  components: {
    RemoteSelectorWrapper,
    BaseSelector,
    InputPositiveInt
  },
  data () {
    return {
      options: [],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      filterSchema: null,
      table: {
        data: [],
        selected: [],
        header: [
          {
            label: '策略组ID',
            prop: 'id'
          },
          {
            label: '策略组名称',
            prop: 'policyGroupName',
            'show-overflow-tooltip': true
          },
          {
            label: '机型/机芯',
            prop: 'chip',
            render: (h, { row }) => {
              return this.getModelChipInfo(h, row)
            }
          },
          {
            label: '版本/状态',
            prop: 'tabStatus',
            formatter: row => {
              const status = row.status
              const currentVersion = row.currentVersion
              return `${currentVersion}/${this.$consts.statusText[status]}`
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: 140
          }
        ],
        selectionType: 'multiple',
        props: {
          'tooltip-effect': 'dark'
        }
      },
      selected: [],
      originSelected: []
    }
  },
  props: ['title', 'disabled', 'isLive', 'source', 'selectionType', 'category', 'homepageModel', 'platform', 'checkPlatform'],
  computed: {
  },
  methods: {
    handleSelectStart () {
      this.$emit('select-start')
      if (!this.isLive) {
        this.handleResetFilter()
      } else {
        this.fetchData()
      }
    },
    handleSelectCancel () {
      this.$refs.wrapper.handleSelectCancel()
    },
    handleSelectEnd (data) {
      const { platform, checkPlatform } = this
      const selectPlatform = data[0].platform
      if (checkPlatform) {
        if (checkPlatform && platform && selectPlatform && checkPlatform !== selectPlatform) {
          this.$confirm('选中策略的机型机芯的内容源与当前策略的机型机芯的内容源不一样，当前策略的机型机芯将被清除，是否继续操作？', '提示')
            .then(() => {
              this.$emit('select-end', data, { platform: selectPlatform, isReset: true })
              this.$refs.wrapper.handleSelectEnd()
            })
            .catch(() => {})
        }
      } else {
        this.$emit('select-end', data, { platform: selectPlatform })
        this.$refs.wrapper.handleSelectEnd()
      }
    },
    genDefaultFilter () {
      return {
        id: '',
        policyGroupName: '',
        model: '',
        chip: '',
        homepageId: '',
        status: '',
        mac: ''
      }
    },
    handleFilterChange () {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleResetFilter () {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    getModelChipInfo (h, row) {
      const rlsModelChipList = row.rlsModelChipList || []
      const count = rlsModelChipList.length
      let info
      if (count > 3) {
        info = `${count}个`
      } else {
        info = rlsModelChipList.map(item => h('div', `${item.model}-${item.chip}`))
      }
      return h('div', null, info)
    },
    fetchData () {
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      const pagination = this.pagination
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      this.$service.policyGroupList(filter).then(data => {
        this.table.data = data.rows
        this.pagination.total = data.total
      })
    }
  },
  created () {
    let filterSchema = _.map({
      homepageId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      homepageName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '名称'
      })
    }).other('form', {
      cols: {
        item: 6,
        label: 0,
        wrapper: 22
      },
      layout: 'inline',
      footer: {
        cols: {
          item: 6,
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
  }
}
</script>

<style>

</style>
