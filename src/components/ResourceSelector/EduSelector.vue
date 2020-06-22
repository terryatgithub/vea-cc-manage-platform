 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="coocaaVId"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table"
    :pagination="pagination"
    :select-end-on-dbl-click="true"
    @pagination-change="fetchData"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="selectEnd">

    <el-collapse slot="filter" value="1" @change="handleCollapseChange">
      <el-collapse-item title="查询条件" name="1">
        <el-form @keypress.enter.native="handleFilterChange" class="search-form" :inline="true" v-model="filter" label-width="72px">
          <el-form-item label="内容商">
            <CommonSelector filterable clearable v-model="filter.contentProviders" :options="contentProviderEnums" />
          </el-form-item>
          <el-form-item label="教育分类">
            <CommonSelector filterable clearable :value="filter.teachTypes" @input="handleTeachTypesChange" :options="teachTypeEnums" />
          </el-form-item>
          <el-form-item label="年级年龄">
            <CommonSelector filterable clearable v-model="filter.gradeList" :options="gradeEnums" placeholder="请选择" />
          </el-form-item>
          <el-form-item label="内容分类">
            <CommonSelector filterable clearable v-model="filter.videoTypes" :options="videoTypeEnums" placeholder="请选择" />
          </el-form-item>
          <el-form-item label="付费类型">
            <CommonSelector filterable clearable v-model="filter.payTypes" :options="payTypeEnums" placeholder="请选择" />
          </el-form-item>
          <el-form-item label="内容标签">
            <CommonSelector filterable clearable v-model="filter.contentTag" :options="contentTagEnums" placeholder="请选择" />
          </el-form-item>
          <el-form-item label="资源形态">
            <CommonSelector filterable clearable v-model="filter.contentForm" :options="contentFormEnums" placeholder="请选择" />
          </el-form-item>
          <el-form-item label="课程名称">
            <el-input clearable v-model="filter.title" size="small"></el-input>
          </el-form-item>
          <span v-show="isMore">
            <el-form-item label="课程版本">
              <CommonSelector filterable clearable v-model="filter.courseVersion" :options="courseVersionEnums" placeholder="请选择" />
            </el-form-item>
            <el-form-item label="集数">
              <CommonSelector filterable clearable v-model="filter.segmentTag" :options="segmentTagEnums" placeholder="请选择" />
            </el-form-item>
            <el-form-item label="是否全集">
              <el-select filterable clearable v-model="filter.updateStatus" size="small">
                <el-option label="不限" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="同步时间">
              <el-select filterable clearable v-model="filter.synDate" size="small">
                <el-option label="7天" :value="7" size="small"></el-option>
                <el-option label="15天" :value="15" size="small"></el-option>
                <el-option label="1个月" :value="30" size="small"></el-option>
                <el-option label="3个月" :value="90" size="small"></el-option>
                <el-option label="1年" :value="365" size="small"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="动漫明星">
              <el-input clearable v-model="filter.cartoonStar" size="small"></el-input>
            </el-form-item>
            <el-form-item label="地区">
              <el-select v-model="filter.areas" filterable clearable allow-create size="small">
                <el-option
                  v-for="area in conditionList.areas"
                  :key="area.tagId"
                  :label="area.tagCnName"
                  :value="area.tagCnName"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="权益">
              <el-select filterable clearable v-model="filter.teachTypes" size="small">
                <el-option label="教育" value="教育"></el-option>
                <el-option label="少儿" value="少儿"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="年代">
              <el-input
                size="small"
                clearable
                v-model="filter.yearStart"
                @blur="yearStartListen"
                style="width: 72px;"
              ></el-input>
              -
              <el-input
                size="small"
                clearable
                v-model="filter.yearEnd"
                @blur="yearEndListen"
                style="width: 72px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="排序方式">
              <el-select filterable clearable v-model="filter.orderBy" size="small" style="width: 120px;">
                <el-option
                  v-for="order in conditionList.orderBy"
                  :key="order.tagId"
                  :label="order.tagCnName"
                  :value="order.tagEnName"
                ></el-option>
              </el-select>
              <el-tooltip :content="filter.order === 'asc' ? '升序' : '降序'">
                <el-button
                  :icon="filter.order === 'asc' ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                  @click="changeSort()"
                ></el-button>
              </el-tooltip>
            </el-form-item>
          </span>
          <div style="text-align: center">
            <el-button
              :icon="isMore ? 'arrow-up' : 'arrow-down'"
              size="small"
              @click="isMore = !isMore"
            >{{ isMore ? '收起' : '展开'}}</el-button>
            <el-button size="small" type="primary" @click="handleFilterChange">查询</el-button>
            <el-button size="small" type="warning" @click="handleFilterReset">重置</el-button>
            {{currentVideoId}}
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <EpisodeSelector ref="episodeSelector" :id="currentVideoId" :source="filter.sources" @select-end="handleSelectEpisodeEnd">
      <span></span>
    </EpisodeSelector>
  </BaseSelector>
</template>

<script>
import BaseSelector from '../BaseSelector'
import CommonSelector from '@/components/CommonSelector'
import EpisodeSelector from './EpisodeSelector'
export default {
  components: {
    BaseSelector,
    CommonSelector,
    EpisodeSelector
  },
  data () {
    return {
      currentVideoId: undefined,
      isMore: false,
      conditionList: {},
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      filter: this.getDefaultFilter(),
      efficientFilter: this.getDefaultFilter(),
      table: {
        props: {},
        data: [],
        header: [
          { prop: 'coocaaVId', label: 'ID', fixed: true, width: '220' },
          {
            prop: 'title',
            label: '课程名称',
            fixed: true,
            width: '220'
          },
          {
            prop: 'description',
            label: '课程简介',
            width: '250',
            showOverflowTooltip: true
          },
          {
            prop: 'sourceName',
            label: '内容提供商',
            width: '150'
          },
          {
            prop: 'videoKey',
            label: '自定义标签',
            width: '150'
          },
          {
            prop: 'classfication',
            label: '第三方标签',
            width: '150'
          },
          {
            prop: 'thumb',
            label: '图片',
            width: '120',
            render: (h, { row }) => {
              return h('img', {
                key: row.thumb,
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
            label: '课程集数',
            width: '120',
            formatter: (row) => {
              const ccVideoSourceEntities = row.ccVideoSourceEntities || []
              const videoEntity = ccVideoSourceEntities[0] || {}
              return videoEntity.publishSegment
            }
          },
          {
            prop: 'segment',
            label: '已选集数',
            type: 'specialBut',
            width: '105',
            mouseStyle: 'hover',
            fixed: 'right',
            render: (h, { row }) => {
              const coocaaVId = row.coocaaVId
              const selectedEpisodes = this.selectedEpisodes
              if (selectedEpisodes[coocaaVId]) {
                return h('el-button', {
                  attrs: {
                    type: 'primary',
                    text: '已选集数',
                    value: '已选集数',
                    title: selectedEpisodes[coocaaVId].urlTitle
                  } }, '已选集数')
              }
            }
          },
          {
            prop: 'but',
            label: '操作',
            width: '105',
            fixed: 'right',
            render: (h, { row }) => {
              // const ccVideoSourceEntities = row.ccVideoSourceEntities || []
              // const entity = ccVideoSourceEntities[0]
              // if (entity && entity.currentSegment > 1 && entity.thirdSource === this.efficientFilter.sources) {
              return h('el-button', {
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    this.handleSelectEpisode(row)
                  }

                }
              }, '选择单集')
              // }
            }
          }
        ],
        selectionType: 'single'
      },
      selectedEpisodes: {}
    }
  },
  computed: {
    selected () {
      return this.$refs.baseSelector.selected.slice()
    },
    contentProviderEnums () {
      return (this.conditionList.contentProviders || [])
        .map(({ tagCnName }) => ({ label: tagCnName, value: tagCnName }))
    },
    teachTypeEnums () {
      const sources = this.conditionList.sources
      if (sources) {
        return sources[0].child
          .map(({ categoryName }) => ({ label: categoryName, value: categoryName }))
      }
      return []
    },
    gradeEnums () {
      const gradeList = this.conditionList.gradeList
      const teachType = this.filter.teachTypes
      const teachTypeRange = {
        '幼儿': [0, 2],
        '小学': [2, 8],
        '初中': [8, 11],
        '高中': [11, 14]
      }
      const range = teachTypeRange[teachType]
      if (range && gradeList) {
        const allGrade = gradeList.map(({ tagCnName }) => ({ label: tagCnName, value: tagCnName }))
        return allGrade.slice(range[0], range[1])
      }
      return []
    },
    videoTypeEnums () {
      const teachTypes = this.filter.teachTypes
      if (teachTypes) {
        return (this.conditionList.sources[0].child
          .find(({ categoryName }) => categoryName === teachTypes)
          .child[0].tagEntities || [])
          .map(({ tagName }) => ({ label: tagName, value: tagName }))
      }
      return []
    },
    payTypeEnums () {
      return (this.conditionList.payTypes || [])
        .map(({ tagCnName, tagEnName }) => ({ label: tagCnName, value: tagEnName }))
    },
    contentTagEnums () {
      return (this.conditionList.contentTag || []).map(({ tagCnName }) => ({ label: tagCnName, value: tagCnName }))
    },
    courseVersionEnums () {
      return (this.conditionList.courseVersion || [])
        .map(({ tagCnName }) => ({ label: tagCnName, value: tagCnName }))
    },
    segmentTagEnums () {
      return (this.conditionList.segmentTag || [])
        .map(({ tagCnName, tagEnName }) => ({ label: tagCnName, value: tagEnName }))
    },
    contentFormEnums () {
      // 内容形式 0-不限；1-视频 ；2-绘本；3-听故事
      return [
        {
          label: '不限',
          value: 0
        },
        {
          label: '视频',
          value: 1
        },
        {
          label: '绘本',
          value: 2
        },
        {
          label: '听故事',
          value: 3
        }
      ]
    }
  },
  props: ['isLive', 'selectionType', 'idType'],
  methods: {
    selectEnd (data) {
      data = data.map((e) => {
        e.selectedEpisodes = this.selectedEpisodes[e.coocaaVId]
        return e
      })
      this.$emit('select-end', data)
    },
    handleCollapseChange () {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 1000)
    },
    getDefaultFilter () {
      return {
        // 筛选条件表单
        resType: 'vod',
        callbackparam: 'result',
        sources: 'teach', // 内容源
        contentProviders: undefined, // 内容商
        teachTypes: undefined, // 教育分类
        gradeList: undefined, // 年级
        videoTypes: undefined, // 内容分类
        payTypes: undefined, // 付费类型
        contentTag: undefined, // 内容标签
        contentForm: undefined, // 资源形态
        orderBy: undefined, // 排序方式
        order: 'desc', // 排序方式 asc:升序，desc：降序，默认降序
        title: undefined, // 课程标题
        courseVersion: undefined, // 课程版本
        segmentTag: undefined, // 集数
        updateStatus: undefined, // 是否全集(integer)
        synDate: undefined, // 同步时间
        cartoonStar: undefined, // 动漫明星
        areas: '', // 地区
        yearStart: undefined, // 开始年代
        yearEnd: undefined, // 结束年代
        businessType: 1, // 业务线类型:0影视, 1教育
        idType: this.idType
      }
    },
    getFilter () {
      const pagination = this.pagination
      const originFilter = this.efficientFilter
      const filter = Object.keys(originFilter).reduce((result, key) => {
        if (originFilter[key] !== '') {
          result[key] = originFilter[key]
        }
        return result
      }, {})
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
      this.fetchData()
    },
    fetchData () {
      const filter = this.getFilter()
      this.$service.getMediaVideoInfos(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    handleTeachTypesChange (teachTypes) {
      this.filter.gradeList = undefined
      this.filter.videoTypes = undefined
      this.filter.teachTypes = teachTypes
    },
    yearStartListen: function () {
      if (this.filter.yearStart && !+this.filter.yearStart) {
        this.$message('年代必须为数字')
        this.filter.yearStart = null
      }
    },
    yearEndListen: function () {
      if (this.filter.yearEnd && !+this.filter.yearEnd) {
        this.$message('年代必须为数字')
        this.filter.yearEnd = null
      }
    },
    changeSort: function () {
      // 修改排序按钮的点击事件
      if (this.filter.order === 'asc') {
        this.filter.order = 'desc'
      } else {
        this.filter.order = 'asc'
      }
    },
    handleSelectEpisode (movie) {
      this.currentVideoId = movie.coocaaVId
      this.$nextTick(() => {
        this.$refs.episodeSelector.$refs.wrapper.handleSelectStart()
      })
    },
    handleSelectEpisodeEnd (episodes) {
      // this.currentVideoId = education.coocaaVId
      const currentVideoId = this.currentVideoId
      this.$set(this.selectedEpisodes, currentVideoId, episodes[0])
      // 自动勾选当前影片
      const tableData = this.table.data
      const index = tableData.findIndex(item => item.coocaaVId === currentVideoId)
      const Edu = tableData[index]
      const baseSelector = this.$refs.baseSelector
      if (this.selectionType === 'single') {
        if (baseSelector.tableSelected !== index) {
          baseSelector.handleTableRowSelectionChange(Edu, index)
        }
      } else if (this.selectionType === 'multiple') {
        if (baseSelector.tableSelected.indexOf(index) === -1) {
          baseSelector.handleTableRowSelectionAdd(Edu, index)
        }
      }
      // this.$nextTick(() => {
      //   this.$refs.episodeSelector.$refs.wrapper.handleSelectStart()
      // })
    }
  },
  created () {
    const params = {
      type: 'vod',
      businessType: 1
    }
    this.$service.mediaGetCondition(params).then(data => {
      this.conditionList = data.vod
    })
  }
}
</script>

<style lang='stylus' scoped>
.search-form >>>
  .el-form-item
    margin-bottom 5px
</style>
