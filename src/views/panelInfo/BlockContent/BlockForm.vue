<template>
  <div v-if="false && mode === 'read'"></div>
  <div v-else>
    <el-form
      class="block-content-form"
      v-if="contentForm"
      :model="contentForm"
      :rules="contentRule"
      ref="contentForm"
      label-width="120px"
    >
      <template v-if="contentType === 'specific'">
        <el-form-item label="内容类别" prop="resourceType">
          <el-radio-group v-model="contentForm.resourceType" :disabled="isReadonly">
            <el-radio :label="0">内容</el-radio>
            <el-radio :label="1">活动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联定向人群" prop="dmpRegistryInfo">
          <el-button type="primary" @click="handleSelectCrowdStart" :disabled="isReadonly">添加人群</el-button>
          <el-tag
            type="primary"
            v-if="contentForm.dmpRegistryInfo"
          >已选择: {{ contentForm.dmpRegistryInfo.dmpPolicyName}} / {{ contentForm.dmpRegistryInfo.dmpCrowdName}}</el-tag>
        </el-form-item>
      </template>
      <el-form-item v-if="isSpecific" label="资源类别" prop="coverType">
        <CommonSelector
          :disabled="isReadonly"
          type="radio"
          :value="contentForm.coverType"
          @input="$emit('cover-type-change', $event)"
          :options="coverTypeEnums"
        />
      </el-form-item>

      <el-form-item label="内容资源" prop="extraValue1" v-if="contentForm.coverType === 'media'">
        <ResourceSelector
          ref="resourceSelector"
          v-if="!isReadonly"
          :is-live="false"
          :disable-partner="!!source"
          :selectors="['video', 'edu', 'pptv', 'live', 'topic', 'rotate']"
          selection-type="single"
          :source="source"
          @select-end="handleSelectMediaEnd"
        >
          <el-button>选择资源</el-button>
        </ResourceSelector>
        <el-tag type="primary" v-if="contentForm.extraValue1">已选择: {{ contentForm.extraValue1 }}</el-tag>
        <el-button v-show="!isReadonly && contentForm.extraValue1" plain type="primary" @click="handleAddTagStart">打标签</el-button>
      </el-form-item>
      <el-form-item label="内容资源" prop="extraValue1" v-if="contentForm.coverType === 'app'">
        <ResourceSelector
          ref="resourceSelector"
          v-if="!isReadonly"
          :is-live="false"
          :selectors="['app']"
          :disable-partner="!!source"
          selection-type="single"
          :source="source"
          @select-end="handleSelectAppEnd"
        >
          <el-button>选择资源</el-button>
        </ResourceSelector>
        <el-tag type="primary" v-if="contentForm.extraValue1">已选择: {{ contentForm.extraValue1 }}</el-tag>
      </el-form-item>

      <el-form-item label="内容资源" prop="extraValue1" v-if="contentForm.coverType === 'mall'">
        <ResourceSelector
          ref="resourceSelector"
          v-if="!isReadonly"
          :is-live="false"
          :selectors="['good']"
          selection-type="single"
          :auto-fetch-selectors="['good']"
          @select-end="handleSelectGoodEnd"
        >
          <el-button>选择商品</el-button>
        </ResourceSelector>
        <el-tag type="primary" v-if="contentForm.extraValue1">已选择: {{ contentForm.extraValue1 }}</el-tag>
      </el-form-item>

      <template v-if="contentType === 'specfic'">
        <el-form-item label="内容类型" v-if="contentForm.coverType === 'custom'">
          <el-select v-model="contentForm.blockResourceType" :disabled="isReadonly">
            <el-option label="影视" :value="1"></el-option>
            <el-option label="应用" :value="0"></el-option>
            <el-option label="其他" :value="-1"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <el-form-item label="标题" prop="title">
        <el-input v-model.trim="contentForm.title" :disabled="isReadonly"></el-input>
        <el-checkbox
          v-if="!hideTitleOptions"
          :value="!contentForm.showTitle"
          :disabled="isReadonly"
          @input="contentForm.showTitle = $event ? 0 : 1"
        >关闭标题栏，仅图片运营</el-checkbox>
      </el-form-item>
      <el-form-item label="副标题" prop="subTitle" v-if="contentForm.coverType !== 'block'">
        <el-input v-model.trim="contentForm.subTitle" :disabled="isReadonly"></el-input>
        <el-checkbox
          :value="!contentForm.showSubTitle"
          :disabled="isReadonly"
          @input="contentForm.showSubTitle = $event ? 0 : 1"
        >落焦不显示副标题</el-checkbox>
      </el-form-item>
      <el-form-item label="单集副标题" prop="singleSubTitle">
        <el-input v-model.trim="contentForm.singleSubTitle" :disabled="isReadonly"></el-input>有单集副标题时，优先显示单集副标题
      </el-form-item>

      <el-form-item label="内容海报" prop="pictureUrl" v-if="contentForm.coverType !== 'block'">
        <GlobalPictureSelector
          :disabled="isReadonly"
          :picture-resolution="resolution[0] + '*' + resolution[1]"
          :picture-preset="contentForm.picturePreset"
          @select-end="handleSelectPostEnd"
        >
          <div
            class="post-box corner-box"
            :style="{
              height: postSize.height + 'px',
              width: postSize.width + 'px',
              cursor: 'pointer'
            }"
          >
            <img :src="contentForm.pictureUrl" referrerpolicy="no-referrer">
            <div class="post-info">
              <div class="post-episode" v-if="[1, 4, 5].indexOf(contentForm.categoryId) > -1">
                <span v-if="contentForm.showSeries"  class="episode">
                  <template v-if="contentForm.categoryId === 1">
                    {{
                    contentForm.publishStatus === 'ended'
                    ? contentForm.series
                    ? contentForm.series + '集全'
                    : '暂无'
                    : contentForm.series
                    ? '已更新至' + contentForm.series + '集'
                    : '暂无'
                    }}
                  </template>
                  <template v-else-if="contentForm.categoryId === 5">
                    {{
                    contentForm.publishStatus === 'ended'
                    ? ''
                    : contentForm.variety
                    ? contentForm.variety
                    : '暂无'
                    }}
                  </template>
                </span>
                <span v-if="contentForm.showScore"  class="score">{{ contentForm.score ? contentForm.score + '分' : ''}}</span>
              </div>
              <div
                v-show="contentForm.showTitle"
                class="post-title"
                :title="contentForm.title"
              >{{ contentForm.title }}</div>
              <div
                v-show="contentForm.showTitle && contentForm.showSubTitle"
                class="post-sub-title"
                :title="contentForm.singleSubTitle || contentForm.subTitle"
              >{{ contentForm.singleSubTitle || contentForm.subTitle }}</div>
            </div>
            <template>
              <span
                v-for="(corner, cIndex) in contentForm.cornerList"
                :class="['corner', 'corner-' + cIndex]"
                :key="cIndex"
                @click.stop="void(0)"
              >
                <CornerSelector
                  :disabled="isReadonly"
                  :position="cIndex"
                  @select-end="handleSelectCornerIconEnd($event, cIndex)"
                >
                  <span class="corner-img-wrapper" v-if="corner.imgUrl">
                    <img :src="corner.imgUrl" referrerpolicy="no-referrer">
                    <i
                      v-show="!isReadonly"
                      title="删除角标"
                      class="el-icon-circle-close"
                      @click.stop="handleRemoveCornerIcon(cIndex)"
                    ></i>
                  </span>
                  <div class="corner-add-icon-wrapper" v-else>
                    <i class="el-icon-plus"></i>
                  </div>
                </CornerSelector>
              </span>
            </template>
          </div>
        </GlobalPictureSelector>
        <div>
          <el-checkbox
            :value="!contentForm.showSeries"
            :disabled="isReadonly"
            @input="contentForm.showSeries = $event ? 0 : 1">
            不展示期数
          </el-checkbox>
          <el-checkbox
            :value="!contentForm.showScore"
            :disabled="isReadonly"
            @input="contentForm.showScore = $event ? 0 : 1">
            不展示评分
          </el-checkbox>
        </div>
      </el-form-item>

      <el-form-item label="替补海报" v-if="shouldHaveBackupPicture" prop="alternativePictureUrl">
        <GlobalPictureSelector
          :picture-resolution="resolution[0] + '*' + resolution[1]"
          @select-end="handleSelectBackupPostEnd"
        >
          <div
            class="post-box"
            :style="{ height: postSize.height + 'px', width: postSize.width + 'px', cursor: 'pointer' }"
          >
            <img :src="contentForm.alternativePictureUrl" referrerpolicy="no-referrer">
          </div>
        </GlobalPictureSelector>
      </el-form-item>

      <template v-if="contentForm.coverType === 'media'">
        <el-form-item label="背景视频" prop="bgParams.id">
          <ResourceSelector
            ref="resourceSelector"
            v-if="!isReadonly"
            :is-live="false"
            :disable-partner="!!source"
            :selectors="['video', 'edu', 'pptv', 'live', 'topic', 'rotate']"
            selection-type="single"
            :source="source"
            @select-end="handleSelectBgMediaEnd"
          >
            <el-button>选择资源</el-button>
          </ResourceSelector>
          <el-tag type="primary" :closable="!isReadonly" @close="handleRemoveBgMedia" v-if="contentForm.bgParams && contentForm.bgParams.id">
            已选择: {{ contentForm.bgParams.id }} {{ contentForm.bgParams.title ? ('(' + contentForm.bgParams.title + ')') : ''}}
          </el-tag>
        </el-form-item>

        <el-form-item label="背景图" prop="bgImgUrl">
          <GlobalPictureSelector
            :disabled="isReadonly"
            @select-end="handleSelectBgEnd">
            <div v-if="contentForm.bgImgUrl"  class="bg-img-wrapper">
              <img
                class="bg-img"
                :src="contentForm.bgImgUrl"
                referrerpolicy="no-referrer">
              <i
                  v-show="!isReadonly && contentForm.bgImgUrl"
                  title="删除背景"
                  class="el-icon-close"
                  @click.stop="contentForm.bgImgUrl = ''"></i>
            </div>
            <div v-else class="bg-placeholder"></div>
          </GlobalPictureSelector>
        </el-form-item>
      </template>

      <el-form-item label="推荐位" prop="vContentId" v-if="contentForm.coverType === 'block'">
        <ResourceSelector
          v-if="!isReadonly"
          ref="blockSelector"
          :is-live="false"
          :selectors="['func', 'broadcast']"
          selection-type="single"
          :source="source"
          @select-end="handleSelectBlockEnd"
        >
          <el-button>选择推荐位</el-button>
        </ResourceSelector>
        <el-tag type="primary" v-if="contentForm.vContentId">已选择: {{ contentForm.vContentId }}</el-tag>
      </el-form-item>
      <el-form-item
        label="价格"
        prop="price"
        v-if="isMall && (['custom', 'media', 'app'].indexOf(contentForm.coverType) > -1)"
      >
        <Price
          v-model.trim="contentForm.price"
          min="0"
          style="margin-right: 10px"
          :disabled="isReadonly"
        ></Price>(元)
      </el-form-item>
      <el-form-item
        label="秒杀价"
        prop="secKillPrice"
        v-if="isMall && (['custom', 'media', 'app'].indexOf(contentForm.coverType) > -1)"
      >
        <Price
          v-model.trim="contentForm.secKillPrice"
          min="0"
          style="margin-right: 10px"
          :disabled="isReadonly"
        ></Price>(元)
      </el-form-item>
      <template v-if="contentForm.coverType === 'custom'">
        <el-form-item label="打开方式">
          <el-select
            v-model="contentForm.redundantParams.openMode"
            @change="handleOpenModeChange"
            :disabled="isReadonly"
          >
            <el-option label="网页" value="webpage"></el-option>
            <el-option label="视频" value="video"></el-option>
            <el-option label="图片" value="picture"></el-option>
            <el-option label="版面" value="tab"></el-option>
            <el-option label="第三方应用" value="app"></el-option>
          </el-select>
          <ClickEventSelector
            v-if="!isReadonly"
            v-show="contentForm.redundantParams.openMode === 'app'"
            @select-end="handleSelectClickEventEnd">
            <el-button type="primary">快速填充</el-button>
          </ClickEventSelector>
        </el-form-item>
        <template v-if="contentForm.redundantParams.openMode === 'webpage'">
          <el-form-item label="网页类型" prop="webpageType">
            <el-radio-group
              v-model="contentForm.redundantParams.webpageType"
              @change="handleWebPageTypeChange"
              :disabled="isReadonly"
            >
              <el-radio label="1">浮窗网页</el-radio>
              <el-radio label="2">全屏网页</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item key="webpageUrl" label="网页地址" prop="redundantParams.webpageUrl" :rules="contentRule.webpageUrl">
            <el-input v-model.trim="contentForm.redundantParams.webpageUrl" :disabled="isReadonly"></el-input>
          </el-form-item>
          <el-form-item key="webpage-versioncode" label="应用版本号" prop="redundantParams.versioncode" :rules="[{required: true, message: '请输入版本号', trigger: 'blur'}]">
            <el-input
              v-model.trim="contentForm.redundantParams.versioncode"
              :disabled="isReadonly"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="contentForm.redundantParams.openMode === 'video'">
          <el-form-item key="videoName" label="视频名称" prop="redundantParams.videoName" :rules="contentRule.videoName">
            <el-input v-model.trim="contentForm.redundantParams.videoName" :disabled="isReadonly"></el-input>
          </el-form-item>
          <el-form-item key="videoUrl" label="视频地址" prop="redundantParams.videoUrl" :rules="contentRule.videoUrl">
            <el-input v-model.trim="contentForm.redundantParams.videoUrl" :disabled="isReadonly"></el-input>
          </el-form-item>
        </template>

        <template v-if="contentForm.redundantParams.openMode === 'picture'">
          <el-form-item key="pictureUrl" label="选择图片" prop="redundantParams.pictureUrl" :rules="contentRule.pictureUrl">
            <Upload
              :multiple="false"
              accept="image/jpg,image/jpeg,image/png,image/bmp,image/gif"
              ref="upload"
              @upload="handleUpload">
              <div class="upload-pic-list" slot="preview" slot-scope="{fileList}">
                <div
                  v-show="!isReadonly && fileList.length === 0"
                  class="upload-pic-list__add"
                  @click="!isReadonly && $refs.upload.handleSelectFile()">
                </div>
                <div
                  v-if="fileList.length > 0"
                  class="upload-pic-list__item"
                  @click="!isReadonly && $refs.upload.handleSelectFile()">
                  <div
                    class="upload-pic-list__error"
                    v-if="fileList[0].status === 'error'">
                    上传失败: {{ fileList[0].message }}
                  </div>
                  <div v-if="fileList[0].status === 'uploading'" class="upload-pic-list__progress">
                    <el-progress :width="100" type="circle" :percentage="fileList[0].percentage"></el-progress>
                  </div>
                  <img v-else :src="fileList[0].dataUrl">
                  <i
                    v-if="fileList[0].status !== 'uploading' && !isReadonly"
                    class="upload-pic-list__remove el-icon el-icon-close"
                    title="移除"
                    @click.stop="handleRemovePicture(fileList[0])"/>
                </div>
              </div>
            </Upload>
            <span>提示:只能上传png/gif/jpg/bmp文件</span>
          </el-form-item>
        </template>

        <template v-if="contentForm.redundantParams.openMode === 'tab'">
          <el-form-item key="tabId" label="版面" prop="redundantParams.tabId" :rules="contentRule.tabId">
            <TabSelector
              :disabled="isReadonly"
              title="选择版面"
              selection-type="single"
              :source="source"
              :selected-close="true"
              @select-single="handleSelectTabEnd"/>
            <el-tag type="primary" v-if="contentForm.redundantParams.tabId">
              已选择: {{
              contentForm.redundantParams.tabId }}
            </el-tag>
          </el-form-item>
        </template>

        <template v-if="contentForm.redundantParams.openMode === 'app'">
          <AppParamsForm
            v-if="!isReadonly"
            key="app"
            v-model="contentForm.redundantParams"
            label-width="140px"
            prop-prefix="redundantParams."
          />
          <AppParamsRead v-else :value="contentForm.redundantParams" />
        </template>
      </template>
      <!-- Sprint2.10 儿童模式 需求，这个字段非精细化情况下放外面了 -->
      <el-form-item label="应用版本号" prop="versionCode" v-if="isSpecific && contentForm.coverType === 'media'">
        <el-input v-model.trim="contentForm.versionCode" :disabled="isReadonly"></el-input>
      </el-form-item>
      <!-- 儿童模式这个字段放外层了
      <template v-if="contentType === 'normal'">
        <el-form-item
          label="设置广告位"
          v-if="data.pannelParentType !== 'group' && data.blockInfo.type !== 'Mall' && (contentForm.coverType === 'media' || contentForm.coverType === 'app' || contentForm.coverType === 'custom')"
          prop="flagIsSetad"
        >
          <el-radio-group v-model="contentForm.flagIsSetad" :disabled="isReadonly">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      -->
    </el-form>
    <CrowdSelector
      v-if="showCrowdSelector"
      @select-cancel="handleSelectCrowdCancel"
      @select-end="handleSelectCrowdEnd"
    />
    <TagFrame
      v-if="showBlockTagDialog"
      :ids="[currentResourceId]"
      @close="showBlockTagDialog = false">
    </TagFrame>
  </div>
</template>

<script>
import { Upload } from 'admin-toolkit'
import Price from '@/components/Price'
import AppParamsForm from './AppParamsForm'
import AppParamsRead from './AppParamsRead'
import CornerSelector from '@/components/selectors/CornerIconSelector'
import GlobalPictureSelector from '@/components/selectors/GlobalPictureSelector'
import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
import CommonSelector from '@/components/CommonSelector'
import CrowdSelector from '@/components/CrowdSelector.vue'
import TabSelector from '@/components/selectors/TabSelector'
import ClickEventSelector from '@/components/selectors/ClickEventSelector'
import TagFrame from '../TagFrame'
import { getSelectedResource, chopSubTitle, setMediaContent, setAppContent, setGoodContent } from '../panelInfoUtil'
export default {
  components: {
    Upload,
    Price,
    AppParamsForm,
    CornerSelector,
    GlobalPictureSelector,
    ResourceSelector,
    CommonSelector,
    CrowdSelector,
    TabSelector,
    ClickEventSelector,
    AppParamsRead,
    TagFrame
  },
  data() {
    const isReadonly = this.isReadonly
    const checkMannulVersionCode = (rule, value, callback) => {
      // 当为教育资源时 保证所填值为空或大于7位
      if (
        this.contentForm.contentType === 3 &&
        (value.length > 0 && value.length < 7)
      ) {
        callback(new Error('教育版本号需为7位以上'))
      } else {
        callback()
      }
    }
    const checkWebpageUrl = function(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入网页地址'))
      } else if (
        value.indexOf('https') === -1 &&
        value.indexOf('http') === -1
      ) {
        callback(new Error('请输入https或http地址'))
      } else {
        callback()
      }
    }
    const checkAttributeInfo = function(rule, value, callback) {
      if (
        _this.contentFormType === 'specific' &&
        !_this.contentForm.attributeInfo &&
        !_this.isReadonly
      ) {
        callback(new Error('请选择人群'))
      } else {
        callback()
      }
    }
    const re = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
    const checkPrice = function(rule, value, callback) {
      if (!re.test(value)) {
        value === 0 && value !== ''
          ? callback()
          : callback(new Error('请输入合法的价格'))
      } else if (value.toString().indexOf('.') !== -1) {
        callback(new Error('只允许输入小数点后两位'))
      } else {
        callback()
      }
    }

    const checkSecKill = function(rule, value, callback) {
      var re = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
      // if (!re.test(value)) {
      //     callback(new Error('请输入数字'));
      // }

      if (!re.test(value)) {
        value === '' ? callback() : callback(new Error('请输入合法的价格'))
      } else if (value.toString().indexOf('.') !== -1) {
        callback(new Error('只允许输入小数点后两位'))
      } else {
        callback()
      }
    }
    return {
      showCrowdSelector: false,
      showBlockTagDialog: false,
      uploadImg: '/uploadHomeImg.html', // 上传图片接口
      contentRule: {
        bgImgUrl: [
          {
            validator: (_, val, cb) => {
              const bgParams = this.contentForm.bgParams
              if (bgParams && bgParams.id && !val) {
                cb(new Error('选择背景视频之后必须选择背景图'))
              } else {
                cb()
              }
            }
          }
        ],
        webpageUrl: [
          { required: true, validator: checkWebpageUrl, trigger: 'blur' }
        ],
        videoName: [
          { required: true, message: '请输入视频名称', trigger: 'blur' }
        ],
        videoUrl: [
          { required: true, message: '请输入视频地址', trigger: 'blur' }
        ],
        tabId: [
          { required: true, message: '请选择版面', trigger: 'blur' }
        ],
        moviePercent: [
          {
            type: 'number',
            required: true,
            message: '请输入进度',
            trigger: 'blur'
          }
        ],
        extraValue1: [
          { required: true, message: '请选择资源', trigger: 'blur' }
        ],
        title: [
          {
            validator: function(_, value, cb) {
              if (this.contentForm.showTitle && value.trim() === '') {
                cb(new Error('请输入标题'))
              } else {
                cb()
              }
            }.bind(this)
          },
          { max: 45, message: '不超过 45 个字符', trigger: 'blur' }
        ],
        subTitle: [{ max: 45, message: '不超过 45 个字符', trigger: 'blur' }],
        pictureUrl: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        alternativePictureUrl: [
          { required: true, message: '请选择替补海报', trigger: 'blur' },
          {
            validator: function(_, pictureUrl, cb) {
              if (pictureUrl && pictureUrl.slice(-4).toLowerCase() === 'webp') {
                cb(new Error('替补海报不能选择动图'))
              } else {
                cb()
              }
            }
          }
        ],
        vContentId: [
          {
            type: 'number',
            required: true,
            message: '请选择功能',
            trigger: 'blur'
          }
        ],
        attributeInfo: [{ validator: checkAttributeInfo, trigger: 'blur' }],
        versionCode: [{ validator: checkMannulVersionCode, trigger: 'blur' }],
        price: [{ required: true, validator: checkPrice, trigger: 'blur' }],
        secKillPrice: [
          { required: false, validator: checkSecKill, trigger: 'blur' }
        ],
        dmpRegistryInfo: [{ required: !isReadonly, message: '请选择定向人群' }]
      }
    }
  },
  props: [
    'contentType',
    'mode',
    'contentForm',
    'data',
    'source',
    'pannel',
    'hideTitleOptions',
    'checkCrowd'
  ],
  computed: {
    isSpecific() {
      return this.contentType === 'specific'
    },
    currentResourceId() {
      return this.contentForm.extraValue1
    },
    isReadonly() {
      return this.mode === 'read'
    },
    resolution() {
      const data = this.data
      return [data.blockInfo.width, data.blockInfo.height]
    },
    postSize() {
      const blockInfo = this.data.blockInfo || {}
      const width = blockInfo.width || 200
      const height = blockInfo.height || 200
      const maxWidth = 800
      const maxHeight = 600
      let ratio = 1
      if (width < height) {
        let finalHeight = (height * 200) / width
        if (finalHeight > maxHeight) {
          ratio = maxHeight / finalHeight
        }
        return {
          height: finalHeight * ratio,
          width: 200 * ratio
        }
      } else {
        let finalWidth = (width * 200) / height
        if (finalWidth > maxWidth) {
          ratio = maxWidth / finalWidth
        }
        return {
          height: 200 * ratio,
          width: finalWidth * ratio
        }
      }
    },
    isMall() {
      return this.data.blockInfo.type === 'Mall'
    },
    shouldHaveBackupPicture() {
      const contentForm = this.contentForm
      const pictureUrl = contentForm.pictureUrl
      return (
        contentForm.coverType !== 'block' && !this.isNormalPicture(pictureUrl)
      )
    },
    coverTypeEnums() {
      const enums = [
        {
          label: '媒体资源',
          value: 'media'
        },
        {
          label: '应用圈',
          value: 'app'
        },
        {
          label: '自定义',
          value: 'custom'
        },
        {
          label: '商品',
          value: 'mall'
        },
        {
          label: '推荐位管理',
          value: 'block',
          disabled: this.isMall
        }
      ]

      if (this.contentType === 'specific') {
        return enums.filter(
          item => item.value !== 'block'
        )
      }

      return enums
    }
  },
  methods: {
    handleAddTagStart() {
      this.showBlockTagDialog = true
    },
    genParams(openMode) {
      return {
        openMode: openMode || 'app',
        webpageUrl: '',
        webpageType: '2',
        videoName: '',
        videoUrl: '',
        pictureUrl: '',
        tabId: '',
        packagename: '',
        versioncode: openMode === 'webpage' ? '102007' : '-1',
        dowhat: 'startActivity',
        bywhat: 'action',
        byvalue: '',
        data: undefined,
        params: [{ key: '', value: '' }]
      }
    },
    handleUpload(file, fileItem) {
      this.$refs.upload.fileList = [fileItem]
      fileItem.status = 'uploading'
      this.$service
        .uploadImage({
          file,
          onUploadProgerss: evt => {
            if (evt.lengthComputable) {
              fileItem.percentage = evt.loaded / evt.total
            }
          }
        })
        .then(data => {
          if (data.success) {
            const img = data.data[0]
            fileItem.pictureName = img.fileName
            fileItem.pictureType = img.fileType
            fileItem.pictureUrl = img.url
            fileItem.status = 'success'
            this.contentForm.redundantParams.pictureUrl = img.url
          } else {
            fileItem.status = 'error'
            fileItem.message = data.msg
          }
        })
        .catch(() => {
          fileItem.status = 'error'
          fileItem.message = '网络错误'
        })
    },
    handleRemovePicture(fileItem) {
      this.$refs.upload.handleRemove(fileItem)
      this.contentForm.redundantParams.pictureUrl = ''
    },
    handleSelectTabEnd(result) {
      const selected = result
      if (selected) {
        this.$set(this.contentForm.redundantParams, 'tabId', selected.tabId + '')
        this.$set(this.contentForm.redundantParams, 'tabType', selected.tabType + '')
      }
    },
    handleSelectCrowdStart() {
      this.showCrowdSelector = true
    },
    handleSelectCrowdCancel() {
      this.showCrowdSelector = false
    },
    handleSelectCrowdEnd(policy, crowd) {
      const existsIndex = this.checkCrowd(crowd)
      if (existsIndex !== undefined) {
        this.$message({
          type: 'error',
          message: '第' + (existsIndex + 1) + '个精细化内容已关联该人群'
        })
      } else {
        this.$set(this.contentForm, 'dmpRegistryInfo', {
          dmpPolicyId: policy.value,
          dmpCrowdId: crowd.value,
          dmpPolicyName: policy.label,
          dmpCrowdName: crowd.label
        })
        this.showCrowdSelector = false
      }
    },
    handleOpenModeChange(val) {
      this.contentForm.redundantParams = this.genParams(val)
    },
    handleWebPageTypeChange(val) {
      this.contentForm.redundantParams.versioncode =
        val == '1' ? '1' : '102007'
    },
    handleSelectMediaEnd(resources) {
      const selectedResult = getSelectedResource(resources)
      const partner = selectedResult.partner
      const selectedType = selectedResult.selectedType
      const selected = selectedResult.selected[0]
      const selectedEpisode = selectedResult.selectedEpisode[selected.coocaaVId]
      const blockSize = this.resolution
      setMediaContent(this.contentForm, {partner, selectedType, selected, selectedEpisode, blockSize})
      this.$refs.resourceSelector.clearSelected()
    },
    handleSelectAppEnd(resources) {
      setAppContent(this.contentForm, resources.app[0])
    },
    handleSelectGoodEnd(resources) {
      setGoodContent(this.contentForm, resources.good[0])
    },
    handleSelectClickEventEnd(data) {
      const clickEvent = data[0]
      const { packagename, versioncode, dowhat, bywhat, byvalue, params: paramsStr, exception } = clickEvent
      const contentForm = this.contentForm
      let params = []
      if (paramsStr) {
        const paramsObj = JSON.parse(paramsStr)
        params = Object.keys(paramsObj).map((key) => {
          return {
            key,
            value: paramsObj[key]
          }
        })
      }
      if (params.length === 0) {
        params.push({ key: undefined, value: undefined })
      }
      contentForm.redundantParams = Object.assign({}, contentForm.redundantParams, {
        packagename,
        versioncode,
        dowhat,
        bywhat,
        byvalue,
        params,
        exception
      })
    },
    isNormalPicture(pictureUrl) {
      return !pictureUrl || pictureUrl.slice(-4).toLowerCase() !== 'webp'
    },
    handleSelectCornerIconEnd(icon, position) {
      const cornerIcon = {
        cornerIconId: icon.cornerIconId,
        position: position,
        imgUrl: icon.imgUrl
      }
      this.$set(this.contentForm.cornerList, position, cornerIcon)
    },
    handleRemoveCornerIcon(position) {
      this.$set(this.contentForm.cornerList, position, {})
    },
    handleSelectPostEnd(post) {
      this.contentForm.pictureUrl = post.pictureUrl
    },
    handleSelectBackupPostEnd(post) {
      this.contentForm.alternativePictureUrl = post.pictureUrl
    },
    handleSelectBgEnd(post) {
      this.contentForm.bgImgUrl = post.pictureUrl
    },
    handleSelectBgMediaEnd(resources) {
      const selectedResult = getSelectedResource(resources)
      const partner = selectedResult.partner
      const selectedType = selectedResult.selectedType
      const selected = selectedResult.selected[0]
      const selectedEpisode = selectedResult.selectedEpisode[selected.coocaaVId]

      const contentForm = this.contentForm
      let mediaId
      let mediaTitle
      let episodeId
      if (selectedType === 'video') {
        // 影视中心
        if (selectedEpisode) {
          if (partner === 'tencent') {
            mediaId = '_otx_' + selected.coocaaVId
            episodeId = selectedEpisode.coocaaMId
          } else if (partner === 'yinhe') {
            mediaId = '_oqy_' + selected.coocaaVId
            episodeId = selectedEpisode.coocaaMId
          } else if (partner === 'youku') {
            mediaId = '_oyk_' + selected.coocaaVId
            episodeId = selectedEpisode.coocaaMId
          }
        } else {
          if (partner === 'tencent') {
            mediaId = '_otx_' + selected.coocaaVId
          } else if (partner === 'yinhe') {
            mediaId = '_oqy_' + selected.coocaaVId
          } else if (partner === 'youku') {
            mediaId = '_oyk_' + selected.coocaaVId
          }
        }
      } else if (selectedType === 'edu') {
        // 教育中心
        mediaId = '_otx_' + selected.coocaaVId
      } else if (selectedType === 'pptv') {
        // pptv
        mediaId =
          'pptv_tvsports://tvsports_detail?section_id=' +
          selected.pid +
          '&from_internal=1'
      } else if (selectedType === 'live') {
        // 直播资源
        mediaId = '_otx_' + selected.vId + ''
      } else if (selectedType === 'topic') {
        // 专题资源
        mediaId = selected.id + ''
      } else if (selectedType === 'rotate') {
        // 轮播资源
        mediaId = selected.id + ''
      }

      mediaTitle = selectedEpisode ? selectedEpisode.urlTitle : selected.title
      contentForm.bgParams = {
        id: mediaId,
        title: mediaTitle
      }
      contentForm.bgType = 'res'
    },
    handleRemoveBgMedia() {
      const contentForm = this.contentForm
      contentForm.bgParams = {
        id: ''
      }
      contentForm.bgType = ''
    },
    handleSelectBlockEnd(resources) {
      const selectedFunc = resources.func[0]
      const selectedBroadcast = resources.broadcast[0]
      if (selectedFunc) {
        const selected = selectedFunc
        this.contentForm.videoContentType = 'sysPlugin'
        this.contentForm.title = selected.pluginName
        this.contentForm.vContentId = selected.pluginId
        this.contentForm.pictureUrl = selected.globalPicture
          ? selected.globalPicture.pictureUrl
          : ''
        // if (selected.referenceData) {
        //     this.contentForm.price = selected.referenceData.price / 100;
        //     this.contentForm.secKillPrice =
        //             selected.referenceData.secKillPrice / 100;
        // }
      }
      if (selectedBroadcast) {
        const selected = selectedBroadcast
        this.contentForm.videoContentType = 'specific'
        this.contentForm.title = selected.containerName
        this.contentForm.vContentId = selected.id
        this.contentForm.pictureUrl = selected.poster.pictureUrl
      }
      this.$refs.blockSelector.clearSelected()
    },
    validate(data, cb) {
      const contentForm = this.contentForm
      this.$refs.contentForm.validate((valid) => {
        if (valid) {
          if (contentForm.coverType === 'custom') {
            if (contentForm.price < contentForm.secKillPrice) {
              return cb('价格小于秒杀价，建议重新填写！')
            }
          }
          cb()
        } else {
          cb('请把表单填写完整')
        }
      })
    }
  },
  mounted() {
    const redundantParams = this.contentForm.redundantParams
    if (redundantParams.openMode === 'picture' && redundantParams.pictureUrl) {
      this.$refs.upload.fileList = [{
        status: 'success',
        dataUrl: redundantParams.pictureUrl
      }]
    }
  }
}
</script>

<style scoped>
.block-content-form >>> .el-input {
  max-width: 280px;
}
.post-box {
  border: 1px solid #ccc;
  overflow: hidden;
}
.post-box img {
  width: 100%;
}
.post-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 5px;
  line-height: 20px;
  font-size: 12px;
  background: #000;
  opacity: 0.8;
  color: #fff;
}
.post-info .post-title,
.post-info .post-sub-title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.post-info .episode,
.post-info .score {
  position: absolute;
  top: -20px;
  background: #000;
  padding: 0 5px;
}
.post-info .score {
  right: 0;
}
.post-info .episode {
  left: 0;
}

.corner-box {
  position: relative;
}

.corner-box span.corner {
  position: absolute;
  width: 50px;
  height: 50px;
  text-align: center;
  cursor: pointer;
}

.corner-box span.corner img {
  width: 100%;
  height: 100%;
}

.corner-box span.corner-0 {
  top: 0;
  left: 0;
}

.corner-box span.corner-1 {
  top: 0;
  right: 0;
}

.corner-box span.corner-2 {
  bottom: 0;
  right: 0;
}

.corner-box span.corner-3 {
  bottom: 0;
  left: 0;
}

.corner-add-icon-wrapper {
  height: 24px;
  padding: 0 8px;
  line-height: 22px;
  color: #12ce66;
  border: 1px solid #12ce66;
  background: #fff;
}

.corner-img-wrapper {
  position: relative;
}

.corner-img-wrapper i {
  position: absolute;
  top: 0;
  right: 0;
  color: #ff4949;
  font-size: 20px;
}
</style>

<style lang="stylus" scoped>
$height = 100px;
$width = 100px;

.upload-pic-list__progress {
  position: absolute;
}

.upload-pic-list__add, .upload-pic-list__item {
  height: $height;
  width: $width;
  margin-right: 10px;
  display: inline-block;
  vertical-align: top;
  border: 1px solid #ccc;
}

.upload-pic-list__add {
  cursor: pointer;

  i {
    position: relative;
    top: 50%;
    margin: -10px auto;
    display: block;
    font-size: 20px;
    text-align: center;
  }
}

.upload-pic-list__item {
  position: relative;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}

.upload-pic-list__error {
  position: absolute;
  background: #000;
  opacity: 0.7;
  color: #fff;
  width: 100%;
  font-size: 12px;
  padding: 5px;
  display: block;
  box-sizing: border-box;
}

.upload-pic-list__remove {
  position: absolute;
  color: red;
  cursor: pointer;
  top: 0;
  right: 0;
}
</style>
<style lang="stylus">
.bg-placeholder
  position relative
  border 1px solid #ccc
  width 250px
  height 250px
  cursor pointer
.bg-img
  width 100%
.bg-img-wrapper
  position relative
  width 300px
  i
    color red
    cursor pointer
    position absolute
    top 0px
    right -12px
</style>
