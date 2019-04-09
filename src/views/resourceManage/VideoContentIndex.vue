<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :pagination="handleFilterChange"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <div class="cc-movie-filter">
        <div class="cc-search">
          <el-collapse value="1">
            <el-collapse-item title="查询条件" name="1">
              <el-form
                :inline="true"
                :model="searchForm"
                class="search-form-inline"
                label-width="72px"
              >
                <el-form-item label="渠道">
                  <el-select v-model="partner" size="small">
                    <el-option
                      v-for="(partner, pIndex) in partnerList"
                      :key="pIndex"
                      :label="partner.label"
                      :value="partner.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="内容源">
                  <el-select v-model="searchForm.sources" @change="sourceSelectChange" size="small">
                    <!-- <el-option
                      v-for="(source, sIndex) in source"
                      :key="source.source_code"
                      :label="source.source_title"
                      :value="source.source_code"
                    ></el-option>-->
                    <el-option
                      v-for="source in source"
                      :key="source.source_code"
                      :label="source.source_title"
                      :value="source.source_code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="searchForm.sources === 'tencent'" label="牌照">
                  <el-select v-model="searchForm.licensee" size="small" clearable>
                    <!-- <el-option
                    v-for="(item, index) in conditionList.licensee"
                    :key="item.tagId"
                    :label="item.tagCnName"
                    :value="item.tagEnName"
                    ></el-option>-->
                    <el-option label="请选择/输入" value></el-option>
                    <el-option
                      v-for="item in conditionList.licensee"
                      :key="item.tagId"
                      :label="item.tagCnName"
                      :value="item.tagEnName"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="频道类型">
                  <el-select
                    filterable
                    v-model="searchForm.category"
                    @change="categorySelectChange"
                    size="small"
                  >
                    <el-option label="请选择/输入" value></el-option>
                    <!-- <el-option
                    v-for="(category, cIndex) in categories"
                    :key="category.categoryId"
                    :label="category.categoryName"
                    :value="category.categoryId"
                    ></el-option>-->
                    <el-option
                      v-for="category in categories"
                      :key="category.categoryId"
                      :label="category.categoryName"
                      :value="category.categoryId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="影片类型">
                  <el-select filterable v-model="searchForm.videoTypes" size="small">
                    <el-option label="请选择/输入" value></el-option>
                    <!-- <el-option
                    v-for="(videoType, vIndex) in videoTypes"
                    :key="videoType.tagId"
                    :label="videoType.tagName"
                    :value="videoType.tagName"
                    ></el-option>-->
                    <el-option
                      v-for="videoType in videoTypes"
                      :key="videoType.tagId"
                      :label="videoType.tagName"
                      :value="videoType.tagName"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="付费类型">
                  <el-select filterable v-model="searchForm.payTypes" size="small">
                    <el-option label="请选择/输入" value></el-option>
                    <!-- <el-option
                      v-for="(payType, pIndex) in conditionList.payTypes"
                      :key="payType.tagId"
                      :label="payType.tagCnName"
                      :value="payType.tagEnName"
                    ></el-option>-->
                    <el-option
                      v-for="payType  in conditionList.payTypes"
                      :key="payType.tagId"
                      :label="payType.tagCnName"
                      :value="payType.tagEnName"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="标题">
                  <el-input v-model="searchForm.title" size="small"></el-input>
                </el-form-item>
                <el-form-item label="素材类型">
                  <el-select v-model="searchForm.contentTypes" size="small">
                    <el-option label="请选择" value></el-option>
                    <el-option
                      v-for="contentType in conditionList.contentTypes"
                      :key="contentType.contentTypeId"
                      :label="contentType.contentType"
                      :value="contentType.contentTypeId"
                    ></el-option>
                    <!-- <el-option
                      v-for="(contentType, cIndex) in conditionList.contentTypes"
                      :key="contentType.contentTypeId"
                      :label="contentType.contentType"
                      :value="contentType.contentTypeId"
                    ></el-option>-->
                  </el-select>
                </el-form-item>
                <el-form-item label="年代">
                  <el-input
                    size="small"
                    v-model="searchForm.yearStart"
                    @blur="yearStartListen"
                    style="width: 48px;"
                  ></el-input>-
                  <el-input
                    size="small"
                    v-model="searchForm.yearEnd"
                    @blur="yearEndListen"
                    style="width: 48px;"
                  ></el-input>
                </el-form-item>
                <span v-show="isMore">
                  <el-form-item label="影片格式">
                    <el-select v-model="searchForm.videoFormat" size="small">
                      <el-option label="请选择" value></el-option>
                      <!-- <el-option
                        v-for="(videoFormat, vIndex) in conditionList.videoFormat"
                        :key="videoFormat.tagEnName"
                        :label="videoFormat.tagCnName"
                        :value="videoFormat.tagEnName"
                      ></el-option>-->
                      <el-option
                        v-for="videoFormat in conditionList.videoFormat"
                        :key="videoFormat.tagEnName"
                        :label="videoFormat.tagCnName"
                        :value="videoFormat.tagEnName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="内容标签">
                    <el-select v-model="searchForm.contentTag" size="small">
                      <el-option label="请选择" value></el-option>
                      <!-- <el-option
                        v-for="(label, lIndex) in conditionList.contentTag"
                        :key="label.tagId"
                        :label="label.tagCnName"
                        :value="label.tagCnName"
                      ></el-option>-->
                      <el-option
                        v-for="label in conditionList.contentTag"
                        :key="label.tagId"
                        :label="label.tagCnName"
                        :value="label.tagCnName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="排序方式">
                    <el-select v-model="searchForm.orderBy"  style="width: 85px;">
                      <el-option label="请选择" value></el-option>
                      <!-- <el-option
                        v-for="(order, oIndex) in conditionList.orderBy"
                        :key="order.tagId"
                        :label="order.tagCnName"
                        :value="order.tagEnName"
                      ></el-option>-->
                      <el-option
                        v-for="order in conditionList.orderBy"
                        :key="order.tagId"
                        :label="order.tagCnName"
                        :value="order.tagEnName"
                      ></el-option>
                    </el-select>
                    <el-tooltip :content="orderTip">
                      <el-button
                        :icon="searchForm.order === 'asc' ? 'arrow-up' : 'arrow-down'"
                        size="mini"
                        @click="changeSort()"
                      ></el-button>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="导演">
                    <el-select v-model="searchForm.directors" filterable allow-create size="small">
                      <el-option label="请选择/输入" value></el-option>
                      <!-- <el-option
                        v-for="(director, dIndex) in conditionList.directors"
                        :key="director.tagId"
                        :label="director.tagCnName"
                        :value="director.tagCnName"
                      ></el-option>-->
                      <el-option
                        v-for="director in conditionList.directors"
                        :key="director.tagId"
                        :label="director.tagCnName"
                        :value="director.tagCnName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="主演">
                    <el-select v-model="searchForm.actors" filterable allow-create size="small">
                      <el-option label="请选择/输入" value></el-option>'
                      <!-- <el-option
                        v-for="(actor, aIndex) in conditionList.actors"
                        :key="actor.tagId"
                        :label="actor.tagCnName"
                        :value="actor.tagCnName"
                      ></el-option>-->
                      <el-option
                        v-for="actor in conditionList.actors"
                        :key="actor.tagId"
                        :label="actor.tagCnName"
                        :value="actor.tagCnName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="地区">
                    <el-select v-model="searchForm.areas" filterable allow-create size="small">
                      <el-option label="请选择/输入" value></el-option>
                      <!-- <el-option
                        v-for="(area, arIndex) in conditionList.areas"
                        :key="area.tagId"
                        :label="area.tagCnName"
                        :value="area.tagCnName"
                      ></el-option>-->
                      <el-option
                        v-for="area in conditionList.areas"
                        :key="area.tagId"
                        :label="area.tagCnName"
                        :value="area.tagCnName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </span>
                <div style="text-align: center">
                  <el-button
                    :icon="isMore ? 'arrow-up' : 'arrow-down'"
                    size="small"
                    @click="showMore()"
                  >{{ isMore ? '收起' : '展开'}}</el-button>
                  <el-button size="small" type="primary" @click="search">查询</el-button>
                  <el-button size="small" type="warning" @click="reset">重置</el-button>
                </div>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
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
import _ from 'gateschema'
import ButtonList from './../../components/ButtonLIst'
import { ContentWrapper, Table, ActionList, utils } from 'admin-toolkit'
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper
  },
  data() {
    return {
      searchForm: {
        sources: 'tencent', // 内容源
        category: '', // 频道类型
        videoTypes: '', // 影片类型
        licensee: '', // 牌照
        payTypes: '', // 付费类型
        provider: '', // 聚合内容
        title: '', // 标题
        contentTypes: '', // 素材类型
        yearStsearchFormart: null, // 开始年代
        yearEnd: null, // 结束年代
        videoFormat: '', // 影片格式
        contentTag: '', // 内容标签
        orderBy: '', // 排序方式
        order: 'desc', // 排序方式 asc:升序，desc：降序，默认降序
        directors: '', // 导演
        actors: '', // 主演
        areas: '' // 地区
      },
      partner: 'tencent',
      conditionList: {}, // 筛选条件
      searchParams: {},
      partnerList: [
        {
          label: '腾讯',
          value: 'tencent'
        },
        {
          label: '爱奇艺',
          value: 'yinhe'
        }
      ],
      source: [],
      categories: [], // 频道类型选项
      videoTypes: [],
      isMore: false,
      orderTip: '降序排列', // 排序按钮文字提示
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'coocaaVId'
          },
          {
            label: '标题',

            prop: 'title',
            sortable: true
          },
          {
            label: '副标题',
            prop: 'subTitle',
            width: '110',
            sortable: true
          },
          {
            label: '内容源',
            prop: 'ccVideoSourceEntities',
            'min-width': '90',
            render: (createElement, { row }) => {
              for (var i = 0; i < row.ccVideoSourceEntities.length; i++) {
                if (row.ccVideoSourceEntities[i].thirdSource === 'tencent') {
                  return '腾讯'
                }
                if (row.ccVideoSourceEntities[i].thirdSource === '4KGarden') {
                  return '4k花园'
                }
                if (row.ccVideoSourceEntities[i].thirdSource === 'yinhe') {
                  return '爱奇艺'
                }
              }
            }
          },
          {
            label: '状态',
            prop: 'videoStatus',
            'min-width': '160',
            render: (createElement, { row }) => {
              // 0为失效,1为有效,2待审核,3审核不通过,4草稿
              switch (row.videoStatus) {
                case 0:
                  return '失效'
                  break
                case 1:
                  return '有效'
                  break
                case 2:
                  return '待审核'
                  break
                case 3:
                  return '审核不通过'
                  break
                case 4:
                  return '草稿'
                  break
              }
            }
          },
          {
            label: '图片',
            prop: 'thumb',
            width: '130',
            render: (createElement, { row }) => {
              return createElement('img', {
                attrs: {
                  src: row.thumb,
                  width: '50px',
                  height: '50px',
                  class: 'imgs'
                }
              })
            }
          },
          {
            label: '影片类型',
            prop: 'videoType'
          },
          {
            label: '内容类型',
            prop: 'contentType',
            width: '170'
          },
          {
            label: '期数',
            prop: 'season'
          },
          {
            label: '导演',
            prop: 'directors',
            width: '170',
            sortable: true
          },
          {
            label: '演员',
            prop: 'actors',
            width: '170',
            sortable: true
          },
          {
            label: '地区',
            prop: 'publishArea',
            'min-width': '170'
          },
          {
            label: '年代',
            prop: 'year'
          },
          {
            label: '已选集数',
            prop: 'segment',
            fixed: 'right'
          },
          {
            label: '操作',
            fixed: 'right',
            render: utils.component.createOperationRender(this, {
              setRole: '选择单集'
            })
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  watch: {
    selected: function(newValue) {
      this.$emit('input', newValue)
    },
    tableData: function(newVal, oldVal) {
      console.log(newVal)
    },
    'searchForm.sources': {
      deep: true,
      handler: function(newVal, oldVal) {
        this.pannelResource = newVal
      }
    },
    partner: 'getSources',
    'searchForm.ccSearchReset': {
      deep: true,
      handler: function(newVal, oldVal) {
        this.searchForm.ccSearchReset = newVal
      }
    }
  },
  methods: {
    showMore: function() {
      // 展开/收起按钮的点击事件
      this.isMore = !this.isMore
    },
    search: function() {
      this.searchForm.ccSearchReset = false
      this.searchParams = this.deepClone(this.searchForm)
      this.fetchData()
      var newParam = Object.assign({}, this.singleObj)
      newParam.data = []
      newParam.selectId = ''
      newParam.index = undefined
      newParam.singleIdArr = []
      newParam.singleIndexArr = []
      newParam.titleArr = []
      newParam.titleArrData = []
    },
    reset: function() {
      this.searchForm = {
        // sources: this.pannelResource || 'tencent', // 内容源
        sources: 'tencent', // 内容源
        category: '', // 频道类型
        videoTypes: '', // 影片类型
        payTypes: '', // 付费类型
        provider: '', // 聚合内容
        title: '', // 标题
        contentTypes: '', // 素材类型
        yearStart: null, // 开始年代
        yearEnd: null, // 结束年代
        videoFormat: '', // 影片格式
        contentTag: '', // 内容标签
        orderBy: '', // 排序方式
        order: 'desc', // 排序方式 asc:升序，desc：降序，默认降序
        directors: '', // 导演
        actors: '', // 主演
        areas: '' // 地区
      }
      this.searchForm.ccSearchReset = true
      this.searchParams = this.deepClone(this.searchForm)
      if (this.partner !== 'tencent') {
        this.partner = 'tencent'
      }
      this.$nextTick(this.getSources)
      this.fetchData()
    },
    yearStartListen: function() {
      if (this.searchForm.yearStart && !+this.searchForm.yearStart) {
        this.$message('年代必须为数字')
        this.searchForm.yearStart = null
        return
      }
    },
    yearEndListen: function() {
      if (this.searchForm.yearEnd && !+this.searchForm.yearEnd) {
        this.$message('年代必须为数字')
        this.searchForm.yearEnd = null
        return
      }
    },
    categorySelectChange: function(categoryId) {
      // 切换频道类型
      this.searchForm.videoTypes = ''
      var categories = this.categories
      var cIndex = categories.findIndex(function(category) {
        return category.categoryId === categoryId
      })
      this.videoTypes = categories[cIndex]
        ? categories[cIndex].child[0].tagEntities
        : []
    },
    sourceSelectChange: function(sourceName) {
      // 切换内容源
      if (sourceName !== 'tencent') {
        this.searchForm.licensee = ''
      }
    },
     changeSort: function () { // 修改排序按钮的点击事件
            if (this.searchForm.order === 'asc') {
                this.searchForm.order = 'desc';
                this.orderTip = '降序排列';
            } else {
                this.searchForm.order = 'asc';
                this.orderTip = '升序排列';
            }
        },
    handleCreate() {
      this.$router.push({ name: 'prize-create' })
    },
    //表格操作
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.coocaaVId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.coocaaVId
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
      debugger
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.coocaaVId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    //查询
    handleFilterChange(type) {
      debugger
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    //重置
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
        filter.resType = 'vod'
        filter.callbackparam = 'result'
      }
      return filter
      console.log(filter)
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      let mediaObj = Object.assign({}, filter)
      if ((this.searchForm.ccSearchReset = true)) {
        mediaObj.sources = this.searchForm.sources
      } else {
        if (this.searchForm.sources) {
          mediaObj.sources = this.searchForm.sources //内容源
        }
      }
      if (this.searchForm.category) {
        mediaObj.category = this.searchForm.category //频道类型
      } else {
        delete mediaObj.category
      }
      if (this.searchForm.videoTypes) {
        mediaObj.videoTypes = this.searchForm.videoTypes //影片类型
      } else {
        delete mediaObj.videoTypes
      }
      if (this.searchForm.licensee) {
        mediaObj.licensee = this.searchForm.licensee //牌照
      } else {
        delete mediaObj.licensee
      }
      if (this.searchForm.payTypes) {
        mediaObj.payTypes = this.searchForm.payTypes //付费类型
      } else {
        delete mediaObj.payTypes
      }
      if (this.searchForm.yearStart) {
        mediaObj.yearStart = this.searchForm.yearStart //年代
      } else {
        delete mediaObj.yearStart
      }
      if (this.searchForm.yearEnd) {
        mediaObj.yearEnd = this.searchForm.yearEnd //年代
      } else {
        mediaObj.yearEnd
      }
      if (this.searchForm.title) {
        mediaObj.title = this.searchForm.title //标题
      } else {
        delete mediaObj.title
      }
      if (this.searchForm.contentTypes) {
        mediaObj.contentTypes = this.searchForm.contentTypes //素材类型
      } else {
        delete mediaObj.contentTypes
      }
      if (this.searchForm.videoFormat) {
        mediaObj.videoFormat = this.mediaObj.videoFormat //影片格式
      } else {
        delete mediaObj.videoFormat
      }
      if (this.searchForm.contentTag) {
        mediaObj.contentTag = this.searchForm.contentTag //内容标签
      } else {
        delete mediaObj.contentTag
      }
      if (this.searchForm.orderBy) {
        mediaObj.orderBy = this.searchForm.orderBy //排序方式
      } else {
        delete matchMedia.orderBy
      }
      if (this.searchForm.directors) {
        mediaObj.directors = this.searchForm.directors //导演
      } else {
        delete mediaObj.directors
      }
      if (this.searchForm.actors) {
        mediaObj.actors = this.searchForm.actors //演员
      } else {
        delete mediaObj.directors
      }
      if (this.searchForm.areas) {
        mediaObj.areas = this.searchForm.areas //地区
      } else {
        delete mediaObj.actors
      }
      this.$service.getMediaVideoInfos(mediaObj).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
        console.log(this.pagination.total)
      })
    },
    //
    getSources() {
      var partner = this.partner
      this.$service.getPartnerSource({ partnerName: partner }).then(data => {
        var source = data.rows.reduce(function(result, item) {
          if (item.source_List) {
            result = result.concat(item.source_List)
          }
          return result
        }, [])
        this.source = source
        var defaultSelected =
          source.find(function(item) {
            return item.source_code === partner
          }) || source[0]
        if (defaultSelected) {
          this.searchForm.sources = defaultSelected.source_code
        }
      })
    },
    getCondition() {
      this.$service.getCondition().then(data => {
        this.categories = data.vod.sources[0].child
        this.conditionList = data.vod
      })
    }
  },
  created() {
    this.fetchData()
    this.getSources() //内容源
    this.getCondition() //频道类型
  }
}
</script>
<style lang = 'stylus' scoped>
.btns {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
}
</style>



