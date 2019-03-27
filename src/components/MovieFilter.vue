/***********************************************************************************************
 *@name   : MovieFilter(改编自ccMovieFilter)
 *@desc   : 影视筛选器
 ***********************************************************************************************/
<template>
  <ContentWrapper
    :pagination="pagination"
    @filter-change="search"
  >
    <el-collapse value="1">
      <el-collapse-item title="查询条件" name="1">
        <el-form :inline="true" :model="searchForm" class="search-form-inline" label-width="72px">
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
              <el-option v-for="item in conditionList.licensee" :key="item.tagId" :label="item.tagCnName" :value="item.tagCnName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="频道类型">
            <el-select filterable v-model="searchForm.category" @change="categorySelectChange" size="small">' +
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


          <div style="text-align: center">
            <el-button :icon="isMore ? 'arrow-up' : 'arrow-down'" size="small" @click="showMore()">{{ isMore ? '收起' : '展开'}}</el-button>
            <el-button size="small" type="primary" @click="search">查询</el-button>
            <el-button size="small" type="warning" @click="reset">重置</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </ContentWrapper>
</template>

<script>
import _ from 'gateschema'
import { RemoteSelect, ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    RemoteSelect,
    ContentWrapper,
    Table
  },

  props:['partner', 'disablePartner'],

  data() {
    return {
      sources: [],
      searchForm: {
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
      pagination: {},
      selected: null,
      table: {
        props: {},
        header: [
          {
            label: '轮播入口ID',
            prop: 'id',
            sortable: true
          },
          {
            label: '轮播入口名称',
            prop: 'title'
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
      this.getSource(value)
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
    search() {},
    reset: function () {
      this.searchForm = {
        sources: undefined, // 内容源
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
      this.searchForm.ccSearchReset = true;
      this.searchParams = this.deepClone(this.searchForm);
      if (this.partner !== this.originPartner) {
          this.$emit('partnerChange', this.originPartner)
      }
      this.$nextTick(this.getSources)
    },
  },
  created() {
    this.originPartner = this.partner
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