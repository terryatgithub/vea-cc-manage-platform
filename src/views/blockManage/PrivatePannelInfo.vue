<template>
  <div>
    <div class="hompage-upsert">
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <div class="base-info">
          <div>专属影院版块：</div>
          <div>专属影院，影片数据 由大数据和媒资库提供，运营人员只需配置相应内容块的影片类型（0 会员影片，1 非会员影片，2 单点影片）。</div>
        </div>

        <CommonContent
          :mode="mode"
          :resource-info="resourceInfo"
          @replicate="mode = 'replicate'"
          @edit="mode = 'edit'"
          @unaudit="$emit('upsert-end')"
          @shelves="fetchData"
          @audit="$emit('upsert-end')"
          @select-version="fetchData"
          @delete="$emit('upsert-end', $event)"
          @submit-audit="handleSubmitAudit"
          @save-draft="handleSaveDraft"
        >
         <div class="form-legend-header">
        <i class="el-icon-edit">基本信息</i>
        </div>
          <div v-if="mode!== 'read'">
            <el-form
              ref="upsertForm"
              :model="panel"
              label-width="120px"
              :rules="rules"
              class="el-form-add"
            >
              <el-form-item label="业务分类">
                <el-select
                  :value="panel.panelGroupCategory"
                  @input="handlePanelGroupCategoryChange"
                >
                  <el-option
                    :label="item.dictCnName"
                    v-for="(item,index) in panelGroupCategoryOptions"
                    :key="index"
                    :value="item.dictId"
                  ></el-option>
                </el-select>
                <span class="spform marginL">注：只有一个权限的操作者不能选择业务分类</span>
              </el-form-item>
              <el-form-item
                label="内容源"
                v-if="panelGroupCategoryValue === 'common' || panelGroupCategoryValue === 'video'"
              >
                <el-radio-group
                  :value="panel.pannelResource"
                  @input="handlePannelResourceChange"
                  :disabled="sourceDisabled"
                >
                  <el-radio
                    v-for="(item, index) in $consts.sourceOptions"
                    :label="item.value"
                    :key="index">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="版块名称" prop="pannelList.0.pannelName" :rules="rules.pannelName">
                <el-input v-model="panel.pannelList[0].pannelName"></el-input>
              </el-form-item>
              <template v-if="panel.panelGroupType === 9">
                  <el-form-item label="推荐策略">
                      <el-select
                        :value="panel.pannelList[0].recommendStrategy"
                        @input="handleRecommedStrategyInput"
                        :disabled="isReplica">
                        <el-option
                          :label="item.label"
                          v-for="(item,index) in recommendStrategyOptions"
                          :key="index"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
              </template>
              <div class="form-legend-header">
                <span>内容配置</span>
              </div>
              <el-form-item label="版块标题" prop="pannelList.0.pannelTitle" :rules="rules.pannelTitle">
                <el-input v-model="panel.pannelList[0].pannelTitle" placeholder="请输入版本标题"/>
                <el-checkbox
                  :value="!panel.showTitle"
                  @input="panel.showTitle=!$event"
                  class="marginL"
                >前端不显示标题</el-checkbox>
              </el-form-item>
              <div>
                <el-form-item v-if="panel.panelGroupType === 5" label="版块布局">
                  <span
                    class="spform J-selected J_select J_layout-selected"
                    v-if="panel.layoutId > 0"
                  >{{panel.layoutId}}</span>
                  <el-checkbox v-model="panel.lucenyFlag">设置前端推荐位底色透明</el-checkbox>
                  <div class="content-list">
                    <div
                      class="content-list__item"
                      v-for="(item, index) in panel.pannelList[0].contentList"
                      :key="index"
                    >
                      <el-select size="mini" v-model="item.blockVideoType">
                        <el-option
                          v-for="(type, tIndex) in blockVideoTypeOptions"
                          :key="tIndex"
                          :value="type.value"
                          :label="type.label"
                        ></el-option>
                      </el-select>
                      <span class="content-list__item-id">{{ index + 1}}</span>
                    </div>
                  </div>
                </el-form-item>
              </div>
              <template v-if="panel.panelGroupType === 9 || panel.panelGroupType === 10">
                <el-form-item
                  prop="pannelList.0.firstPageVipContentAmount"
                  label="首屏付费内容数"
                  :rules="rules.amount"
                >
                  <el-input-number
                    v-model="panel.pannelList[0].firstPageVipContentAmount"
                    :max="6"
                    :min="0"
                  />
                </el-form-item>
                <el-form-item
                  prop="pannelList.0.vipContentAmount"
                  label="总付费内容数"
                  :rules="rules.amount"
                >
                  <el-input-number v-model="panel.pannelList[0].vipContentAmount" :max="15" :min="0"/>
                </el-form-item>
              </template>
            </el-form>
          </div>
          <div v-if="mode === 'read'">
            <el-form label-width="120px" label-position="right">
              <el-form-item label="业务分类">
                <span>{{ getCategoryLabel(panel.panelGroupCategory) }}</span>
              </el-form-item>
              <el-form-item
                label="内容源"
                v-if="panelGroupCategoryValue === 'common' || panelGroupCategoryValue === 'video'"
              >
                <span>{{ $consts.sourceText[panel.pannelResource] }}</span>
              </el-form-item>
              <el-form-item
                label="版块名称"
                prop="pannelList.0.pannelName">
                {{ panel.pannelList[0].pannelName }}
              </el-form-item>
              <template v-if="panel.panelGroupType === 9">
                <el-form-item label="推荐策略">
                  <span>
                    {{ getRecommendStrategyLabel(panel.pannelList[0].recommendStrategy) }}
                  </span>
                </el-form-item>
              </template>
              <div class="form-legend-header">
                <span>内容配置</span>
              </div>
              <el-form-item label="版块标题" prop="pannelList.0.pannelTitle">
                {{ panel.pannelList[0].pannelTitle }}
                ({{ panel.showTitle ? '显示' : '不显示' }})
              </el-form-item>
              <el-form-item v-if="panel.panelGroupType === 5" label="版块布局">
                <span
                  class="spform J-selected J_select J_layout-selected"
                  v-if="panel.layoutId > 0"
                >{{panel.layoutId}}</span>
                ({{ panel.lucenyFlag ? '透明' : '非透明' }})
                <div class="content-list">
                  <div
                    class="content-list__item"
                    v-for="(item, index) in panel.pannelList[0].contentList"
                    :key="index"
                  >
                    <el-select
                      :disabled="mode === 'read'"
                      size="mini"
                      v-model="item.blockVideoType"
                    >
                      <el-option
                        v-for="(type, tIndex) in blockVideoTypeOptions"
                        :key="tIndex"
                        :value="type.value"
                        :label="type.label"
                      ></el-option>
                    </el-select>
                    <span class="content-list__item-id">{{ index + 1}}</span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item
                v-if="panel.panelGroupType === 9 || panel.panelGroupType === 10"
                label="内容免/付费比例"
              >
                <el-form-item
                  class="amount-input"
                  label="首屏付费内容数"
                >{{ panel.pannelList[0].firstPageVipContentAmount}}</el-form-item>
                <el-form-item
                  class="amount-input"
                  label="总付费内容数"
                >{{ panel.pannelList[0].vipContentAmount}}</el-form-item>
              </el-form-item>
            </el-form>
          </div>
        </CommonContent>
      </ContentCard>
    </div>
  </div>
</template>
<script>
import CommonContent from '@/components/CommonContent.vue'
import titleMixin from '@/mixins/title'
export default {
  mixins: [titleMixin],
  components: {
    CommonContent
  },
  props: {
    id: Number,
    initMode: String,
    version: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    const blockVideoTypeOptions = [
      {
        value: 0,
        label: '会员影片'
      },
      {
        value: 1,
        label: '非会员影片'
      },
      {
        value: 2,
        label: '单点影片'
      }
    ]

    return {
      mode: 'create',
      resourceName: '专属影院',
      panelGroupCategoryOptions: [],
      // 推荐策略
      recommendStrategyOptions: [],
      blockVideoTypeOptions: blockVideoTypeOptions,
      rules: {
        pannelName: [
          { required: true, message: '请填写版块名称' },
          { max: 45, message: '版块名称不超过 45 个字符' }
        ],
        pannelTitle: [
          { required: true, message: '请填写标题' },
          { max: 45, message: '标题不超过 45 个字符' }
        ],
        amount: [
          {
            validator (rule, value, callback) {
              if (Number.isInteger(Number(value)) && Number(value) >= 0) {
                callback()
              } else {
                callback(new Error('请输入整数'))
              }
            },
            trigger: 'blur'
          }
        ]
      },
      versionList: [],
      panel: {
        pannelGroupId: undefined,
        currentVersion: undefined,
        parentType: 'function',
        groupTitle: '',
        // pannelName: undefined,
        // pannelTitle: undefined,
        showTitle: true,
        lucenyFlag: false,
        // layoutId: undefined,
        pannelResource: 'o_tencent',
        panelGroupCategory: 67, // 业务分类
        panelGroupType: 9,
        //   focusConfig: undefined,
        //   dictInfoList: '',
        //   content: '',
        // priority: '1',
        pannelList: [
          {
            pannelId: undefined,
            pannelCategory: 67,
            pannelName: undefined,
            pannelTitle: '专属剧场',
            pannelResource: undefined,
            pannelType: 9,
            pannelStatus: undefined,
            showTitle: undefined,
            flagIs4k: 0,
            fillType: 4, // 填充类型为 用推荐流填充
            // layoutId: undefined,
            //  panelIsFocus: undefined,
            //   focusShape: undefined,
            recommendStrategy: 'serial_watch_too',
            vipContentAmount: 5, // 类型为9，10时候才有
            firstPageVipContentAmount: 2, // 类型为9，10时候才有
            contentList: [
              // pannelType为 5的时候才有
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 },
              // { blockVideoType: 0 }
            ]
          }
        ]
      }
    }
  },
  computed: {
    sourceDisabled () {
      const panel = this.panel
      return this.mode === 'replicate' || (panel.currentVersion !== undefined && panel.pannelList[0].pannelStatus !== 2)
    },
    // eslint-disable-next-line
    panelGroupCategoryValue() {
      const options = this.panelGroupCategoryOptions
      const panelGroupCategory = this.panel.panelGroupCategory
      if (options) {
        const target = options.find(function (item) {
          return item.dictId === panelGroupCategory
        })
        return target && target.dictEnName
      }
    },
    // eslint-disable-next-line
    resourceInfo() {
      const panel = this.panel
      if (panel.pannelGroupId) {
        return {
          id: panel.pannelGroupId,
          type: 'pannel',
          menuElId: 'privatePannelInfo',
          version: panel.currentVersion,
          status: panel.pannelList[0].pannelStatus
        }
      }
    },
    isReplica () {
      return this.mode === 'replica'
    },
    isDisableTabType () {
      const mode = this.mode
      return mode === 'edit' || mode === 'replicate' || mode === 'copy'
    }
  },
  methods: {
    handleRecommedStrategyInput (recommendStrategy) {
      this.panel.pannelList[0].recommendStrategy = recommendStrategy
      this.initPanelTitleByRecommendStrategy(recommendStrategy)
    },
    initPanelTitleByRecommendStrategy (recommendStrategy) {
      const selected = this.recommendStrategyOptions.find(function (item) {
        return item.value === recommendStrategy
      })
      this.panel.pannelList[0].pannelTitle = selected && selected.label
    },
    getRecommendStrategyLabel (value) {
      const selected = this.recommendStrategyOptions.find(function (item) {
        return item.value === value
      })
      return selected && selected.label
    },
    setDefaultPanelTitle (pannelType) {
      this.panel.pannelList[0].pannelType = pannelType
      this.panel.pannelList[0].pannelTitle =
        pannelType === 10 ? '猜你喜欢' : '专属剧场'
    },
    getCategoryLabel (value) {
      const selected = this.panelGroupCategoryOptions.find(function (item) {
        return item.dictId === value
      })
      return selected && selected.dictCnName
    },
    getPanelGroupTypeLabel (value) {
      const labelMap = {
        9: '根据用户近期观影偏好推荐',
        10: '根据用户近期观看的影片推荐'
      }
      return labelMap[value]
    },
    handlePanelGroupCategoryChange (val) {
      this.panel.panelGroupCategory = val
      const panelGroupCategoryValue = this.panelGroupCategoryValue
      if (
        panelGroupCategoryValue === 'common' ||
        panelGroupCategoryValue === 'video'
      ) {
        this.panel.pannelResource = 'o_tencent'
      } else {
        this.panel.pannelResource = ''
      }
    },
    handlePannelResourceChange (val) {
      this.panel.pannelResource = val
    },
    handleSaveDraft () {
      const data = JSON.parse(JSON.stringify(this.panel))
      data.pannelStatus = 2
      this.submit(data)
    },
    handleSubmitAudit () {
      const data = JSON.parse(JSON.stringify(this.panel))
      data.pannelStatus = 3
      this.submit(data)
    },
    validate (data, cb) {
      this.$refs.upsertForm.validate(function (valid) {
        if (valid) {
          // 首屏不能比付费多
          const firstPanel = data.pannelList[0]
          const panelGroupType = data.panelGroupType
          if (panelGroupType === 9 || panelGroupType === 10) {
            if (firstPanel.vipContentAmount < firstPanel.firstPageVipContentAmount) {
              return cb(Error('首屏付费内容数量不能大于总付费内容数量'))
            }
            if (firstPanel.vipContentAmount > firstPanel.firstPageVipContentAmount + 9) {
              return cb(Error('总付费内容数应小于等于(首屏付费内容数 + 9)'))
            }
          }
          cb()
        }
      })
    },
    submit (data) {
      let firstPageVipContentAmount = data.pannelList[0].firstPageVipContentAmount
      let vipContentAmount = data.pannelList[0].vipContentAmount
      if (vipContentAmount > firstPageVipContentAmount + 9) {
        this.$message({
          type: 'error',
          message: '总付费内容数应小于等于（首屏付费内容数 + 9）'
        })
        return
      }
      this.validate(
        data,
        (err) => {
          if (!err) {
            this.$service.panelUpsert(this.parseDataToApi(data), '保存成功').then(data => {
              this.$emit('upsert-end')
            })
          } else {
            this.$message({
              type: 'error',
              message: err
            })
          }
        }
      )
    },
    parseDataToApi (data) {
      if (this.mode === 'replicate') {
        data.currentVersion = ''
      }
      const panel = JSON.parse(JSON.stringify(data))
      const panelGroupCategory = panel.panelGroupCategory
      const pannelResource = panel.pannelResource
      const pannelStatus = panel.pannelStatus
      const layoutId = panel.layoutId
      const showTitle = panel.showTitle ? 1 : 0
      const lucenyFlag = panel.lucenyFlag ? 1 : 0
      panel.pannelList.forEach(function (item) {
        item.pannelCategory = panelGroupCategory
        item.pannelResource = pannelResource
        item.pannelStatus = pannelStatus
        item.layoutId = layoutId
        item.showTitle = showTitle

        if (item.contentList) {
          item.contentList.forEach(function (cItem) {
            cItem.lucenyFlag = lucenyFlag
          })
        }
      })
      delete panel.pannelResource
      delete panel.showTitle
      delete panel.lucenyFlag
      delete panel.pannelStatus
      delete panel.layoutId
      return panel
    },
    parseApiToData (data) {
      const panel = data
      const firstPanel = data.pannelList[0]
      panel.pannelResource = firstPanel.pannelResource
      panel.showTitle = firstPanel.showTitle === 1
      panel.pannelStatus = firstPanel.pannelStatus
      panel.layoutId = firstPanel.layoutId

      if (firstPanel.contentList && firstPanel.contentList.length > 0) {
        const firstContent = firstPanel.contentList[0]
        panel.lucenyFlag = firstContent.lucenyFlag === 1
      }
      return panel
    },
    setPanel (data) {
      const panel = this.parseApiToData(data)
      Object.assign(this.panel, panel)
    },
    getDictType () {
      this.$service.getDictType({ type: 'businessType' }).then(data => {
        this.panelGroupCategoryOptions = data
      })
    },
    getRecommendStrategy () {
      this.$service.getRecommendStrategy().then((data) => {
        console.log('rs', data)
        this.recommendStrategyOptions = data
      })
    },
    fetchData (version) {
      this.$service.panelGetDetail({ id: this.id, version }).then(data => {
        this.setPanel(data)
      })
    }
  },
  created () {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.fetchData(this.version)
    }
    this.getDictType()
    this.getRecommendStrategy()
  }
}
</script>

<style lang='stylus' scoped>
.base-info
  background-color: #fef8b8
  padding-bottom: 10px
  margin-bottom: 10px
.base-info div
  padding: 5px
.content-list
  display: flex
  flex-wrap: wrap
  .content-list__item
    padding: 10px 10px 10px 30px
    margin: 5px
    border: 1px solid #ccc
    position: relative
    .content-list__item-id
      position: absolute
      top: 0px
      left: 5px
      color: red
.content-list__item >>> .el-input, .content-list__item >>> .el-select
  width: 150px
</style>
