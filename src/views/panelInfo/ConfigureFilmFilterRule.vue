<template>
  <div class="content">
    <el-button type="primary" @click="isVisibleDialog = true">配置影片筛选规则</el-button>
    <el-dialog
      title="配置影片筛选规则"
      width="60%"
      :visible.sync="isVisibleDialog"
      :close-on-click-modal="false"
      @open="handleOpenDialog"
      @closed="handleCloseDialog"
    >
      <div v-show="stepCount === 0">
        <div class="step-title">选择内容源</div>
        <el-checkbox-group :value="sourceList" @input="handleInputSourceList" class="items-group">
          <el-checkbox
            v-for="(source, index) in sourceListOptions"
            :key="index"
            :label="source.value"
          >{{source.label}}</el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" @click="handleOneStepNext" :disabled="sourceList.length === 0">下一步</el-button>
      </div>
      <div v-show="stepCount === 1">
        <div class="step-title">选择影视业务筛选条件</div>
        <div>(1) 影片分类</div>
        <el-checkbox-group v-model="movieFilterForm.categorys" class="margin-bottom-20 items-group">
          <el-checkbox
            v-for="filmType in filmTypeOptions"
            :key="filmType.value"
            :label="filmType.value"
           >{{filmType.label}}</el-checkbox>
        </el-checkbox-group>
        <div>(2) 影片标签&nbsp;
          <el-radio-group v-model="movieFilterForm.tagsRelation">
            <el-radio :label="0">或</el-radio>
            <el-radio :label="1">且</el-radio>
          </el-radio-group>
          <!-- <FilmRuleTagLogicFilter
            class="margin-bottom-20"
            v-model="movieFilterForm.tagCodes" /> -->
          <TagLogicFilter
            class="margin-bottom-20"
            hiddenExtend
            ref="movieTagLogicFilter"
            :value="movieFilterForm.tagCodes"
            @input="handleInputMovieTag"
            @get-tag-entity="handleGetMovieTagEntity"/>
        </div>
        <div>(3) 演员</div>
        <div class="margin-bottom-20">
          <el-tag
            v-for="(movieActor, index) in movieFilterForm.actors"
            :key="index"
            closable
            @close="handleDeleteTag(movieFilterForm.actors, index)">
            {{movieActor}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible.actor"
            v-model="inputTagValue"
            ref="actorTagInput"
            size="small"
            @keyup.enter.native="handleTagInputConfirm(movieFilterForm.actors, 'actor')"
            @blur="handleTagInputConfirm(movieFilterForm.actors, 'actor')"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showTagInput('actor')">+ New Tag</el-button>
        </div>
        <div>(4) 导演</div>
        <div class="margin-bottom-20">
          <el-tag
            v-for="(director, index) in movieFilterForm.directors"
            :key="index"
            closable
            @close="handleDeleteTag(movieFilterForm.directors, index)">
            {{director}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible.director"
            v-model="inputTagValue"
            ref="directorTagInput"
            size="small"
            @keyup.enter.native="handleTagInputConfirm(movieFilterForm.directors, 'director')"
            @blur="handleTagInputConfirm(movieFilterForm.directors, 'director')"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showTagInput('director')">+ New Tag</el-button>
        </div>
        <div>(5) 地区</div>
        <el-checkbox-group v-model="movieFilterForm.areas" class="margin-bottom-20 items-group">
          <el-checkbox
          v-for="(filmArea, index) in filmAreaOptions"
          :key="index"
          :label="filmArea.value"
          >{{filmArea.label}}</el-checkbox>
        </el-checkbox-group>
        <div>(6) 付费类型</div>
        <el-checkbox-group v-model="movieFilterForm.payTypes" class="margin-bottom-20 items-group">
          <el-checkbox
            v-for="filmPayType in filmPayTypeOptions"
            :key="filmPayType.value"
            :label="filmPayType.value"
            >{{filmPayType.label}}</el-checkbox>
        </el-checkbox-group>
        <div>(7) 影视视频特点</div>
        <el-checkbox-group v-model="movieFilterForm.videoFeatures" class="margin-bottom-20">
          <el-checkbox label="1">具有4k</el-checkbox>
          <el-checkbox label="2">具有杜比</el-checkbox>
        </el-checkbox-group>
        <div>(8) 长短片区分<span style="font-size: 12px;margin-left: 10px">（左边是我们计算的长短片区分，右边是第三方给到的）</span></div>
        <div>
          <div class="inline-checkbox-group">
            <el-checkbox-group v-model="movieFilterForm.longShortTypes" class="margin-bottom-20">
              <el-checkbox
                v-for="item in filmLongShortTypeOptions"
                :key="item.value"
                :label="item.value">
                {{item.label}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="inline-checkbox-group">
            <el-checkbox-group v-model="movieFilterForm.contentTypes" class="margin-bottom-20">
              <el-checkbox
                v-for="item in filmContentTypeOptions"
                :key="item.value"
                :label="item.value">
                {{item.label}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div>(9) 评分</div>
        <div class="margin-bottom-20">
          <InputPositiveInt :regexp="/^[\d\.]*$/" v-model.number="movieFilterForm.scoreUp" style="width: 100px;margin-right: 5px" />——
          <InputPositiveInt :regexp="/^[\d\.]*$/" v-model.number="movieFilterForm.scoreDown" style="margin-left: 5px; width: 100px" />
          <span style="font-size: 12px;margin-left: 10px">填写评分范围，精确到小数点后一位</span>
        </div>
        <div>(10) 创建时间</div>
        <el-row :gutter="1" style="width: 100%" class="margin-bottom-20">
          <el-col :span="8">
            <el-select filterable v-model="createdTimeSelect" @change="handleResetFilmTime">
              <el-option :value="1" label="时间段选择"></el-option>
              <el-option :value="2" label="最近x个月"></el-option>
            </el-select>
          </el-col>
          <el-col :span="16">
            <el-date-picker
              v-if="createdTimeSelect === 1"
              v-model="movieFilterForm.createdTime"
              type="daterange"
              align="right"
              value-format="yyyy-MM-dd"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div v-else>
              <InputPositiveInt clearable v-model="movieFilterForm.createdMonthTime" style="width: 100px"/>
              <span>&nbsp;个月</span>
            </div>
          </el-col>
        </el-row>
        <div>(11) 热度</div>
        <el-row :gutter="1" class="margin-bottom-20">
          <el-col :span="8">
            <el-select filterable v-model="feverSelect">
              <el-option :value="1" label="一月热度"></el-option>
              <el-option :value="2" label="一周热度"></el-option>
            </el-select>
          </el-col>
          <el-col :span="16">
            Top&nbsp;<InputPositiveInt clearable style="width: 100px" v-model="movieFilterForm.feverTop"/>
            <span class="tip-text">填写6及以上整数</span>
          </el-col>
        </el-row>
        <div>
          <el-button type="primary" @click="handleStepBack">上一步</el-button>
          <el-button type="primary" @click="handleTwoStepNext">下一步</el-button>
        </div>
      </div>
      <div v-show="stepCount === 2">
        <div class="step-title">选择教育业务筛选条件</div>
        <div>(1) 影片分类</div>
        <el-checkbox-group v-model="eduFilterForm.teachCategory" class="margin-bottom-20 items-group">
          <el-checkbox
            v-for="teachCategory in teachCategoryOptions"
            :key="teachCategory.value"
            :label="teachCategory.value"
           >{{teachCategory.label}}</el-checkbox>
        </el-checkbox-group>
        <div>(2) 影片标签&nbsp;
          <el-radio-group v-model="eduFilterForm.tagsRelation">
            <el-radio :label="0">或</el-radio>
            <el-radio :label="1">且</el-radio>
          </el-radio-group>
          <TagLogicFilter
            class="margin-bottom-20"
            hiddenExtend
            ref="eduTagLogicFilter"
            :value="eduFilterForm.teachTagCodes"
            @input="handleInputEduTag"
            @get-tag-entity="handleGetEduTagEntity"/>
        </div>
        <div>(3) CP名</div>
        <div class="margin-bottom-20">
          <el-tag
            v-for="(company, index) in eduFilterForm.company"
            :key="index"
            closable
            @close="handleDeleteTag(eduFilterForm.company, index)">
            {{company}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible.company"
            v-model="inputTagValue"
            ref="companyTagInput"
            size="small"
            @keyup.enter.native="handleTagInputConfirm(eduFilterForm.company, 'company')"
            @blur="handleTagInputConfirm(eduFilterForm.company, 'company')"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showTagInput('company')">+ New Tag</el-button>
        </div>
        <div>(4) 地区</div>
        <el-checkbox-group v-model="eduFilterForm.teachAreas" class="margin-bottom-20 items-group">
          <el-checkbox
            v-for="(teachArea, index) in teachAreaOptions"
            :key="index"
            :label="teachArea.value"
           >{{teachArea.label}}</el-checkbox>
        </el-checkbox-group>
        <div>(5) 教育媒资特点</div>
        <el-checkbox-group
          :value="eduFilterForm.teachFeatures"
          @input="handleInputTeachFeatures"
          class="margin-bottom-20"
          style="margin-top: 10px">
          <el-checkbox :label="1">仅选取绘本</el-checkbox>
          <el-checkbox :label="2">仅选取有声读物</el-checkbox>
          <el-checkbox :label="3">仅选取视频内容</el-checkbox>
        </el-checkbox-group>
        <!-- 媒资没做 -->
        <!-- <div>(6) 评分</div>
        <div class="margin-bottom-20">
          <el-input :regexp="/^[\d\.]*$/" v-model.number="eduFilterForm.scoreUp" style="width: 100px;margin-right: 5px" />——
          <el-input :regexp="/^[\d\.]*$/" v-model.number="eduFilterForm.scoreDown" style="margin-left: 5px; width: 100px" />
          <span style="font-size: 12px;margin-left: 10px">填写评分范围，精确到小数点后一位</span>
        </div> -->
        <div>(6) 创建时间</div>
        <el-row :gutter="1" style="width: 100%" class="margin-bottom-20">
          <el-col :span="8">
            <el-select v-model="eduCreatedTimeSelect" @change="handleResetEduTime">
              <el-option :value="1" label="时间段选择"></el-option>
              <el-option :value="2" label="最近x个月"></el-option>
            </el-select>
          </el-col>
          <el-col :span="16">
            <el-date-picker
              v-if="eduCreatedTimeSelect === 1"
              v-model="eduFilterForm.teachCreatedTime"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div v-else>
              <InputPositiveInt v-model="eduFilterForm.teachCreatedMonthTime" style="width: 100px"/>
              <span>个月</span>
            </div>
          </el-col>
        </el-row>
        <div>(7) 热度</div>
        <el-row :gutter="1" class="margin-bottom-20">
          <el-col :span="8">
            <el-select v-model="eduFeverSelect">
              <el-option :value="1" label="一月热度"></el-option>
              <el-option :value="2" label="一周热度"></el-option>
            </el-select>
          </el-col>
          <el-col :span="16">
            Top<InputPositiveInt style="width: 100px" v-model="eduFilterForm.feverTop"/>
            <span class="tip-text">填写6及以上整数</span>
          </el-col>
        </el-row>
        <div>
          <el-button type="primary" @click="handleStepBack">上一步</el-button>
          <el-button type="primary" @click="handleThreeStepNext">下一步</el-button>
        </div>
      </div>
      <div v-show="stepCount === 3">
        <div class="step-title">设置排序规则（{{filmFilterCount}}部影片）</div>
        <el-radio-group v-model="homeOrderType">
          <el-radio :label="0" class="order-radio">创建时间排序（越新的排越前面）</el-radio>
          <el-radio :label="1" class="order-radio">热度排序（越热的排越前面）</el-radio>
          <el-radio :label="2" class="order-radio">创建时间+热度排序（优先热度排序）</el-radio>
          <el-radio :label="3" class="order-radio">创建时间+热度排序（优先创建时间排序）</el-radio>
        </el-radio-group>
        <div>
          <el-button type="primary" @click="handleStepBack">上一步</el-button>
          <el-button type="primary" @click="handleStepEnd" :disabled="filmFilterCount < 12" title="影片数量少于12，无法创建版块">完成</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InputPositiveInt from '@/components/InputPositiveInt'
import TagLogicFilter from '@/components/ResourceSelector/TagLogicFilter'
// import FilmRuleTagLogicFilter from './FilmRuleTagLogicFilter'
const homeOrderTypeOptions = [
  {
    label: '创建时间排序',
    value: 0
  },
  {
    label: '热度排序',
    value: 1
  },
  {
    label: '创建时间+热度排序（优先热度）',
    value: 2
  },
  {
    label: '创建时间+热度排序（优先创建时间）',
    value: 3
  }
]
export default {
  components: {
    InputPositiveInt,
    TagLogicFilter
    // FilmRuleTagLogicFilter
  },
  props: ['source'],
  data () {
    return {
      isVisibleDialog: false,
      stepCount: 0,
      stepStack: [],
      sourceList: [],
      sourceListOptions: [],
      // 第二步
      filmTypeOptions: [],
      filmAreaOptions: [],
      filmPayTypeOptions: [],
      filmContentTypeOptions: [],
      filmLongShortTypeOptions: [],
      movieFilterForm: {
        categorys: [],
        tagsRelation: 1,
        tagCodes: [],
        actors: [],
        directors: [],
        areas: [],
        payTypes: [],
        videoFeatures: [],
        longShortTypes: ['0'],
        contentTypes: [],
        createdTime: [],
        createdMonthTime: undefined,
        feverTop: undefined,
        scoreDown: undefined,
        scoreUp: undefined
      },
      createdTimeSelect: 1,
      feverSelect: 1,
      // 第三步
      teachCategoryOptions: [],
      teachAreaOptions: [],
      teachFeatureOptions: [],
      eduFilterForm: {
        teachCategory: [],
        tagsRelation: 1,
        teachTagCodes: [],
        company: [],
        teachAreas: [],
        teachFeatures: [],
        teachCreatedTime: [],
        teachCreatedMonthTime: undefined,
        feverTop: undefined,
        scoreDown: undefined,
        scoreUp: undefined
      },
      eduCreatedTimeSelect: 1,
      eduFeverSelect: 1,
      inputVisible: {
        actor: false,
        director: false,
        company: false
      },
      inputTagValue: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近两周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 21)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      isMovieFilter: true,
      isEduFilter: false,
      filmFilterCount: 0,
      homeOrderType: 0,
      homeOrderTypeOptions
    }
  },
  methods: {
    handleInputSourceList (val) {
      const sourceList = this.sourceList || []
      const selectedTeach = sourceList.includes('teach')
      const currentSelectedTeash = val.includes('teach')
      if (!selectedTeach && currentSelectedTeash) {
        // 已经选了别的，新选中教育
        this.sourceList = ['teach']
      } else if (selectedTeach && val.length > 1) {
        // 已经选中教育，新选了别的
        this.sourceList = val.filter(item => item !== 'teach')
      } else {
        this.sourceList = val
      }
    },
    handleInputTeachFeatures (val) {
      const eduFilterForm = this.eduFilterForm
      const originVal = eduFilterForm.teachFeatures
      eduFilterForm.teachFeatures = val.filter(item => {
        return !originVal.includes(item)
      })
    },
    handleOpenDialog () {
      this.$service.getFilmFilterPartnerSource({ partnerName: this.$consts.sourceToPartner[this.source] }).then(data => {
        this.sourceListOptions = data.rows[0].source_List.map(item => {
          return {
            label: item.source_title,
            value: item.source_code
          }
        })
      })
    },
    handleCloseDialog () {
      Object.assign(this.$data, this.$options.data())
      this.$refs.movieTagLogicFilter.tags = [[]]
      this.$refs.eduTagLogicFilter.tags = [[]]
    },
    handleOneStepNext () {
      const sourceList = this.sourceList
      const eduIndex = sourceList.findIndex(item => {
        return item === 'teach'
      })
      this.isEduFilter = eduIndex !== -1
      // 不含影视业务跳过第二步
      if (this.isEduFilter && sourceList.length === 1) {
        this.isMovieFilter = false
      } else {
        this.isMovieFilter = true
      }
      if (this.isMovieFilter) {
        this.stepStack.push(this.stepCount)
        this.stepCount++
        this.$service.getFilmFilterOptions({ businessType: 0, type: 'vod' }).then(result => {
          const rs = JSON.parse(result.replace('result(', '').replace(/\)*$/, ''))
          const { contentTypes = [], longShortTypes = [] } = rs.vod || {}
          this.filmTypeOptions = (rs.vod.categoryList || []).map(item => {
            return {
              label: item.categoryName,
              value: item.categoryId
            }
          })
          this.filmAreaOptions = (rs.vod.areas || []).map(item => {
            return {
              label: item.tagCnName,
              value: item.tagCnName
            }
          })
          this.filmPayTypeOptions = (rs.vod.payTypes || []).map(item => {
            return {
              label: item.tagCnName,
              value: item.tagEnName
            }
          })
          this.filmContentTypeOptions = contentTypes.map((item) => {
            return {
              label: item.contentType,
              value: item.contentTypeId
            }
          })
          this.filmLongShortTypeOptions = longShortTypes.map(item => {
            return {
              label: item.tagCnName,
              value: item.tagEnName
            }
          })
        })
      } else {
        this.stepStack.push(this.stepCount)
        this.stepCount += 2
        this.stepIntoEduBusiness()
      }
    },
    stepIntoEduBusiness () {
      this.$service.getFilmFilterOptions({ businessType: 1, type: 'vod' }).then(result => {
        const rs = JSON.parse(result.replace('result(', '').replace(/\)*$/, ''))
        this.teachCategoryOptions = (rs.vod.teachCategory || []).map(item => {
          return {
            label: item.tagCnName,
            value: item.tagEnName
          }
        })
        this.teachAreaOptions = (rs.vod.areas || []).map(item => {
          return {
            label: item.tagCnName,
            value: item.tagCnName
          }
        })
      })
    },
    handleTwoStepNext () {
      const feverTop = this.movieFilterForm.feverTop
      if (feverTop && feverTop < 6) {
        this.$message.error('热度请填写6及以上整数')
        return
      }
      this.stepStack.push(this.stepCount)
      if (this.isEduFilter) {
        this.stepCount++
      } else {
        this.stepCount += 2
        this.handleGetFilterResult()
      }
      this.scrollTop()
    },
    handleThreeStepNext () {
      this.stepStack.push(this.stepCount)
      this.stepCount++
      this.handleGetFilterResult()
    },
    handleStepBack () {
      this.stepCount = this.stepStack.pop()
      this.scrollTop()
    },
    handleGetFilterResult (homeOrderType) {
      const { isMovieFilter, isEduFilter, sourceList, movieFilterForm, eduFilterForm } = this
      let params = {
        sources: sourceList.join(','),
        homeOrderType,
        page: 1,
        rows: 30
      }
      // 参数填写-影视筛选
      let movieParams = {}
      if (isMovieFilter) {
        const movieTagSign = ['@', '#'][movieFilterForm.tagsRelation]
        movieParams = {
          categorys: movieFilterForm.categorys.join(','),
          tagCodes: movieFilterForm.tagCodes.join(movieTagSign),
          actors: movieFilterForm.actors.join(','),
          directors: movieFilterForm.directors.join(','),
          areas: movieFilterForm.areas.join(','),
          payTypes: movieFilterForm.payTypes.join(','),
          videoFeatures: movieFilterForm.videoFeatures.join(','),
          longShortTypes: movieFilterForm.longShortTypes.join(','),
          contentTypes: movieFilterForm.contentTypes.join(','),
          scoreUp: movieFilterForm.scoreUp,
          scoreDown: movieFilterForm.scoreDown
        }
        const createdTimeSelect = this.createdTimeSelect
        if (createdTimeSelect === 1 && movieFilterForm.createdTime.length !== 0) {
          movieParams.createdTimeStart = movieFilterForm.createdTime[0]
          movieParams.createdTimeEnd = movieFilterForm.createdTime[1]
        } else {
          movieParams.recentMonths = movieFilterForm.createdMonthTime
        }
        const feverSelect = this.feverSelect
        if (feverSelect === 1) {
          movieParams.monthHotTop = movieFilterForm.feverTop
        } else {
          movieParams.weekHotTop = movieFilterForm.feverTop
        }
      }
      // 参数填写-教育筛选
      let eduParams = {}
      if (isEduFilter) {
        const eduTagSign = ['@', '#'][eduFilterForm.tagsRelation]
        eduParams = {
          teachCategory: eduFilterForm.teachCategory.join(','),
          company: eduFilterForm.company.join(','),
          teachTagCodes: eduFilterForm.teachTagCodes.join(eduTagSign),
          teachAreas: eduFilterForm.teachAreas.join(','),
          teachFeatures: eduFilterForm.teachFeatures.join(','),
          scoreUp: eduFilterForm.scoreUp,
          scoreDown: eduFilterForm.scoreDown
        }
        const createdTimeSelect = this.eduCreatedTimeSelect
        if (createdTimeSelect === 1 && eduFilterForm.teachCreatedTime.length !== 0) {
          eduParams.teachCreatedTimeStart = eduFilterForm.teachCreatedTime[0]
          eduParams.teachCreatedTimeEnd = eduFilterForm.teachCreatedTime[1]
        } else {
          eduParams.teachRecentMonths = eduFilterForm.teachCreatedMonthTime
        }
        const eduFeverSelect = this.eduFeverSelect
        if (eduFeverSelect === 1) {
          eduParams.teachMonthHotTop = eduFilterForm.feverTop
        } else {
          eduParams.teachWeekHotTop = eduFilterForm.feverTop
        }
      }
      // 请求服务
      if (isMovieFilter && isEduFilter) {
        Object.assign(params, movieParams)
        Object.assign(params, eduParams)
      } else if (isMovieFilter) {
        Object.assign(params, movieParams)
      } else {
        Object.assign(params, eduParams)
      }
      return this.$service.getFilmFilterResult(params).then(rs => {
        this.filmFilterCount = rs.data ? rs.data.total : 0
        if (this.filmFilterCount < 12) {
          return this.$message.error(`该筛选规则仅获取${this.filmFilterCount}部影片，少于12部，不可创建版块影片数量少于12，无法创建版块`)
        }
        // 第四步结束
        if (homeOrderType !== undefined) {
          // 规则描述
          const mediaRuleDesc = this.parseRuleDesc()
          this.$emit('get-filter-result', {
            mediaRule: params,
            hasEdu: this.isEduFilter ? 1 : 0,
            mediaRuleDesc
          })
        }
      })
    },
    handleStepEnd () {
      this.handleGetFilterResult(this.homeOrderType).then(() => {
        this.isVisibleDialog = false
      })
    },
    scrollTop () {
      this.$nextTick(() => {
        var container = this.$el.querySelector('.el-dialog__wrapper')
        container.scrollTop = 0
      })
    },
    handleDeleteTag (target, index) {
      target.splice(index, 1)
    },
    handleTagInputConfirm (target, tagType) {
      if (this.inputTagValue) {
        target.push(this.inputTagValue)
      }
      this.inputVisible[tagType] = false
      this.inputTagValue = ''
    },
    showTagInput (tagType) {
      this.inputVisible[tagType] = true
      const refName = tagType + 'TagInput'
      this.$nextTick(_ => {
        this.$refs[refName].$refs.input.focus()
      })
    },
    handleResetFilmTime () {
      this.movieFilterForm.createdTime = undefined
      this.movieFilterForm.createdMonthTime = undefined
    },
    handleResetEduTime () {
      this.eduFilterForm.teachCreatedTime = undefined
      this.eduFilterForm.teachCreatedMonthTime = undefined
    },
    parseRuleDesc () {
      const { sourceList, sourceListOptions, isMovieFilter, isEduFilter, movieFilterForm, eduFilterForm } = this
      const parseRuleLabel = function (arr, valueArr, linkSign) {
        return valueArr.map(value => {
          // eslint-disable-next-line eqeqeq
          const obj = arr.find(item => { return item.value == value })
          return obj.label
        }).join(linkSign)
      }
      let desc = '内容源：' + parseRuleLabel(sourceListOptions, sourceList, ' || ') + '\n'
      desc += '\n'
      // 影视描述
      if (isMovieFilter) {
        const { filmTypeOptions, filmAreaOptions, filmPayTypeOptions, movieCodeTagDesc, filmLongShortTypeOptions, filmContentTypeOptions } = this
        const { categorys, tagsRelation, tagCodes, actors, directors, areas, payTypes, videoFeatures, longShortTypes, contentTypes,
          createdTime, createdMonthTime, feverTop, scoreUp, scoreDown } = movieFilterForm
        desc += '影视业务规则：\n'
        categorys.length !== 0 && (desc += '分类：' + parseRuleLabel(filmTypeOptions, categorys, '、') + '\n')
        tagCodes.length !== 0 && (desc += '标签：' + movieCodeTagDesc + '(' + ['或', '且'][tagsRelation] + '关系)' + '\n')
        actors.length !== 0 && (desc += '演员：' + actors.join('、') + '\n')
        directors.length !== 0 && (desc += '导演：' + directors.join('、') + '\n')
        areas.length !== 0 && (desc += '地区：' + parseRuleLabel(filmAreaOptions, areas, '、') + '\n')
        payTypes.length !== 0 && (desc += '付费类型：' + parseRuleLabel(filmPayTypeOptions, payTypes, '、') + '\n')
        videoFeatures.length !== 0 && (desc += '视频特点：' +
          parseRuleLabel([{ label: '4k', value: 1 }, { label: '杜比', value: 2 }], videoFeatures, '、') + '\n')

        if (longShortTypes.length > 0) {
          desc += `长短片：${parseRuleLabel(filmLongShortTypeOptions, longShortTypes, '、')}\n`
        }
        if (contentTypes.length > 0) {
          desc += `长短片（第三方）：${parseRuleLabel(filmContentTypeOptions, contentTypes, '、')}\n`
        }
        ;(scoreUp || scoreDown) && (desc += `评分：${scoreUp || '_'}——${scoreDown || '_'}\n`)
        const createdTimeSelect = this.createdTimeSelect
        if (createdTimeSelect === 1 && movieFilterForm.createdTime.length !== 0) {
          desc += '新度：' + createdTime.join('、') + '\n'
        } else {
          createdMonthTime && (desc += '新度：最近' + createdMonthTime + '个月' + '\n')
        }
        const feverSelect = this.feverSelect
        feverTop && (desc += '热度：' + feverSelect === 1 ? ('一月热度Top' + feverTop) : ('一周热度Top' + feverTop) + '\n')
        desc += '\n'
      }
      // 教育描述
      if (isEduFilter) {
        const { teachCategoryOptions, teachAreaOptions, eduCodeTagDesc } = this
        const { teachCategory, tagsRelation, teachTagCodes, company, teachAreas,
          teachFeatures, teachCreatedTime, teachRecentMonths, feverTop, scoreUp, scoreDown } = eduFilterForm
        desc += '教育业务规则：\n'
        teachCategory.length !== 0 && (desc += '分类：' + parseRuleLabel(teachCategoryOptions, teachCategory, '、') + '\n')
        teachTagCodes.length !== 0 && (desc += '标签：' + eduCodeTagDesc + '(' + ['或', '且'][tagsRelation] + '关系)' + '\n')
        company.length !== 0 && (desc += 'CP名：' + company.join('、') + '\n')
        teachAreas.length !== 0 && (desc += '地区：' + parseRuleLabel(teachAreaOptions, teachAreas, '、') + '\n')
        teachFeatures.length !== 0 && (desc += '视频特点：' +
          parseRuleLabel([{ label: '绘本', value: 1 }, { label: '有声读物', value: 2 }, { label: '视频内容', value: 3 }], teachFeatures, '、') + '\n')
        ;(scoreUp || scoreDown) && (desc += `评分：${scoreUp || '_'}-${scoreDown || '_'}\n`)
        const createdTimeSelect = this.eduCreatedTimeSelect
        if (createdTimeSelect === 1 && eduFilterForm.teachCreatedTime.length !== 0) {
          desc += '新度：' + teachCreatedTime.join('、') + '\n'
        } else {
          teachRecentMonths && (desc += '新度：最近' + teachRecentMonths + '个月' + '\n')
        }
        const eduFeverSelect = this.eduFeverSelect
        feverTop && (desc += '热度：' + eduFeverSelect === 1 ? ('一月热度Top' + feverTop) : ('一周热度Top' + feverTop) + '\n')
        desc += '\n'
      }
      const { homeOrderTypeOptions, homeOrderType } = this
      desc += '排序规则：' + parseRuleLabel(homeOrderTypeOptions, [homeOrderType], '')
      return desc
    },
    handleGetMovieTagEntity (entity) {
      this.movieCodeTagDesc = (entity[0] || []).map(item => { return item.tagCnName }).join('、')
    },
    handleInputMovieTag (val) {
      this.movieFilterForm.tagCodes = (val[0] || '').split(',')
    },
    handleGetEduTagEntity (entity) {
      this.eduCodeTagDesc = (entity[0] || []).map(item => { return item.tagCnName }).join('、')
    },
    handleInputEduTag (val) {
      this.eduFilterForm.teachTagCodes = (val[0] || '').split(',')
    }
  },
  created () {}

}
</script>

<style lang='stylus' scoped>
.content >>> .el-dialog__body
  padding 0 40px 30px
.margin-bottom-20
  margin-bottom 20px
.items-group > .el-checkbox
  width 80px
.step-title
  font-family cursive
  font-size 16px
  font-weight bold
  margin-bottom 10px
.el-tag + .el-tag
  margin-left: 10px
.button-new-tag
  margin-left 10px
  height 32px
  line-height 30px
  padding-top 0
  padding-bottom 0
.input-new-tag
  width 90px
  margin-left 10px
  vertical-align bottom
.tip-text
  font-size 12px
  margin-left 5px
  color red
.order-radio
  display block
  margin-bottom 15px
.inline-checkbox-group
  display inline-block
  margin-right 10px
  >>> .el-checkbox-group
    padding 0 10px
    border 1px solid #DCDFE6
    border-radius 2px
</style>
