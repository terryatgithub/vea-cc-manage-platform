/***********************************************************************************************
 *@name   : MovieFilter(改编自ccMovieFilter)
 *@desc   : 影视筛选器
 ***********************************************************************************************/
<template>
  <ContentWrapper
    :pagination="pagination"
    @filter-change="search"
  >
    <!-- 筛选部分 -->
    <el-collapse value="1">
      <el-collapse-item title="查询条件" name="1">
        <el-form :inline="true" :model="searchForm" class="search-form-inline" label-width="80px">
          <el-form-item label="渠道">
            <el-select :value="partner" :disabled="disablePartner" @input="partnerChange" size="small">
              <el-option v-for="(partner, pIndex) in partnerList" :key="pIndex" :label="partner.label" :value="partner.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容源">
            <el-select v-model="searchForm.sources" @change="sourceSelectChange" size="small">
              <el-option v-for="source in sources" :key="source.source_code" :label="source.source_title" :value="source.source_code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="searchForm.sources==='tencent'" label="牌照">
            <el-select v-model="searchForm.licensee" size="small" clearable>
              <el-option v-for="item in conditionList.licensee" :key="item.tagId" :label="item.tagCnName" :value="item.tagEnName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="频道类型">
            <el-select filterable v-model="searchForm.category" @change="categorySelectChange" size="small">
              <el-option label="请选择/输入" value=""></el-option>
              <el-option v-for="category in categories" :key="category.categoryId" :label="category.categoryName" :value="category.categoryId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="影片类型">
            <el-select filterable v-model="searchForm.videoTypes" size="small">
              <el-option label="请选择/输入" value=""></el-option>
              <el-option v-for="videoType in videoTypes" :key="videoType.tagId" :label="videoType.tagName" :value="videoType.tagName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="付费类型">
            <el-select filterable v-model="searchForm.payTypes" size="small">
              <el-option label="请选择/输入" value=""></el-option>
              <el-option v-for="payType in conditionList.payTypes" :key="payType.tagId" :label="payType.tagCnName" :value="payType.tagEnName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="searchForm.title" size="small"></el-input>
          </el-form-item>
          <el-form-item label="素材类型">
            <el-select v-model="searchForm.contentTypes" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="contentType in conditionList.contentTypes" :key="contentType.contentTypeId" :label="contentType.contentType" :value="contentType.contentTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年代">
            <el-input size="small" v-model="searchForm.yearStart" @blur="yearStartListen" style="width: 48px;"></el-input>
            - <el-input size="small" v-model="searchForm.yearEnd" @blur="yearEndListen" style="width: 48px;"></el-input>
          </el-form-item>
          <span v-show="isMore">
            <el-form-item label="影片格式">
              <el-select v-model="searchForm.videoFormat" size="small">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="videoFormat in conditionList.videoFormat" :key="videoFormat.tagEnName" :label="videoFormat.tagCnName" :value="videoFormat.tagEnName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="内容标签">
              <el-select v-model="searchForm.contentTag" size="small">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="label in conditionList.contentTag" :key="label.tagId" :label="label.tagCnName" :value="label.tagCnName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序方式">
              <el-select v-model="searchForm.orderBy" size="small" style="width: 120px;">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="order in conditionList.orderBy" :key="order.tagId" :label="order.tagCnName" :value="order.tagEnName"></el-option>
              </el-select>
              <el-tooltip :content="orderTip">
                <el-button :icon="searchForm.order === 'asc' ? 'arrow-up' : 'arrow-down'" size="mini" @click="changeSort()"></el-button>
              </el-tooltip>
              </el-form-item>
              <el-form-item label="导演">
                <el-select v-model="searchForm.directors" filterable allow-create size="small">
                  <el-option label="请选择/输入" value=""></el-option>
                  <el-option v-for="director in conditionList.directors" :key="director.tagId" :label="director.tagCnName" :value="director.tagCnName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主演">
                <el-select v-model="searchForm.actors" filterable allow-create size="small">
                  <el-option label="请选择/输入" value=""></el-option>
                  <el-option v-for="actor in conditionList.actors" :key="actor.tagId" :label="actor.tagCnName" :value="actor.tagCnName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="地区">
                <el-select v-model="searchForm.areas" filterable allow-create size="small">
                  <el-option label="请选择/输入" value=""></el-option>
                  <el-option v-for="area in conditionList.areas" :key="area.tagId" :label="area.tagCnName" :value="area.tagCnName"></el-option>
                </el-select>
              </el-form-item>
          </span>
          <div style="text-align: center">
            <el-button :icon="isMore ? 'arrow-up' : 'arrow-down'" size="small" @click="showMore()">{{ isMore ? '收起' : '展开'}}</el-button>
            <el-button size="small" type="primary" @click="search">查询</el-button>
            <el-button size="small" type="warning" @click="reset">重置</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!-- 筛选部分end -->

    <!-- Table部分 -->
    <Table
      :props="table.props"
      :header="table.header"
      :data="table.data"
      :selected="table.selected"
      :selection-type="table.selectionType"
      @row-selection-change="handleRowChange"
    />
    <!-- Table部分end -->
  </ContentWrapper>
</template>

<script>
import _ from 'gateschema'
import { RemoteSelect, ContentWrapper, Table, utils } from 'admin-toolkit'
export default {
  components: {
    RemoteSelect,
    ContentWrapper,
    Table
  },

  props:['partner', 'disablePartner', 'singleObj'],

  data() {
    return {
      sources: [],
      searchForm: {
          resType: 'vod',
          callbackparam: 'result',
          sources: '', // 内容源
          category: '', // 频道类型
          videoTypes: '', // 影片类型
          licensee: '', //牌照
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
      },
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
      originPartner: undefined,
      conditionList: {}, // 筛选条件
      categories: [],
      videoTypes: [],
      isMore: false,
      orderTip: '降序排列', // 排序按钮文字提示
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      selected: null,
      table: {
        props: {},
        header: [
          {
            prop: 'coocaaVId',
            label: 'ID',
            width: '200',
            sortable: true
          },
          {
            prop: 'title',
            label: '标题',
            width: '250'
          },
          {
            prop: 'subTitle',
            label: '副标题',
            width: '250'
          },
          {
            prop: 'ccVideoSourceEntities',
            label: '内容源',
            width: '100',
            render: (h, {row}) => {
              return h('div', this.getSourceLabel(row))
            }
          },
          {
            prop: 'videoStatus',
            label: '状态',
            width: '100',
            formatter: function (row) {
                return ['失效', '有效', '待审核', '审核不通过', '草稿'][row.videoStatus]
            }
          },
          {
            prop: 'thumb',
            label: '图片',
            width: '120',
            render: (h, {row}) => {
              return h('img', {
                attrs: {
                  src: row.thumb,
                  width: "50px",
                  height: "50px",
                  class: "imgs"
                }
              })
            }
          },
          {
            prop: 'videoType',
            label: '影片类型',
            width: '120'
          },
          {
            prop: 'contentType',
            label: '内容类型',
            width: '120'
          },
          {
            prop: 'season',
            label: '期数',
            width: '100'
          },
          {
            prop: 'directors',
            label: '导演',
            width: '150'
          },
          {
            prop: 'actors',
            label: '演员',
            width: '150',
            showOverflowTooltip: true
          },
          {
            prop: 'publishArea',
            label: '地区',
            width: '100'
          }, 
          {
            prop: 'year',
            label: '年代',
            width: '100'
          }, 
          {
            prop: 'segment',
            label: '已选集数',
            type: 'specialBut',
            width: '150',
            mouseStyle: 'hover',
            fixed: 'right'
          },
          {
            prop: 'but',
            label: '操作',
            width: '130',
            fixed: 'right',
            render: utils.component.createOperationRender(this, {
              selectSingle: '选择单集'
            })
          }
        ],
        data: [],
        selected: {},
        selectionType: 'single'
      }
    }
  },

  watch: {
    partner(value) {
      this.searchForm.sources = this.partner
      this.getSource(value)
    },
    selected: function(value) {
      this.$emit('input', value)
    }
  },

  methods: {
    deepClone: function (obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    sourceSelectChange(sourceName) {
      if (sourceName !== 'tencent') {
          this.searchForm.licensee = ''
      }
    },
    partnerChange(value) {
      this.$emit('partnerChange', value)
    },
    // 获取内容源
    getSource(partner) {
    this.$service.getPartnerSource({partnerName: partner}).then(data => {
      this.sources = data.rows.reduce(function(result, item){
         if(item.source_List) {
            result = result.concat(item.source_List)
         }
         return result
        }, [])
      })
    },
    // 内容源列标签
    getSourceLabel(row){
      var flag = false
      for (var i = 0; i < row.ccVideoSourceEntities.length; i++) {
          if (row.ccVideoSourceEntities[i].thirdSource === '4KGarden') {
              flag = true
              break
          }
      }
      if (flag === true) {
          return '4k花园'
      } else {
          if (row.ccVideoSourceEntities[0] && row.ccVideoSourceEntities[0].thirdSource === 'tencent') {
              return '腾讯'
          } else if (row.ccVideoSourceEntities[0] && row.ccVideoSourceEntities[0].thirdSource === 'yinhe') {
              return '爱奇艺'
          }
      }
    },
    statusLabel(row) {
      return ['失效', '有效', '待审核', '审核不通过', '草稿'][row.videoStatus];
    },
    categorySelectChange: function (categoryId) { // 切换频道类型
        this.searchForm.videoTypes = ''
        var categories = this.categories
        var cIndex = categories.findIndex(function (category) {
            return category.categoryId === categoryId;
        })
        this.videoTypes = categories[cIndex] ? categories[cIndex].child[0].tagEntities : []
    },
    yearStartListen: function () {
        if (this.searchForm.yearStart && !+this.searchForm.yearStart) {
            this.$message('年代必须为数字')
            this.searchForm.yearStart = null
            return
        }
    },
    yearEndListen: function () {
      if (this.searchForm.yearEnd && !+this.searchForm.yearEnd) {
          this.$message('年代必须为数字')
          this.searchForm.yearEnd = null
          return
      }
    },
    search(type) {
      if (type !== 'pagination') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getMediaVideoInfos(filter).then(result => {
        let data = JSON.parse(result.slice(7, -1))
        this.pagination.total = data.total
        this.table.data = data.rows
      })
      // 选择单集
      var newParam = Object.assign({}, this.singleObj)
      newParam.data = []
      newParam.selectId = ''
      newParam.index = undefined
      newParam.singleIdArr = []
      newParam.singleIndexArr = []
      newParam.titleArr = []
      newParam.titleArrData = []
    },
    parseFilter() {
      const { searchForm, pagination } = this
      if (pagination) {
        searchForm.page = pagination.currentPage
        searchForm.rows = pagination.pageSize
      }
      let rs = {}
      Object.keys(searchForm).map(function(item){
        if(searchForm[item]){
          rs[item] = searchForm[item]
        }
      })
      return rs
    },
    reset: function () {
      this.searchForm = {
        resType: 'vod',
        callbackparam: 'result',
        sources: this.partner, // 内容源
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
      };
      this.table.data = []
      this.searchParams = this.deepClone(this.searchForm);
      if (this.partner !== this.originPartner) {
          this.$emit('partnerChange', this.originPartner)
      }
      this.getSource(this.partner)
    },
    showMore: function () { // 展开/收起按钮的点击事件
        this.isMore = !this.isMore;
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
    // 选择单集
    selectSingle() {

    },
    handleRowChange(row, index) {
      this.table.selected = index
      this.selected = row.coocaaVId
    }
  },
  created() {
    this.originPartner = this.partner
    this.searchForm.sources = this.partner
  },
  mounted() {
    this.getSource(this.partner)
    this.$service.getCondition().then(result => {
      const data = JSON.parse(result.slice(7,-1))
      this.categories = data.vod.sources[0].child
      this.conditionList = data.vod
    })
  }
}
</script>

<style lang='stylus' scoped>
</style>