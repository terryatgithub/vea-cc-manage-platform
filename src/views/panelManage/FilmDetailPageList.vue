<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="handleFilterChange">
      <div class="el-row">
      <el-form :model="filter" inline label-width="90px" >
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-input v-model="filter.tabId" placeholder="板面ID"/>
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-input v-model="filter.tabName" placeholder="版面名称"/>
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select
              v-model="filter['filmDetailPageInfo.source']"
              placeholder="内容源"
              clearable
              @change="pannelValue=[];filter['filmDetailPageInfo.channel']=[]"
            >
              <el-option value="qq" label="腾讯"/>
              <el-option value="iqiyi" label="爱奇艺"/>
              <el-option value="youku" label="优酷"/>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select v-model="filter.tabStatus" clearable placeholder="状态">
              <el-option
                v-for="item in tabStatusOption"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select v-model="filter['filmDetailPageInfo.category']" clearable placeholder="业务分类">
              <el-option value="0" label="影视"/>
              <el-option value="1" label="教育"/>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-cascader
              placeholder="频道"
              :value="filter['filmDetailPageInfo.channel']"
              :options="channelOptions"
              expand-trigger="hover"
              clearable
              @change="handleChannelChange"
            />
          </div>
        </el-form-item>
        <el-form-item class="el-col el-col-6">
          <div class="el-col-20">
            <el-select v-model="filter['filmDetailPageInfo.product']" clearable placeholder="产品包">
              <el-option
                v-for="(item, index) in productOptions"
                :key="index"
                :label="item.source_name"
                :value="item.source_sign"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="handleFilterChange">查询</el-button>
          <el-button  @click="handleFilterReset">重置</el-button>
        </el-form-item>
      </el-form>
      </div>
        <ButtonGroupForListPage
        pageName='filmDetailPage'
        @add="addFilmDetail"
        @edit="editData"
        @delete="batchDel"
        >
        </ButtonGroupForListPage>

      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
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
export default {
  components: {
    ContentWrapper,
    ButtonGroupForListPage,
    Table
  },

  data() {
    return {
      pannelValue: [],
      filter: this.getDefaultFilter(),
      pagination: {
        currentPage: 1
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
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.openReview(row)
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
              return row.tabCategory == 0 || row.tabCategory == 67
                ? '影视'
                : row.tabCategory == 1
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
              return (
                row.currentVersion +
                '/' +
                ['下架', '上架', '草稿', '待审核', '审核通过', '审核不通过'][
                  row.tabStatus
                ]
              )
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
                      this.openReviewWithVersion(row)
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
            sortable: true
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
      selected: []
    }
  },

  methods: {
    getDefaultFilter() {
      return {
        tabType: 3,
        idPrefix: '10',
        tabId: undefined,
        tabName: undefined,
        tabStatus: undefined,
        'filmDetailPageInfo.source': undefined,
        'filmDetailPageInfo.channel': [],
        'filmDetailPageInfo.category': undefined,
        'filmDetailPageInfo.product': undefined
      }
    },
    /**
     * 获取数据
     */
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.tabInfoList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
        this.table.selected = []
        this.selected = []
      })
    },
    parseFilter() {
      const { pagination } = this
      const filter = JSON.parse(JSON.stringify(this.filter))
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      const channel = filter['filmDetailPageInfo.channel'][1]
      if (channel) {
        filter['filmDetailPageInfo.channel'] = channel
      }
      return filter
    },
    // 表单筛选
    // handleFilterChange(type) {
    //   if (this.$validateId(this.filter.tabId)) {
    //     if (type === 'query') {
    //       if (this.pagination) {
    //         this.pagination.currentPage = 1
    //       }
    //     }
    //     this.fetchData()
    //   }
    // },
    handleFilterChange(type) {
      if (type !== 'pagination') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = this.getDefaultFilter()
      this.pannelValue = []
      this.pagination.currentPage = 1
      this.fetchData()
    },
    // 按钮操作
    addFilmDetail() {
      this.$emit('open-add-page')
    },
    editData() {
      const selected = this.selected
      if (selected.length !== 1) {
        this.$message('只能选择一条数据')
        return false
      }
      this.$service
        .tabInfoGet({ id: selected.join(), tabType: 3 })
        .then(data => {
          if (data.tabStatus !== 2) {
            this.$alert('该状态不允许编辑！', '操作提示', {
              confirmButtonText: '确定'
            })
            return false
          } else {
            this.$emit('open-add-page', selected[0], 'edit')
          }
        })
    },
    batchDel() {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      }
      if (window.confirm('确定要删除吗')) {
        const select = this.selected.join(',')
        this.$service
          .removeFilmDetailPage({ id: select }, '删除成功')
          .then(() => {
            this.fetchData()
          })
      }
    },
    /**
     * 行选择操作
     */
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.tabId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.tabId
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.table.selected = []
      }
    },
    handleAllRowSelectionRemove() {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.tabId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    // 服务
    getMediaResourceInfo() {
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

    handleChannelChange(value) {
      this.filter['filmDetailPageInfo.source'] = ''
      this.filter['filmDetailPageInfo.source'] = value[0]
    },
    openReview(row) {
      this.$emit('open-add-page', row.tabId, 'read')
    },
    openReviewWithVersion(row) {
      this.$emit('open-add-page', row.tabId, 'read', row.duplicateVersion)
    }
  },
  created() {
    this.getMediaResourceInfo().then(() => {})
    this.fetchData()
  }
}
</script>

<style lang='stylus' scoped>
.content >>> .el-table .cell
                display: flex
                justify-content: center
                align-items: center
                height: 40px
.btns
  margin: 20px auto
.content >>> .el-form-item__content
                width: 100%
                .el-select,.el-cascader
                   width 100%
 .content
    >>> .el-form--inline .el-form-item {
           margin-right: 0px;
}
</style>
