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
      <div v-if="stepCount === 0">
        <div class="step-title">第一步：选择内容源</div>
        <el-checkbox-group v-model="sourceList" class="items-group">
          <el-checkbox
            v-for="(source, index) in sourceListOptions"
            :key="index"
            :label="source.value"
          >{{source.label}}</el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" @click="handleOneStepNext" :disabled="sourceList.length === 0">进入第二步</el-button>
      </div>
      <div v-else-if="stepCount === 1">
        <div class="step-title">第二步：选择影视业务筛选条件</div>
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
            <el-radio :label="1">或</el-radio>
            <el-radio :label="2">且</el-radio>
          </el-radio-group>
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
        <div>(8) 创建时间</div>
        <el-row :gutter="1" style="width: 100%" class="margin-bottom-20">
          <el-col :span="8">
            <el-select v-model="createdTimeSelect" @change="handleResetFilmTime">
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
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div v-else>
              <InputPositiveInt v-model="movieFilterForm.createdMonthTime" style="width: 100px"/>
              <span>个月</span>
            </div>
          </el-col>
        </el-row>
        <div>(9) 热度</div>
        <el-row :gutter="1" class="margin-bottom-20">
          <el-col :span="8">
            <el-select v-model="feverSelect">
              <el-option :value="1" label="一月热度"></el-option>
              <el-option :value="2" label="一周热度"></el-option>
            </el-select>
          </el-col>
          <el-col :span="16">
            Top<InputPositiveInt style="width: 100px" v-model="movieFilterForm.feverTop"/>
            <span class="tip-text">填写6及以上整数</span>
          </el-col>
        </el-row>
        <div>
          <el-button type="primary" @click="handleStepBack">上一步</el-button>
          <el-button type="primary" @click="handleTwoStepNext">下一步</el-button>
        </div>
      </div>
      <div v-else-if="stepCount === 2">
        <div class="step-title">第三步：选择教育业务筛选条件</div>
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
            <el-radio :label="1">或</el-radio>
            <el-radio :label="2">且</el-radio>
          </el-radio-group>
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
        <el-checkbox-group v-model="eduFilterForm.teachCategory" class="margin-bottom-20 items-group">
          <el-checkbox
            v-for="teachArea in teachAreaOptions"
            :key="teachArea.value"
            :label="teachArea.value"
           >{{teachArea.label}}</el-checkbox>
        </el-checkbox-group>
        <div>(5) 教育媒资特点</div>
        <el-radio-group
          v-model="eduFilterForm.teachFeatures"
          class="margin-bottom-20"
          style="margin-top: 10px"
        >
          <el-radio :label="undefined">未定义</el-radio>
          <el-radio :label="1">仅选取绘本</el-radio>
          <el-radio :label="2">仅选取有声读物</el-radio>
          <el-radio :label="3">仅选取视频内容</el-radio>
        </el-radio-group>
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
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div v-else>
              <InputPositiveInt v-model="movieFilterForm.teachCreatedMonthTime" style="width: 100px"/>
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
      <div v-else>
        <div class="step-title">第四步：设置排序规则（{{filmFilterCount}}部影片）</div>
        <el-radio-group v-model="homeOrderType">
          <el-radio :label="1" class="order-radio">创建时间排序（越新的排越前面）</el-radio>
          <el-radio :label="2" class="order-radio">热度排序（越热的排越前面）</el-radio>
          <el-radio :label="3" class="order-radio">创建时间+热度排序（优先热度排序）</el-radio>
          <el-radio :label="4" class="order-radio">创建时间+热度排序（优先时间排序）</el-radio>
        </el-radio-group>
        <div>
          <el-button type="primary" @click="handleStepBack">上一步</el-button>
          <el-button type="primary" @click="handleStepEnd">完成</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  components: {
    InputPositiveInt
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
      movieFilterForm: {
        categorys: [],
        tagsRelation: 1,
        tags: [],
        actors: [],
        directors: [],
        areas: [],
        payTypes: [],
        videoFeatures: [],
        createdTime: undefined,
        createdMonthTime: undefined,
        feverTop: undefined
      },
      createdTimeSelect: 1,
      feverSelect: 1,
      // 第三部
      teachCategoryOptions: [],
      teachAreaOptions: [],
      teachFeatureOptions: [],
      eduFilterForm: {
        teachCategory: [],
        tagsRelation: 1,
        teachTagCodes: [],
        company: [],
        teachAreas: [],
        teachFeatures: undefined,
        teachCreatedTime: undefined,
        teachCreatedMonthTime: undefined,
        feverTop: undefined
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
      homeOrderType: 1
    }
  },
  methods: {
    handleOpenDialog () {
      this.$service.getFilmFilterPartnerSource()
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
          const rs = JSON.parse(result.slice(7, -1))
          this.filmTypeOptions = rs.vod.categoryList.map(item => {
            return {
              label: item.categoryName,
              value: item.categoryId
            }
          })
          this.filmAreaOptions = rs.vod.areas.map(item => {
            return {
              label: item.tagCnName,
              value: item.tagCnName
            }
          })
          this.filmPayTypeOptions = rs.vod.payTypes.map(item => {
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
        const rs = JSON.parse(result.slice(7, -1))
        this.teachCategoryOptions = rs.vod.teachCategory.map(item => {
          return {
            label: item.tagCnName,
            value: item.tagId
          }
        })
        this.teachAreaOptions = rs.vod.areas.map(item => {
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
      }
      this.scrollTop()
    },
    handleThreeStepNext () {
      this.stepStack.push(this.stepCount)
      this.stepCount++
    },
    handleStepBack () {
      this.stepCount = this.stepStack.pop()
      this.scrollTop()
    },
    handleStepEnd () {
      this.isVisibleDialog = false
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
      this.movieFilterForm.teachCreatedMonthTime = undefined
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
</style>
