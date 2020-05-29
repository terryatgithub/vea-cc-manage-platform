<template>
  <RemoteSelectorWrapper
    ref="wrapper"
    title="选择版块"
    custom-class="resource-selector"
    @select-start="handleSelectStart">
    <template slot="content" slot-scope="{isShow}">
      <BaseSelector
        v-if="isLive ? true : isShow"
        ref="baseSelector"
        id-field="pannelGroupId"
        :is-live="isLive"
        :selection-type="selectionType"
        :table="table"
        :pagination="pagination"
        @pagination-change="fetchData"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
        <el-form slot="filter" @keypress.enter.prevent.native="handleFilterChange" :inline="true" v-model="filter">
          <el-form-item>
            <el-select filterable v-model="filter.pannelType" placeholder="类型">
              <el-option :value="1" label="内容版块"></el-option>
              <el-option :value="3" label="专辑版块"></el-option>
              <el-option :value="5" label="专属影院版块"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <InputPositiveInt clearable v-model="filter.pannelId" placeholder="版块ID"></InputPositiveInt>
          </el-form-item>
          <el-form-item >
            <el-input clearable v-model="filter.pannelName" placeholder="版块名称"></el-input>
          </el-form-item>
          <el-form-item >
            <el-select filterable clearable v-model="filter.pannelCategory" placeholder="业务分类">
              <el-option
                v-for="(item, index) in panelCategoryOptions"
                :key="index"
                :disabled="item.disabled"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select filterable clearable v-model="filter.pannelStatus" placeholder="状态">
              <el-option
                v-for="(item, index) in $consts.statusOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select filterable clearable v-model="filter.parentType" placeholder="版块组类型">
              <el-option
                v-for="(item, index) in parentTypeOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select filterable clearable v-model="filter.fillType" placeholder="版块内容来源">
              <el-option
                v-for="(item, index) in fillTypeOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select filterable clearable v-model="filter.idPrefix" placeholder="数据来源">
              <el-option label="酷开" value="10"></el-option>
              <el-option label="江苏广电" value="11"></el-option>
            </el-select>
          </el-form-item>

          <el-button type="primary" @click="handleFilterChange">查询</el-button>
          <el-button type="warning" @click="handleResetFilter">重置</el-button>
        </el-form>
      </BaseSelector>
    </template>
    <slot></slot>
  </RemoteSelectorWrapper>
</template>

<script>
import RemoteSelectorWrapper from '../RemoteSelectorWrapper'
import BaseSelector from '../BaseSelector'
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  components: {
    RemoteSelectorWrapper,
    BaseSelector,
    InputPositiveInt
  },
  data () {
    const panelStatusOptions = this.$consts.statusOptions.filter(item => {
      return [3, 4, 7].indexOf(item.value) > -1
    })
    const panelStatusOptionsIndexed = panelStatusOptions.reduce(
      (result, item) => {
        result[item.value] = item.label
        return result
      },
      {}
    )
    return {
      options: [],
      panelCategoryOptions: [],
      pannelCategoryOptionsIndexed: {},
      panelStatusOptions,
      panelStatusOptionsIndexed,
      parentTypeOptions: [
        {
          label: '分组版块',
          value: 'group'
        },
        {
          label: '功能版块',
          value: 'function'
        }
      ],
      fillTypeOptions: [],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      table: {
        data: [],
        selected: [],
        header: [
          {
            label: 'ID',
            prop: 'pannelGroupId'
          },
          {
            label: '名称',
            prop: 'pannelGroupRemark',
            'show-overflow-tooltip': true,
            width: 200
          },
          {
            label: '业务分类',
            width: 100,
            render: function (h, scope) {
              return this.pannelCategoryOptionsIndexed[scope.row.pannelCategory]
            }.bind(this)
          },
          {
            label: '布局',
            width: 200,
            prop: 'fullLayoutName',
            'show-overflow-tooltip': true
          },
          {
            label: '引用状态',
            prop: 'fullTabName',
            'show-overflow-tooltip': true
          },
          {
            label: '状态',
            render: function (h, scope) {
              return this.$consts.statusText[scope.row.pannelStatus]
            }.bind(this)
          },
          {
            label: '版块内容来源',
            render: function (h, scope) {
              return this.$consts.panelFillTypeText[scope.row.pannelList[0].fillType]
            }.bind(this)
          },
          {
            prop: 'lastUpdateDate',
            label: '更新时间',
            width: 190
          },
          {
            prop: 'userName',
            label: '更新人',
            width: 120
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
  props: ['isLive', 'source', 'selectionType', 'tabType'],
  computed: {
    isAlbumTab () {
      return this.tabType === 2
    }
  },
  methods: {
    handleSelectStart () {
      this.$emit('select-start')
      this.fetchData()
    },
    handleSelectCancel () {
      this.$refs.wrapper.handleSelectCancel()
    },
    handleSelectEnd (data) {
      if (!this.isAlbumTab) {
        // 校验版块是否存在多功能推荐位
        const validPanelPlugin = function (pluginType, panel) {
          const pluginTypeList = (panel.pluginTypes || '').split(',')
          return pluginTypeList.some(item => item === pluginType)
        }
        for (let i = 0; i < data.length; i++) {
          const panel = data[i]
          if (validPanelPlugin('REFERENCE_PLAY_VIDEO', panel)) {
            return this.$message.error('版块' + panel.pannelGroupRemark + '含有【播放视频推荐位】，只能配置在专题版面中')
          }
          if (validPanelPlugin('REFERENCE_VIP_QRCODE', panel)) {
            return this.$message.error('版块' + panel.pannelGroupRemark + '含有【VIP二维码推荐位】，只能配置在专题版面中')
          }
        }
      }
      this.$emit('select-end', data)
      this.$refs.wrapper.handleSelectEnd()
    },
    genDefaultFilter () {
      return {
        idPrefix: this.$consts.idPrefix,
        pannelType: 1,
        panelId: undefined,
        pannelName: undefined,
        pannelCategory: undefined,
        pannelStatus: undefined,
        parentType: undefined,
        pannelResource: undefined,
        resourceIsNull: true,
        fillType: undefined
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
    fetchData () {
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      const pagination = this.pagination
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      if (!filter.pannelStatus) {
        filter.multiStatus = '3,4'
      }
      filter.pannelResource = this.source
      this.$service.panelPageList(filter).then(data => {
        this.table.data = data.rows
        this.pagination.total = data.total
      })
    }
  },
  created () {
    this.$service.getDictType({ type: 'businessType' }).then(data => {
      this.panelCategoryOptions = data.map(item => {
        return {
          label: item.dictCnName,
          value: item.dictId,
          disabled: item.disabled
        }
      })
      this.pannelCategoryOptionsIndexed = this.panelCategoryOptions.reduce((result, item) => {
        result[item.value] = item.label
        return result
      }, {})
    })
    this.$service.getMediaFillType().then(data => {
      this.fillTypeOptions = data.map(item => {
        return {
          label: item.dictCnName,
          value: parseInt(item.dictEnName)
        }
      })
    })
  }
}
</script>

<style>

</style>
