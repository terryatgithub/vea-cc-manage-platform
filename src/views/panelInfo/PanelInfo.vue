<template>
  <PageWrapper>
    <PageContentWrapper v-show="activePage == 'panel_info'">
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <CommonContent
          ref="commonContent"
          :mode="mode"
          :resource-info="resourceInfo"
          @replicate="mode = 'replicate'"
          @edit="mode = 'edit'"
          @unaudit="$emit('upsert-end')"
          @shelves="fetchData"
          @audit="$emit('upsert-end')"
          @submit-audit="handleSubmitAudit"
          @save-draft="handleSaveDraft"
          @select-version="fetchData"
          @delete="$emit('upsert-end', $event)"
          @cancel-timing="fetchData(pannel.currentVersion)">
          <div slot="copy-confirm">
            复制到
            <el-select v-model="copyToPanelDataType">
              <el-option :value="1" label="常规运营"></el-option>
              <el-option :value="3" label="业务专辑"></el-option>
            </el-select>
            &nbsp;
            <el-button type="primary" @click="handleCopy($consts.status.draft)">复制为草稿</el-button>
            <el-button type="primary" @click="handleCopy($consts.status.waiting)">复制并提交审核</el-button>
          </div>

          <div v-if="currentPanelDataType == 1" class="base-info">
            <div>常规运营版块：</div>
            <div>运营人员纯手工运营的版块，可以通过此版块自主配置影片、频道、活动、系统功能等，此类版块适合首屏比较固定的内容版块，不做个性推荐积累。</div>
          </div>
          <div v-if="currentPanelDataType == 3" class="base-info">
            <div>业务专辑：</div>
            <div>运营人员可以把业务站点专辑，关联映射至此版块中，可以多个进行排序。</div>
          </div>
          <template v-if="mode !== 'read'">
            <div class="form-legend-header">
              <i class="el-icon-edit">基本信息</i>
            </div>
            <el-form ref="form" :model="pannel" label-width="120px">
              <el-form-item label="业务分类"  class="selectItem">
                <CommonSelector
                  :value="pannel.panelGroupCategory"
                  @input="handlePanelGroupCategoryChange"
                  :disabled="isReplica"
                  :options="businessTypeEnums"/>
                <span class="remarks marginL">注：只有一个权限的操作者不能选择业务分类</span>
              </el-form-item>

              <el-form-item
                label="内容源"
                v-if="isPanelCommonOrVideo">
                <SourceRadioSelector
                  :value="pannel.pannelResource"
                  @input="handlePannelResourceChange"
                  :disabled="isReplica"
                />
              </el-form-item>

              <el-form-item label="版块名称" required>
                <el-input v-model.trim="pannel.pannelName"></el-input>
              </el-form-item>

              <el-form-item label="版块分类" required>
                <CommonSelector
                  type='radio'
                  :value="pannel.parentType"
                  @input="handleParentTypeChange"
                  :disabled="isReplica"
                  :options="$consts.panelTypeOptions"/>
              </el-form-item>

              <el-form-item v-if="pannel.parentType === 'group'" label="落焦规则">
                <el-radio-group v-model="pannel.focusConfig" @change="handleFocusConfigChange">
                  <el-radio label="">手动指定</el-radio>
                  <el-radio label="week">根据一周时间</el-radio>
                  <el-radio label="timeSlot">根据时间段</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="版块属性">
                <BinCheckBox label="4K" v-model="pannel.flagIs4k" :disabled="isReplica" />
              </el-form-item>
            </el-form>

            <div v-if="mode === 'edit' || mode === 'replicate'">
              <div class="form-legend-header" @click="handlePanelDataClick">
                <i v-if="isCollapseData" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-up"></i>
                <span>版块数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                昨日UVCTR：<span>{{panelUVCTR.value?toPercent(panelUVCTR.value):'N/A'}}</span>，
                日环比<span :class="panelUVCTR.dailyGrowth>0 ? 'data-up' : 'data-down'">{{panelUVCTRPercent.dailyGrowth}}</span>；
                周同比<span :class="panelUVCTR.weeklyGrowth>0 ? 'data-up' : 'data-down'">{{panelUVCTRPercent.weeklyGrowth}}</span>
              </div>
              <div v-if="!isCollapseData">
                <div v-for="(panelChartData, index) in panelChartDataArr" class="chart-box" :key="index">
                  <div class="chart-box--title">{{panelChartData.title}}</div>
                  <VeLine
                    :data="handleChartData(panelChartData)"
                    :legend-visible="false"
                    :extend="handleChartExtend(panelChartData)"
                    :settings="handleChartSettings(panelChartData)"
                    :events="handleChartEvents(index, 'edit')"
                    :mark-line="markLine"
                    :mark-point="markPoint"
                    >
                  </VeLine>
                </div>
              </div>
            </div>

            <div class="form-legend-header">
              <span>内容配置</span>
            </div>

            <el-form ref="form" :model="pannel" label-width="120px">
              <el-form-item v-if="pannel.parentType === 'normal'" label="版块标题" required>
                <el-input
                  style="width: 300px"
                  v-model="pannel.pannelList[0].pannelTitle"
                  placeholder="请输入版块标题"
                ></el-input>
                <BinCheckBox label="前端不显示标题" v-model="pannel.showTitle" is-negative />
              </el-form-item>
              <el-form-item v-if="pannel.parentType === 'group'" label="版块标题" required>
                <el-input v-model="pannel.groupTitle" placeholder="请输入版块标题"></el-input>
              </el-form-item>
              <el-form-item label="版块布局" required>
                <LayoutSelector ref="layoutSelector" @select-end="handleSelectLayoutEnd">
                  <el-button @click.stop="handleSelectLayoutStart" type="primary" plain >选择布局</el-button>
                </LayoutSelector>
                <span
                  class="marginL"
                  v-if="selectedLayout"
                >(已选择: {{ selectedLayout.layoutName }})</span>
                <BinCheckBox class="marginL" label="设置前端推荐位底色透明" v-model="pannel.lucenyFlag" />
              </el-form-item>
              <el-form-item label="落焦形式" required>
                <CommonSelector
                  v-model="pannel.focusShape"
                  :options="$consts.panelFocusOptions"
                  placeholder="请选择"
                />
                <BinCheckBox v-model="isShowfocusImgUrl" v-show="pannel.focusShape === 0" label="设置异形焦点" />
              </el-form-item>
              <el-form-item label="异形焦点" v-if="isShowfocusImgUrl && (pannel.focusShape === 0)">
                <el-button v-show="!selectedLayout" :disabled="!selectedLayout">选择异形焦点(请先选择布局)</el-button>
                <GlobalPictureSelector
                  v-show="selectedLayout"
                  title="选择异形焦点"
                  :picture-resolution="alienFocusResolution"
                  @select-end="handleSelectAlienFocusEnd"
                />
                <div>
                  <img
                    v-if="pannel.focusImgUrl"
                    :src="pannel.focusImgUrl"
                    style="margin-top: 10px; width: 200px; border: 1px solid #eee"
                  >
                </div>
              </el-form-item>
              <el-form-item v-if="!pannel.pannelGroupId" v-show="isShowTagsField" class="tag-list" label="资源共有标签">
                <el-tag type="primary" v-for="(item, index) in sharedTags" :key="index">{{ item.tagName }}/{{ item.tagWeight}}</el-tag>
              </el-form-item>
              <el-form-item v-else v-show="isShowTagsField" class="tag-list" label="资源共有标签">
                <div class="media-tag-list">
                  <div
                    v-for="(item, index) in sharedTags"
                    :key="index"
                    class="media-tag-list__item">
                    {{ item.tagName }}
                    <el-input-number :max="1.5" :min="0.5" @change="handleInputTagWeight(arguments[0], arguments[1], item)" v-model="item.tagWeight" :step="0.1" />
                  </div>
                </div>
              </el-form-item>
              <el-form-item v-show="isShowTagsField"  class="tag-list" label="资源批量打标签">
                <el-button type="primary" plain @click="handleBatchAddTag">
                  批量打标签
                </el-button>
              </el-form-item>
              <el-form-item label="批量填充">
                <span v-show="!selectedLayout">
                  请先选择布局
                </span>
                <div v-show="selectedLayout">
                  <ResourceSelector
                    ref="resourceSelector"
                    :selectors="mediaResourceSelectors"
                    :is-live="false"
                    :disable-partner="!!pannel.pannelResource"
                    selection-type="multiple"
                    :source="pannel.pannelResource"
                    :business-type="pannel.panelGroupCategory"
                    @select-end="handleSelectResourceEnd">
                    <el-button type="primary" plain @click.stop="handleSelectResourceStart">选择资源</el-button>
                  </ResourceSelector>
                  <ResourceSelector
                    class="margin-left-20"
                    v-if="canFillWithRanking"
                    ref="rankingSelector"
                    :selectors="['ranking']"
                    :is-live="false"
                    :disable-partner="!!pannel.pannelResource"
                    selection-type="single"
                    :source="pannel.pannelResource"
                    :business-type="pannel.panelGroupCategory"
                    @select-end="handleSelectRankingEnd">
                      <el-button type="primary" plain @click.stop="handleSelectRankingStart">
                        选择排行榜
                      </el-button>
                  </ResourceSelector>
                  <el-tooltip
                    v-else
                    effect="dark"
                    placement="top">
                    <div slot="content">
                      使用排行榜，布局必须满足：标题布局、不带价格、只有一行、
                      <br/>
                      每个推荐位都是 260*364、推荐位数量 6~11 个
                      <br />
                      目前只支持业务类型为 不限、教育、影视
                    </div>
                    <el-button class="is-disabled" type="primary" plain>
                      选择排行榜
                    </el-button>
                  </el-tooltip>
                </div>
                <div v-if="pannel.parentType === 'group'" style="float:right">
                  <el-button
                    type="primary"
                    @click="handleSetDefaultActiveTab"
                    :disabled="(!!pannel.pannelList[activePannelIndex].panelIsFocus) || pannel.focusConfig != ''">
                    设置默认落焦
                  </el-button>
                  <el-button
                    type="primary"
                    @click="handleAddTab"
                    :disabled="pannel.pannelList.length >= 10">
                    添加分组
                  </el-button>
                </div>
                <div class="pannel-blocks">
                  <template v-if="pannel.parentType === 'group'">
                    <el-tabs
                      :value="activePannelIndex + ''"
                      @input="activePannelIndex = +$event"
                      type="card"
                      closable
                      @tab-remove="handleRemoveTab"
                    >
                      <el-tab-pane
                        v-for="(item, index) in pannel.pannelList"
                        :key="index"
                        :name="index.toString()"
                      >
                        <span slot="label" @dblclick="handleSetPanelGroupInfoStart(index)">
                          {{ (item.pannelTitle || '').trim() || "双击修改" }}
                          {{
                          item.panelIsFocus && pannel.focusConfig === ""
                          ? "(默认落焦)"
                          : ""
                          }}
                        </span>
                        <VirtualPanel
                          :blocks="item.contentList"
                          :mode="mode"
                          @drag="handleDragBlock"
                          @remove-block="handleRemoveBlock"
                          @click-block="handleClickBlock"
                        ></VirtualPanel>
                      </el-tab-pane>
                    </el-tabs>
                  </template>

                  <VirtualPanel
                    v-else
                    :blocks="pannel.pannelList[0].contentList"
                    :mode="mode"
                    @drag="handleDragBlock"
                    @remove-block="handleRemoveBlock"
                    @click-block="handleClickBlock"
                  ></VirtualPanel>
                </div>
              </el-form-item>
            </el-form>
          </template>

          <template v-if="mode === 'read'">

            <div class="form-legend-header">
              <i class="el-icon-edit">基本信息</i>
            </div>
            <el-form ref="form" :model="pannel" label-width="120px">
              <el-form-item label="业务分类" v-if="businessTypeEnums.length > 0">
                {{ (businessTypeEnums.find(item => item.value == pannel.panelGroupCategory) || {}).label }}
              </el-form-item>

              <el-form-item
                label="内容源"
                v-if="isPanelCommonOrVideo"
              >
                {{ $consts.sourceText[pannel.pannelResource] }}
              </el-form-item>

              <el-form-item label="版块名称" required>
                <div>{{pannel.pannelName}}</div>
              </el-form-item>

              <el-form-item label="版块分类" required>
                <div>{{ $consts.panelTypeText[pannel.parentType] }} </div>
              </el-form-item>

              <el-form-item v-if="pannel.focusConfig !== ''" label="落焦规则">
                <div>{{ pannel.focusConfig === '' ? '手动指定' : ({week:'根据一周时间', timeSlot: '根据时间段'})[pannel.focusConfig] }} </div>
              </el-form-item>

              <el-form-item label="版块属性">
                <BinCheckBox label="4K" v-model="pannel.flagIs4k" :disabled="true" />
              </el-form-item>
            </el-form>

            <div>
            <div class="form-legend-header" @click="handlePanelDataClick">
              <i v-if="isCollapseData" class="el-icon-arrow-down"></i>
              <i v-else class="el-icon-arrow-up"></i>
              <span>版块数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              昨日UVCTR：<span>{{panelUVCTR.value?toPercent(panelUVCTR.value):'N/A'}}</span>，
              日环比<span :class="panelUVCTR.dailyGrowth>0 ? 'data-up' : 'data-down'">{{panelUVCTRPercent.dailyGrowth}}</span>；
              周同比<span :class="panelUVCTR.weeklyGrowth>0 ? 'data-up' : 'data-down'">{{panelUVCTRPercent.weeklyGrowth}}</span>
            </div>
            <div v-if="!isCollapseData">
              <div v-for="(panelChartData, index) in panelChartDataArr" :key="index" class="chart-box">
                <div class="chart-box--title">{{panelChartData.title}}</div>
                <VeLine
                  :data="handleChartData(panelChartData)"
                  :legend-visible="false"
                  :extend="handleChartExtend(panelChartData)"
                  :settings="handleChartSettings(panelChartData)"
                  :mark-line="markLine"
                  :mark-point="markPoint"
                >
                </VeLine>
              </div>
            </div>
            </div>

            <div class="form-legend-header">
              <span>内容配置</span>
            </div>

            <el-form ref="form" :model="pannel" label-width="120px">
              <el-form-item v-if="pannel.parentType === 'normal'" label="版块标题" required>
                <div>{{pannel.pannelList[0].pannelTitle}} {{ pannel.showTitle === false ? '(前端不显示)' : '' }}</div>
              </el-form-item>
              <el-form-item v-if="pannel.parentType === 'group'" label="版块标题" required>
                <div>{{pannel.groupTitle}} {{ pannel.showTitle === false ? '(前端不显示)' : '' }}</div>
              </el-form-item>
              <el-form-item label="版块布局" v-if="selectedLayout">
                <div>{{ selectedLayout.layoutName }}({{selectedLayout.layoutId}}){{pannel.lucenyFlag ? '(透明)' : ''}}</div>
              </el-form-item>
              <el-form-item label="落焦形式" required>
                {{ $consts.panelFocusText[pannel.focusShape] }}
              </el-form-item>
              <el-form-item label="异形焦点" v-if="isShowfocusImgUrl && (pannel.focusShape === 0)">
                <div>
                  <img
                    v-if="pannel.focusImgUrl"
                    :src="pannel.focusImgUrl"
                    style="margin-top: 10px; width: 200px; border: 1px solid #eee"
                  >
                </div>
              </el-form-item>
              <el-form-item v-show="isShowTagsField" class="tag-list" label="资源共有标签">
                <el-tag type="primary" v-for="(item, index) in sharedTags" :key="index">{{ item.tagName }}/{{ item.tagWeight }}</el-tag>
              </el-form-item>
              <el-form-item label="推荐位">
                <div class="pannel-blocks pannel-blocks--read">
                  <template v-if="pannel.parentType === 'group'">
                    <el-tabs
                      v-model="activePannelIndex"
                      type="card"
                    >
                      <el-tab-pane
                        v-for="(item, index) in pannel.pannelList"
                        :key="index"
                        :name="index.toString()">

                        <span slot="label" @dblclick="handleSetPanelGroupInfoStart(index)">
                          {{ item.pannelTitle }} {{ item.panelIsFocus && pannel.focusConfig === '' ? '(默认落焦)' : '' }}
                        </span>
                        <VirtualPanel
                          :blocks="item.contentList"
                          :mode="mode"
                          :show-chart-btn="true"
                          @click-block="handleClickBlock"
                          @show-simple-chart="handleAnalyzeData('simple', $event, index)"
                          @show-dmp-chart="handleAnalyzeData('dmp', $event, index)"
                        ></VirtualPanel>
                      </el-tab-pane>
                    </el-tabs>
                  </template>

                  <VirtualPanel
                    v-else
                    :mode="mode"
                    :blocks="pannel.pannelList[0].contentList"
                    @click-block="handleClickBlock"
                    :show-chart-btn="true"
                    @show-simple-chart="handleAnalyzeData('simple', $event)"
                    @show-dmp-chart="handleAnalyzeData('dmp', $event)"
                  ></VirtualPanel>
                </div>
              </el-form-item>
            </el-form>
          </template>

        </CommonContent>
          <PanelGroupInfoSetter
            v-if="activePanelGroup"
            :info="activePanelGroup"
            :mode="mode"
            :panel-list="pannel.pannelList"
            :focus-config="pannel.focusConfig"
            @set-end="handleSetPanelGroupInfoEnd"
            @set-cancel="handleSetPanelGroupInfoCancel">
          </PanelGroupInfoSetter>
          <TagFrame :is-batch="true" :ids="panelResourceIds" v-if="showAddTagDialog" @close="handleBatchAddTagEnd"></TagFrame>
      </ContentCard>
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage == 'block_content'">
      <BlockContent
        :mode="mode"
        :data="blockContentProps"
        :source="pannel.pannelResource"
        :pannel="pannel.pannelList[+activePannelIndex]"
        :pannel-group-id="pannel.pannelGroupId"
        :hide-title-options="!!blockContentProps.blockInfo.title_info"
        @cancel="handleSetBlockContentCancle"
        @save="handleSetBlockContentEnd"
      />
    </PageContentWrapper>

    <AnalyzeSimpleDataDialog :show.sync="isVisiAnalyzeSimpleData" :parentId="id" :position="analyzeBtnCurrentIndex"/>
    <AnalyzeDmpDataDialog :show.sync="isVisiAnalyzeDmpData" :parentId="id" :position="analyzeBtnCurrentIndex"/>
  </PageWrapper>
</template>
<script>
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import ContentCard from '@/components/ContentCard'
import CommonContent from '@/components/CommonContent'
import titleMixin from '@/mixins/title'
import VirtualPanel from '@/components/VirtualPanel'
import SourceRadioSelector from '@/components/SourceRadioSelector'
import LayoutSelector from '@/components/selectors/LayoutSelector'
import GlobalPictureSelector from '@/components/selectors/GlobalPictureSelector'
import BlockContent from './BlockContent/BlockContent'
import CommonSelector from '@/components/CommonSelector'
import BinCheckBox from '@/components/BinCheckBox'

import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
import PanelGroupInfoSetter from './PanelGroupInfoSetter'

import TagFrame from './TagFrame'
import VeLine from 'v-charts/lib/line.common'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'

import AnalyzeSimpleDataDialog from './AnalyzeSimpleDataDialog'
import AnalyzeDmpDataDialog from './AnalyzeDmpDataDialog'

import { genResourceContentList, genRankingContentList, getMatchedPictureUrl, isValidLayoutForRanking } from './panelInfoUtil'
import { cloneDeep } from 'lodash'

export default {
  mixins: [titleMixin],
  components: {
    PageWrapper,
    PageContentWrapper,
    ContentCard,
    CommonContent,
    CommonSelector,
    VirtualPanel,
    SourceRadioSelector,
    LayoutSelector,
    GlobalPictureSelector,
    BlockContent,
    BinCheckBox,
    ResourceSelector,
    PanelGroupInfoSetter,
    TagFrame,
    VeLine,
    AnalyzeSimpleDataDialog,
    AnalyzeDmpDataDialog
  },
  data() {
    const extend = {
      grid: {
        top: '10%',
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      series: v => {
        v[0].smooth = false
        return v
      },
      xAxis: {
        // triggerEvent: true,
        axisLabel: {
          rotate: 45,
          formatter: function(val) {
            let mark = val.indexOf('(')
            if (mark === -1) {
              return val
            } else {
              let version = val.slice(mark - val.length)
              let date = val.slice(0, mark)
              return [`{a|${version}}`, date].join('')
            }
          },
          rich: {
            a: { color: 'red' }
          }
        }
      },
      color: ['#1E90FF ', '#2f4554']
    }
    this.markLine = {
      data: [
        {
          name: '平均线',
          type: 'average'
        }
      ]
    }
    this.markPoint = {
      data: [
        {
          name: '最大值',
          type: 'max'
        },
        {
          name: '最小值',
          type: 'min'
        }
      ]
    }
    return {
      analyzeBtnCurrentIndex: undefined,
      isVisiAnalyzeSimpleData: false,
      isVisiAnalyzeDmpData: false,
      // 数据展现
      extend: extend,
      settings: {
        labelMap: {
          y: '曝光UV'
        }
      },
      isCollapseData: true,
      panelUVCTR: {
        value: '',
        dailyGrowth: '',
        weeklyGrowth: ''
      },
      panelUVCTRPercent: {
        value: 'N/A',
        dailyGrowth: 'N/A',
        weeklyGrowth: 'N/A'
      },
      panelChartDataArr: [],

      mode: 'create',
      activePage: 'panel_info',
      PANNEL_STATUS: {
        draft: 2,
        waiting: 3,
        accepted: 4,
        rejected: 5
      },
      showResourceSelector: false,
      selectedLayout: null,
      // 推荐位个数
      // 经过计算(和扩展) 的布局信息,
      blocks: [],
      // 包含选中内容
      selectedResources: [],
      selectedFocusImgUrl: undefined,

      // 复制到
      copyToPanelDataType: this.panelDataType,

      // 设置推荐位内容窗口
      blockContentProps: {},
      // 版块类型，1-常规版块，2-排行榜，3-业务专辑，4-智能推荐版块，5-专属影院版块，6-影片详情页，7-定向版块等
      pannelType: 1,

      // ----
      pannel: {
        pannelGroupId: undefined,
        pannelName: '',
        panelGroupCategory: 67,
        parentType: 'normal', // normal, group
        flagIs4k: 0,
        pannelResource: 'o_tencent',

        groupTitle: undefined,
        panelGroupType: undefined,
        showTitle: 1,
        selectV: '',
        lucenyFlag: 0,
        focusShape: 0,
        focusImgUrl: undefined,

        focusConfig: '', // '', week
        currentVersion: '',

        pannelList: [
          {
            rankIsOpen: 0,
            rankChildId: undefined,
            pannelTitle: '',
            panelIsFocus: 0,
            contentList: [],
            selectedResources: []
          }
        ]
      },
      isShowfocusImgUrl: false,
      blockList: [],
      blockCountList: [0],
      blockCount: 1,
      businessTypeEnums: [],

      currentBlockIndex: undefined,
      // 当前激活的分组 pannel 的索引值
      activePannelIndex: '0',
      activePanelGroup: undefined,

      showAddTagDialog: false,
      sharedTags: [],

      // 用在 watcher 中，设置一个标识表示是否人为更新数据，避免 watcher 逻辑执行
      isResetingData: false,
      // 允许开排行榜的业务类型
      // 不限，教育 支持排行榜
      allowRankBusinessTypes: [67, 60, 31]
    }
  },
  props: ['id', 'initMode', 'version', 'panelDataType', 'initGroupIndex', 'initBlockIndex'],
  computed: {
    resourceName() {
      return this.currentPanelDataType === 3 ? '业务专辑' : '版块'
    },
    // eslint-disable-next-line
    resourceInfo() {
      const panel = this.pannel
      if (panel.pannelGroupId) {
        return {
          id: panel.pannelGroupId,
          version: panel.currentVersion,
          status: panel.pannelStatus,
          type: 'pannel',
          menuElId: 'pannelInfo'
        }
      }
    },
    mediaResourceSelectors () {
      return ['video', 'app', 'edu', 'pptv', 'live', 'topic', 'rotate', 'good']
    },
    mediaResourceSelectionType () {
      if (this.isFillWithRanking) {
        return 'single'
      }
      return 'multiple'
    },
    currentPanelDataType() {
      const panel = this.pannel
      if (panel.pannelGroupId) {
        return panel.panelGroupType
      }
      return this.panelDataType
    },
    isPanelCommonOrVideo() {
      const panelGroupCategory = this.pannel.panelGroupCategory
      return panelGroupCategory === 31 || panelGroupCategory === 67
    },
    isReplica() {
      return this.mode === 'replicate' || this.pannel.duplicateVersion === 'yes'
    },
    isSelectMultiResource() {
      const selectedLayout = this.selectedLayout.layoutJsonParsed
      if (
        selectedLayout &&
        selectedLayout.type === 'Panel' &&
        selectedLayout.contents.length === 1
      ) {
        return false
      }
      return true
    },
    // eslint-disable-next-line
    alienFocusResolution() {
      const selectedLayout = this.selectedLayout
      if (selectedLayout) {
        const firstBlock = selectedLayout.layoutJsonParsed.contents[0]
        const width = firstBlock.width + 15 + 15
        const height = firstBlock.height + 20 + 79
        const pictureSize = width + '*' + height
        return pictureSize
      }
    },
    panelResourceIds() {
      const ids = []
      const contentTypeMap = {
        movie: true,
        edu: true,
        shopping: false,
        app: false
      }
      this.pannel.pannelList.forEach(function(item) {
        item.contentList.forEach(function(blockItem) {
          blockItem.videoContentList.forEach(function(videoItem) {
            const videoContentType = videoItem.videoContentType
            const id = videoItem.extraValue1 || ''
            if (id && contentTypeMap[videoContentType]) {
              ids.push(id)
            }
          })
        })
      })
      return ids
    },
    isShowTagsField() {
      const pannelList = this.pannel.pannelList
      let isShow = !!this.selectedLayout
      for (
        let i = 0, length = pannelList.length;
        i < length;
        i++
      ) {
        const pannel = pannelList[i]
        const contentList = pannel.contentList
        for (let j = 0, lengthJ = contentList.length; j < lengthJ; j++) {
          const content = contentList[j] || {}
          if (
            !content.videoContentList ||
            content.videoContentList.length === 0
          ) {
            isShow = false
            break
          }
        }
      }
      return isShow
    },
    couldSetReleaseTime() {
      const mode = this.mode
      const currentVersion = this.pannel.currentVersion
      const isCreatingOrCopying = mode === 'create' || mode === 'copy'
      const isEditingV1 = mode === 'edit' && currentVersion === 'V1'
      const isCoocaa = this.$consts.idPrefix === '10'
      return isCoocaa && !(isCreatingOrCopying || isEditingV1)
    },
    isFillWithRanking () {
      const activePannelIndex = +this.activePannelIndex
      const pannelList = this.pannel.pannelList
      return !!pannelList[activePannelIndex].rankIsOpen
    },
    canFillWithRanking () {
      const allowRankBusinessTypes = this.allowRankBusinessTypes
      const pannel = this.pannel
      const activePannelIndex = +this.activePannelIndex
      const pannelList = pannel.pannelList
      const activePannel = pannelList[activePannelIndex]
      const validBusinessType = allowRankBusinessTypes.includes(pannel.panelGroupCategory)
      const validLayout = isValidLayoutForRanking(activePannel.contentList)
      return validBusinessType && validLayout
    }
  },
  watch: {
    isShowfocusImgUrl(val) {
      if (val === false) {
        this.pannel.focusImgUrl = ''
      }
    },
    'pannel.focusShape': function(val) {
      if (val === 1) {
        this.isShowfocusImgUrl = false
      }
    },
    'pannel.parentType': function(val) {
      if (val === 'group') {
        this.pannel.showTitle = 1
      }
    },
    'pannel.focusConfig': 'handleFocusConfigChange'
  },
  methods: {
    handleToggleFillWithRanking (val) {
      const panelList = this.pannel.pannelList
      const activePannelIndex = +this.activePannelIndex
      const activePannel = panelList[activePannelIndex]
      if (val) {
        if (!isValidLayoutForRanking(activePannel.contentList)) {
          return this.$message({
            type: 'error',
            duration: 8000,
            message: '采用排行榜，布局必须满足：标题布局、不带价格、只有一行、每个推荐位都是260*364、推荐位数量6~11个'
          })
        }
        panelList[activePannelIndex].rankIsOpen = 1
        this.clearBlocks()
      } else {
        // 清空内容
        panelList[activePannelIndex].rankIsOpen = 0
        this.clearBlocks()
      }
    },
    toPercent: decimal => {
      return (Math.round(decimal * 10000) / 100.00 + '%')
    },
    toArrowPercent (decimal) {
      const rs = this.toPercent(Math.abs(decimal))
      return rs + (decimal > 0 ? ' ↑' : ' ↓')
    },
    handleChartData(chartData) {
      return {
        title: chartData.title,
        unit: chartData.unit,
        columns: ['x', 'y'],
        rows: chartData.data
      }
    },
    handleChartSettings(chartData) {
      return {
        labelMap: {
          y: chartData.title
        }
      }
    },
    handleChartExtend(chartData) {
      const yAxis = {
        axisLabel: {
          formatter: '{value}%'
        }
      }
      const extend = Object.assign({}, this.extend)
      return chartData.unit === '%'
        ? Object.assign(extend, {
          yAxis
        })
        : extend
    },
    // 暂时没有extra, e.componentType !== 'xAxis', xAxis: {triggerEvent: false}
    // 故下面的函数暂时不执行
    handleChartEvents (index, mode) {
      let _this = this
      return {
        click: function(e) {
          const h = _this.$createElement
          if (e.componentType === 'xAxis' && mode === 'edit') {
            let xIndex = _this.panelChartDataArr[index].data.findIndex(item => {
              return item.x === e.value
            })
            const extra = _this.panelChartDataArr[index].data[xIndex].extra
            if (extra && extra.length !== 0) {
              // 埋点
              _this.$sendEvent({
                type: 'album_version_show'
              })
              // 展示
              let extraNodeArr = extra.map(item => {
                return h('p', null, item)
              })
              _this.$msgbox({
                title: '推荐位标题变化',
                message: h('div', null, extraNodeArr),
                confirmButtonText: '确定'
              })
            }
          }
        }
      }
    },
    handleBatchAddTag() {
      this.showAddTagDialog = true
      this.$sendEvent({
        type: 'panel_tag',
        payload: {
          panel_group_id: this.pannel.pannelGroupId || 'new'
        }
      })
    },
    handleBatchAddTagEnd() {
      this.getSharedTags()
      this.showAddTagDialog = false
    },
    handleInputTagWeight(weight, originWeight, tag) {
      this.$sendEvent({
        type: 'tag_weight',
        payload: {
          panel_group_id: this.pannel.pannelGroupId || 'new',
          type: weight <= originWeight ? 'minus' : 'plus'
        }
      })
      this.$service.panelTagUpsert({
        panelId: this.pannel.pannelGroupId,
        tagId: tag.tagId,
        tagName: tag.tagName,
        tagWeight: tag.tagWeight
      })
        .catch((e) => {
          tag.tagWeight = originWeight
        })
    },
    getSharedTags() {
      const panelId = this.pannel.pannelGroupId
      const resourceIds = this.panelResourceIds
      const isNoResources = resourceIds && resourceIds.length === 0
      if (!this.isShowTagsField || isNoResources) {
        this.sharedTags = []
      } else {
        this.$service.getSharedTags({
          coocaaVIds: resourceIds.join(','),
          panelId
        }).then((data) => {
          this.sharedTags = data.tags || []
        })
      }
    },
    handleFocusConfigChange(val) {
      if (this.isResetingData) {
        return
      }
      if (val === 'week') {
        const pannel = this.pannel
        const pannelList = pannel.pannelList
        let count = 7 - pannelList.length
        while (count-- > 0) {
          this.addPannel()
        }
        const titles = [
          '周一',
          '周二',
          '周三',
          '周四',
          '周五',
          '周六',
          '周日'
        ]
        pannel.pannelList = pannelList.map(function(item, index) {
          item.pannelTitle = titles[index]
          item.panelIsFocus = 0
          return item
        })
        this.updateAllPosition()
      }
      if (val === 'timeSlot') {
        const pannel = this.pannel
        const pannelList = pannel.pannelList
        let count = 4 - pannelList.length
        while (count-- > 0) {
          this.addPannel()
        }
        pannel.pannelList = pannelList.map(function(item, index) {
          item.pannelTitle = '时间段分组'
          return item
        })
        this.updateAllPosition()
      }
    },
    fetchData(version) {
      return this.$service.panelGetDetail({ id: this.id, version }).then(data => {
        this.setPanelInfoData(data)
      })
    },
    getPanelIndexListUsingRanking () {
      const pannelList = this.pannel.pannelList
      return pannelList.reduce((result, item, index) => {
        if (item.rankIsOpen) {
          result.push(index)
        }
        return result
      }, [])
    },
    handleSelectVersion() {
      const pannel = this.pannel
      window.location.href =
        this.urls.copy_pannel +
        '?id=' +
        pannel.pannelGroupId +
        '&version=' +
        pannel.currentVersion
    },
    handleCopy(status) {
      this.pannel.panelGroupType = this.copyToPanelDataType
      const STATUS = this.$consts.status
      if (status === STATUS.waiting) {
        this.handleSubmitAudit()
      } else {
        this.handleSaveDraft()
      }
    },
    // 布局
    handleSelectLayoutStart () {
      const panelIndexListUsingRanking = this.getPanelIndexListUsingRanking()
      if (panelIndexListUsingRanking.length > 0) {
        this.$confirm('当前有版块使用排行榜填充，切换布局后这些版块内容将被清空，确定要换布局？', '提示')
          .then(() => {
            this.$refs.layoutSelector.$refs.wrapper.handleSelectStart()
          })
          .catch(() => {})
      } else {
        this.$refs.layoutSelector.$refs.wrapper.handleSelectStart()
      }
    },
    handleSelectLayoutEnd(layout, blockCount) {
      // 切换布局之后，如果含有用排行榜填充的，清空所有版块内容
      const panelIndexListUsingRanking = this.getPanelIndexListUsingRanking()
      panelIndexListUsingRanking.forEach(index => {
        // 把使用排行榜填充的版块内容清空
        this.clearBlocks(index)
      })
      this.selectedLayout = layout
      // 如果是横向拓展布局
      blockCount = blockCount || layout.layoutJsonParsed.contents.length
      this.blockCount = blockCount
      this.blockCountList = this.blockCountList.map(_ => blockCount)
      // 如果选择的是拓展布局，按照设置的数量删除多余的资源
      if (blockCount !== undefined) {
        this.pannel.pannelList.forEach(item => {
          const selectedResources = item.selectedResources
          if (selectedResources) {
            item.selectedResources = selectedResources.slice(0, blockCount)
          }
        })
      }
      // 关闭推荐流按钮
      this.pannel.pannelList.forEach(pannelList => {
        pannelList.contentList.forEach(contentList => {
          contentList.videoContentList.forEach(videoContent => {
            videoContent.flagSetRec = 0
            videoContent.mediaAutomationBlockRls = {
              refreshCal: 1,
              mediaAutomationId: '',
              blockType: 'normal'
            }
          })
        })
      })
      // 如果选择的是不含价格的布局，要删除所有价格信息
      if (layout.layoutJsonParsed.contents[0].type !== 'Mall') {
        this.pannel.pannelList.forEach(function(item) {
          item.contentList.forEach(function(cItem) {
            ;[]
              .concat(
                cItem.videoContentList || [],
                cItem.specificContentList || []
              )
              .forEach(function(vItem) {
                vItem.price = undefined
                vItem.secKillPrice = undefined
              })
          })
        })
      }
      // 重新计算所有 pannel 的推荐位
      let i = this.pannel.pannelList.length
      while (--i >= 0) {
        this.updatePosition(i)
      }
      this.getSharedTags()
      // 清除异形焦点
      this.pannel.focusImgUrl = ''
    },
    handleSelectAlienFocusEnd(item) {
      this.pannel.focusImgUrl = item.pictureUrl
    },

    // 设置版块内容
    handleClickBlock(index) {
      const pannel = this.pannel
      if (this.isFillWithRanking) {
        return this.$message.error('使用排行榜填充的版块里的推荐位不能查看或编辑')
      }
      const selectedLayout = this.selectedLayout
      const activePannelIndex = +this.activePannelIndex
      const selectedResources =
        this.pannel.pannelList[activePannelIndex].selectedResources || []
      this.blockContentProps = {
        layoutType: selectedLayout.layoutJsonParsed.type,
        pannelParentType: pannel.parentType,
        pannelCategory: this.pannel.panelGroupCategory,
        block: selectedResources[index],
        blockInfo: this.blockList[activePannelIndex][index],
        pannelResource: this.pannel.pannelResource
      }
      this.currentBlockIndex = index
      this.activePage = 'block_content'
    },
    handleSetBlockContentCancle() {
      this.activePage = 'panel_info'
      this.getSharedTags()
    },
    handleSetBlockContentEnd(param) {
      const activePannelIndex = +this.activePannelIndex
      const activePannel = this.pannel.pannelList[activePannelIndex]
      const selectedResources = activePannel.selectedResources || []
      const currentBlockIndex = this.currentBlockIndex
      const resource = selectedResources[currentBlockIndex] || {}
      selectedResources[currentBlockIndex] = resource
      Object.assign(resource, param)
      if (param.specificContentList.length > 0) {
        activePannel.pannelType = 7
      }
      this.updatePosition()
      this.getSharedTags()
      this.activePage = 'panel_info'
    },
    handleSelectRankingStart () {
      const pannel = this.pannel
      const activePannelIndex = +this.activePannelIndex
      const activePannel = pannel.pannelList[activePannelIndex]
      const areBlocksEmpty = activePannel.selectedResources.length === 0
      if (!activePannel.rankIsOpen && !areBlocksEmpty) {
        this.$confirm('使用排行榜填充之后，原来推荐位内容将被全部清除, 是否继续操作?', '提示')
          .then(() => {
            this.$refs.rankingSelector.$refs.wrapper.handleSelectStart()
          })
          .catch(() => {})
      } else {
        this.$refs.rankingSelector.$refs.wrapper.handleSelectStart()
      }
    },
    handleSelectRankingEnd (selectedResources) {
      const pannel = this.pannel
      const activePannelIndex = +this.activePannelIndex
      const activePannel = pannel.pannelList[activePannelIndex]
      const blockCount = this.blockCountList[activePannelIndex]
      // 获取排行榜资源
      const ranking = selectedResources.ranking[0]
      const businessType = this.pannel.panelGroupCategory
      const partner = this.$consts.sourceToPartner[pannel.pannelResource]
      const reqData = {
        code: ranking.code,
        businessType,
        partner
      }
      this.$service.mediaGetRankingInfoVideoList(reqData).then(result => {
        activePannel.rankIsOpen = 1
        activePannel.rankChildId = ranking.id
        activePannel.selectedResources = []
        // 根据推荐位个数 n, 截取 n-1 个资源
        const rankingResources = result.rankingVideoInfoEntities || []
        selectedResources.rankingCode = ranking.code
        selectedResources.ranking = rankingResources.slice(0, blockCount - 1)
        return this.insertResources({
          selectedResources,
          isFillWithRanking: true
        })
      })
    },
    handleSelectResourceStart () {
      const pannel = this.pannel
      const activePannelIndex = +this.activePannelIndex
      const activePannel = pannel.pannelList[activePannelIndex]
      if (activePannel.rankIsOpen) {
        this.$confirm('当前版块推荐位已使用排行榜填充，若选择其他资源填充，原来排行榜的内容将全部清除, 是否继续操作?', '提示')
          .then(() => {
            this.$refs.resourceSelector.$refs.wrapper.handleSelectStart()
          })
          .catch(() => {})
      } else {
        this.$refs.resourceSelector.$refs.wrapper.handleSelectStart()
      }
    },
    handleSelectResourceEnd(selectedResources) {
      const resourceSelector = this.$refs.resourceSelector
      const pannel = this.pannel
      const activePannelIndex = +this.activePannelIndex
      const activePannel = pannel.pannelList[activePannelIndex]
      // 获取当前已有内容的推荐位数量
      let blockNotEmptyCount = 0
      activePannel.contentList.forEach(function(item) {
        const videoContentList = item.videoContentList
        if (videoContentList && videoContentList.length > 0) {
          blockNotEmptyCount++
        }
      })

      this.$prompt('请确认从第几个内容框开始填充', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder:
          '当前已填充 ' + blockNotEmptyCount + ' 个， 默认为从第1位开始填充',
        inputValidator: function(value) {
          if (value !== null && !RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)) {
            return '请正确填写位置'
          }
        }
      })
        .then(result => {
          if (activePannel.rankIsOpen) {
            activePannel.rankIsOpen = 0
            activePannel.rankChildId = undefined
            activePannel.selectedResources = []
          }
          resourceSelector.clearSelected()
          return this.insertResources({
            insertAfter: result.value || 1,
            selectedResources
          })
        })
        .catch((e) => {
          console.log(e)
          resourceSelector.$refs.wrapper.handleSelectStart()
        })
    },
    insertResources ({ insertAfter = 1, selectedResources, isFillWithRanking }) {
      const pannel = this.pannel
      const activePannelIndex = +this.activePannelIndex
      const activePannel = pannel.pannelList[activePannelIndex]
      const genMethod = isFillWithRanking ? genRankingContentList : genResourceContentList
      const resourcesToInsert = genMethod(selectedResources, {
        // 把一些值置为为定义，
        // 因为 gen 出来的默认数据结构只适用于推荐位详情里面，在外面没必要用
        bgParams: undefined,
        cornerList: undefined,
        redundantParams: undefined,
        // 定义一个标识，在填充的时候，填充最合适尺寸的图片
        shouldFindFitestPicture: true
      })
        .map(function(item) {
          return {
            contentPosition: null,
            blockMallPosition: null,
            focusImgUrl: '',
            lucenyFlag: 0,
            resize: null,
            titleInfo: null,
            videoContentList: [item],
            specificContentList: []
          }
        })
      const newResourcesLength = Math.max(
        insertAfter - 1 + resourcesToInsert.length,
        activePannel.selectedResources.length
      )
      const newResources = Array.apply(null, {
        length: newResourcesLength
      })
      for (
        let i = 0,
          start = insertAfter - 1,
          end = start + resourcesToInsert.length - 1,
          length = newResourcesLength;
        i < length;
        i++
      ) {
        if (i >= start && i <= end) {
          // 覆盖原来的
          newResources[i] = resourcesToInsert[i - start]
          // 只覆盖第一个，后面的补上
          const videoContentList = newResources[i].videoContentList
          const originSelectedResources = activePannel.selectedResources[i] || {}
          const originVideoContentList = originSelectedResources.videoContentList
          if (originVideoContentList && originVideoContentList.length > 1) {
            newResources[i].videoContentList = videoContentList.concat(originVideoContentList.slice(1))
          }
        } else {
          // 新资源填充完毕，后面的还是原来的
          newResources[i] = activePannel.selectedResources[i]
        }
      }
      activePannel.selectedResources = newResources
      // 计算每个 block 的位置
      this.updatePosition()
      this.getSharedTags()
    },
    handleRemoveTab(indexString) {
      this.$confirm('确认删除该子版块?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(
          function() {
            const pannelList = this.pannel.pannelList
            if (pannelList.length === 1) {
              return this.$message({
                type: 'error',
                message: '至少包含一个分组'
              })
            }
            const index = +indexString
            pannelList.splice(index, 1)
            if (this.activePannelIndex >= indexString) {
              const activePannelIndex = index - 1
              this.activePannelIndex =
                activePannelIndex === -1 ? '0' : activePannelIndex.toString()
            }
          }.bind(this)
        )
        .catch(function(e) {
          console.log(e)
        })
    },
    handleAddTab() {
      const validateBlocksRes = this.validateBlocks()
      if (validateBlocksRes.emptyBlock) {
        return this.$message({
          type: 'error',
          message: '请先把空推荐位填充完毕'
        })
      }

      this.activePanelGroup = {
        index: this.pannel.pannelList.length,
        title: '',
        startTime: undefined,
        endTime: undefined,
        panelIsFocus: 0
      }
    },
    addPannel() {
      const pannelList = this.pannel.pannelList
      const pannel = {
        rankIsOpen: 0,
        rankChildId: undefined,
        pannelTitle: undefined,
        panelIsFocus: 0,
        selectedResources: [],
        contentList: []
      }
      const index = pannelList.length
      this.activePannelIndex = index.toString()
      this.blockCountList.push(this.blockCount)
      pannelList.push(pannel)
    },
    handleSetDefaultActiveTab() {
      const activePannelIndex = +this.activePannelIndex
      this.pannel.pannelList.forEach(function(item, index) {
        if (activePannelIndex === index) {
          item.panelIsFocus = 1
        } else {
          item.panelIsFocus = 0
        }
      })
    },

    handlePanelGroupCategoryChange(val) {
      this.$confirm('切换业务类型将清空推荐位内容, 确定切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const panel = this.pannel
          panel.panelGroupCategory = val
          if (this.isPanelCommonOrVideo) {
            panel.pannelResource = 'o_tencent'
          } else {
            panel.pannelResource = ''
          }
          this.clearBlocks()
        }
        )
        .catch(function() {})
    },
    handlePannelResourceChange(val) {
      this.$confirm('切换内容源将清空推荐位内容, 确定切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(
          function() {
            this.pannel.pannelResource = val
            this.clearBlocks()
          }.bind(this)
        )
        .catch(function() {})
    },
    handleParentTypeChange(val) {
      this.$confirm('切换版块类型将清空推荐位内容, 确定切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(
          function() {
            const pannel = this.pannel
            if (val === 'normal') {
              pannel.focusConfig = ''
            }
            pannel.pannelList = pannel.pannelList.slice(0, 1)
            this.activePannelIndex = 0
            this.clearBlocks()
            this.pannel.parentType = val
          }.bind(this)
        )
        .catch(function() {})
    },

    handleSetPanelGroupInfoStart(index) {
      const panel = this.pannel.pannelList[index]
      this.activePanelGroup = {
        index: index,
        title: panel.pannelTitle,
        rankIsOpen: panel.rankIsOpen,
        startTime: panel.startTime,
        endTime: panel.endTime,
        panelIsFocus: panel.panelIsFocus
      }
    },
    handleSetPanelGroupInfoCancel() {
      this.activePanelGroup = undefined
    },
    handleSetPanelGroupInfoEnd() {
      const groupInfo = this.activePanelGroup
      const index = groupInfo.index
      const panelList = this.pannel.pannelList
      let panel = panelList[index]
      if (!panel) {
        // 是新添加的
        this.addPannel()
        panel = panelList[index]
      }
      panel.pannelTitle = groupInfo.title
      if (groupInfo.panelIsFocus) {
        this.setPanelDefaultFocus(index)
      } else {
        panel.panelIsFocus = groupInfo.panelIsFocus
      }
      const originRankIsOpen = panel.rankIsOpen
      const rankIsOpen = groupInfo.rankIsOpen
      if (rankIsOpen !== originRankIsOpen) {
        // 清空内容
        panel.selectedResources = []
      }
      panel.rankIsOpen = rankIsOpen
      panel.startTime = groupInfo.startTime
      panel.endTime = groupInfo.endTime
      this.activePanelGroup = undefined
      this.updateAllPosition()
    },
    setPanelDefaultFocus(index) {
      const panelList = this.pannel.pannelList
      const panel = panelList[index]
      panelList.forEach(function(item) {
        item.panelIsFocus = 0
      })
      panel.panelIsFocus = 1
    },
    clearBlocks(index) {
      const pannel = this.pannel
      const pannelList = pannel.pannelList
      const doClear = (i) => {
        const item = pannelList[i]
        item.rankIsOpen = 0
        item.rankChildId = undefined
        item.selectedResources = []
      }
      if (index !== undefined) {
        doClear(index)
      } else {
        pannelList.forEach((item, index) => {
          doClear(index)
        })
      }
      this.updateAllPosition()
    },
    updateAllPosition() {
      let i = this.pannel.pannelList.length
      while (--i >= 0) {
        this.updatePosition(i)
      }
    },
    updatePosition(index) {
      const selectedLayout = this.selectedLayout
      if (!selectedLayout) {
        return
      }
      const pannel = this.pannel
      const blockList = this.blockList
      const currentPannelIndex = index === undefined
        ? +this.activePannelIndex
        : index
      const currentPannel = pannel.pannelList[currentPannelIndex]

      const { blocks, selectedBlocksAndResources } = this.getBlocksAndResources(currentPannelIndex)
      blockList[currentPannelIndex] = blocks
      currentPannel.contentList = selectedBlocksAndResources
    },
    getBlocksAndResources (currentPannelIndex, layoutVersion) {
      // 可以使用外部传过来的 pannel 数据,
      // 在保存的时候需要使用6.0的布局来计算
      // 而展示的时候用8.0的布局
      const pannel = this.pannel
      const blockCountList = this.blockCountList
      const selectedLayout = this.selectedLayout
      // 用 JSON.parse，因为需要一个新的对象
      const layoutStr = layoutVersion === 'v6' ? selectedLayout.layoutJson : selectedLayout.layoutJson8
      const layoutJsonParsed = JSON.parse(layoutStr)
      const type = layoutJsonParsed.type
      const blocks = layoutJsonParsed.contents
      const originBlockCount = blocks.length

      const currentPannel = pannel.pannelList[currentPannelIndex]
      const selectedResources = currentPannel.selectedResources || []
      const blockCount = blockCountList[currentPannelIndex]

      const lastBlock = blocks[originBlockCount - 1]
      const layoutWidth = lastBlock.x + lastBlock.width
      const lastBlockResize = lastBlock.resize || {}
      const layoutHeight =
        lastBlock.y + (lastBlockResize.height || lastBlock.height)

      const calculateFactory = function() {
        if (type === 'Expander' && originBlockCount === 2) {
          const space = layoutJsonParsed.extra.space
          return function(n) {
            // 复制第 2 个推荐位
            const targetBlock = blocks[1]
            const resize = targetBlock.resize
            const titleInfo = targetBlock.title_info
            const mallResize = targetBlock.mall_resize
            const x =
              layoutWidth + (n - 2) * space + (n - 3) * targetBlock.width
            const y = targetBlock.y
            const result = {
              height: targetBlock.height,
              width: targetBlock.width,
              x: x,
              y: y,
              isExtra: true,
              title_info: titleInfo,
              mall_resize: mallResize,
              loop: targetBlock.loop,
              type: targetBlock.type
            }

            if (titleInfo && resize) {
              result.resize = {
                height: resize.height,
                width: resize.width,
                x: x,
                y: y
              }
            }
            return result
          }
        } else if (type === 'Expander') {
          const space = layoutJsonParsed.extra.space
          return function(n) {
            const times = Math.floor(n / originBlockCount) - 1
            const index = n % originBlockCount
            const targetBlock = blocks[index]
            const resize = targetBlock.resize
            const titleInfo = targetBlock.title_info
            const mallResize = targetBlock.mall_resize
            const x = targetBlock.x + times * layoutWidth + times * space
            const y = targetBlock.y
            const result = {
              height: targetBlock.height,
              width: targetBlock.width,
              x: x,
              y: y,
              isExtra: true,
              title_info: titleInfo,
              mall_resize: mallResize,
              loop: targetBlock.loop,
              type: targetBlock.type
            }

            if (titleInfo && resize) {
              result.resize = {
                height: resize.height,
                width: resize.width,
                x: x,
                y: y
              }
            }
            return result
          }
        }

        if (type === 'Lengthwise') {
          const space = 28
          return function(n) {
            const times = Math.ceil(n / originBlockCount) - 1
            const index = n - originBlockCount * times - 1
            const targetBlock = blocks[index]
            const resize = targetBlock.resize
            const titleInfo = targetBlock.title_info
            const mallResize = targetBlock.mall_resize
            const x = targetBlock.x
            const y = targetBlock.y + times * layoutHeight + times * space
            const result = {
              height: targetBlock.height,
              width: targetBlock.width,
              parents: targetBlock.parents,
              type: targetBlock.type,
              title_align: targetBlock.title_align,
              x: x,
              y: y,
              isExtra: true,
              title_info: titleInfo,
              mall_resize: mallResize
            }

            if (titleInfo && resize) {
              result.resize = {
                height: resize.height,
                width: resize.width,
                x: x,
                y: y
              }
            }

            return result
          }
        }
      }

      if (type === 'Expander' || type === 'Lengthwise') {
        // 如果时横线拓展布局或者纵向拓展布局, 按照资源数量或者设定的推荐位个数填充
        const calculate = calculateFactory()
        // 分组版块不支持自动拓展
        const count =
          pannel.parentType === 'group' && type === 'Lengthwise'
            ? blockCount
            : Math.max(blockCount, selectedResources.length)
        // 把最新的推荐位个数存下来
        blockCountList[currentPannelIndex] = count
        let i = blocks.length
        while (i++ < count) {
          blocks.push(calculate(i))
        }
      }

      // 检查重复
      const resourceIndexed = {}
      const selectedBlocksAndResources = blocks.map(function(item, index) {
        const resource = selectedResources[index] || {}
        const contentList = resource.videoContentList || []
        const specificContentList = resource.specificContentList || []
        const idFieldMap = {
          media: 'extraValue1',
          block: 'vContentId',
          mall: 'extraValue1'
        }
        // 有 extraValue1 才判断重复, 自定义不判断
        contentList.forEach((content, contentIndex) => {
          const coverType = content.coverType
          const shouldCheck = coverType === 'media' || coverType === 'block' || coverType === 'mall'
          if (shouldCheck) {
            let id = content[idFieldMap[coverType]]
            if (id) {
              // 单集的 extraValue1 相同，可能有 extraValue4 或 extraValue5
              id = id + (content.extraValue4 || '') + (content.extraValue5 || '')
              const duplicatedItem = resourceIndexed[id]
              if (duplicatedItem) {
                duplicatedItem.resource.duplicated = {
                  // 与当前的重复
                  index: duplicatedItem.index,
                  contentIndex: duplicatedItem.contentIndex,
                  duplicatedIndex: index,
                  duplicatedContentIndex: contentIndex
                }
                resource.duplicated = {
                  // 与上面的重复
                  index,
                  contentIndex,
                  duplicatedIndex: duplicatedItem.index,
                  duplicatedContentIndex: duplicatedItem.contentIndex
                }
              } else {
                resource.duplicated = false
                resourceIndexed[id] = {
                  resource,
                  index,
                  contentIndex
                }
              }
            }
          } else {
            resource.duplicated = false
          }
        })

        // 如果推荐位带标题，则强制显示标题
        ;[].concat(contentList, specificContentList).forEach(function(cItem) {
          if (item.title_info) {
            cItem.showTitle = 1
            cItem.forceTitle = true
          } else {
            cItem.forceTitle = false
          }

          // 默认不显示
          if (cItem.showTitle === undefined) {
            cItem.showTitle = 0
          }
          if (cItem.showSubTitle === undefined) {
            cItem.showSubTitle = 0
          }
        })

        // 获取最匹配的海报
        const firstContent = contentList[0] || {}
        const picturePreset = firstContent.picturePreset
        if (firstContent.shouldFindFitestPicture && picturePreset) {
          const size = [item.width, item.height]
          firstContent.pictureUrl = getMatchedPictureUrl(size, picturePreset)
          firstContent.shouldFindFitestPicture = undefined
        }

        resource.videoContentList = contentList
        resource.contentPosition = Object.assign({}, item, {
          resize: undefined
        })
        resource.titleInfo = item.title_info
        resource.mallResize = item.mall_resize
        resource.resize = item.resize
        resource.isExtra = item.isExtra
        return resource
      })

      return {
        blocks,
        selectedBlocksAndResources
      }
    },

    handleDragBlock(oldIndex, newIndex) {
      if (this.isFillWithRanking) {
        return this.$message.error('排行榜填充的推荐位不支持自定义位置')
      }
      // 改变资源
      const activePannel = this.pannel.pannelList[+this.activePannelIndex]
      const selectedResources = activePannel.selectedResources
      const resourceA = selectedResources[oldIndex]
      const resourceB = selectedResources[newIndex]
      selectedResources[newIndex] = resourceA
      selectedResources[oldIndex] = resourceB
      // 重新计算
      this.updatePosition()
    },

    // 移除某个推荐位
    handleRemoveBlock(index) {
      // 重新计算 block
      const activePannelIndex = +this.activePannelIndex
      const activePannel = this.pannel.pannelList[activePannelIndex]
      if (activePannel.rankIsOpen) {
        return this.$message.error('使用排行榜填充的版块里的推荐位不能删除')
      }
      this.blockCountList[activePannelIndex]--
      const selectedResources = activePannel.selectedResources
      // 移除对应的资源
      selectedResources.splice(index, 1)
      // 更新位置
      this.updatePosition()
      this.getSharedTags()
    },
    getFormData() {
      const data = JSON.parse(JSON.stringify(this.pannel))
      const mode = this.mode
      if (mode === 'replicate') {
        data.currentVersion = ''
      }
      if (mode === 'copy') {
        data.pannelGroupId = undefined
        data.currentVersion = ''
      }
      return data
    },
    makeCompatibleV6 (panel) {
      // 使用 v6 的布局重新计算位置信息，为来兼容旧的数据同步到江苏有线等
      const panelList = panel.pannelList
      let i = panelList.length
      while (--i >= 0) {
        const { selectedBlocksAndResources } = this.getBlocksAndResources(i, 'v6')
        panelList[i].contentList = selectedBlocksAndResources
      }
    },
    parseDataToApi(data) {
      const panelDataType = this.currentPanelDataType
      const layout = this.selectedLayout
      const pannel = JSON.parse(JSON.stringify(data))

      pannel.panelGroupType = panelDataType
      pannel.pannelList = data.pannelList.map(function(item) {
        let hasSpecific = false
        const itemContentList = item.contentList.map(function(_contentItem) {
          const titleInfo = _contentItem.titleInfo
          const resize = _contentItem.resize
          const mallResize = _contentItem.mallResize

          const contentPosition = Object.assign(
            {},
            _contentItem.contentPosition
          )
          // 去除不需要的
          contentPosition.resize = undefined
          contentPosition.mall_resize = undefined
          contentPosition.title_info = undefined
          contentPosition.isExtra = undefined
          if (layout.layoutJsonParsed.type === 'Expander') {
            // 对横向拓展布局做特殊处理
            contentPosition.x = 0
            contentPosition.y = 0
            if (titleInfo) {
              titleInfo.x = 0
              titleInfo.y = 0
            }
            if (resize) {
              resize.x = 0
              resize.y = 0
            }
          }

          const contentItem = Object.assign({}, _contentItem, {
            contentPosition: JSON.stringify(contentPosition),
            titleInfo: titleInfo ? JSON.stringify(titleInfo) : '',
            resize: resize ? JSON.stringify(resize) : '',
            blockMallPosition: mallResize ? JSON.stringify(mallResize) : ''
          })

          contentItem.focusImgUrl = pannel.focusImgUrl
          contentItem.lucenyFlag = pannel.lucenyFlag

          if (
            contentItem.specificContentList &&
            contentItem.specificContentList.length > 0
          ) {
            hasSpecific = true
          }
          // 去除辅助字段
          ;[]
            .concat(
              contentItem.videoContentList || [],
              contentItem.specificContentList || []
            )
            .forEach(function(item) {
              item.forceTitle = undefined
              item.picturePreset = undefined
            })

          delete contentItem.mallResize
          delete contentItem.isExtra
          delete contentItem.duplicated

          return contentItem
        })

        let timeSlot
        if (pannel.focusConfig === 'timeSlot') {
          const startTime = item.startTime
          const endTime = item.endTime
          if (startTime && endTime) {
            timeSlot = startTime + ',' + endTime
          }
        }

        return {
          pannelStatus: pannel.pannelStatus,
          pannelId: item.pannelId,
          pannelCategory: pannel.panelGroupCategory,
          pannelName: pannel.pannelName,
          pannelTitle: item.pannelTitle,
          pannelResource: pannel.pannelResource,
          // item.pannelType 有可能有值 7, 如果是定向版块
          pannelType: hasSpecific ? 7 : panelDataType,
          showTitle: pannel.showTitle,
          flagIs4k: pannel.flagIs4k,
          layoutId: layout.layoutId,
          panelIsFocus: item.panelIsFocus,
          timeSlot: timeSlot,
          focusShape: pannel.focusShape,
          contentList: itemContentList,
          rankIsOpen: item.rankIsOpen,
          rankChildId: item.rankChildId
        }
      })
      delete pannel.pannelName
      delete pannel.pannelResource
      delete pannel.showTitle
      delete pannel.flagIs4k
      delete pannel.lucenyFlag
      delete pannel.focusShape
      delete pannel.focusImgUrl

      // 时间段默认落焦
      if (pannel.focusConfig === 'timeSlot') {
        const defaultFocusIndex = pannel.pannelList.findIndex(function(item) {
          return item.panelIsFocus === 1
        })
        if (defaultFocusIndex === -1) {
          pannel.pannelList[0].panelIsFocus = 1
        }
      }

      return pannel
    },
    validate(pannel, callback) {
      const cb = (err) => {
        if (!err) {
          callback()
        } else {
          this.$message({
            type: 'error',
            message: err.message || err
          })
        }
      }
      const PANNEL_STATUS = this.$consts.status
      const status = pannel.pannelStatus

      if (!pannel.pannelName) {
        return cb(Error('请输入版块名称'))
      }
      if (pannel.pannelName.length > 45) {
        return cb(Error('版块名称长度不能大于 45 个字符'))
      }

      if (pannel.parentType === 'normal' && !pannel.pannelList[0].pannelTitle) {
        return cb(Error('请输入版块标题'))
      }
      if (pannel.parentType === 'normal' && pannel.pannelList[0].pannelTitle.length > 45) {
        return cb(Error('版块标题长度不能大于 45 个字符'))
      }

      if (pannel.parentType === 'group' && !pannel.groupTitle) {
        return cb(Error('请输入版块标题'))
      }
      if (pannel.parentType === 'group' && pannel.groupTitle.length > 45) {
        return cb(Error('版块标题长度不能大于 45 个字符'))
      }

      if (!this.selectedLayout) {
        return cb(Error('请选择布局'))
      }

      if (this.isShowfocusImgUrl && !pannel.focusImgUrl) {
        return cb(Error('请设置异形焦点'))
      }
      // 如果是待审核或者审核通过
      if (
        status === PANNEL_STATUS.accepted ||
        status === PANNEL_STATUS.waiting
      ) {
        const validateBlocksRes = this.validateBlocks()

        const emptyPannelTitleIndex = validateBlocksRes.emptyPannelTitleIndex
        const duplicatedPannelTitleIndex = validateBlocksRes.duplicatedPannelTitleIndex
        const emptyTimeSlotIndex = validateBlocksRes.emptyTimeSlotIndex
        const emptyPostIndex = validateBlocksRes.emptyPostIndex
        const emptyPostBlockIndex = validateBlocksRes.emptyPostBlockIndex
        const emptyPriceIndex = validateBlocksRes.emptyPriceIndex
        const emptyPriceBlockIndex = validateBlocksRes.emptyPriceBlockIndex
        const emptyTitleIndex = validateBlocksRes.emptyTitleIndex
        const emptyTitleBlockIndex = validateBlocksRes.emptyTitleBlockIndex
        const emptyBlock = validateBlocksRes.emptyBlock
        const duplicatedIndex = validateBlocksRes.duplicatedIndex
        const duplicatedInfo = validateBlocksRes.duplicatedInfo
        const focusIndex = validateBlocksRes.focusIndex

        const isPanelGroup = pannel.parentType === 'group'

        if (this.isPanelCommonOrVideo) {
          if (!pannel.pannelResource) {
            return cb(Error('请选择内容源'))
          }
        }

        if (emptyPannelTitleIndex !== undefined) {
          return cb(Error('请填写第' + (emptyPannelTitleIndex + 1) + '分组的标题'))
        }

        if (duplicatedPannelTitleIndex !== undefined) {
          return cb(Error('第' + (duplicatedPannelTitleIndex + 1) + '分组的标题与别的分组重复'))
        }

        if (emptyTimeSlotIndex !== undefined) {
          return cb(Error('请设置第' + (emptyTimeSlotIndex + 1) + '分组的落焦时间'))
        }

        if (
          emptyPriceIndex !== undefined &&
          emptyPriceBlockIndex !== undefined
        ) {
          if (pannel.parentType === 'group') {
            return cb(Error(
              '请设置第 ' +
              (emptyPriceIndex + 1) +
              ' 个分组第 ' +
              (emptyPriceBlockIndex + 1) +
              ' 个推荐位的价格'
            ))
          } else {
            return cb(Error('请设置第 ' + (emptyPriceBlockIndex + 1) + ' 个推荐位的价格'))
          }
        }

        if (
          emptyTitleIndex !== undefined &&
          emptyTitleBlockIndex !== undefined
        ) {
          if (pannel.parentType === 'group') {
            return cb(Error(
              '请设置第 ' +
              (emptyTitleIndex + 1) +
              ' 个分组第 ' +
              (emptyTitleBlockIndex + 1) +
              ' 个推荐位的标题'
            ))
          } else {
            return cb(Error('请设置第 ' + (emptyTitleBlockIndex + 1) + ' 个推荐位的标题'))
          }
        }

        if (emptyPostIndex !== undefined && emptyPostBlockIndex !== undefined) {
          if (pannel.parentType === 'group') {
            return cb(Error(
              '请设置第 ' +
              (emptyPostIndex + 1) +
              ' 个分组第 ' +
              (emptyPostBlockIndex + 1) +
              ' 个推荐位的内容海报'
            ))
          } else {
            return cb(Error(
              '请设置第 ' + (emptyPostBlockIndex + 1) + ' 个推荐位的内容海报'
            ))
          }
        }
        if (duplicatedInfo) {
          const prefix = isPanelGroup
            ? `第 ${duplicatedIndex + 1} 个分组`
            : ''
          return cb(Error(`${prefix}第 ${duplicatedInfo.index + 1} 推荐位
            第 ${duplicatedInfo.contentIndex + 1} 
            个内容与第 ${duplicatedInfo.duplicatedIndex + 1} 个推荐位第 
            ${duplicatedInfo.duplicatedContentIndex + 1} 个内容重复`))
        }

        if (emptyBlock) {
          return cb(Error('含有空推荐位'))
        }

        if (
          pannel.focusConfig === '' &&
          focusIndex === undefined &&
          pannel.parentType === 'group'
        ) {
          return cb(Error('请选择默认落焦'))
        }
      }
      cb()
    },
    validateBlocks() {
      const pannelList = this.pannel.pannelList
      const focusConfig = this.pannel.focusConfig
      const pannelTitleIndex = {}
      let emptyPannelTitleIndex
      let duplicatedPannelTitleIndex

      let emptyTimeSlotIndex

      let emptyPriceIndex
      let emptyPriceBlockIndex

      let emptyPostIndex
      let emptyPostBlockIndex

      let emptyTitleIndex
      let emptyTitleBlockIndex

      let emptyBlock
      let duplicatedIndex
      let duplicatedInfo
      let focusIndex

      // eslint-disable-next-line
      checkBlock:
      for (let i = 0, length = pannelList.length; i < length; i++) {
        const pannel = pannelList[i]
        if (!pannel.pannelTitle) {
          emptyPannelTitleIndex = i
          // eslint-disable-next-line
          break checkBlock
        }

        // 标题重复检查
        const pannelTitle = pannel.pannelTitle.trim()
        if (pannelTitleIndex[pannelTitle]) {
          duplicatedPannelTitleIndex = i
          // eslint-disable-next-line
          break checkBlock
        } else {
          pannelTitleIndex[pannelTitle] = true
        }

        // 落焦时间段重叠检查
        if (focusConfig === 'timeSlot') {
          if (!(pannel.startTime && pannel.endTime) && !pannel.panelIsFocus) {
            emptyTimeSlotIndex = i
            // eslint-disable-next-line
            break checkBlock
          }
        }
        if (pannel.panelIsFocus) {
          focusIndex = i
        }
        const contentList = pannel.contentList
        for (let j = 0, lengthJ = contentList.length; j < lengthJ; j++) {
          const content = contentList[j] || {}
          if (
            !content.videoContentList ||
            content.videoContentList.length === 0
          ) {
            emptyBlock = content
            // eslint-disable-next-line
            break checkBlock
          }
          if (content.duplicated) {
            duplicatedIndex = i
            duplicatedInfo = content.duplicated
            // eslint-disable-next-line
            break checkBlock
          }

          const price = content.videoContentList[0].price
          if (
            content.contentPosition.type === 'Mall' &&
            (price === undefined || price === -1 || price === '')
          ) {
            emptyPriceIndex = i
            emptyPriceBlockIndex = j
            // eslint-disable-next-line
            break checkBlock
          }

          const title = content.videoContentList[0].title || ''
          const mustSetTitle = content.videoContentList[0].forceTitle || false
          if (mustSetTitle && title.trim() === '') {
            emptyTitleIndex = i
            emptyTitleBlockIndex = j
          }

          // 海报检查
          const post = content.videoContentList[0].pictureUrl
          if (!post) {
            emptyPostIndex = i
            emptyPostBlockIndex = j
          }
        }
      }
      return {
        emptyPannelTitleIndex,
        duplicatedPannelTitleIndex,
        emptyTimeSlotIndex,
        emptyPostIndex,
        emptyPostBlockIndex,
        emptyPriceIndex,
        emptyPriceBlockIndex,
        emptyTitleIndex,
        emptyTitleBlockIndex,
        emptyBlock,
        duplicatedIndex,
        duplicatedInfo,
        focusIndex
      }
    },
    handleSaveDraft() {
      const data = this.getFormData()
      data.isTiming = undefined
      data.releaseTime = undefined
      data.pannelStatus = this.$consts.status.draft
      this.validate(data, () => {
        this.upsertPanelInfo(data)
      })
    },
    handleSubmitAudit(timing) {
      const data = this.getFormData()
      data.pannelStatus = this.$consts.status.waiting
      this.validate(data, () => {
        if (this.couldSetReleaseTime) {
          if (timing) {
            data.isTiming = timing.isTiming
            data.releaseTime = timing.releaseTime
            this.upsertPanelInfo(data)
          } else {
            this.$refs.commonContent.showReleaseTimeSetter = true
          }
        } else {
          this.upsertPanelInfo(data)
        }
      })
    },
    upsertPanelInfo(data) {
      // 使用 v6 布局重新计算 contentPosition
      this.makeCompatibleV6(data)
      this.$service
        .panelUpsert(this.parseDataToApi(data), '保存成功')
        .then(result => {
          this.$emit('upsert-end')
        })
    },
    resetingData(cb) {
      this.isResetingData = true
      cb()
      this.$nextTick(() => {
        this.isResetingData = false
      })
    },
    setPanelInfoData(panelInit) {
      this.resetingData(() => {
        const initData = panelInit
        const pannel = this.pannel
        const pannelList = initData.pannelList || []
        const firstPannel = pannelList[0]
        Object.assign(pannel, panelInit)
        pannel.pannelName = panelInit.pannelGroupRemark

        if (firstPannel) {
          firstPannel.contentList = firstPannel.contentList || []
          this.blockCountList = pannelList.map(function(item) {
            return item.contentList.length
          })
          pannel.pannelList = pannelList.map(function(item) {
            item.contentList = item.contentList.map(function(contentItem) {
              contentItem.contentPosition = JSON.parse(
                contentItem.contentPosition
              )
              ;[]
                .concat(
                  contentItem.videoContentList || [],
                  contentItem.specificContentList || []
                )
                .forEach((item) => {
                  if (+item.price === -1) {
                    item.price = ''
                  }
                  if (+item.secKillPrice === -1) {
                    item.secKillPrice = ''
                  }
                })
              return contentItem
            })
            if (item.timeSlot) {
              const timeSlot = item.timeSlot.split(',')
              item.startTime = new Date(timeSlot[0])
              item.endTime = new Date(timeSlot[1])
            }
            item.rankIsOpen = item.rankIsOpen || 0
            item.selectedResources = item.contentList
            return item
          })
          pannel.pannelResource = firstPannel.pannelResource
          pannel.flagIs4k = firstPannel.flagIs4k
          pannel.showTitle = firstPannel.showTitle
          pannel.focusShape = firstPannel.focusShape
          pannel.pannelStatus = firstPannel.pannelStatus

          const layout = firstPannel.layoutInfo
          layout.layoutJsonParsed = JSON.parse(layout.layoutJson8)
          this.selectedLayout = layout

          const firstBlock = firstPannel.contentList[0]
          if (firstBlock) {
            pannel.lucenyFlag = firstBlock.lucenyFlag
            pannel.focusImgUrl = firstBlock.focusImgUrl
            this.isShowfocusImgUrl = firstBlock.focusImgUrl
          }
        }
        this.pannel = cloneDeep(pannel)
        this.updateAllPosition()
        this.getSharedTags()
      })
    },
    clickBlock() {
      const { initGroupIndex, initBlockIndex } = this
      if (initGroupIndex !== undefined) {
        this.activePannelIndex = initGroupIndex
      }
      if (initBlockIndex !== undefined) {
        this.handleClickBlock(initBlockIndex)
      }
    },
    getSimpleBrowseData() {
      this.$service.getPanelSimpleBrowseData({ id: this.id }).then(data => {
        const panelUVCTR = data.rows[0].data[0] ? data.rows[0].data[0].uvctr : 'N/A'
        this.panelUVCTR = panelUVCTR
        this.panelUVCTRPercent.dailyGrowth = panelUVCTR.dailyGrowth ? this.toArrowPercent(panelUVCTR.dailyGrowth) : 'N/A'
        this.panelUVCTRPercent.weeklyGrowth = panelUVCTR.weeklyGrowth ? this.toArrowPercent(panelUVCTR.weeklyGrowth) : 'N/A'
      })
    },
    // 点击板块数据展示折线图
    handlePanelDataClick() {
      this.isCollapseData = !this.isCollapseData
      if (this.panelChartDataArr.length !== 0) {
        return
      }
      this.$service.getPanelChartData({ id: this.id }).then(data => {
        this.panelChartDataArr = data.rows
      })
    },
    // 点击看数据、dmp按钮
    handleAnalyzeData (type, index, pannelListIndex) { // pannelListIndex对group有效
      this.analyzeBtnCurrentIndex = undefined
      const { pannel } = this
      if (pannel.parentType === 'group') {
        // let contentList = pannelList[pannelListIndex].contentList
        this.analyzeBtnCurrentIndex = pannelListIndex + '-' + index
      } else {
        // let contentList = pannelList[0].contentList
        this.analyzeBtnCurrentIndex = index
      }
      if (type === 'dmp') {
        this.isVisiAnalyzeDmpData = true
        this.$sendEvent({
          type: 'block_data_show',
          payload: {
            type: 'dmp'
          }
        })
      } else { // type === 'simple'
        this.isVisiAnalyzeSimpleData = true
        this.$sendEvent({
          type: 'block_data_show',
          payload: {
            type: 'position'
          }
        })
      }
    }
  },
  created() {
    this.mode = this.initMode || 'create'
    this.$service.getDictType({ type: 'businessType', isFilter: 1 }).then(data => {
      this.businessTypeEnums = data.map(item => {
        return {
          label: item.dictCnName,
          value: item.dictId,
          disabled: item.disabled
        }
      })
    })
    if (this.mode === 'edit' || this.mode === 'replicate' || this.mode === 'copy' || this.mode === 'read') {
      this.getSimpleBrowseData()
    }
  },
  mounted() {
    if (this.id) {
      this.fetchData(this.version).then(() => {
        this.clickBlock()
      })
      this.$sendEvent({
        type: 'panel_show',
        payload: {
          panel_group_id: this.id
        }
      })
    }
  }
}
</script>
<style scoped>
.pannel-blocks {
  margin-top: 20px;
  max-width: 100%;
  overflow: auto;
}
.pannel-blocks >>> .el-tabs__content {
  overflow-x: visible;
  overflow-y: auto;
}
.pannel-blocks--read >>> .cc-virtual-pannel__block:hover .cc-virtual-pannel__block-remove {
  display: none;
}
.base-info {
  margin: 10px 0;
  border: 1px solid #e7e4c2;
  background: #fef8b8;
  padding: 10px;
}
.tag-list >>> .el-tag {
  margin-right: 10px;
}
</style>
<style lang="stylus" scoped>
.media-tag-list__item
  display inline-block
  border 1px solid #3ba7f0
  background #e8f5ff
  margin 0 10px 10px 0
  padding-left 5px
  color #666
  >>>
    .el-input-number--small
      width 100px
      margin-left 5px
    .el-input-number__decrease,
    .el-input-number__increase,
    .el-input__inner
      background #e8f5ff
      border-radius 0
      border none
    .el-input-number__decrease
      border-left 1px solid #3ba7f0
      border-right 1px solid #3ba7f0
    .el-input-number__increase
      border-left 1px solid #3ba7f0
.data-up
  color: red
.data-down
  color: #00AA00
.chart-box--title
  height: 44px
  line-height: 44px
  text-align: center
  font-size: 25px
.fill-width-ranking
  margin-left 10px
  display inline-block
</style>
