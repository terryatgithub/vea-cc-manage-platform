 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="coocaaVId"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table"
    :pagination="pagination"
    @pagination-change="fetchData"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="selectEnd"
    >

    <el-collapse slot="filter" value="1" @change="handleCollapseChange">
      <el-collapse-item title="查询条件" name="1">
        <el-form :inline="true" :model="filter" class="search-form-inline" label-width="80px">
          <el-form-item label="渠道">
            <CommonSelector v-model="filter.partner" :disabled="disablePartner" :options="$consts.partnerOptions" />
          </el-form-item>
          <el-form-item label="内容源">
            <CommonSelector v-model="filter.sources" :options="sourceEnums" />
          </el-form-item>
          <el-form-item v-show="filter.sources === 'tencent'" label="牌照">
            <CommonSelector v-model="filter.licensee" :options="licenseEnums" clearable />
          </el-form-item>
          <el-form-item label="频道类型">
            <CommonSelector v-model="filter.category" :options="categoryEnums"  />
          </el-form-item>
          <el-form-item label="影片类型">
            <CommonSelector v-model="filter.videoTypes" :options="videoTypeEnums"  />
          </el-form-item>
          <el-form-item label="付费类型">
            <CommonSelector v-model="filter.payTypes" :options="payTypeEnums"  />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="filter.title"></el-input>
          </el-form-item>
          <el-form-item label="素材类型">
            <CommonSelector v-model="filter.contentTypes" :options="contentTypeEnums"  />
          </el-form-item>
          <el-form-item label="年代">
            <el-input
              size="small"
              v-model="filter.yearStart"
              @blur="yearStartListen"
              style="width: 80px;"
            ></el-input>
            -
            <el-input
              size="small"
              v-model="filter.yearEnd"
              @blur="yearEndListen"
              style="width: 80px;"
            ></el-input>
          </el-form-item>
          <span v-show="isMore">
            <el-form-item label="影片格式">
              <CommonSelector v-model="filter.videoFormat" :options="videoFormatEnums"  />
            </el-form-item>
            <el-form-item label="内容标签">
              <CommonSelector v-model="filter.contentTag" :options="contentTagEnums"  />
            </el-form-item>
            <el-form-item label="排序方式">
              <el-select v-model="filter.orderBy" size="small" style="width: 120px;">
                <el-option label="请选择" value></el-option>
                <el-option
                  v-for="order in conditionList.orderBy"
                  :key="'order'+order.tagId"
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
            <el-form-item label="导演">
              <CommonSelector v-model="filter.directors" placeholder="请选择/输入" filterable allow-create :options="directorEnums"  />
            </el-form-item>
            <el-form-item label="主演">
              <CommonSelector v-model="filter.actors" placeholder="请选择/输入" filterable allow-create :options="actiorEnums"  />
            </el-form-item>
            <el-form-item label="地区">
              <CommonSelector v-model="filter.areas" placeholder="请选择/输入" filterable allow-create :options="areaEnums"  />
            </el-form-item>
            <el-form-item label="影片标签" style="display: block">
              <TagLogicFilter ref="tagLogicFilter" v-model="filter.tagCodes" />
            </el-form-item>
          </span>
          <div style="text-align: center">
            <el-button
              :icon="isMore ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              size="small"
              @click="isMore = !isMore"
            >{{ isMore ? '收起' : '展开'}}</el-button>
            <el-button size="small" type="primary" @click="handleFilterChange">查询</el-button>
            <el-button size="small" type="warning" @click="handleFilterReset">重置</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <EpisodeSelector ref="episodeSelector" :id="currentVideoId" :source="filter.partner" @select-end="handleSelectEpisodeEnd">
      <!-- default slot -->
      <span></span>
    </EpisodeSelector>

  </BaseSelector>
</template>

<script>
import BaseSelector from '../BaseSelector'
import CommonSelector from '@/components/CommonSelector'
import EpisodeSelector from './EpisodeSelector'
import TagLogicFilter from './TagLogicFilter'
export default {
  components: {
    BaseSelector,
    CommonSelector,
    EpisodeSelector,
    TagLogicFilter
  },
  data() {
    return {
      isMore: false,
      currentVideoId: undefined,
      conditionList: {},
      sourceEnums: [],
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
            prop: 'coocaaVId',
            label: 'ID',
            width: '130',
            sortable: true
          },
          {
            prop: 'title',
            label: '标题',
            width: '100'
          },
          {
            prop: 'subTitle',
            label: '副标题',
            width: '100'
          },
          {
            prop: 'ccVideoSourceEntities',
            label: '内容源',
            width: '60',
            render: (h, { row }) => {
              return h('div', this.getSourceLabel(row))
            }
          },
          {
            prop: 'videoStatus',
            label: '状态',
            width: '50',
            formatter: function(row) {
              return ['失效', '有效', '待审核', '审核不通过', '草稿'][
                row.videoStatus
              ]
            }
          },
          {
            prop: 'thumb',
            label: '图片',
            width: '60',
            render: (h, { row }) => {
              return h('img', {
                attrs: {
                  src: row.thumb,
                  width: '50px',
                  height: '50px',
                  'referrerpolicy': 'no-referrer'
                }
              })
            }
          },
          {
            prop: 'videoType',
            label: '影片类型',
            width: '80'
          },
          {
            prop: 'contentType',
            label: '内容类型',
            width: '80'
          },
          {
            prop: 'season',
            label: '期数'
          },
          {
            prop: 'directors',
            label: '导演'
          },
          {
            prop: 'actors',
            label: '演员',
            showOverflowTooltip: true
          },
          {
            prop: 'publishArea',
            label: '地区'
          },
          {
            prop: 'year',
            label: '年代'
          },
          {
            prop: 'segment',
            label: '已选集数',
            type: 'specialBut',
            width: '100',
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
            width: '100',
            fixed: 'right',
            render: (h, { row }) => {
              return h('el-button', {
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    this.handleSelectEpisode(row)
                  }

                }
              }, '选择单集')
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'single'
      },
      selectedEpisodes: {}
    }
  },
  computed: {
    selected() {
      return this.$refs.baseSelector.selected.slice()
    },
    licenseEnums() {
      return (this.conditionList.licensee || [])
        .map(({ tagCnName, tagEnName }) => ({ label: tagCnName, value: tagEnName }))
    },
    categoryEnums() {
      const categories = (this.conditionList.sources || [{}])[0].child
      return (categories || [])
        .map(({ categoryName, categoryId }) => ({ label: categoryName, value: categoryId }))
    },
    videoTypeEnums() {
      const selectedCategory = this.filter.category
      if (selectedCategory) {
        return (this.conditionList.sources[0].child
          .find(({ categoryId }) => categoryId === selectedCategory)
          .child[0].tagEntities || [])
          .map(({ tagName }) => ({ label: tagName, value: tagName }))
      }
      return []
    },
    payTypeEnums() {
      return (this.conditionList.payTypes || [])
        .map(({ tagCnName, tagEnName }) => ({ label: tagCnName, value: tagEnName }))
    },
    contentTypeEnums() {
      return (this.conditionList.contentTypes || [])
        .map(({ contentType, contentTypeId }) => ({ label: contentType, value: contentTypeId }))
    },
    videoFormatEnums() {
      return (this.conditionList.videoFormat || [])
        .map(({ tagCnName, tagEnName }) => ({ label: tagCnName, value: tagEnName }))
    },
    contentTagEnums() {
      return (this.conditionList.contentTag || [])
        .map(({ tagCnName }) => ({ label: tagCnName, value: tagCnName }))
    },
    directorEnums() {
      return (this.conditionList.directors || [])
        .map(({ tagCnName }) => ({ label: tagCnName, value: tagCnName }))
    },
    actiorEnums() {
      return (this.conditionList.actors || [])
        .map(({ tagCnName }) => ({ label: tagCnName, value: tagCnName }))
    },
    areaEnums() {
      return (this.conditionList.areas || [])
        .map(({ tagCnName }) => ({ label: tagCnName, value: tagCnName }))
    }
  },
  props: ['isLive', 'disablePartner', 'selection-type', 'source'],
  watch: {
    'filter.partner': 'onPartnerChange',
    'filter.sources': 'onSourceChange',
    'filter.category': 'onCategoryChange'
  },
  methods: {
    selectEnd(data) {
      data = data.map((e)=> {
         e.selectedEpisodes = this.selectedEpisodes[e.coocaaVId]
         return e
      })
      this.$emit("select-end", data)
    },
    handleCollapseChange() {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 1000)
    },
    handleSelectEpisode(movie) {
      this.currentVideoId = movie.coocaaVId
      this.$refs.episodeSelector.$refs.wrapper.handleSelectStart()
    },
    handleSelectEpisodeEnd(episodes) {
      const currentVideoId = this.currentVideoId
      this.$set(this.selectedEpisodes, currentVideoId, episodes[0])
      // 自动勾选当前影片
      const tableData = this.table.data
      const index = tableData.findIndex(item => item.coocaaVId === currentVideoId)
      const video = tableData[index]
      const baseSelector = this.$refs.baseSelector
      if (this.selectionType === 'single') {
        if (baseSelector.selected !== index) {
          baseSelector.handleTableRowSelectionChange(video, index)
        }
      } else if (this.selectionType === 'multiple') {
        if (baseSelector.selected.indexOf(index) === -1) {
          baseSelector.handleTableRowSelectionAdd(video, index)
        }
      }
    },
    onPartnerChange() {
      const partner = this.filter.partner
      this.sourceEnums = []
      if (partner) {
        this.$service.getPartnerSource({ partnerName: partner }).then(data => {
          const sourceEnums = data.rows.reduce(function(result, item) {
            if (item.source_List) {
              result = result.concat(item.source_List
                .map(({ source_code, source_title }) => ({ label: source_title, value: source_code })))
            }
            return result
          }, [])
          const defaultSelected = sourceEnums.find(function(item) {
            return item.value === partner
          }) || sourceEnums[0]
          if (defaultSelected) {
            this.filter.sources = defaultSelected.value
          }
          this.sourceEnums = sourceEnums
        })
      }
    },
    onSourceChange(val) {
      if (val !== 'tencent') {
        this.filter.licensee = undefined
      }
    },
    onCategoryChange() {
      this.filter.videoTypes = undefined
    },
    getSourceLabel(row) {
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
        if (
          row.ccVideoSourceEntities[0] &&
          row.ccVideoSourceEntities[0].thirdSource === 'tencent'
        ) {
          return '腾讯'
        } else if (
          row.ccVideoSourceEntities[0] &&
          row.ccVideoSourceEntities[0].thirdSource === 'yinhe'
        ) {
          return '爱奇艺'
        }
      }
    },
    statusLabel(row) {
      return ['失效', '有效', '待审核', '审核不通过', '草稿'][row.videoStatus]
    },
    getDefaultFilter() {
      return {
        resType: 'vod',
        callbackparam: 'result',
        partner: this.$consts.sourceToPartner[this.source || this.$consts.sourceOptions[0].value],
        sources: '', // 内容源
        category: '', // 频道类型
        videoTypes: '', // 影片类型
        licensee: '', // 牌照
        payTypes: '', // 付费类型
        provider: '', // 聚合内容
        title: '', // 标题
        contentTypes: '', // 素材类型
        yearStart: undefined, // 开始年代
        yearEnd: undefined, // 结束年代
        videoFormat: '', // 影片格式
        contentTag: '', // 内容标签
        orderBy: '', // 排序方式
        order: 'desc', // 排序方式 asc:升序，desc：降序，默认降序
        directors: '', // 导演
        actors: '', // 主演
        areas: '', // 地区
        tagCodes: [[]]
      }
    },
    getFilter() {
      const pagination = this.pagination
      const originFilter = this.efficientFilter
      const filter = Object.keys(originFilter).reduce((result, key) => {
        if (originFilter[key] !== '') {
          result[key] = originFilter[key]
        }
        return result
      }, {})
      filter.partner = undefined
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange() {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = this.getDefaultFilter()
      this.efficientFilter = this.getDefaultFilter()
      this.$refs.tagLogicFilter.reset()
      this.onPartnerChange()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData() {
      const filter = this.getFilter()
      this.$service.getMediaVideoInfos(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    handleTeachTypesChange(teachTypes) {
      this.filter.gradeList = undefined
      this.filter.videoTypes = undefined
      this.filter.teachTypes = teachTypes
    },
    yearStartListen: function() {
      if (this.filter.yearStart && !+this.filter.yearStart) {
        this.$message('年代必须为数字')
        this.filter.yearStart = null
      }
    },
    yearEndListen: function() {
      if (this.filter.yearEnd && !+this.filter.yearEnd) {
        this.$message('年代必须为数字')
        this.filter.yearEnd = null
      }
    },
    changeSort: function() {
      // 修改排序按钮的点击事件
      if (this.filter.order === 'asc') {
        this.filter.order = 'desc'
      } else {
        this.filter.order = 'asc'
      }
    }
  },
  created() {
    this.$service.mediaGetCondition().then(data => {
      this.conditionList = data.vod
    })
    this.onPartnerChange()
  }
}
</script>

<style lang='stylus' scoped>
.search-form-inline
  >>> .el-form-item__content
    width 174px
</style>
