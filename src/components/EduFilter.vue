/***********************************************************************************************
 *@name   : EduFilter(改编自ccEduFilter)
 *@desc   : 教育筛选器
 ***********************************************************************************************/
<template>
  <ContentWrapper
    :pagination="pagination"
    @filter-change="search"
  >
    <el-collapse value="1">
      <el-collapse-item title="查询条件" name="1">
        <el-form :inline="true" v-model="searchForm" label-width="72px">
          <el-form-item label="内容商">
            <el-select filterable v-model="searchForm.contentProviders" size="small">
              <el-option label="请选择/输入" value=""></el-option>
              <el-option v-for="provider in conditionList.contentProviders" :key="provider.tagCnName" :label="provider.tagCnName" :value="provider.tagCnName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教育分类">
            <el-select v-model="searchForm.teachTypes" @change="teachTypesSelectChange" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="teachType in teachTypes" :key="teachType.categoryName" :label="teachType.categoryName" :value="teachType.categoryName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级年龄">
            <el-select v-model="searchForm.gradeList" size="small" placeholder="请选择教育分类">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="grade in gradeList" :key="grade.tagId" :label="grade.tagCnName" :value="grade.tagCnName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容分类">
            <el-select filterable v-model="searchForm.videoTypes" size="small" placeholder="请选择教育分类">
              <el-option label="请选择/输入" value=""></el-option>
              <el-option v-for="videoType in eduTypes" :key="videoType.tagName" :label="videoType.tagName" :value="videoType.tagName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="付费类型">
            <el-select v-model="searchForm.payTypes" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="payType in conditionList.payTypes" :key="payType.tagId" :label="payType.tagCnName" :value="payType.tagEnName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容标签">
            <el-select filterable v-model="searchForm.contentTag" size="small">
              <el-option label="请选择/输入" value=""></el-option>
              <el-option v-for="label in conditionList.contentTag" :key="label.tagId" :label="label.tagCnName" :value="label.tagCnName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程名称">
            <el-input v-model="searchForm.title" size="small"></el-input>
          </el-form-item>
          <span v-show="isMore">
            <el-form-item label="课程版本">
              <el-select filterable v-model="searchForm.courseVersion" size="small">
                <el-option label="请选择/输入" value=""></el-option>
                <el-option v-for="version in conditionList.courseVersion" :key="version.tagId" :label="version.tagCnName" :value="version.tagCnName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="集数">
              <el-select filterable v-model="searchForm.segmentTag" size="small">
                <el-option label="请选择/输入" value=""></el-option>
                <el-option v-for="tag in conditionList.segmentTag" :key="tag.tagEnName" :label="tag.tagCnName" :value="tag.tagEnName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否全集">
              <el-select filterable v-model="searchForm.updateStatus" size="small">
                <el-option label="请选择/输入" value=""></el-option>
                <el-option label="不限" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="同步时间">
              <el-select filterable v-model="searchForm.synDate" size="small">
                <el-option label="请选择/输入" value=""></el-option>
                <el-option label="7天" :value="7" size="small"></el-option>
                <el-option label="15天" :value="15" size="small"></el-option>
                <el-option label="1个月" :value="30" size="small"></el-option>
                <el-option label="3个月" :value="90" size="small"></el-option>
                <el-option label="1年" :value="365" size="small"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="动漫明星">
              <el-input v-model="searchForm.cartoonStar" size="small"></el-input>
            </el-form-item>
            <el-form-item label="地区">
              <el-select v-model="searchForm.areas" filterable allow-create size="small">
                <el-option label="请选择/输入" value=""></el-option>
                <el-option v-for="area in conditionList.areas" :key="area.tagId" :label="area.tagCnName" :value="area.tagCnName"></el-option> 
              </el-select>
            </el-form-item>
            <el-form-item label="年代">
              <el-input size="small" v-model="searchForm.yearStart" @blur="yearStartListen" style="width: 48px;"></el-input>
              - <el-input size="small" v-model="searchForm.yearEnd" @blur="yearEndListen" style="width: 48px;"></el-input>
            </el-form-item>
            <el-form-item label="排序方式">
              <el-select v-model="searchForm.orderBy" size="small" style="width: 85px;">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="order in conditionList.orderBy" :key="order.tagId" :label="order.tagCnName" :value="order.tagEnName"></el-option>
              </el-select>
            <el-tooltip :content="orderTip">
              <el-button :icon="searchForm.order === 'asc' ? 'arrow-up' : 'arrow-down'" size="mini" @click="changeSort()"></el-button>
            </el-tooltip>
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
import { ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    ContentWrapper,
    Table
  },
  props: ['pannelResource', 'multi'],

  data () {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      searchForm: { // 筛选条件表单
        resType: 'vod',
        callbackparam: 'result',
        // sources: 'o_tencent', // 内容源
        contentProviders: '', // 内容商
        teachTypes: '', // 教育分类
        gradeList: '', // 年级
        videoTypes: '', // 内容分类
        payTypes: '', // 付费类型
        contentTag: '', // 内容标签
        orderBy: '', // 排序方式
        order: 'desc', // 排序方式 asc:升序，desc：降序，默认降序
        title: '', // 课程标题
        courseVersion: '', // 课程版本
        segmentTag: '', // 集数
        updateStatus: '', // 是否全集(integer)
        synDate: '', // 同步时间
        cartoonStar: '', // 动漫明星
        areas: '', // 地区
        yearStart: null, // 开始年代
        yearEnd: null, // 结束年代
        businessType: 1 // 业务线类型:0影视, 1教育
      },
      table: {
        props: {},
        data: [],
        header:  [
          { prop: 'coocaaVId',
            label: 'ID',
            fixed: true,
            width: '220'
          }, {
            prop: 'title',
            label: '课程名称',
            fixed: true,
            width: '220'
        }, {
            prop: 'description',
            label: '课程简介',
            width: '250',
            showOverflowTooltip: true
        }, {
            prop: 'sourceName',
            label: '内容提供商',
            width: '150'
        }, {
            prop: 'videoKey',
            label: '自定义标签',
            width: '150'
        }, {
            prop: 'classfication',
            label: '第三方标签',
            width: '150'
        }, {
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
        }, {
            prop: 'publistSegment',
            label: '课程集数',
            width: '120'
        }],
        selected: {},
        selectionType: 'single'
      },
      conditionList: {},
      teachTypes: [], // 教育分类选项
      eduTypes: [], // 内容分类
      gradeList: [], // 年级
      isMore: false,
      orderTip: '降序排列', // 排序按钮文字提示
      selected: undefined
    };
  },

  watch: {
    selected: function(value) {
      this.$emit('input', value)
    }
  },

  methods: {
    teachTypesSelectChange: function (categoryName) { // 切换教育分类
      this.searchForm.gradeList = ''
      this.searchForm.videoTypes = ''
      var teachTypes = this.teachTypes
      var tIndex = teachTypes.findIndex(function (teachType) {
          return teachType.categoryName === categoryName
      })

      // 改变内容分类
      this.eduTypes = teachTypes[tIndex] ? teachTypes[tIndex].child[0].tagEntities : []

      // 改变年级
      var gradeList = this.conditionList.gradeList
      var showGradeList = []
      switch (categoryName) {
          case '幼儿':
              showGradeList = gradeList.slice(0, 2)
              break
          case '小学':
              showGradeList = gradeList.slice(2, 8)
              break
          case '初中':
              showGradeList = gradeList.slice(8, 11)
              break
          case '高中':
              showGradeList = gradeList.slice(11, 14)
              break
          default:
              break
      }
      this.gradeList = showGradeList
    },
    handleRowChange(row, index) {
      this.table.selected = index
      this.selected = row
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
    showMore: function () { // 展开/收起按钮的点击事件
        this.isMore = !this.isMore
    },
    changeSort: function () { // 修改排序按钮的点击事件
        if (this.searchForm.order === 'asc') {
            this.searchForm.order = 'desc'
            this.orderTip = '降序排列'
        } else {
            this.searchForm.order = 'asc'
            this.orderTip = '升序排列'
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
      this.$service.getMediaVideoInfos(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
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
        this.searchForm = { // 筛选条件表单
            resType: 'vod',
            callbackparam: 'result',
            // sources: this.pannelResource || 'o_tencent', // 内容源
            contentProviders: '', // 内容商
            teachTypes: '', // 教育分类
            gradeList: '', // 年级
            videoTypes: '', // 内容分类
            payTypes: '', // 付费类型
            contentTag: '', // 内容标签
            orderBy: '', // 排序方式
            order: 'desc', // 排序方式 asc:升序，desc：降序，默认降序
            title: '', // 课程标题
            courseVersion: '', // 课程版本
            segmentTag: '', // 集数
            updateStatus: '', // 是否全集(integer)
            synDate: '', // 同步时间
            cartoonStar: '', // 动漫明星
            areas: '', // 地区
            yearStart: null, // 开始年代
            yearEnd: null, // 结束年代
            businessType: 1 // 业务线类型:0影视, 1教育
        }
        this.table.data = []
    },
  },
  mounted() {
    const params = {
      type: 'vod',
      businessType: 1
    }
    this.$service.getCondition(params).then(data => {
      this.conditionList = data.vod
    })
  },
  created() {}

  
}
</script>

<style lang='stylus' scoped>
</style>