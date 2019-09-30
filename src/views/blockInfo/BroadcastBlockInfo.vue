<template>
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
        <el-form-item label="配置模式">
          <el-radio-group :value="basicForm.configModel" @input="handleInputConfigModel">
            <el-radio label="broadcast" :disabled="disabled">轮播模式</el-radio>
            <el-radio label="group" :disabled="disabled">组合模式</el-radio>
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
          v-if="basicForm.configModel === 'group'"
          type="warning"
        >短标题模式需至少运营四个资源，长标题模式至少6个，才能填满布局哦~</el-tag>
        <ResourceSelector
          v-if="isGroupModel&&!disabled "
          ref="resourceSelector"
          :disable-partner="!!source"
          :source="source"
          :selectors="resourceOptions"
          :is-live="false"
          style="float: right;"
          selection-type="multiple"
          @select-end="handleSelectNormalmultipleResourceEnd"
        >
          <el-button type="primary" plain>批量选择资源</el-button>
        </ResourceSelector>
      </div>
      <!-- {{normalVersionContent正常版本}} -->
      <div class="form-wrap">
        <!-- group -->
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
          <el-card style="cursor: pointer;" v-if="!disabled">
            <span class="add-version" @click="handleAddNormalContent">+添加资源</span>
          </el-card>
        </el-row>

        <!-- broadcast -->
        <div class="content-wrapper" v-if="basicForm.configModel === 'group'">
          <div class="content-type-switcher">
            <el-radio-group :value="normalForm.showContentType" @input="handleSwitchShowContentType">
              <el-radio class="conten-type-switcher__item" label="general">通用推荐位版本</el-radio>
              <el-radio class="conten-type-switcher__item" label="dmp">分人群推荐位{{ dmpContentList.length > 0 ? `(${dmpContentList.length}个)` : '' }}</el-radio>
            </el-radio-group>
          </div>
          <div v-if="normalForm.showContentType === 'general'">
            <BroadcastBlockForm 
              ref="broadcastBlockForm"
              @toggle-manaulset-resource="handleToggleManualSetResource($event, 'general')"
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
              @toggle-manaulset-resource="handleToggleManualSetResource($event, 'dmp')"
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
        <div 
          :class="basicForm.configModel === 'sign' ? 'content-wrapper' : ''" 
          v-if="basicForm.configModel === 'broadcast' || basicForm.configModel === 'sign'">
          <BroadcastBlockForm 
            ref="broadcastBlockForm"
            @toggle-manaulset-resource="handleToggleManualSetResource($event, 'general')"
            :config-model="basicForm.configModel"
            :normal-form="normalForm"
            :normal-rules="normalRules"
            :is-readonly="disabled"
            :is-group-model="isGroupModel"
            :source="source"
            :show-resource-tip="currentIndex === 0"
          />
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
              v-if="!disabled "
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
              v-if="lowerForm.thirdIdOrPackageName"
            >已选择：{{lowerForm.thirdIdOrPackageName}}</el-tag>
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
              picture-resolution='1210*449'
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
      <!-- 海报弹框  -->
      <!-- <el-dialog :visible.sync="customDialogPicture.visible" width="1200px">
        <DialogPicture
          :title="customDialogPicture.title"
          :pictureResolution="pictureResolution"
          :form="customDialogPicture.form"
          v-model="selectPicture"
          v-if="customDialogPicture.visible"
          @close-dialog="savePicture"
        ></DialogPicture>
        <div slot="footer" class="dialog-footer">
          <el-button @click="customDialogPicture.visible = false">取 消</el-button>
          <el-button type="primary" @click="savePicture">确 定</el-button>
        </div>
      </el-dialog> -->
      <!-- 海报弹框 end -->
      <!-- 角标弹框  -->
      <!-- <el-dialog :visible.sync="customDialogCorner.visible" width="1200px">
        <DialogCorner
          v-model="selectPicture"
          :typePosition="customDialogCorner.index"
          :cornerIconTypeOptions="cornerIconTypeOptions"
          v-if="customDialogCorner.visible"
          @close-dialog="savePicture"
        ></DialogCorner>
        <div slot="footer" class="dialog-footer">
          <el-button @click="customDialogCorner.visible = false">取 消</el-button>
          <el-button type="primary" @click="savePicture">确 定</el-button>
        </div>
      </el-dialog> -->
      <!-- 角标弹框 end -->
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
</template>

<script>
import draggable from 'vuedraggable'
import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
import CornerSelector from '@/components/selectors/CornerIconSelector'

import DialogPicture from '@/components/DialogPicture'
import DialogCorner from '@/components/DialogCorner'
import selectClick from '@/views/blockInfo/selectClick'
import CommonContent from '@/components/CommonContent.vue'
import AppParams from '@/components/AppParams.vue'
import AppParamsRead from '@/components/AppParamsRead.vue'
import { cloneDeep } from 'lodash'
import _ from 'gateschema'
import titleMixin from '@/mixins/title'
import BroadcastBlockForm from './BroadcastBlockForm'
import GlobalPictureSelector from '@/components/selectors/GlobalPictureSelector'
import { getParams } from './broadcastBlockUtil';

export default {
  mixins: [titleMixin],
  components: {
    draggable,
    ResourceSelector,
    GlobalPictureSelector,
    CornerSelector,

    DialogPicture,
    DialogCorner,
    selectClick,
    AppParams,
    AppParamsRead,
    CommonContent,
    BroadcastBlockForm
  },
  props: ['id', 'initMode', 'version'],
  data() {
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
        configModel: 'broadcast',
        currentVersion: undefined,
        status: undefined,
        source: 'none'
      },
      normalForm: {
      },
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
              if (normalForm.sign === 'manualResource') {
                if (!value || JSON.stringify(value) === '{}') {
                  return cb('请选择资源')
                }
              }
              cb()
            }
          }
        ],
        dmpRegistryInfo: [{ required: true, message: '请选择定向人群' }],
        'mediaAutomationBlockRls.mediaAutomationId': [
          { required: true, message: '当开关开启时必填' }
        ],
        'mediaAutomationBlockRls.refreshCal': [
          { required: true, message: '当开关开启时必填', trigger: 'blur' }
        ]
      },
      lowerRules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        'poster.pictureUrl': [
          { required: true, message: '请上传海报', trigger: 'blur' }
        ],
        thirdIdOrPackageName: [
          { required: true, message: '请填选择资源', trigger: 'blur' }
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
              customFormatter: function(row, column) {
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
              customFormatter: function(row, column) {
                return ['', '审核通过', '待审核'][column]
              }
            }
          ]
        }
      },
      // smallTopics: false,
      versionForm: {
        flagSetRec: 0,
        mediaAutomationBlockRls: {
          refreshCal: 1,
          mediaAutomationId: '',
          blockType: 'rotate'
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
        contentType: '',
        clickParams: {},
        // jumpAdress: '1',
        poster: {},
        cornerIconList: [{}, {}, {}, {}],
        // dmp
        showContentType: 'general',
        dmpContentList: [],
        activeIndex: 0,
        isDmpContent: false
      },
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
      resourceVisible: false,
      layoutOptions: {
        contentDataNew: []
      },
      selectPicture: '',
      resourceSeq: '',
      layoutparam: {},
      layouttypenew: '',
      checkresourceis: true,
      // customDialogPicture: {},
      customDialogCorner: {},
      pictureOptions: {}
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
    resourceOptionsLowerForm (){
      return this.lowerForm.coverType === 'app' 
        ? ['app'] 
        : ['video', 'edu', 'live', 'rotate']
    },
    resourceOptionsManualResource (){
      return ['video', 'edu', 'live', 'rotate']
    },
    resourceOptionsNormalForm (){
      return this.currentIndex === 0 && this.basicForm.configModel === 'sign' 
        ? ['rotate'] 
        : ['video', 'edu', 'live', 'rotate']
    },
    resourceOptions (){
      return ['video', 'edu', 'live', 'rotate']
    },
    isManualSetResource () {
      return this.normalForm.type === 'url'
    },
    normalResourceBtn () {
      return this.isGroupModel ? '播放资源' : '轮播资源'
    },
    isGroupModel() {
      const configModel = this.basicForm.configModel
      return configModel === 'group' || configModel === 'sign'
    },
    source() {
      return this.basicForm.source === 'none' ? '' : this.basicForm.source
    },
    thirdIdOrPackageNameForClick() {
      return this.getThirdId(this.normalForm.clickParams)
    },
    couldFullscreen() {
      const contentType = this.normalForm.contentType
      return ['movie', 'custom', 'edu', 'txLive'].indexOf(contentType) > -1
    },
    classObject: function() {
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
    couldSetReleaseTime() {
      const mode = this.mode
      const currentVersion = this.basicForm.currentVersion
      const isCreatingOrCopying = mode === 'create' || mode === 'copy'
      const isEditingV1 = mode === 'edit' && currentVersion === 'V1'
      const isCoocaa = this.$consts.idPrefix == '10'
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
    handleSwitchShowContentType(val) {
      if (val === 'general' && this.dmpContentList.length === 0) {
        this.normalForm.showContentType = val
      } else {
        this.checkNormalForm(() => {
          this.normalForm.showContentType = val
        })
      }
    },
    handleAddDmpContent() {
      const normalForm = this.normalForm
      const dmpContentList = normalForm.dmpContentList
      if (dmpContentList.length > 0) {
        this.checkNormalForm(() => {
          dmpContentList.push(this.genDefaultContentForm({isDmpContent: true})) 
          normalForm.activeIndex = dmpContentList.length - 1
        })
      } else {
        dmpContentList.push(this.genDefaultContentForm({isDmpContent: true})) 
        normalForm.activeIndex = dmpContentList.length - 1
      }
    },
    handleDragDmpConentStart(event) {
    },
    handleDragDmpConentEnd(event) {
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
    checkCrowd(crowd) {
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
    handleSourceChange(val) {
      this.$confirm('切换内容源将清空内容, 确定切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(
          function() {
            this.normalForm = this.genDefaultContentForm()
            this.normalVersionContent = [this.normalForm]
            this.currentIndex = 0
            this.cleanLowerForm('media')
            this.basicForm.source = val
          }.bind(this)
        )
        .catch(function(e) {})
    },
    getThirdId(clickParams) {
      if (clickParams) {
        const result = (clickParams.id ||
          clickParams.rotateId ||
          clickParams.pTopicCode ||
          clickParams.url
        )
        return result
      }
    },
    replicate() {
      this.mode = 'replicate'
    },
    edit() {
      this.mode = 'edit'
    },
    clickThirdpartSubmit() {
      const { onclickEventVisibleFlag } = this
      if (onclickEventVisibleFlag === 'lower') {
        const inputValue = this.$refs.openWayLower.inputValue
        this.parseOnclick(inputValue)
      } else {
        const inputValue = this.$refs.openWayNormal.inputValue
        this.parseOnclick(inputValue)
      }
    },
    parseOnclick(inputValue) {
      const clickData = this.clickData
      Object.keys(inputValue).map(item => {
        if (item === 'params') {
          const params = JSON.parse(clickData[item])
          inputValue[item] = Object.keys(params).map(function(key) {
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
    getClickData(data) {
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
    handleChangeSign(newVal) {
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
        .catch(function() {
          this.$message({
            type: 'info',
            message: '已取消切换'
          })
        })
    },
    clearFormAll: function() {
      // 清空正常版本和低版本数据
      const normalForm = cloneDeep(this.versionForm) 
      const lowerForm = cloneDeep(this.versionForm)
      this.lowerForm = lowerForm
      this.normalForm = normalForm
      this.normalVersionContent = [normalForm]
    },
    /** 轮播模式，正常版本选择资源回掉函数 */
    handleSelectNormalSingleResourceEnd(selectedResources, mode) {
      let data
      if (mode === 'single') {
        data = this.callbackParam('rotate', selectedResources.rotate[0])
      } else {
        let resourceOptions = this.resourceOptionsNormalForm
        for (var i = 0; i < resourceOptions.length; i++) {
          const resourceType = resourceOptions[i]
          const resources = selectedResources[resourceType]
          if (resources && resources.length === 1) {
            data = this.callbackParam(
              resourceOptions[i],
              resources[0],
              selectedResources.videoSource
            )
          }
        }
      }
      this.resourceConfirm(data, 'normalForm')
    },
    handleSelectNormalmultipleResourceEnd(selectedResources) {
      let dataArr = []
      let resourceOptions = this.resourceOptions
      for (var i = 0; i < resourceOptions.length; i++) {
        selectedResources[resourceOptions[i]].forEach(item => {
          dataArr.push(
            this.callbackParam(
              resourceOptions[i],
              item,
              selectedResources.videoSource
            )
          )
        })
      }
      this.resourceConfirm(dataArr, 'normalForm')
    },
    handleSelectLowerSingleResourceEnd(selectedResources) {
      let data
      let resourceOptions = this.resourceOptionsLowerForm
      for (var i = 0; i < resourceOptions.length; i++) {
        const resources = selectedResources[resourceOptions[i]]
        if (resources && resources.length === 1) {
          data = this.callbackParam(
            resourceOptions[i],
            resources[0],
            selectedResources.videoSource
          )
        }
      }
      this.resourceConfirm(data, 'lowerForm')
    },
    /**
     * 资源转换
     */
    callbackParam(tabName, selected, sourceType) {
      let s = {
        type: '', // 面向客户端
        contentType: '', // 面向管理后台
        thirdIdOrPackageName: ''
      }
      const prefixMap = {
        tencent: '_otx_',
        o_tencent: '_otx_',
        yinhe: '_oqy_',
        o_iqiyi: '_oqy_',
        youku: '_oyk_'
      }
      switch (tabName) {
        case 'video': {
          const selectedEpisode = selected.selectedEpisodes
          const prefix = (prefixMap[sourceType] || '')
          if (selectedEpisode) {
            if (selectedEpisode.urlIsTrailer === 6 && selectedEpisode.thirdVId) {
              // 如果是短视频, 并且 thirdVId 存在
              s.thirdIdOrPackageName = prefix + selectedEpisode.thirdVId
              s.sid = selectedEpisode.coocaaMId
            } else {
              s.thirdIdOrPackageName = prefix + selected.coocaaVId
              s.vid = selectedEpisode.coocaaMId
            }
            s.pictureUrl = selectedEpisode.thumb
            s.title = selectedEpisode.urlTitle
            s.subTitle = selectedEpisode.urlSubTitle
          } else {
            s.thirdIdOrPackageName = prefix + selected.coocaaVId
            s.pictureUrl = selected.thumb
            s.title = selected.title
            s.subTitle = selected.subTitle
          }
          s.contentType = 'movie'
          s.type = 'res'
          s.coverType = 'media'
          break
        }
        case 'app': {
          s.contentType = 'app'
          s.thirdIdOrPackageName = selected.appPackageName
          s.pictureUrl = selected.appImageUrl
          s.title = selected.appName
          s.type = 'app'
          s.coverType = 'app'
          break
        }
        case 'edu': {
          s.contentType = 'edu'
          s.coverType = 'media'
          s.thirdIdOrPackageName = '_otx_' + selected.coocaaVId
          s.platformId = selected.source
          s.pictureUrl = selected.thumb
          s.title = selected.title
          s.subTitle = selected.subTitle
          s.type = 'res'
          break
        }
        case 'pptv': {
          s.contentType = 'pptv'
          s.coverType = 'media'
          s.thirdIdOrPackageName =
            'pptv_tvsports://tvsports_detail?section_id=' +
            selected.pid +
            '&from_internal=1'
          s.title = selected.pTitle
          s.type = ''
          break
        }
        case 'live': {
          s.contentType = 'txLive'
          s.coverType = 'media'
          s.thirdIdOrPackageName = '_otx_' + selected.vId + ''
          s.platformId = selected.source
          s.pictureUrl = selected.thumb
          s.title = selected.title
          s.subTitle = selected.subTitle
          s.type = 'live'
          break
        }
        case 'topic': {
          selected.dataSign === 'parentTopic'
            ? (s.contentType = 'bigTopic')
            : (s.contentType = 'topic')
          s.thirdIdOrPackageName = selected.id + ''
          s.pictureUrl = selected.picture
          s.title = selected.title
          s.subTitle = selected.subTitle
          s.type = 'topic'
          s.coverType = 'media'
          break
        }
        case 'rotate': {
          s.contentType = 'rotate'
          s.coverType = 'media'
          s.thirdIdOrPackageName = selected.id + ''
          s.pictureUrl = selected.picture
          s.title = selected.title
          s.subTitle = selected.subTitle
          s.type = 'rotate'
          break
        }
        default:
          break
      }
      return s
    },

    packageFormParam (item) {
      const form = cloneDeep(this.versionForm)
      form.type = item.type
      form.coverType = item.coverType
      if (item.contentType === 'rotate') {
        form.subchannelIs = true
      } else {
        form.subchannelIs = false
      }
      if (item.contentType === 'bigTopic') {
        form.smallTopicsIs = true
      } else {
        form.smallTopicsIs = false
      }
      form.title = item.title
      form.contentType = item.contentType
      form.subTitle = item.subTitle
      form.thirdIdOrPackageName = item.thirdIdOrPackageName
      if (item.pictureUrl) {
        const poster = Object.assign({}, form.poster)
        poster.pictureUrl = item.pictureUrl
        form.poster = poster
      } else {
        form.poster = {pictureUrl: ''}
      }
      const param = getParams(item)
      form.params = param
      if (form.sign === 'autoSet') {
        form.clickParams = cloneDeep(param)
        form.clickTemplateType = item.contentType
      }
      return form
    },
    // ??资源确定
    resourceConfirm (callbackData, form) {
      this.currentForm = this[form]
      this.resourceVisible = false
      if (callbackData instanceof Array) {
        let data = callbackData.reduce((result, current) => {
          result.push(this.packageFormParam(current))
          return result
        }, [])
        this.normalVersionContent.splice(this.currentIndex, 1, ...data)
        this[form] = data[0]
      } else {
        this[form] = this.packageFormParam(callbackData)
        if (form === 'normalForm') {
          this.normalVersionContent.splice(this.currentIndex, 1, this[form])
        }
      }
    },
    // 校验normalForm
    checkNormalForm: function(cb) {
      const $broadcastBlockForm = this.$refs.broadcastBlockForm
      if ($broadcastBlockForm) {
        $broadcastBlockForm.$refs.normalForm.validate((valid) => {
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
    genDefaultContentForm(preset) {
      return {
        flagSetRec: 0,
        mediaAutomationBlockRls: {
          refreshCal: 1,
          mediaAutomationId: '',
          blockType: 'rotate'
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
        ...preset
      }
    },
    // 组合模式->添加normalForm
    handleAddNormalContent () {
      this.checkNormalForm(() => {
        this.normalForm = this.genDefaultContentForm()
        this.normalVersionContent.push(this.normalForm)
        this.currentIndex = this.normalVersionContent.length - 1
      })
    },
    // 组合模式->删除normalForm
    handleDeleteNormalContent (index) {
      // debugger
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

    // 打开海报和角标弹窗
    // openPicture: function(type, form, index) {
    //   if (this.disabled) return
    //   form === 'normalForm'
    //     ? (this.pictureResolution = '797*449')
    //     : (this.pictureResolution = '1210*449')
    //   this.pictureType = type
    //   this.currentForm = form
    //   if (type === 'poster') {
    //     this.customDialogPicture = {
    //       visible: true,
    //       form
    //     }
    //   } else {
    //     this.customDialogCorner = {
    //       visible: true,
    //       form,
    //       index
    //     }
    //   }
    //   this.pictureOptions = this.pictureListOptions[type]
    // },
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
    // savePicture: function() {
    //   var selectPicture = this.selectPicture
    //   if (JSON.stringify(selectPicture) === '{}') {
    //     this.$message('请至少选择一项')
    //   } else {
    //     this.customDialogPicture.visible = false
    //     this.customDialogCorner.visible = false
    //     if (this.pictureType === 'poster') {
    //       this[this.currentForm].poster = {
    //         pictureUrl: selectPicture.pictureUrl,
    //         pictureId: selectPicture.pictureId
    //       }
    //     } else if (this.pictureType === 'corner') {
    //       var index = selectPicture.cornerIconType.typePosition
    //       var cornerObj = {
    //         cornerIconId: selectPicture.cornerIconId,
    //         position: index,
    //         imgUrl: selectPicture.imgUrl
    //       }
    //       var newForm = this[this.currentForm].cornerIconList.slice(0)
    //       // var newForm = Object.assign({}, this.currentForm.cornerIconList);
    //       newForm[index] = cornerObj
    //       this[this.currentForm].cornerIconList = newForm
    //       this.customDialogCorner.visible = false
    //     }
    //     this.selectPicture = {}
    //   }
    //   this.normalVersionContent[this.currentIndex] = this.normalForm
    // },
    onDragStart: function(event) {
      console.log(event)
    },
    onDragtEnd: function(event) {
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
    lowerFill: function() {
      var newForm = cloneDeep(this.normalVersionContent[0])
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
    cleanLowerForm: function(val) {
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
      this.$refs.basicForm.validate((valid) => {
        if (valid) {
          this.checkNormalForm(() => {
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
                  // if (firstContent.sign === 'manualResource' && !firstContent.clickParams.rotateId) {
                  //   return this.$message.error('信号源模式下，第一个资源如果设置跳转到其它播放资源，必须是轮播资源')
                  // }
                }
                // 检查海报, 批量填充轮播资源的时候会缺少海报
                for (let i = 0; i < normalVersionContent.length; i++) {
                  if (!normalVersionContent[i].poster.pictureUrl) {
                    return this.$message.error(`请设置第 ${i+1} 个内容的海报`)
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
    doSave(data) {
      const parseParams = (onclick) => {
        const params = onclick.params || []
        onclick.params = params.reduce((result, item) => {
          result[item.key] = item.value
          return result
        }, {})
      }
      const configModel = data.configModel
      if (this.mode === 'replicate') {
        data.currentVersion = ''
      }
      const parseContent = (item) => {
        // 转换数据
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
          parseParams(item.onclick)
          item.onclick = JSON.stringify(item.onclick)
        }
        // 转换子频道
        if (item.subchannelId) {
          item.params.stationId = item.subchannelId
          delete item.subchannelId
        }
        item.params = JSON.stringify(item.params)
        item.clickParams = JSON.stringify(item.clickParams)
        if (item.dmpContentList.length > 0) {
          item.dmpContentList = item.dmpContentList.map(parseContent)
        } else {
          item.dmpContentList = undefined
        }
        delete item.thirdIdOrPackageName
        delete item.activeIndex
        delete item.showContentType
        delete item.isDmpContent
        return item
      }
      data.normalVersionContent = data.normalVersionContent.map(parseContent)

      const lowerVersionContent = data.lowerVersionContent
      if (lowerVersionContent.onclick) {
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
      lowerVersionContent.onclick = JSON.stringify(lowerVersionContent.onclick)              

      data.parentType = 'Block'
      this.$service
        .saveBlockInfo({ jsonStr: JSON.stringify(data) }, '提交成功')
        .then(() => {
          this.$emit('upsert-end')
        })
    },

    fetchData(version) {
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
          const mapContent = (item, isDmpContent) => {
            item.onclick = item.sign === 'manualSet' ? JSON.parse(item.onclick) : {}
            item.params = JSON.parse(item.params || '{}')
            item.clickParams = JSON.parse(item.clickParams || '{}')
            parseCornerIconList(item)
            parseParams(item.onclick)
            item.thirdIdOrPackageName = this.getThirdId(item.params)
            item.subchannelIs = item.contentType === 'rotate'
            if (item.subchannelIs) {
              item.subchannelId = item.params.stationId
            }
            if (item.dmpContentList) {
              item.dmpContentList = item.dmpContentList.map((item) => mapContent(item, true))
            }
            item = this.genDefaultContentForm({...item, isDmpContent})
            return item
          }
          this.normalVersionContent = data.normalVersionContent.map((item) => mapContent(item, false))
          this.normalForm = this.normalVersionContent[0]

          // lower data
          const lowerData = cloneDeep(data.lowerVersionContent)
          lowerData.onclick = JSON.parse(lowerData.onclick)
          lowerData.params = JSON.parse(lowerData.params || '{}')
          lowerData.thirdIdOrPackageName = this.getThirdId(lowerData.params)
          lowerData.smallTopicsIs = lowerData.contentType === 'bigTopic'
          if (lowerData.smallTopicsIs ) {
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
    }
  },
  created() {
    this.normalForm = cloneDeep(this.versionForm)
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
  width: 96%
  height: 36px
  margin: 8px 0px
  padding: 0px 6px
  font-size: 17px
  line-height: 36px
  background: #e5e9f2
  border-radius: 4px
.form-wrap
  width: 95%
  height: auto
  padding: 10px
  border: 2px dotted darkgray
  overflow: auto
.version-title
  height: 40px !important
  width: 97% !important
.version-title__h
  float: left
  margin-top: 7px
.version-title__tag
  margin-top: 6px
  margin-left: 10px
.demo-ruleForm, .key-span
  width: 100px
  display: inline-block
  text-align: center
  background: #f1f1f1
  border: 1px solid #ddd
  margin-right: 10px
  border-radius: 6px
.button-wraprer
  padding: 8px 0px
  border-bottom: 1px solid #ccc
.el-card__body
  padding: 7px
.el-card__body img
  width: 100%
.normal-left-list
  width: 190px
  /* height: 400px; */
  /* border-right: 1px solid gray; */
  float: left
  padding: 8px
  margin-right: 8px
  /* max-height: 617px; */
  overflow: auto
.write-play
  color: #20a0ff
  margin-left: 10px
.el-icon-close
  font-size: 14px
  position: absolute
  right: 2px
  top: 4px
  color: red
.active
  border: 2px dashed #f58b2fd6
.cutLine
  border-left: 1px solid gray
  margin-left: 10px
.add-version
  font-size: 17px
  height: 100px
  line-height: 100px
  display: block
  text-align: center
.normal-version-wrap
  width: 160px
  min-height: 120px
  position: relative
  margin-bottom: 10px
  text-align: center
  cursor: pointer
.normal-version-wrap span
  font-size: 16px
.normal-version-wrap img
  width: 95%
  height: 90px
  border-radius: 8px
/* 角标 */
.corner-box
  position: relative
  width: 150px
  height: 150px
.corner-box span.corner
  position: absolute
  width: 50px
  height: 50px
  text-align: center
  cursor: pointer
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
  margin-top: 20px
  margin-left: 110px
.sign-tip
  font-size: 11px;
  color: orange;
  padding: 0;
  line-height: 1;
  margin-top: 10px;
  clear: both;

.content-wrapper
  float left
  width 75%
  border-left 1px solid #808080
  margin-left 10px
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
</style>

<style lang="stylus" scoped>
.added-contents-wrapper {
  margin-bottom: 16px;
  padding: 8px;
  border-top: 2px dashed #C0CCDA;
  border-bottom: 2px dashed #C0CCDA;
  white-space: nowrap;
  overflow: auto;

  .added-contents-list {
    display: inline-block;
  }

  >>> .el-card {
    position: relative;
    display: inline-block;
    width: 190px;
    height: 120px;
    margin-right: 5px;
    text-align: center;
    cursor: pointer;

    .remove-handle {
      position: absolute;
      top: 0;
      right: 0;
      padding: 4px;
      color: #FF4949;
      font-weight: bolder;
    }

    .audit-handle {
      position: absolute;
      top: 0;
      right: 0;
      padding: 4px;
    }

    img {
      height: 120px;
    }
  }
}
</style>