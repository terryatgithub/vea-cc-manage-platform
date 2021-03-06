<template>
  <ContentCard title="待处理影片详情页" @go-back="$emit('go-back')">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <div class="el-row">
      </div>

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
import { ContentWrapper, Table } from 'admin-toolkit'
import BaseList from '@/components/BaseList'
import { cloneDeep } from 'lodash'
export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table
  },

  data () {
    return {
      resourceType: 'film',
      pannelValue: [],
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      pagination: {
        currentPage: 1,
        pageSize: 20
      },
      tabStatusOption: [
        { label: '下架', value: '0' },
        { label: '上架', value: '1' },
        { label: '草稿', value: '2' },
        { label: '待审核', value: '3' },
        { label: '审核通过', value: '4' },
        { label: '审核不通过', value: '5' }
      ],
      productOptions: [], // 产品包筛选条件
      channelOptions: [],
      table: {
        props: {},
        data: [],
        header: [
          {
            prop: 'tabId',
            label: 'ID',
            sortable: true
          },
          {
            prop: 'tabName',
            label: '版面名称',
            minWidth: 180,
            'show-overflow-tooltip': true,
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.handleRead(row)
                    }
                  }
                },
                row.tabName
              )
            }
          },
          {
            prop: 'filmDetailPageInfo.priority',
            label: '优先级',
            sortable: true
          },
          {
            prop: 'tabCategory',
            label: '业务分类',
            sortable: true,
            formatter: row => {
              return row.tabCategory === 0 || row.tabCategory === 67
                ? '影视'
                : row.tabCategory === 1
                  ? '教育'
                  : ''
            }
          },
          {
            prop: 'filmDetailPageInfo.source',
            label: '内容源',
            sortable: true,
            formatter: row => {
              if (row.tabCategory === 0 || row.tabCategory === 67) {
                switch (row.filmDetailPageInfo.source) {
                  case 'qq':
                    return '腾讯'
                  case 'iqiyi':
                    return '爱奇艺'
                  case 'youku':
                    return '优酷'
                }
              } else {
                return ''
              }
            }
          },
          {
            prop: 'tabStatus',
            label: '版本/状态',
            sortable: true,
            formatter: row => {
              return row.currentVersion + '/' + this.$consts.statuxText[row.tabStatus]
            }
          },
          {
            prop: 'duplicateVersion',
            label: '待审核副本',
            sortable: true,
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.handleRead(row, row.duplicateVersion)
                    }
                  }
                },
                row.duplicateVersion
              )
            }
          },
          {
            prop: 'lastUpdateDate',
            label: '更新时间',
            sortable: true,
            width: 140
          },
          {
            prop: 'modifierName',
            label: '更新人',
            sortable: true
          },
          {
            prop: 'auditor',
            label: '审核人',
            sortable: true
          }
        ],
        selected: [],
        selectionType: 'multiple'
      },
      selected: [],
      filterFormRules: {
        tabId: [
          {
            validator (rule, value, cb) {
              if (value && !/^\d+$/.test(value)) {
                return cb(Error('请输入数字'))
              }
              cb()
            }
          }
        ]
      }
    }
  },

  methods: {
    genDefaultFilter () {
      return {
        keyword: 'tab',
        subCategoryArray: 3
      }
    },
    /**
     * 获取数据
     */
    fetchData () {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.desktopGetDataSyncList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
        this.table.selected = []
        this.selected = []
      })
    },
    parseFilter () {
      const { pagination } = this
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange () {
      this.$refs.filterForm.validate((valid) => {
        if (valid) {
          this.pagination.currentPage = 1
          this.efficientFilter = cloneDeep(this.filter)
          this.fetchData()
        }
      })
    },
    handleFilterReset () {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pannelValue = []
      this.pagination.currentPage = 1
      this.fetchData()
    },
    // 服务
    getMediaResourceInfo () {
      return this.$service.getMediaResourceInfo().then(data => {
        var movieData = JSON.parse(decodeURI(data.slice(5, -1)))
        var videoItemModels = movieData.videoItemModels
        // 产品包
        var productList = videoItemModels.reduce((result, item) => {
          result.push(item.productList)
          return result
        }, [])
        var productItems = [].concat.apply([], productList)
        this.productOptions = productItems

        // 频道->爱奇艺channelOptions
        var channelQiyi = {
          label: '爱奇艺',
          value: 'iqiyi',
          children: []
        }
        channelQiyi.children = videoItemModels[0].categoryList.reduce(
          (result, item) => {
            return result.concat({
              label: item.category_name,
              value: item.cc_category_id
            })
          },
          []
        )
        var channelTent = {
          label: '腾讯',
          value: 'qq',
          children: []
        }
        channelTent.children = videoItemModels[1].categoryList.reduce(
          (result, item) => {
            return result.concat({
              label: item.category_name,
              value: item.cc_category_id
            })
          },
          []
        )
        var channelYouku = {
          label: '优酷',
          value: 'youku',
          children: []
        }
        channelYouku.children = videoItemModels[2].categoryList.reduce(
          (result, item) => {
            return result.concat({
              label: item.category_name,
              value: item.cc_category_id
            })
          },
          []
        )
        this.channelOptions.push(channelQiyi)
        this.channelOptions.push(channelTent)
        this.channelOptions.push(channelYouku)
      })
    },
    handleChannelChange (value) {
      this.filter['filmDetailPageInfo.source'] = ''
      this.filter['filmDetailPageInfo.source'] = value[0]
    }
  },
  created () {
    this.getMediaResourceInfo().then(() => {})
    this.fetchData()
  }
}
</script>

<style lang='stylus' scoped>
.content >>> .el-form-item__content
                width: 100%
                .el-select,.el-cascader
                   width 100%
 .content
    >>> .el-form--inline .el-form-item {
           margin-right: 0px;
}
</style>
