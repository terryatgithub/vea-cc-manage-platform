/*
<#include "./components/cc-select-layout.ftl">
<#include "./components/cc-movie-selector.ftl">
<#include "./components/cc-resource-selector.ftl">
<#include "./components/cc-virtual-pannel.ftl">
<#include "./components/cc-block-content.ftl">
<#include "../components/cc-price.ftl">
<#include "../components/cc-crowd-selector.ftl"/>
*/

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
          @copy="handleCopy"
          @submit-audit="handleSubmitAudit"
          @save-draft="handleSaveDraft"
          @select-version="fetchData"
          @delete="$emit('upsert-end')"
          @cancel-timing="fetchData(pannel.currentVersion)"
        >
          <div slot="copy-confirm">
            复制到
            <el-select v-model="copyToPanelDataType">
              <el-option :value="1" label="常规运营"></el-option>
              <el-option :value="3" label="业务专辑"></el-option>
            </el-select>
            &nbsp;
            <el-button type="primary" @click="handleCopy">确认复制</el-button>
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
              <span>基本信息</span>
            </div>
            <el-form ref="form" :model="pannel" label-width="120px">
              <el-form-item label="业务分类">
                <CommonSelector
                  :value="pannel.panelGroupCategory"
                  @input="handlePanelGroupCategoryChange"
                  :disabled="isReplica"
                  :options="businessTypeEnums"/>
                <span class="spform">注：只有一个权限的操作者不能选择业务分类</span>
              </el-form-item>

              <el-form-item
                label="内容源"
                v-if="isPanelCommonOrVideo"
              >
                <SourceRadioSelector
                  :value="pannel.pannelResource"
                  @input="handlePannelResourceChange"
                  :disabled="isReplica"
                />
              </el-form-item>

              <el-form-item label="版块名称" required>
                <el-input v-model="pannel.pannelName"></el-input>
              </el-form-item>

              <el-form-item label="版块分类" required>
                <CommonSelector
                  type='radio'
                  :value="pannel.parentType"
                  @input="handleParentTypeChange"
                  :disabled="isReplica"
                  :options="$consts.panelTypeOptions"/>
              </el-form-item>

              <el-form-item v-if="pannel.parentType === 'group'" label="默认落焦">
                <el-radio-group v-model="pannel.focusConfig">
                  <el-radio label>手动指定</el-radio>
                  <el-radio label="week">自动指定</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item v-if="pannel.focusConfig !== ''" label="落焦规则">
                <el-radio-group v-model="pannel.focusConfig">
                  <el-radio label="week">根据一周时间</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="版块属性">
                <BinCheckBox label="4K" v-model="pannel.flagIs4k" :disabled="isReplica" />
              </el-form-item>
            </el-form>

            <div class="form-legend-header">
              <span>内容配置</span>
            </div>

            <el-form ref="form" :model="pannel" label-width="120px">
              <el-form-item v-if="pannel.parentType === 'normal'" label="版块标题" required>
                <el-input
                  style="width: 220px"
                  v-model="pannel.pannelList[0].pannelTitle"
                  placeholder="请输入版本标题"
                ></el-input>
                <BinCheckBox label="前端不显示标题" v-model="pannel.showTitle" is-negative />
              </el-form-item>
              <el-form-item v-if="pannel.parentType === 'group'" label="版块标题" required>
                <el-input v-model="pannel.groupTitle" placeholder="请输入版本标题"></el-input>
              </el-form-item>
              <el-form-item label="版块布局" required>
                <LayoutSelector @select-end="handleSelectLayoutEnd"></LayoutSelector>
                <span
                  class="spform J-selected J_select J_layout-selected"
                  v-if="selectedLayout"
                >(已选择: {{ selectedLayout.layoutName }})</span>
                <BinCheckBox label="设置前端推荐位底色透明" v-model="pannel.lucenyFlag" />
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
              <el-form-item label="批量填充">
                <span v-show="!selectedLayout">
                  请先选择布局
                </span>
                <ResourceSelector 
                  ref="resourceSelector"
                  v-show="selectedLayout"
                  :selectors="['video', 'app', 'edu', 'pptv', 'live', 'topic', 'rotate']"
                  :is-live="false"
                  :disable-partner="!!pannel.pannelResource"
                  selection-type="multiple"
                  :source="pannel.pannelResource" 
                  @select-end="handleSelectResourceEnd">
                  <el-button>选择资源</el-button>
                </ResourceSelector>
                <template v-if="pannel.parentType === 'group'">
                  <el-button
                    style="float:right"
                    type="primary"
                    @click="handleAddTab"
                    :disabled="pannel.pannelList.length >= 10"
                  >添加标签</el-button>
                  <el-button
                    style="float:right"
                    type="warning"
                    @click="handleSetDefaultActiveTab"
                    :disabled="(!!pannel.pannelList[activePannelIndex].panelIsFocus) || pannel.focusConfig != ''"
                  >设置默认落焦</el-button>
                </template>
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
                        <span slot="label" @dblclick="handleSetPannelTitleStart(index)">
                          {{ item.pannelTitle || "双击修改" }}
                          {{
                          item.panelIsFocus && pannel.focusConfig === ""
                          ? "(默认落焦)"
                          : ""
                          }}
                        </span>
                        <VirtualPanel
                          :blocks="item.contentList"
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
              <span>基本信息</span>
            </div>
            <el-form ref="form" :model="pannel" label-width="120px">
              <el-form-item label="业务分类" v-if="businessTypeEnums.length > 0">
                {{ businessTypeEnums.find(item => item.value == pannel.panelGroupCategory).label }}
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

              <el-form-item v-if="pannel.parentType === 'group'" label="默认落焦">
                <div>{{pannel.focusConfig === '' ? '手动指定' : '自动指定'}}</div>
              </el-form-item>

              <el-form-item v-if="pannel.focusConfig !== ''" label="落焦规则">
                <div>{{pannel.focusConfig === 'week' ? '根据一周时间' : ''}} </div>
              </el-form-item>

              <el-form-item label="版块属性">
                <BinCheckBox label="4K" v-model="pannel.flagIs4k" :disabled="true" />
              </el-form-item>
            </el-form>

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
              <el-form-item label="推荐位">
                <div class="pannel-blocks">
                  <template v-if="pannel.parentType === 'group'">
                    <el-tabs
                      v-model="activePannelIndex"
                      type="card"
                    >
                      <el-tab-pane
                        v-for="(item, index) in pannel.pannelList"
                        :key="index"
                        :name="index.toString()"
                      >
                        
                        <span slot="label">{{ item.pannelTitle }} {{ item.panelIsFocus && pannel.focusConfig === '' ? '(默认落焦)' : '' }}</span>
                        <VirtualPanel
                          :blocks="item.contentList"
                          @click-block="handleClickBlock"
                        ></VirtualPanel>
                      </el-tab-pane>
                    </el-tabs>
                  </template>

                  <VirtualPanel
                    v-else
                    :blocks="pannel.pannelList[0].contentList"
                    @click-block="handleClickBlock"
                  ></VirtualPanel>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </CommonContent>
      </ContentCard>
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage == 'block_content'">
      <BlockContent
        :mode="mode"
        :data="blockContentProps"
        :source="pannel.pannelResource"
        :pannel="pannel.pannelList[+activePannelIndex]"
        :hide-title-options="!!blockContentProps.blockInfo.title_info"
        @cancel="handleSetBlockContentCancle"
        @save="handleSetBlockContentEnd"
      />
    </PageContentWrapper>
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
import BlockContent from '@/components/BlockContent/BlockContent'
import CommonSelector from '@/components/CommonSelector'
import BinCheckBox from '@/components/BinCheckBox'

import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'

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
    ResourceSelector
  },
  data() {
    var checkNum = function(rule, value, callback) {
      var reg = /^[1-9]\d*$/
      if (!reg.test(value)) {
        callback(new Error('请输入个数'))
      } else if (value < app.layoutConetntLength) {
        callback(
          new Error('请输入大于或等于' + app.layoutConetntLength + '的数')
        )
      } else {
        callback()
      }
    }
    return {
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
      selectedBlocksAndResources: [],

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
    }
  },
  props: ['id', 'initMode', 'version', 'panelDataType', 'initGroupIndex', 'initBlockIndex'],
  computed: {
    resourceName() {
      return this.currentPanelDataType === 3 ? '业务专辑' : '版块'
    },
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
    currentPanelDataType() {
      const panel = this.pannel
      if (panel.pannelGroupId) {
        return panel.panelGroupType
      }
      return this.panelDataType
    },
    pannelStatusText() {
      const pannelStatus = this.pannel.pannelList[0].pannelStatus
      if (pannelStatus !== '') {
        return basicFn.numToAuditStatus(pannelStatus)
      }
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
    alienFocusResolution() {
      const selectedLayout = this.selectedLayout
      if (selectedLayout) {
        const firstBlock = selectedLayout.layoutJsonParsed.contents[0]
        const width = firstBlock.width + 15 + 15
        const height = firstBlock.height + 20 + 79
        const pictureSize = width + '*' + height
        return pictureSize
      }
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
    'pannel.focusConfig': function(val) {
      if (val === 'week') {
        const pannel = this.pannel
        const pannelList = pannel.pannelList
        let count = 7 - pannelList.length
        while (count-- > 0) {
          this.addPannel()
        }
        const titles = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        pannel.pannelList = pannelList.map(function(item, index) {
          item.pannelTitle = titles[index]
          return item
        })
        this.updateAllPosition()
      }
    },
    'pannel.parentType': function(val) {
      if (val === 'group') {
        this.pannel.showTitle = 1
      }
    }
  },
  methods: {
    fetchData(version) {
      return this.$service.panelGetDetail({ id: this.id, version }).then(data => {
        this.setPanelInfoData(data)
      })
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
    handleCopy() {
      this.pannel.pannelList[0].pannelType = this.copyToPanelDataType
      this.handleSaveDraft()
    },
    // 布局
    handleSelectLayoutEnd(layout, blockCount) {
      this.selectedLayout = layout
      this.blockCount = blockCount
      this.blockCountList = this.blockCountList.map(function() {
        return blockCount
      })
      // 如果选择的是拓展布局，按照设置的数量删除多余的资源
      if (blockCount !== undefined) {
        this.pannel.pannelList.forEach(function(item) {
          const selectedResources = item.selectedResources
          if (selectedResources) {
            item.selectedResources = selectedResources.slice(0, blockCount)
          }
        })
      }
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
      // 清除异形焦点
      this.pannel.focusImgUrl = ''
    },
    handleSelectAlienFocusEnd(item) {
      this.pannel.focusImgUrl = item.pictureUrl
    },

    // 设置版块内容
    handleClickBlock(index) {
      const pannel = this.pannel
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
    },
    handleSetBlockContentEnd(param) {
      const activePannelIndex = +this.activePannelIndex
      const activePannel = this.pannel.pannelList[activePannelIndex]
      const selectedResources = activePannel.selectedResources || []
      const currentBlockIndex = this.currentBlockIndex
      const resource = selectedResources[currentBlockIndex] || {}
      selectedResources[currentBlockIndex] = resource
      const content = param.videoContentList[0]
      Object.assign(resource, param)
      if (param.specificContentList.length > 0) {
        activePannel.pannelType = 7
      }
      this.updatePosition()
      this.activePage = 'panel_info'
    },
    handleSelectResourceEnd(selectedResources) {
      const resourceSelector = this.$refs.resourceSelector
      const partner = selectedResources.videoSource
      const selectedEpisodes = selectedResources.episode || {}
      const pannel = this.pannel
      const activePannel = this.pannel.pannelList[+this.activePannelIndex]
      const partnerMap = {
        tencent: 'o_tencent',
        yinhe: 'o_iqiyi',
        youku: 'o_youku'
      }
      const pannelResource = pannel.pannelResource || partnerMap[partner]
      const getExtravue1 = function(vId) {
        return pannelResource === 'o_tencent'
          ? '_otx_' + vId
          : pannelResource === 'o_iqiyi'
          ? '_oqy_' + vId
          : pannelResource === 'o_youku'
          ? '_oyk_' + vId
          : ''
      }
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
        .then(
          function(result) {
            const insertAfter = result.value || 1
            const selectedLayout = this.selectedLayout
            const selectedViedos = selectedResources.video.map(function(item) {
              const episode = selectedEpisodes[item.coocaaVId]
              let finalItem
              if (episode) {
                finalItem = {
                  contentType: 0, // ??

                  coverType: 'media',
                  videoContentType: 'movie',
                  extraValue1: getExtravue1(item.coocaaVId),
                  extraValue5: episode.coocaaMId,
                  pictureUrl: episode.thumb,
                  title: episode.urlTitle,
                  subTitle: episode.urlSubTitle,
                  blockResourceType: 1
                }
              } else {
                finalItem = {
                  contentType: 0, // ??

                  coverType: 'media',
                  videoContentType: 'movie',
                  extraValue1: getExtravue1(item.coocaaVId),
                  extraValue5: undefined,
                  pictureUrl: item.thumb,
                  title: item.title,
                  subTitle: item.urlSubTitle,
                  blockResourceType: 1
                }
              }
              const entity = item.ccVideoSourceEntities[0]
              const score = entity.score
              const updatedSegment = entity.updatedSegment
              const publishSegment = entity.publishSegment
              const isUnknown = publishSegment == 0
              const publishStatus = isUnknown
                ? 'unknown'
                : updatedSegment == publishSegment
                ? 'ended'
                : 'updating'
              finalItem.publishStatus = publishStatus
              finalItem.score = score
              finalItem.categoryId = item.categoryId
              finalItem.series = isUnknown ? null : updatedSegment
              finalItem.variety = entity.lastCollection
              return finalItem
            })

            const selectedApps = selectedResources.app.map(function(item) {
              return {
                contentType: 2,

                coverType: 'app',
                videoContentType: 'app',
                extraValue1: item.appPackageName,
                pictureUrl: item.appImageUrl,
                title: item.appName,
                blockResourceType: 0
              }
            })

            const selectedEdus = selectedResources.edu.map(function(item) {
              const ccVideoSourceEntities = item.ccVideoSourceEntities
              const ret = {
                contentType: 3,

                coverType: 'media',
                videoContentType: 'edu',
                extraValue1: '_otx_' + item.coocaaVId,
                pictureUrl: item.thumb,
                title: item.title,
                subTitle: item.subTitle,
                blockResourceType: 1,
                categoryId: item.categoryId
              }
              if (
                ccVideoSourceEntities &&
                ccVideoSourceEntities[0] &&
                ccVideoSourceEntities[0].isTvod === 1
              ) {
                // Sprint2.2 教育中心单点付费预置版本号
                ret.versionCode = 3420000
              }
              return ret
            })

            const selectedPPTVs = selectedResources.pptv.map(function(item) {
              return {
                contentType: 4,

                coverType: 'media',
                videoContentType: 'pptv',
                extraValue1:
                  'pptv_tvsports://tvsports_detail?section_id=' +
                  item.pid +
                  '&from_internal=1',
                title: item.pTitle,
                blockResourceType: 1,
                categoryId: item.categoryId
              }
            })

            const selectedLives = selectedResources.live.map(function(item) {
              return {
                contentType: 4,

                coverType: 'media',
                contentType: 6,
                videoContentType: 'txLive',
                extraValue1: '_otx_' + item.vId,
                pictureUrl: item.thumb,
                title: item.title,
                subTitle: item.subTitle,
                blockResourceType: 1,
                categoryId: item.categoryId
              }
            })

            const selectedTopics = selectedResources.topic.map(function(item) {
              return {
                coverType: 'media',

                contentType: item.dataSign === 'parentTopic' ? 8 : 7,
                videoContentType:
                  item.dataSign === 'parentTopic' ? 'bigTopic' : 'topic',
                extraValue1: item.id + '',
                pictureUrl: item.picture,
                title: item.title,
                subTitle: item.subTitle,
                blockResourceType: 1,
                categoryId: item.categoryId
              }
            })

            const selectedBroadcast = selectedResources.rotate.map(function(
              item
            ) {
              return {
                coverType: 'media',
                contentType: 9,
                videoContentType: 'rotate',
                extraValue1: item.id + '',
                pictureUrl: item.picture,
                title: item.title,
                subTitle: item.subTitle,
                blockResourceType: 1,
                categoryId: item.categoryId
              }
            })

            const resourcesToInsert = []
              .concat(
                selectedViedos,
                selectedApps,
                selectedEdus,
                selectedLives,
                selectedPPTVs,
                selectedTopics,
                selectedBroadcast
              )
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
                newResources[i] = resourcesToInsert[i - start]
              } else {
                newResources[i] = activePannel.selectedResources[i]
              }
            }

            activePannel.selectedResources = newResources
            resourceSelector.clearSelected()
            // 计算每个 block 的位置
            this.updatePosition()
          }.bind(this)
        )
        .catch((e) => {
          console.log(e)
          resourceSelector.$refs.wrapper.handleSelectStart()
        })
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

      this.$prompt('设置标题', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: '',
        inputValidator: function(value) {
          if (!value || value.trim() === '') {
            return '标题不能为空'
          }
        }
      })
        .then(
          function(result) {
            this.addPannel(result.value)
            this.updatePosition()
          }.bind(this)
        )
        .catch(function() {})
    },
    addPannel(title) {
      const pannelList = this.pannel.pannelList
      const pannel = {
        pannelTitle: title,
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

    handleSetPannelTitleStart(index) {
      const component = this
      this.$prompt('设置标题', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: component.pannel.pannelList[index].pannelTitle,
        inputValidator: function(value) {
          if (!value || value.trim() === '') {
            return '标题不能为空'
          }
        }
      })
        .then(function(result) {
          component.pannel.pannelList[index].pannelTitle = result.value
        })
        .catch(function() {})
    },
    clearBlocks() {
      const pannel = this.pannel
      pannel.pannelList.forEach(function(item) {
        item.selectedResources = []
      })
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
      const layoutJson = JSON.parse(selectedLayout.layoutJson)
      const type = layoutJson.type
      const blocks = layoutJson.contents
      const originBlockCount = blocks.length

      const currentPannelIndex =
        index === undefined ? +this.activePannelIndex : index
      const currentPannel = pannel.pannelList[currentPannelIndex]
      const selectedResources = currentPannel.selectedResources || []
      const blockCount = this.blockCountList[currentPannelIndex]

      const lastBlock = blocks[originBlockCount - 1]
      const layoutWidth = lastBlock.x + lastBlock.width
      const lastBlockResize = lastBlock.resize || {}
      const layoutHeight =
        lastBlock.y + (lastBlockResize.height || lastBlock.height)

      const calculateFactory = function() {
        if (type === 'Expander' && originBlockCount === 2) {
          const space = layoutJson.extra.space
          return function(n) {
            const index = n % originBlockCount
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
          const space = layoutJson.extra.space
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

        let i = blocks.length
        while (i++ < count) {
          blocks.push(calculate(i))
        }
      }

      this.blockList[currentPannelIndex] = blocks
      // 检查重复
      const resourceIndexed = {}
      this.selectedBlocksAndResources = blocks.map(function(item, index) {
        const resource = selectedResources[index] || {}
        const contentList = resource.videoContentList || []
        const specificContentList = resource.specificContentList || []
        const content = contentList[0]
        // 有 extraValue1 才判断重复, 自定义不判断
        if (
          content &&
          (content.coverType === 'media' || content.coverType === 'block')
        ) {
          let id
          if (content.extraValue1) {
            id =
              content.contentType +
              '/' +
              content.extraValue1 +
              (content.extraValue5 || '')
          } else if (content.vContentId) {
            id = content.contentType + '/' + content.vContentId
          }

          if (id) {
            const duplicatedItem = resourceIndexed[id]
            if (duplicatedItem) {
              duplicatedItem.duplicated = true
              resource.duplicated = true
            } else {
              resource.duplicated = false
              resourceIndexed[id] = resource
            }
          }
        } else {
          resource.duplicated = false
        }

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

      currentPannel.contentList = this.selectedBlocksAndResources
    },

    handleDragBlock(oldIndex, newIndex) {
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
      this.blockCountList[activePannelIndex]--
      const activePannel = this.pannel.pannelList[activePannelIndex]
      const selectedResources = activePannel.selectedResources
      // 移除对应的资源
      selectedResources.splice(index, 1)
      // 更新位置
      this.updatePosition()
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
    parseDataToApi(data) {
      const mode = this.mode
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
            })

          delete contentItem.mallResize
          delete contentItem.isExtra
          delete contentItem.duplicated

          return contentItem
        })

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
          focusShape: pannel.focusShape,
          contentList: itemContentList
        }
      })
      delete pannel.pannelName
      delete pannel.pannelResource
      delete pannel.showTitle
      delete pannel.flagIs4k
      delete pannel.lucenyFlag
      delete pannel.focusShape
      delete pannel.focusImgUrl

      console.log('panel', pannel)
      return pannel
    },
    validate(pannel, callback) {
      const cb = (err) => {
        if (!err) {
          callback()
        } else {
          this.$message({
            type: 'error',
            message: err
          })
        }
      }
      const PANNEL_STATUS = this.$consts.status
      const status = pannel.pannelStatus

      if (!pannel.pannelName) {
        return cb('请输入版块名称')
      }
      if (pannel.parentType === 'normal' && !pannel.pannelList[0].pannelTitle) {
        return cb('请输入版块标题')
      }
      if (pannel.parentType === 'group' && !pannel.groupTitle) {
        return cb('请输入版块标题')
      }

      if (!this.selectedLayout) {
        return cb('请选择布局')
      }

      if (this.isShowfocusImgUrl && !pannel.focusImgUrl) {
        return cb('请设置异形焦点')
      }
      // 如果是待审核或者审核通过
      if (
        status === PANNEL_STATUS.accepted ||
        status === PANNEL_STATUS.waiting
      ) {
        const validateBlocksRes = this.validateBlocks()

        const emptyPannelTitleIndex = validateBlocksRes.emptyPannelTitleIndex
        const emptyPostIndex = validateBlocksRes.emptyPostIndex
        const emptyPostBlockIndex = validateBlocksRes.emptyPostBlockIndex
        const emptyPriceIndex = validateBlocksRes.emptyPriceIndex
        const emptyPriceBlockIndex = validateBlocksRes.emptyPriceBlockIndex
        const emptyTitleIndex = validateBlocksRes.emptyTitleIndex
        const emptyTitleBlockIndex = validateBlocksRes.emptyTitleBlockIndex
        const emptyBlock = validateBlocksRes.emptyBlock
        const hasDuplicated = validateBlocksRes.hasDuplicated
        const focusIndex = validateBlocksRes.focusIndex

        if (this.isPanelCommonOrVideo) {
          if (!pannel.pannelResource) {
            return cb('请选择内容源')
          }
        }

        if (emptyPannelTitleIndex !== undefined) {
          return cb('请填写第' + (emptyPannelTitleIndex + 1) + '分组的标题')
        }

        if (
          emptyPriceIndex !== undefined &&
          emptyPriceBlockIndex !== undefined
        ) {
          if (pannel.parentType === 'group') {
            return cb(
              '请设置第 ' +
              (emptyPriceIndex + 1) +
              ' 个分组第 ' +
              (emptyPriceBlockIndex + 1) +
              ' 个推荐位的价格'
            )
          } else {
            return cb('请设置第 ' + (emptyPriceBlockIndex + 1) + ' 个推荐位的价格')
          }
        }

        if (
          emptyTitleIndex !== undefined &&
          emptyTitleBlockIndex !== undefined
        ) {
          if (pannel.parentType === 'group') {
            return cb(
              '请设置第 ' +
              (emptyTitleIndex + 1) +
              ' 个分组第 ' +
              (emptyTitleBlockIndex + 1) +
              ' 个推荐位的标题'
            )
          } else {
            return cb('请设置第 ' + (emptyTitleBlockIndex + 1) + ' 个推荐位的标题')
          }
        }

        if (emptyPostIndex !== undefined && emptyPostBlockIndex !== undefined) {
          if (pannel.parentType === 'group') {
            return cb(
              '请设置第 ' +
              (emptyPostIndex + 1) +
              ' 个分组第 ' +
              (emptyPostBlockIndex + 1) +
              ' 个推荐位的内容海报'
            )
          } else {
            return cb(
              '请设置第 ' + (emptyPostBlockIndex + 1) + ' 个推荐位的内容海报'
            )
          }
        }

        if (
          pannel.focusConfig === '' &&
          focusIndex === undefined &&
          pannel.parentType === 'group'
        ) {
          return cb('请选择默认落焦')
        }
        if (emptyBlock) {
          return cb('含有空推荐位')
        }
        if (hasDuplicated) {
          return cb('含有重复推荐位内容')
        }
      }
      cb()
    },
    validateBlocks() {
      const pannelList = this.pannel.pannelList
      const selectedLayout = this.selectedLayout
      let emptyPannelTitleIndex

      let emptyPriceIndex
      let emptyPriceBlockIndex

      let emptyPostIndex
      let emptyPostBlockIndex

      let emptyTitleIndex
      let emptyTitleBlockIndex

      let emptyBlock
      let hasDuplicated
      let focusIndex

      checkBlock: 
      for (let i = 0, length = pannelList.length; i < length; i++) {
        const pannel = pannelList[i]
        if (!pannel.pannelTitle) {
          emptyPannelTitleIndex = i
          break checkBlock
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
            break checkBlock
          }
          if (content.duplicated) {
            hasDuplicated = true
            break checkBlock
          }

          const price = content.videoContentList[0].price
          const coverType = content.videoContentList[0].coverType
          if (
            content.contentPosition.type === 'Mall' &&
            (price === undefined || price === -1 || price === '')
          ) {
            emptyPriceIndex = i
            emptyPriceBlockIndex = j
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
        emptyPostIndex,
        emptyPostBlockIndex,
        emptyPriceIndex,
        emptyPriceBlockIndex,
        emptyTitleIndex,
        emptyTitleBlockIndex,
        emptyBlock,
        hasDuplicated,
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
        if (this.$consts.idPrefix == '10'){
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
      this.$service
        .panelUpsert(this.parseDataToApi(data), '保存成功')
        .then(result => {
          this.$emit('upsert-end')
        })
    },
    setPanelInfoData(panelInit) {
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
              .forEach(function(item) {
                if (item.price == -1) {
                  item.price = ''
                }
                if (item.secKillPrice == -1) {
                  item.secKillPrice = ''
                }
              })
            return contentItem
          })
          item.selectedResources = item.contentList
          return item
        })
        pannel.pannelResource = firstPannel.pannelResource
        pannel.flagIs4k = firstPannel.flagIs4k 
        pannel.showTitle = firstPannel.showTitle 
        pannel.focusShape = firstPannel.focusShape
        pannel.pannelStatus = firstPannel.pannelStatus

        const layout = firstPannel.layoutInfo
        layout.layoutJsonParsed = JSON.parse(layout.layoutJson)
        this.selectedLayout = layout

        const firstBlock = firstPannel.contentList[0]
        if (firstBlock) {
          pannel.lucenyFlag = firstBlock.lucenyFlag
          pannel.focusImgUrl = firstBlock.focusImgUrl
          this.isShowfocusImgUrl = firstBlock.focusImgUrl
        }
      }
      this.pannel = {...pannel}
      this.updateAllPosition()
    },
    clickBlock() {
      const { initGroupIndex, initBlockIndex } = this
      if (initGroupIndex !== undefined) {
        this.activePannelIndex = initGroupIndex
      }
      if (initBlockIndex !== undefined) {
        this.handleClickBlock(initBlockIndex)
      }
    }
  },
  created() {
    this.mode = this.initMode || 'create'
    this.$service.getDictType({type: 'businessType'}).then(data => {
      this.businessTypeEnums = data.map(item => {
        return {
          label: item.dictCnName,
          value: item.dictId,
          disabled: item.disabled
        }
      })
    })
  },
  mounted() {
    if (this.id) {
      this.fetchData(this.version).then(() => {
        this.clickBlock()
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
.pannel-blocks .el-tabs__content {
  overflow-x: visible;
  overflow-y: auto;
}
.base-info {
  margin: 10px 0;
  border: 1px solid #e7e4c2;
  background: #fef8b8;
  padding: 10px; 
}
</style>
