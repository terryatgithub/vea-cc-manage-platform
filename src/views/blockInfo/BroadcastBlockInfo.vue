<template>
<TabPage>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <CommonContent
      :mode="mode"
      ref="commonContent"
      :resource-info="resourceInfo"
      @replicate="replicate"
      @edit="edit"
      @unaudit="$emit('upsert-end')"
      @shelves="fetchData"
      @submit-audit="handleSubmitAudit"
      @save-draft="handleSaveDraft"
      @audit="$emit('upsert-end')"
      @select-version="fetchData"
      @cancel-timing="fetchData(basicForm.currentVersion)"
      @delete="$emit('upsert-end', $event)"
    >
      <div class="form-legend-header">
        <i class="el-icon-edit">基本信息</i>
      </div>
      <el-form :model="basicForm" ref="basicForm" label-width="100px" class="el-form-add">
        <el-form-item
          label="推荐位名称"
          prop="containerName"
          :rules="[{required: true, message:'请输入推荐位名称', trigger: 'blur'}]"
        >
          <el-input v-model="basicForm.containerName" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="推荐位类型">
          <el-select v-model="basicForm.containerType" :disabled="disabled">
            <el-option label="视频列表" value="REFERENCE_BROADCASTING"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置模式" >
          <el-radio-group :value="basicForm.configModel" @input="handleInputConfigModel">
            <el-radio label="purePoster" :disabled="disabled" >纯图模式</el-radio>
            <!-- <el-radio label="broadcast" :disabled="disabled" v-if="basicForm.configModel === 'broadcast'">轮播模式</el-radio> -->
            <el-radio label="group" :disabled="disabled">窗口模式</el-radio>
            <el-radio label="sign" :disabled="disabled">信号源</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="内容源">
          <el-radio-group :disabled="isReplica" :value="basicForm.source" @input="handleSourceChange">
            <el-radio
              v-for="item in $consts.sourceOptionsWithNone"
              :key="item.value"
              :label="item.value"
              :disabled="disabled">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="split-bar">内容配置</div>
      <div class="version-title">
        <h4 class="version-title__h">正常版本</h4>
        <el-tag
          class="version-title__tag"
          v-if="basicForm.configModel === 'group' || basicForm.configModel === 'purePoster'"
          type="warning"
        >短标题模式需至少运营四个资源，长标题模式至少6个，才能填满布局哦~</el-tag>
        <ResourceSelector
          v-if="isGroupModel&&!disabled "
          ref="resourceSelector"
          :disable-partner="!!source"
          :source="source"
          :selectors="resourceOptions"
          :is-live="false"
          :id-type="1"
          style="float: right;"
          selection-type="multiple"
          @select-end="handleSelectNormalmultipleResourceEnd"
        >
          <el-button type="primary" plain>批量选择资源</el-button>
        </ResourceSelector>
      </div>
      <!-- {{normalVersionContent正常版本}} -->
      <div class="form-wrap">
        <!-- group 正常版本左侧 -->
        <el-row
          :gutter="4"
          class="normal-left-list"
          v-if="isGroupModel"
          :style="classObject">
          <draggable
            v-model="normalVersionContent"
            :options="{group: 'normalVersion' }"
            @start="onDragStart($event)"
            @end="onDragtEnd($event)"
            v-if="!disabled">
            <el-card
              v-for="(normal, index) in normalVersionContent"
              :key="index"
              :class="{ active: index === currentIndex}"
              class="normal-version-wrap"
              @click.native="handleActivateContent(index)">
              <i
                v-if="normalVersionContent.length > 1 &&!disabled"
                class="el-icon-close"
                @click.stop="handleDeleteNormalContent(index)">
              </i>
              <img
                v-if="normal.poster.pictureUrl"
                referrerpolicy="no-referrer"
                :src="normal.poster.pictureUrl"
                />
              <span>{{normal.title}}</span>
            </el-card>
          </draggable>
          <el-card
            v-else
            v-for="(normal, index) in normalVersionContent"
            :key="index"
            :class="{ active: index === currentIndex}"
            class="normal-version-wrap"
            @click.native="handleActivateContent(index)">
            <img
              v-if="normal.poster.pictureUrl"
              referrerpolicy="no-referrer"
              :src="normal.poster.pictureUrl"/>
            <span>{{normal.title}}</span>
          </el-card>
          <el-card v-if="!disabled" class="add-version-card">
            <span class="add-version" @click="handleAddNormalContent">+添加资源</span>
          </el-card>
        </el-row>

        <!-- broadcast -->
        <div class="content-wrapper"  v-if="basicForm.configModel === 'group'">
          <div class="content-type-switcher">
            <el-radio-group :value="normalForm.showContentType" @input="handleSwitchShowContentType">
              <el-radio class="conten-type-switcher__item" label="general">通用推荐位版本</el-radio>
              <el-radio class="conten-type-switcher__item" label="dmp">分人群推荐位{{ dmpContentList.length > 0 ? `(${dmpContentList.length}个)` : '' }}</el-radio>
            </el-radio-group>
          </div>
          <div v-if="normalForm.showContentType === 'general'">
            <BroadcastBlockForm
              ref="broadcastBlockForm"
              @toggle-use-short-video="handleToggleUseShortVideo"
              @toggle-manaulset-resource="handleToggleManualSetResource($event, 'general')"
              :id="id"
              :config-model="basicForm.configModel"
              :normal-form="normalForm"
              :normal-rules="normalRules"
              :is-readonly="disabled"
              :is-group-model="isGroupModel"
              :source="source"
              :show-resource-tip="currentIndex === 0"
            />
          </div>
          <div v-if="normalForm.showContentType === 'dmp'">
            <div class="added-contents-wrapper" :gutter="8">
              <component :is="disabled ? 'div': 'draggable'"
                class="added-contents-list"
                v-model="normalForm.dmpContentList"
                @start="handleDragDmpConentStart"
                @end="handleDragDmpConentEnd">
                <el-card
                  v-for="(content, index) in dmpContentList"
                  :key="index"
                  :class="{active: index === activeDmpIndex}"
                  :body-style="{ padding: '0px' }"
                  @click.native="handleActivateDmpContent(index)">
                  <img
                    v-if="dmpContentList[index].poster.pictureUrl"
                    referrerpolicy="no-referrer"
                    :src="dmpContentList[index].poster.pictureUrl" />
                  <i
                    v-if="!disabled"
                    class="remove-handle el-icon-close"
                    @click.stop.prevent="handleRemoveDmpContent(index)">
                  </i>
                </el-card>
              </component>
              <el-card v-if="mode !== 'read'" @click.native="handleAddDmpContent">
                <i class="el-icon-plus">添加资源</i>
              </el-card>
            </div>
            <BroadcastBlockForm
              ref="broadcastBlockForm"
              v-if="normalForm.dmpContentList[normalForm.activeIndex]"
              @toggle-use-short-video="handleToggleUseShortVideo($event, 'dmp')"
              @toggle-manaulset-resource="handleToggleManualSetResource($event, 'dmp')"
              :id="id"
              :config-model="basicForm.configModel"
              :normal-form="normalForm.dmpContentList[normalForm.activeIndex]"
              :normal-rules="normalRules"
              :is-readonly="disabled"
              :is-group-model="isGroupModel"
              :source="source"
              :checkCrowd="checkCrowd"
            />
          </div>
        </div>
        <div class="content-wrapper" :class="basicForm.configModel === 'purePoster' ? 'min-height': ''"
          v-if="basicForm.configModel === 'purePoster' || basicForm.configModel === 'sign'">
          <template v-if="basicForm.configModel === 'sign'">
            <BroadcastBlockForm
              ref="broadcastBlockForm"
              @toggle-use-short-video="handleToggleUseShortVideo"
              @toggle-manaulset-resource="handleToggleManualSetResource($event, 'general')"
              :id="id"
              :config-model="basicForm.configModel"
              :normal-form="normalForm"
              :normal-rules="normalRules"
              :is-readonly="disabled"
              :is-group-model="isGroupModel"
              :source="source"
              :show-resource-tip="currentIndex === 0"
            />
          </template>
          <!-- 纯图模式 -->
          <template v-if="basicForm.configModel === 'purePoster'">
           <BroadcastBlockFormSpe
              ref="broadcastBlockFormSpe"
              @toggle-use-short-video="handleToggleUseShortVideo"
              @toggle-manaulset-resource="handleToggleManualSetResource($event, 'general')"
              @cover-type-change="handleCoverTypeChange"
              :id="id"
              :config-model="basicForm.configModel"
              :normal-form="normalForm"
              :normal-rules="normalRules"
              :is-readonly="disabled"
              :is-group-model="isGroupModel"
              :source="source"
              :show-resource-tip="currentIndex === 0"
            />
          </template>
        </div>
      </div>
      <!-- {{lowerVersionContent兼容低版本}} -->
      <div class="version-title" style="margin-top: 25px;">
        <h4 style="float: left;margin-top: 7px;">兼容低版本</h4>
        <div
          v-if="isGroupModel"
          style="display: inline-block;margin-left: 14px;"
        >
          <el-button
            @click="lowerFill"
            type="primary"
            plain
            style="margin-right: 10px"
            :disabled="disabled"
          >快速填充
          </el-button>
          <span>使用正常版本的第一个资源，快速配置</span>
        </div>
      </div>
      <div class="form-wrap">
        <el-form
          :model="lowerForm"
          ref="lowerForm"
          :rules="lowerRules"
          label-width="100px"
          class="el-form-add"
        >
          <el-form-item label="资源类别" prop="coverType">
            <el-radio-group :value="lowerForm.coverType" @input="handleInputLowerFormCoverType">
              <el-radio label="media" :disabled="disabled">媒体资源</el-radio>
              <el-radio label="app" :disabled="disabled">应用</el-radio>
              <el-radio label="custom" :disabled="disabled">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="内容资源"
            prop="thirdIdOrPackageName"
            v-if="lowerForm.coverType === 'media' || lowerForm.coverType === 'app' "
          >
            <ResourceSelector
              ref="resourceSelector"
              v-if="!disabled"
              :disable-partner="!!source"
              :source="source"
              :selectors="resourceOptionsLowerForm"
              :is-live="false"
              selection-type="single"
              @select-end="handleSelectLowerSingleResourceEnd"
            >
              <el-button type="primary" plain>选择资源</el-button>
            </ResourceSelector>
            <!-- <el-button type="primary" plain :disabled="disabled"  v-model="lowerForm.thirdIdOrPackageName" @click.native="selectResource('lower', 'lowerForm')">选择资源</el-button> -->
            <el-tag
              type="success"
              class="marginL"
              :closable="!disabled"
              v-if="lowerForm.thirdIdOrPackageName"
              @close="handleCloseLowerFormTag"
            >已选择：{{lowerForm.thirdIdOrPackageName}}</el-tag>
            <el-tag
              type="success"
              class="marginL"
              v-if="lowerForm.thirdIdOrPackageName && singleEpisodeNum"
            >单集：{{singleEpisodeNum}}</el-tag>
          </el-form-item>
          <el-form-item label="指定子频道" prop="subchannelId" v-if="lowerForm.subchannelIs">
            <el-input
              v-model="lowerForm.subchannelId"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="lowerForm.smallTopicsIs" label="指定小专题" prop="smallTopicsId">
            <el-input
              v-model="lowerForm.smallTopicsId"
              :disabled="disabled"
              @blur="smallTopicsLower"
            ></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="lowerForm.title" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="subTitle">
            <el-input v-model="lowerForm.subTitle" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="海报" prop="poster.pictureUrl">
            <GlobalPictureSelector
              :disabled="isReadonly"
              :picture-resolution="basicForm.configModel === 'purePoster' ? undefined : '1210*449'"
              @select-end="handleSelectPostEnd">
              <el-card
                class="post-box"
                style="height: 180px"
                :disabled="disabled">
                <img
                  v-if="lowerForm.poster.pictureUrl"
                  referrerpolicy="no-referrer"
                  :src="lowerForm.poster.pictureUrl"
                  style="height: 180px">
              </el-card>
            </GlobalPictureSelector>
          </el-form-item>
          <el-form-item label="角标">
            <el-card class="corner-box">
              <span
                v-for="(corner, index) in lowerForm.cornerIconList"
                :key="index"
                :class="'corner-' + index "
                class="corner">
                <CornerSelector
                  :disabled="isReadonly"
                  :position="index"
                  @select-end="handleSelectCornerIconEnd($event, index)">
                  <span
                    class="corner-img-wrapper"
                    v-if="corner.imgUrl">
                    <img referrerpolicy="no-referrer" :src="corner.imgUrl" >
                    <i
                      class="el-icon-delete"
                      v-if="!disabled"
                      @click.stop="deleteCorner(lowerForm, index)"
                    ></i>
                  </span>
                  <el-tag v-else type="success">
                    <i class="el-icon-plus"></i>
                  </el-tag>
                </CornerSelector>
              </span>
            </el-card>
          </el-form-item>
          <div v-if="lowerForm.coverType === 'media' || lowerForm.coverType === 'app'">
            <el-form-item label="应用版本号" prop="versionCode">
              <el-input v-model="lowerForm.versionCode" :disabled="disabled"></el-input>
            </el-form-item>
          </div>
          <div v-if="lowerForm.coverType === 'custom'">
            <el-form-item label="打开方式">
              <el-select value="第三方应用" :disabled="disabled">
                <el-option value="app">第三方应用</el-option>
              </el-select>
              <el-button
                type="primary"
                class="marginL"
                plain
                :disabled="disabled"
                @click="onclickEventVisible=true;onclickEventVisibleFlag='lower'"
              >快速填充</el-button>
            </el-form-item>
            <AppParams
              prop-prefix="onclick."
              v-model="lowerForm.onclick"
              ref="openWayLower"
              v-if="!disabled"
            >{{lowerForm.onclick}}
            </AppParams>
            <AppParamsRead :value="lowerForm.onclick" v-if="disabled"/>
          </div>
        </el-form>
      </div>
      <!-- 第三方运用快速填充弹框 -->
      <el-dialog :visible.sync="onclickEventVisible" width="1200px">
        <selectClick @row-click="getClickData"></selectClick>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onclickEventVisible = false">取 消</el-button>
          <el-button type="primary" @click="onclickEventVisible = false;clickThirdpartSubmit()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 第三方运用快速填充弹框end -->
    </CommonContent>
  </ContentCard>
</TabPage>
</template>

<script>
import TabPage from '@/components/TabPage'
import draggable from 'vuedraggable'
import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
import CornerSelector from '@/components/selectors/CornerIconSelector'

import selectClick from '@/views/blockInfo/selectClick'
import CommonContent from '@/components/CommonContent.vue'
import AppParams from '@/components/AppParams.vue'
import AppParamsRead from '@/components/AppParamsRead.vue'
import { cloneDeep } from 'lodash'
import titleMixin from '@/mixins/title'
import BroadcastBlockForm from './BroadcastBlockForm'
import BroadcastBlockFormSpe from './BroadcastBlockFormSpe'
import GlobalPictureSelector from '@/components/selectors/GlobalPictureSelector'
import { parseResourceContent, setContentForm, getSelectedResource } from './broadcastBlockUtil'
import BroadcastBlockStatChartViewer from '@/components/statViewer/BroadcastBlockStatChartViewer'

export default {
  mixins: [titleMixin],
  components: {
    TabPage,
    draggable,
    ResourceSelector,
    GlobalPictureSelector,
    CornerSelector,
    selectClick,
    AppParams,
    AppParamsRead,
    CommonContent,
    BroadcastBlockForm,
    BroadcastBlockStatChartViewer,
    BroadcastBlockFormSpe
  },
  props: ['id', 'initMode', 'version'],
  data () {
    return {
      mode: 'create',
      resourceName: '轮播推荐位',
      pictureResolution: '797*449', // 海报尺寸
      type: 'block',
      menuElId: 'broadcastBlock',
      onclickEventVisibleFlag: '', // 标识是哪个版本的快速填充弹窗normal/lower
      clickData: undefined, // 自定义快速填充单击选中的数据
      onclickEventVisible: false, // 自定义快速填充弹窗
      cornerIconTypeOptions: {},
      cornerTypes: [],
      materialTypes: null,
      basicForm: {
        id: undefined,
        containerName: '',
        containerType: 'REFERENCE_BROADCASTING',
        configModel: 'purePoster',
        currentVersion: undefined,
        status: undefined,
        source: 'none'
      },
      normalForm: {},
      lowerForm: {
        coverType: 'media'
      },
      auditDisabled: false,
      normalRules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        'poster.pictureUrl': [
          { required: true, message: '请上传海报', trigger: 'blur' }
        ],
        thirdIdOrPackageName: [
          { required: true, message: '请填选择资源', trigger: 'blur' }
        ],

        clickParams: [
          {
            validator: (rule, value, cb) => {
              const normalForm = this.normalForm
              const formContent = normalForm.showContentType === 'dmp' // 如果是dmp 新校验dmpContentList
                ? normalForm.dmpContentList[this.activeDmpIndex]
                : normalForm
              // console.log('rule', rule, value, normalForm.sign)
              if (formContent.sign === 'manualResource') {
                if (!value || JSON.stringify(value) === '{}') {
                  return cb(Error('请选择资源'))
                }
              }
              cb()
            }
          }
        ],
        dmpRegistryInfo: [{ required: true, message: '请选择定向人群' }],
        // 'mediaAutomationBlockRls.mediaAutomationId': [
        //   { required: true, message: '当开关开启时必填123' }
        // ],
        'mediaAutomationBlockRls.refreshCal': [
          { required: true, message: '当开关开启时必填', trigger: 'blur' }
        ],
        'shortVideoParams.topicId': [
          { required: true, message: '请选择跳转话题' }
        ]
      },
      lowerRules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        'poster.pictureUrl': [
          { required: true, message: '请上传海报', trigger: 'blur' }
        ],
        thirdIdOrPackageName: [
          { required: true, message: '请填选择资源', trigger: 'blur' }
        ],
        versionCode: [
          {
            validator: (rule, val, cb) => {
              if (!/^(-1|\d*)$/.test(val)) {
                return cb(new Error('应用版本号只能是数字或者-1'))
              }
              cb()
            }
          }
        ]
      },
      currentIndex: 0,
      pictureListOptions: {
        poster: {
          idField: 'pictureId',
          searchParams: {
            pictureId: {
              label: '素材ID'
            },
            pictureName: {
              label: '素材名称'
            },
            pictureCategory: {
              label: '素材类别',
              options: []
            },
            pictureStatus: {
              label: '素材状态',
              options: [
                {
                  label: '审核通过',
                  value: '1'
                },
                {
                  label: '待审核',
                  value: '2'
                }
              ]
            }
          },
          // url: $basePath + '/globalPicture/dataList.html',
          picField: 'pictureUrl',
          textItems: [
            {
              field: 'pictureName'
            },
            {
              field: 'pictureStatus',
              customFormatter: function (row, column) {
                return ['', '审核通过', '待审核'][column]
              }
            }
          ]
        },
        corner: {
          idField: 'cornerIconId',
          searchParams: {
            cornerIconId: {
              label: '角标ID'
            },
            cornerIconName: {
              label: '角标名称'
            },
            'cornerIconType.typeId': {
              label: '角标类别',
              options: []
            }
          },
          // url: $basePath + '/globalCornerIcon/pageList.html',
          picField: 'imgUrl',
          textItems: [
            {
              field: 'cornerIconName'
            },
            {
              field: 'cornerStatus',
              customFormatter: function (row, column) {
                return ['', '审核通过', '待审核'][column]
              }
            }
          ]
        }
      },
      // smallTopics: false,
      versionForm: this.genDefaultContentForm(),
      pictureType: '',
      currentForm: '',
      pannelResource: '',
      // lowFill: false,
      normalVersionContent: [],
      openModeArray: [{ name: '第三方应用', value: 'app' }],
      referenceData: [],
      noPreview: 'noPreview',
      referenceOptions: {
        picture: false
      },
      layoutOptions: {
        contentDataNew: []
      },
      selectPicture: '',
      resourceSeq: '',
      layoutparam: {},
      layouttypenew: '',
      checkresourceis: true,
      // 单集
      singleEpisodeNum: undefined
    }
  },
  computed: {
    disabled () {
      return this.mode === 'read'
    },
    isReadonly () {
      return this.disabled
    },
    dmpContentList () {
      return this.normalForm.dmpContentList || []
    },
    activeDmpIndex () {
      return this.normalForm.activeIndex
    },
    resourceOptionsLowerForm () {
      return this.lowerForm.coverType === 'app'
        ? ['app']
        : ['video', 'edu', 'live', 'rotate']
    },
    resourceOptionsManualResource () {
      return ['video', 'edu', 'live', 'rotate']
    },
    resourceOptionsNormalForm () {
      return this.currentIndex === 0 && this.basicForm.configModel === 'sign'
        ? ['rotate']
        : ['video', 'edu', 'live', 'rotate']
    },
    resourceOptions () {
      return ['video', 'edu', 'live', 'rotate']
    },
    isManualSetResource () {
      return this.normalForm.type === 'url'
    },
    normalResourceBtn () {
      return this.isGroupModel ? '播放资源' : '轮播资源'
    },
    isGroupModel () {
      const configModel = this.basicForm.configModel
      // alert(this.basicForm.configModel)
      // return configModel === 'group' || configModel === 'sign'
      return configModel
    },
    source () {
      return this.basicForm.source === 'none' ? '' : this.basicForm.source
    },
    thirdIdOrPackageNameForClick () {
      return this.getThirdId(this.normalForm.clickParams)
    },
    couldFullscreen () {
      const contentType = this.normalForm.contentType
      return ['movie', 'custom', 'edu', 'txLive'].indexOf(contentType) > -1
    },
    classObject: function () {
      if (this.normalForm.sign === 'autoSet') {
        return {
          height: '600px'
        }
      } else {
        return {
          height: '600px'
        }
      }
    },
    // eslint-disable-next-line
    resourceInfo() {
      const form = this.basicForm
      if (form.id) {
        return {
          id: form.id,
          type: this.type,
          menuElId: this.menuElId,
          version: form.currentVersion,
          status: form.status
        }
      }
    },
    couldSetReleaseTime () {
      const mode = this.mode
      const currentVersion = this.basicForm.currentVersion
      const isCreatingOrCopying = mode === 'create' || mode === 'copy'
      const isEditingV1 = mode === 'edit' && currentVersion === 'V1'
      const isCoocaa = this.$consts.idPrefix === '10'
      return isCoocaa && !(isCreatingOrCopying || isEditingV1)
    },
    isReplica () {
      return this.mode === 'replicated' || this.basicForm.duplicateVersion === 'yes'
    }
  },
  watch: {
  },
  methods: {
    handleActivateDmpContent (index) {
      if (this.dmpContentList[this.activeDmpIndex]) {
        this.checkNormalForm(() => {
          this.normalForm.activeIndex = index
        })
      } else {
        // 当前内容被删除
        this.normalForm.activeIndex = index
      }
    },
    // 切换资源类别之后清空操作
    handleCoverTypeChange (val) {
      const normalVersionContent = this.normalVersionContent
      var newForm = Object.assign({}, this.versionForm)
      newForm.coverType = val
      if (val === 'custom') {
        newForm.sign = 'openMode==app'
        newForm.contentType = 'custom'
        newForm.params = {}
        newForm.clickTemplateType = 'custom'
      }
      this.normalForm = newForm
      normalVersionContent.splice(this.currentIndex, 1, newForm)
    },
    handleRemoveDmpContent (index) {
      this.$confirm('确认删除该内容', '提示', {
        callback: (result) => {
          if (result === 'confirm') {
            const activeDmpIndex = this.activeDmpIndex
            const currentContentList = this.dmpContentList
            currentContentList.splice(index, 1)
            if (currentContentList.length > 0) {
              if (currentContentList[activeDmpIndex] === undefined) {
                this.handleActivateDmpContent(index - 1)
              }
            } else {
              this.handleActivateDmpContent(0)
            }
          }
        }
      })
    },
    handleSwitchShowContentType (val) {
      const normalForm = this.normalForm
      if (val === 'general' && this.dmpContentList.length === 0) {
        normalForm.showContentType = val
      } else {
        this.checkNormalForm(() => {
          normalForm.showContentType = val
        })
      }
    },
    handleAddDmpContent () {
      const normalForm = this.normalForm
      const dmpContentList = this.normalForm.dmpContentList
      if (dmpContentList.length > 0) {
        this.checkNormalForm(() => {
          dmpContentList.push(this.genDefaultContentForm({ isDmpContent: true }))
          normalForm.activeIndex = dmpContentList.length - 1
        })
      } else {
        dmpContentList.push(this.genDefaultContentForm({ isDmpContent: true }))
        normalForm.activeIndex = dmpContentList.length - 1
      }
    },
    handleDragDmpConentStart (event) {
    },
    handleDragDmpConentEnd (event) {
      const normalForm = this.normalForm
      const currentIndex = normalForm.activeIndex
      const { oldIndex, newIndex } = event
      if (oldIndex === currentIndex) {
        normalForm.activeIndex = newIndex
      } else if (oldIndex < currentIndex && newIndex >= currentIndex) {
        normalForm.activeIndex = currentIndex - 1
      } else if (oldIndex > currentIndex && newIndex <= currentIndex) {
        normalForm.activeIndex = currentIndex + 1
      }
    },
    checkCrowd (crowd) {
      const specificContentList = this.dmpContentList
      let length = specificContentList.length
      let existsIndex
      let dmpRegistryInfo
      while (--length >= 0) {
        dmpRegistryInfo = specificContentList[length].dmpRegistryInfo
        if (dmpRegistryInfo && dmpRegistryInfo.dmpCrowdId === crowd.value) {
          existsIndex = length
          break
        }
      }
      return existsIndex
    },
    handleSourceChange (val) {
      this.$confirm('切换内容源将清空内容, 确定切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(
          function () {
            this.normalForm = this.genDefaultContentForm()
            this.normalVersionContent = [this.normalForm]
            this.currentIndex = 0
            this.cleanLowerForm('media')
            this.basicForm.source = val
          }.bind(this)
        )
        .catch(function (e) {})
    },
    getThirdId (clickParams) {
      if (clickParams) {
        const result = (clickParams.id ||
          clickParams.rotateId ||
          clickParams.pTopicCode ||
          clickParams.url
        )
        return result
      }
    },
    replicate () {
      this.mode = 'replicate'
    },
    edit () {
      this.mode = 'edit'
    },
    clickThirdpartSubmit () {
      const { onclickEventVisibleFlag } = this
      if (onclickEventVisibleFlag === 'lower') {
        const inputValue = this.$refs.openWayLower.inputValue
        this.parseOnclick(inputValue)
      } else {
        const inputValue = this.$refs.openWayNormal.inputValue
        this.parseOnclick(inputValue)
      }
    },
    parseOnclick (inputValue) {
      const clickData = this.clickData
      Object.keys(inputValue).map(item => {
        if (item === 'params') {
          const params = JSON.parse(clickData[item])
          inputValue[item] = Object.keys(params).map(function (key) {
            return {
              key: key,
              value: params[key]
            }
          })
        } else {
          inputValue[item] = clickData[item]
        }
      })
    },
    // 第三方应用快速填充
    getClickData (data) {
      this.onclickEventVisible = false
      this.clickData = data
      let params = JSON.parse(data.params)
      let keys = Object.keys(params)
      let paramsArr = keys.reduce((result, current, index) => {
        var obj = {}
        obj.key = current
        obj.value = params[current]
        result.push(obj)
        return result
      }, [])
      let o = {
        packagename: data.packagename,
        versioncode: data.versioncode,
        dowhat: data.dowhat,
        bywhat: data.bywhat,
        byvalue: data.byvalue,
        params: paramsArr,
        exception: data.exception
      }
      this[this.onclickEventVisibleFlag + 'Form']['onclick'] = o
    },
    handleChangeSign (newVal) {
      const normalForm = this.normalForm
      if (newVal === 'autoSet') {
        normalForm.onclick = ''
        normalForm.clickParams = normalForm.params
        normalForm.clickTemplateType = normalForm.contentType
      }
      if (newVal === 'manualResource') {
        normalForm.onclick = ''
        normalForm.clickParams = {}
        normalForm.clickTemplateType = ''
      }
      if (newVal === 'manualSet') {
        // 手动设置
        normalForm.clickTemplateType = 'custom'
        normalForm.clickParams = {}
      }
      normalForm.sign = newVal
    },
    // 自动填写表单
    handleToggleManualSetResource (isManualSetResource, type) {
      const normalForm = this.genDefaultContentForm()
      if (isManualSetResource) {
        normalForm.sign = 'manualSet'
        normalForm.type = 'url'
        normalForm.params = {
          url: '',
          source: '',
          name: '',
          needParse: 'false',
          url_type: 'web'
        }
        normalForm.clickTemplateType = 'custom'
        normalForm.clickParams = {}
      } else {
        normalForm.sign = 'autoSet'
        normalForm.onclick = ''
        normalForm.clickParams = normalForm.params
        normalForm.clickTemplateType = normalForm.contentType
      }
      if (type === 'dmp') {
        normalForm.isDmpContent = true
        const currentNormalForm = this.normalForm
        this.$set(currentNormalForm.dmpContentList, currentNormalForm.activeIndex, normalForm)
      } else {
        this.$set(this.normalVersionContent, this.currentIndex, normalForm)
        this.normalForm = normalForm
      }
    },
    handleToggleUseShortVideo (isOpen, type) {
      let normalForm
      if (type === 'dmp') {
        normalForm = this.normalForm.dmpContentList[this.normalForm.activeIndex]
      } else {
        normalForm = this.normalForm
      }
      if (isOpen) {
        normalForm.type = 'shortVideo'
      }
      normalForm.shortVideoSwitch = isOpen
      normalForm.sign = 'autoSet'
      normalForm.onclick = ''
      normalForm.clickParams = normalForm.params
      normalForm.clickTemplateType = normalForm.contentType
    },
    // 删除角标
    deleteCorner (form, index) {
      var list = form.cornerIconList.slice()
      list[index] = {
        cornerIconId: '',
        imgUrl: '',
        position: index
      }
      form.cornerIconList = list
    },
    // 模式切换
    handleInputConfigModel (val) {
      this.$confirm('切换后配置数据将被清空, 是否确认切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '模式切换成功!'
          })
          this.basicForm.configModel = val
          this.currentIndex = 0
          this.clearFormAll()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消切换'
          })
        })
    },
    clearFormAll () {
      // 清空正常版本和低版本数据
      const normalForm = cloneDeep(this.versionForm)
      const lowerForm = cloneDeep(this.versionForm)
      this.lowerForm = lowerForm
      this.normalForm = normalForm
      this.normalVersionContent = [normalForm]
    },
    handleSelectNormalmultipleResourceEnd (selectedResources) {
      const resourceOptions = this.resourceOptions
      let contentArr = []
      resourceOptions.forEach(resourceName => {
        selectedResources[resourceName].forEach(selected => {
          const normalForm = this.genDefaultContentForm()
          const resourceContent = parseResourceContent(resourceName, selected)
          setContentForm(normalForm, resourceContent)
          contentArr.push(normalForm)
        })
      })
      this.normalVersionContent.splice(this.currentIndex, contentArr.length, ...contentArr)
      this.normalForm = this.genDefaultContentForm()
      this.normalForm = Object.assign(this.normalVersionContent[this.currentIndex])
    },
    handleSelectLowerSingleResourceEnd (selectedResources) {
      const result = getSelectedResource(selectedResources)
      const resourceContent = parseResourceContent(result.selectedType, result.selected[0])
      setContentForm(this.lowerForm, resourceContent)
    },
    // 校验normalForm
    checkNormalForm: function (cb) {
      const $broadcastBlockForm = this.$refs.broadcastBlockForm
      const $broadcastBlockFormSpe = this.$refs.broadcastBlockFormSpe
      if (this.$refs.broadcastBlockForm) {
        const $contentForm = this.$refs.broadcastBlockForm.normalForm
        if ($contentForm.guideConfig.after_play.operation === 'theFilm') {
          if (!$contentForm.guideConfig.after_play.id && !$contentForm.guideConfig.after_play.vid) {
            return this.$message.error('请指定播放资源！')
          }
        }
        if ($contentForm.flagSetRec === 1) {
          if (!$contentForm.mediaAutomationBlockRls.mediaAutomationId && !$contentForm.mediaAutomationBlockRls.recId) {
            return this.$message.error('开关开启时，推荐流选择必须选择其一')
          } else if ($contentForm.mediaAutomationBlockRls.mediaAutomationId && $contentForm.mediaAutomationBlockRls.recId) {
            return this.$message.error('开关开启时，推荐流只能保存其一')
          }
        }
        $broadcastBlockForm.$refs.normalForm.validate((valid) => {
          if (valid) {
            cb()
          } else {
            this.$message.error('请将表单填写完整')
          }
        })
      } else if (($broadcastBlockFormSpe)) {
        $broadcastBlockFormSpe.$refs.normalForm.validate((valid) => {
          if (valid) {
            cb()
          } else {
            this.$message.error('请将表单填写完整')
          }
        })
      } else {
        cb()
      }
    },
    genDefaultContentForm (preset) {
      return {
        flagSetRec: 0,
        mediaAutomationBlockRls: {
          refreshCal: 1,
          mediaAutomationId: '',
          blockType: 'rotate',
          type: '0'
        },
        title: '',
        subTitle: '',
        type: '',
        coverType: 'media',
        thirdIdOrPackageName: '',
        subchannelId: '', // 子频道ID
        subchannelIs: '', // 是否显示子频道
        params: {},
        clickType: 'detail',
        onclick: {},
        sign: 'autoSet',
        guideConfig: {
          id: '',
          vid: '',
          after_play: {
            operation: 'nextFilm',
            id: '',
            vid: ''
          }
        },
        contentType: '',
        clickParams: {},
        // jumpAdress: '1',
        poster: {},
        cornerIconList: [{}, {}, {}, {}],
        // dmp
        showContentType: 'general',
        dmpContentList: [],
        activeIndex: 0,
        isDmpContent: false,
        shortVideoParams: {
          topicId: undefined,
          shortVideoId: undefined
        },
        shortVideoSwitch: false,
        ...preset
      }
    },
    // 组合模式->添加normalForm
    handleAddNormalContent () {
      this.checkNormalForm(() => {
        this.normalForm = this.genDefaultContentForm()
        this.normalVersionContent.push(this.normalForm)
        this.currentIndex = this.normalVersionContent.length - 1
        console.log(this.currentIndex, '----currentIndex')
      })
    },
    // 组合模式->删除normalForm
    handleDeleteNormalContent (index) {
      this.$confirm('是否删除当前选中项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.normalVersionContent.splice(index, 1)
          this.currentIndex = 0
          this.normalForm = this.normalVersionContent[0]
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 组合模式->normalForm切换
    handleActivateContent (index) {
      this.checkNormalForm(() => {
        this.currentIndex = index
        this.normalForm = this.normalVersionContent[index]
      })
    },
    handleSelectPostEnd (selected) {
      this.lowerForm.poster = {
        pictureUrl: selected.pictureUrl,
        pictureId: selected.pictureId
      }
    },
    handleSelectCornerIconEnd (selectPicture) {
      const index = selectPicture.cornerIconType.typePosition
      const corner = {
        cornerIconId: selectPicture.cornerIconId,
        position: index,
        imgUrl: selectPicture.imgUrl
      }
      this.$set(this.lowerForm.cornerIconList, index, corner)
    },
    onDragStart: function (event) {
      console.log(event)
    },
    onDragtEnd: function (event) {
      const { oldIndex, newIndex } = event
      const currentIndex = this.currentIndex
      if (oldIndex === currentIndex) {
        this.currentIndex = event.newIndex
      } else if (oldIndex < currentIndex && newIndex >= currentIndex) {
        this.currentIndex = currentIndex - 1
      } else if (oldIndex > currentIndex && newIndex <= currentIndex) {
        this.currentIndex = currentIndex + 1
      }
    },

    // 快速填充
    lowerFill: function () {
      var newForm = cloneDeep(this.normalVersionContent[0])
      if (newForm.shortVideoSwitch === true) {
        this.$message({
          type: 'error',
          message: '第一个资源是短视频资源，无法快速填充。'
        })
        return
      }
      newForm.dmpContentList = undefined
      // 由于改变 coverType 会触发清除低版本表单，所以先修改 coverType 再赋值 lowerForm
      if (newForm.sign === 'manualSet') {
        this.$message({
          type: 'error',
          message: '手动填写的资源不能填充，请填充自动配置的播放资源，资源填充使用的是正常版本的第一个资源。'
        })
        return
      }
      this.lowerForm.coverType = newForm.coverType
      this.$nextTick(() => {
        this.lowerForm = newForm
      })
    },
    handleInputLowerFormCoverType (val) {
      this.cleanLowerForm(val)
    },
    cleanLowerForm: function (val) {
      var newForm = Object.assign({}, this.versionForm)
      newForm.type = val
      newForm.coverType = val
      if (val === 'custom') {
        newForm.sign = 'openMode==app'
        newForm.contentType = 'custom'
        newForm.params = {}
        newForm.clickTemplateType = 'custom'
      }
      this.lowerForm = newForm
    },
    validate (data, cb) {
      const normalForm = data.normalVersionContent[0]
      const guideConfig = normalForm.guideConfig
      const contentType = normalForm.contentType
      debugger
      this.$refs.basicForm.validate((valid) => {
        if (valid) {
          this.checkNormalForm(() => {
            if (guideConfig.after_play.operation === 'theFilm') {
              if (!guideConfig.after_play.id && !guideConfig.after_play.vid) {
                return this.$message.error('请指定播放资源！')
              }
            }
            if (normalForm.showContentType === 'dmp') {
              if (normalForm.clickParams === {}) {
                return this.$message.error('请选择跳转其他播放资源！')
              }
            }
            if (contentType === '' && normalForm.type !== 'url') return this.$message.error('请选择资源！')
            if (normalForm.mediaAutomationBlockRls.recId) {
              let defalutId = normalForm.mediaAutomationBlockRls.recId
              normalForm.mediaAutomationBlockRls.mediaAutomationId = defalutId
            }
            this.$refs.lowerForm.validate((valid) => {
              if (valid) {
                const configModel = data.configModel
                const normalVersionContent = data.normalVersionContent

                if (configModel === 'group') {
                  if (normalVersionContent.length < 4) {
                    return this.$message.error('组合模式下，正常版本的配置资源至少4个，才可以进行保存！')
                  }
                }
                if (configModel === 'sign') {
                  const firstContent = normalVersionContent[0]
                  if (firstContent.contentType !== 'rotate') {
                    return this.$message.error('信号源模式下，第一个资源必须是轮播资源')
                  }
                }
                // 检查海报, 批量填充轮播资源的时候会缺少海报
                for (let i = 0; i < normalVersionContent.length; i++) {
                  if (!normalVersionContent[i].poster.pictureUrl) {
                    return this.$message.error(`请设置第 ${i + 1} 个内容的海报`)
                  }
                }

                cb()
              } else {
                this.$message.error('请将表单填写完整')
              }
            })
          })
        } else {
          this.$message.error('请将表单填写完整')
        }
      })
    },
    getFormData () {
      const data = cloneDeep(this.basicForm)
      data.normalVersionContent = this.isGroupModel
        ? cloneDeep(this.normalVersionContent)
        : [cloneDeep(this.normalForm)]
      data.lowerVersionContent = cloneDeep(this.lowerForm)
      return data
    },
    handleSaveDraft () {
      const data = this.getFormData()
      data.isTiming = undefined
      data.releaseTime = undefined
      data.status = this.$consts.status.draft
      this.validate(data, () => {
        this.doSave(data)
      })
    },
    handleSubmitAudit (timing) {
      const data = this.getFormData()
      // clickTemplateType
      console.log(data)
      data.status = this.$consts.status.waiting
      this.validate(data, () => {
        if (this.couldSetReleaseTime) {
          if (timing) {
            data.isTiming = timing.isTiming
            data.releaseTime = timing.releaseTime
            this.doSave(data)
          } else {
            this.$refs.commonContent.showReleaseTimeSetter = true
          }
        } else {
          this.doSave(data)
        }
      })
    },
    doSave (data) {
      const parseParams = (onclick) => {
        const params = onclick.params || []
        onclick.params = params.reduce((result, item) => {
          result[item.key] = item.value
          return result
        }, {})
      }
      if (this.mode === 'replicate') {
        data.currentVersion = ''
      }
      const parseContent = (item) => {
        // 转换数据
        // 短视频流
        if (item.shortVideoSwitch === true) {
          item.type = 'shortVideo'
          item.params = {
            ...item.shortVideoParams
          }
          // 选跳转其他播放资源或者手动设置,clickParams/clickTemplateType原来的逻辑不变
          if (item.sign === 'autoSet') {
            item.clickParams = {}// 目前先置空，待后续客户端开发
            item.clickTemplateType = 'shortVideo'
          }
          item.coverType = 'shortVideo'
          item.contentType = 'shortVideo'
        }
        // type url 时，要转换 params 数据, 具体看 getUrlBlur
        if (item.type === 'url') {
          item.params = {
            url: item.thirdIdOrPackageName,
            source: '',
            name: item.title,
            needParse: 'false',
            url_type: 'web'
          }
        }
        if (item.onclick) {
          if (item.coverType !== 'custom' && this.basicForm.configModel === 'purePoster') {
            item.onclick = ''
          } else if (item.coverType !== 'custom' && this.basicForm.configModel === 'group') {
            if (item.sign === 'manualSet') {
              parseParams(item.onclick)
              item.onclick = JSON.stringify(item.onclick)
            } else {
              item.onclick = ''
            }
          } else {
            parseParams(item.onclick)
            item.onclick = JSON.stringify(item.onclick)
          }
        }
        // 转换子频道123
        if (item.subchannelId) {
          item.params.stationId = item.subchannelId
          delete item.subchannelId
        }
        if (item.coverType === 'custom') item.contentType = 'custom'

        item.params = JSON.stringify(item.params)
        item.clickParams = JSON.stringify(item.clickParams)
        item.guideConfig = JSON.stringify(item.guideConfig)
        if (item.dmpContentList.length > 0) {
          item.dmpContentList = item.dmpContentList.map(parseContent)
        } else {
          item.dmpContentList = undefined
        }
        delete item.shortVideoSwitch
        delete item.shortVideoParams
        delete item.thirdIdOrPackageName
        delete item.activeIndex
        delete item.showContentType
        delete item.isDmpContent
        delete item.mediaAutomationBlockRls.type
        return item
      }
      data.normalVersionContent = data.normalVersionContent.map(parseContent)
      const lowerVersionContent = data.lowerVersionContent
      if (lowerVersionContent.coverType) {
        parseParams(lowerVersionContent.onclick)
      }
      // 转换小专题
      if (lowerVersionContent.smallTopicsId) {
        lowerVersionContent.params.topicCode = lowerVersionContent.smallTopicsId
        delete lowerVersionContent.smallTopicsId
      }
      // 转换子频道
      if (lowerVersionContent.subchannelId) {
        lowerVersionContent.params.stationId = lowerVersionContent.subchannelId
        delete lowerVersionContent.subchannelId
      }
      lowerVersionContent.params = JSON.stringify(lowerVersionContent.params)
      if (lowerVersionContent.coverType !== 'custom') {
        lowerVersionContent.onclick = ''
      } else {
        lowerVersionContent.onclick = JSON.stringify(lowerVersionContent.onclick)
      }
      data.parentType = 'Block'
      this.$service
        .saveBlockInfo({ jsonStr: JSON.stringify(data) }, '提交成功')
        .then(() => {
          this.$emit('upsert-end')
        })
    },

    fetchData (version) {
      this.$service
        .getBroadcastBlockEditData({ id: this.id, version })
        .then(data => {
          const basicForm = this.basicForm
          basicForm.containerName = data.containerName
          basicForm.containerType = 'REFERENCE_BROADCASTING'
          basicForm.configModel = data.configModel
          basicForm.source = data.source
          basicForm.status = data.status
          basicForm.id = data.id
          basicForm.currentVersion = data.currentVersion
          basicForm.duplicateVersion = data.duplicateVersion
          const parseParams = (onclick) => {
            if (onclick) {
              const params = onclick.params || {}
              onclick.params = Object.keys(params).map(key => {
                return {
                  key,
                  value: params[key]
                }
              })
            }
          }

          const parseCornerIconList = (data) => {
            data.cornerIconList = (data.cornerIconList || []).reduce((result, item) => {
              result[item.position] = item
              return result
            }, [{}, {}, {}, {}])
          }
          // 解决旧版本没有该字段问题。
          let guideConfigObj = {
            id: '',
            vid: '',
            after_play: {
              operation: '',
              id: '',
              vid: ''
            }
          }
          let mediaAutomationBlockRlsObj = {
            mediaAutomationId: '',
            mediaAutomationName: '',
            refreshCal: '1',
            type: ''
          }
          const mapContent = (item, isDmpContent) => {
            // item.onclick = item.sign === 'manualSet' ? JSON.parse(item.onclick) : {}
            item.onclick = JSON.parse(item.onclick)
            item.params = JSON.parse(item.params || '{}')
            item.clickParams = JSON.parse(item.clickParams || '{}')
            item.guideConfig = JSON.parse(item.guideConfig || JSON.stringify(guideConfigObj))
            item.mediaAutomationBlockRls = item.mediaAutomationBlockRls || mediaAutomationBlockRlsObj
            parseCornerIconList(item)
            parseParams(item.onclick)
            // 短视频
            if (item.params.topicId) {
              item.shortVideoSwitch = true
              item.shortVideoParams = {
                topicId: undefined,
                shortVideoId: undefined
              }
              Object.assign(item.shortVideoParams, item.params)
            }
            item.thirdIdOrPackageName = this.getThirdId(item.params)
            item.subchannelIs = item.contentType === 'rotate'
            if (item.subchannelIs) {
              item.subchannelId = item.params.stationId
            }
            if (item.dmpContentList) {
              item.dmpContentList = item.dmpContentList.map((item) => mapContent(item, true))
            }
            item = this.genDefaultContentForm({ ...item, isDmpContent })
            return item
          }
          this.normalVersionContent = data.normalVersionContent.map((item) => mapContent(item, false))
          this.normalForm = this.normalVersionContent[0]
          const lowerData = cloneDeep(data.lowerVersionContent)
          lowerData.onclick = JSON.parse(lowerData.onclick)
          lowerData.params = JSON.parse(lowerData.params || '{}')
          lowerData.thirdIdOrPackageName = this.getThirdId(lowerData.params)
          lowerData.smallTopicsIs = lowerData.contentType === 'bigTopic'
          if (lowerData.smallTopicsIs) {
            lowerData.smallTopicsId = lowerData.params.topicCode
          }
          lowerData.subchannelIs = lowerData.contentType === 'rotate'
          if (lowerData.subchannelIs) {
            lowerData.subchannelId = lowerData.params.stationId
          }
          parseParams(lowerData.onclick)
          parseCornerIconList(lowerData)
          this.lowerForm = lowerData
        })
    },
    // 选择资源拓展项
    handleCloseLowerFormTag () {
      this.lowerForm.thirdIdOrPackageName = undefined
      this.singleEpisodeNum = undefined
    }
  },
  created () {
    console.log(this.$consts.sourceOptionsWithNone)
    this.normalForm = cloneDeep(this.versionForm)
    this.normalVersionContent.push(this.normalForm) // 纯图模式下默认给个值展示左边数据
    this.lowerForm = cloneDeep(this.versionForm)
    this.lowerForm.smallTopicsId = ''
    this.lowerForm.smallTopicsIs = false
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.fetchData(this.version)
      this.$sendEvent({
        type: 'broadcast_show',
        payload: {
          broadcast_id: this.id
        }
      })
    }
    // 素材类型获取
    this.$service.getDictType({ type: 'materialType' }).then(data => {
      var materialTypeOptions = []
      for (var i = 0; i < data.length; i++) {
        var materialTypeOption = {
          label: data[i].dictCnName,
          value: data[i].dictId
        }
        materialTypeOptions.push(materialTypeOption)
        this.pictureListOptions.poster.searchParams.pictureCategory.options = materialTypeOptions
      }
    })
    // 角标类型获取
    this.$service.getCornerTypes().then(data => {
      var cornerIconTypeOptions = {}
      for (var i = 0; i < data.length; i++) {
        var label = data[i].typeName
        var value = data[i].typeId
        cornerIconTypeOptions[label] = value
      }
      this.cornerIconTypeOptions = cornerIconTypeOptions
    })
  }
}
</script>
<style lang='stylus' scoped>
.split-bar
  width 96%
  height 36px
  margin 8px 0px
  padding 0px 6px
  font-size 17px
  line-height 36px
  background #e5e9f2
  border-radius 4px
.form-wrap
  width 95%
  height auto
  padding 10px
  border 2px dotted darkgray
  overflow auto
.version-title
  height 40px !important
  width 97% !important
.version-title__h
  float left
  margin-top 7px
.version-title__tag
  margin-top 6px
  margin-left 10px
.demo-ruleForm, .key-span
  width 100px
  display inline-block
  text-align center
  background #f1f1f1
  border 1px solid #ddd
  margin-right 10px
  border-radius 6px
.button-wraprer
  padding 8px 0px
  border-bottom 1px solid #ccc
.el-card__body
  padding 7px
.el-card__body img
  width 100%
.normal-left-list
  width 190px
  /* height 400px */
  /* border-right 1px solid gray */
  float left
  padding 8px
  margin-right 8px
  /* max-height 617px */
  overflow auto
.write-play
  color #20a0ff
  margin-left 10px
.el-icon-close
  font-size 14px
  position absolute
  right 2px
  top 4px
  color red
.active
  border 2px dashed #f58b2fd6
.cutLine
  border-left 1px solid gray
  margin-left 10px
.add-version
  font-size 17px
  height 100px
  line-height 100px
  display block
  text-align center
.normal-version-wrap
  width 160px !important
  min-height 120px
  position relative
  margin-bottom 10px
  text-align center
  cursor pointer
.normal-version-wrap span
  font-size 16px
.normal-version-wrap img
  width 95%
  height 90px
  border-radius 8px
/* 角标 */
.corner-box
  position relative
  width 150px
  height 150px
.corner-box span.corner
  position absolute
  width 50px
  height 50px
  text-align center
  cursor pointer
.corner-box span.corner img
  width: 100%
  height: 100%
.corner-box span.corner-0
  top: 0
  left: 0
.corner-box span.corner-1
  top: 0
  right: 0
.corner-box span.corner-2
  bottom: 0
  right: 0
.corner-box span.corner-3
  bottom: 0
  left: 0
.corner-img-wrapper
  position: relative
  height: 100%
  display: block
.corner-img-wrapper i
  position: absolute
  bottom: 0px
  right: 0
  color: #FF4949
  font-size: 20px
.submitCheck
  margin-top 20px
  margin-left 110px
.sign-tip
  font-size 11px
  color orange
  padding 0
  line-height 1
  margin-top 10px
  clear both
.content-wrapper
  float left
  width 75%
  border-left 1px solid #808080
  margin-left 10px
.min-height
  height 648px
.content-type-switcher
  margin-bottom 20px
  border-bottom 1px solid #ccc
.conten-type-switcher__item
  padding 10px
  margin 0
  &.is-checked
    background #409EFF
    >>> .el-radio__label
      padding 0
      color #fff
  >>> .el-radio__input
    display none
.short-video--container
  display inline-block
  margin 0 20px
.short-video--title
  color #606266
  margin-right 7px
.margin-left-85
  margin-left 85px
.added-contents-wrapper
  margin-bottom 16px
  padding 8px
  border-top 2px dashed #C0CCDA
  border-bottom 2px dashed #C0CCDA
  white-space nowrap
  overflow auto
.added-contents-list
    display inline-block
  >>> .el-card
    position relative
    display inline-block
    width 190px
    height 120px
    margin-right 5px
    text-align center
    cursor pointer
.remove-handle
  position absolute
  top 0
  right 0
  padding 4px
  color #FF4949
  font-weight bolder
.audit-handle
  position absolute
  top 0
  right 0
  padding 4px
img
  height 120px
.add-version-card
  cursor pointer
  width 160px
.min-height
  height 648px
</style>
