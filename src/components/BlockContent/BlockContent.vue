<template>
  <ContentCard :title="title" @go-back="$emit('cancel')">
    <div v-if="mode === 'read'"></div>
    <div v-else>
      <BlockContentWrapper :activeIndex="activeIndex">
        <div slot="content">
          <el-form
            class="block-content-form"
            v-if="contentForm"
            :model="contentForm"
            :rules="contentRule"
            ref="contentForm"
            label-width="120px"
          >
            <el-form-item label="资源类别" prop="coverType">
              <el-radio-group v-model="contentForm.coverType" @change="handleCoverTypeChange">
                <el-radio label="media">媒体资源</el-radio>
                <el-radio label="app">应用圈</el-radio>
                <el-radio label="custom">自定义</el-radio>
                <el-radio
                  v-if="contentList.length === 1"
                  label="block"
                  :disabled="isMall"
                >推荐位管理</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="内容资源" prop="extraValue1" v-if="contentForm.coverType === 'media'">
              <el-button type="primary" @click="openWin('resource')" :disabled="isReadonly">选择资源</el-button>
              <el-tag type="primary" v-if="contentForm.extraValue1">
                已选择: {{ contentForm.extraValue1
                }}
              </el-tag>
            </el-form-item>
            <el-form-item label="内容资源" prop="extraValue1" v-if="contentForm.coverType === 'app'">
              <el-button type="primary" @click="openWin('app')" :disabled="isReadonly">选择资源</el-button>
              <el-tag type="primary" v-if="contentForm.extraValue1">
                已选择: {{ contentForm.extraValue1
                }}
              </el-tag>
            </el-form-item>

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
                :picture-resolution="resolution[0] + '*' + resolution[1]"
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
                      <span class="episode">
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
                      <span class="score">{{ contentForm.score ? contentForm.score + '分' : ''}}</span>
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
            </el-form-item>

            <el-form-item
              v-if="shouldHaveBackupPicture"
              label="替补海报"
              prop="alternativePictureUrl"
            >
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

            <el-form-item label="应用版本号" prop="versionCode" v-if="contentForm.coverType === 'media'">
              <el-input v-model.trim="contentForm.versionCode" :disabled="isReadonly"></el-input>
            </el-form-item>
            <el-form-item label="推荐位" prop="vContentId" v-if="contentForm.coverType === 'block'">
              <el-button type="primary" @click="openWin('recommend')" :disabled="isReadonly">选择推荐位</el-button>
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
            <el-form-item
              v-if="data.pannelParentType !== 'group' && data.blockInfo.type !== 'Mall' && (contentForm.coverType === 'media' || contentForm.coverType === 'app' || contentForm.coverType === 'custom')"
              label="设置广告位"
              prop="flagIsSetad"
            >
              <el-radio-group v-model="contentForm.flagIsSetad" :disabled="isReadonly">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>

            <template v-if="contentForm.coverType === 'custom'">
              <el-form-item label="打开方式">
                <el-select
                  v-model="contentForm.redundantParams.openMode"
                  @change="openChange($event)"
                  :disabled="isReadonly"
                >
                  <el-option label="网页" value="webpage"></el-option>
                  <el-option label="视频" value="video"></el-option>
                  <el-option label="图片" value="picture"></el-option>
                  <el-option label="版面" value="tab"></el-option>
                  <el-option label="第三方应用" value="app"></el-option>
                </el-select>
                <el-button
                  v-if="contentForm.redundantParams.openMode === 'app'"
                  type="primary"
                  @click="openWin('onclick')"
                  :disabled="isReadonly"
                >快速填充</el-button>
              </el-form-item>
              <template v-if="contentForm.redundantParams.openMode === 'webpage'">
                <el-form-item label="网页类型" prop="webpageType">
                  <el-radio-group v-model="webpageTypeRadio" @change="openWeb" :disabled="isReadonly">
                    <el-radio label="1">浮窗网页</el-radio>
                    <el-radio label="2">全屏网页</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="网页地址" prop="webpageUrl">
                  <el-input
                    v-model.trim="contentForm.redundantParams.webpageUrl"
                    :disabled="isReadonly"
                  ></el-input>
                </el-form-item>
                <el-form-item label="应用版本号" prop="webAppVersion">
                  <el-input
                    v-model.trim="contentForm.redundantParams.webAppVersion"
                    :disabled="isReadonly"
                  ></el-input>
                </el-form-item>
              </template>
              <template v-if="contentForm.redundantParams.openMode === 'video'">
                <el-form-item 
                  label="视频名称"
                  prop="videoName"
                >
                  <el-input v-model.trim="contentForm.redundantParams.videoName" :disabled="isReadonly"></el-input>
                </el-form-item>
                <el-form-item
                  label="视频地址"
                  prop="videoUrl"
                >
                  <el-input v-model.trim="contentForm.redundantParams.videoUrl" :disabled="isReadonly"></el-input>
                </el-form-item>
              </template>

              <template v-if="contentForm.redundantParams.openMode === 'picture'">
                <el-form-item
                  label="选择图片"
                  prop="pictureUrl">
                  <el-upload
                    :action="urls.uploadImg"
                    :on-success="handleUploadSuccess"
                    :on-remove="handleUploadRemove"
                    :file-list="pictureList"
                    accept="image/png, image/gif, image/jpeg, image/bmp"
                    list-type="picture"
                  >
                    <el-button type="primary" :disabled="isReadonly">点击上传</el-button>
                    <span slot="tip" class="el-upload__tip">提示:只能上传png/gif/jpg/bmp文件</span>
                  </el-upload>
                </el-form-item>
              </template>

              <template v-if="contentForm.redundantParams.openMode === 'tab'">
                <el-form-item
                  label="版面"
                  prop="tabId">
                  <el-button type="primary" @click="openWin('tab')" :disabled="isReadonly">选择版面</el-button>
                  <el-tag type="primary" v-if="contentForm.redundantParams.tabId">
                    已选择: {{
                    contentForm.redundantParams.tabId }}
                  </el-tag>
                </el-form-item>
              </template>

              <template v-if="contentForm.redundantParams.openMode === 'app'">
                <AppParamsForm
                  v-model="contentForm.redundantParams"
                  label-width="140px"
                  prop-prefix="redundantParams."
                />
              </template>
            </template>
          </el-form>
        </div>
      </BlockContentWrapper>
    </div>
  </ContentCard>
</template>

<script>
import Price from '@/components/Price'
import AppParamsForm from './AppParamsForm'
import BlockContentWrapper from './BlockContentWrapper'
import CornerSelector from '@/components/selectors/CornerIconSelector'
import GlobalPictureSelector from '@/components/selectors/GlobalPictureSelector'
export default {
  components: {
    Price,
    AppParamsForm,
    BlockContentWrapper,
    CornerSelector,
    GlobalPictureSelector
  },
  data() {
    const isReadonly = this.isReadonly
    const checkMannulVersionCode = function(rule, value, callback) {
      // 当为教育资源时 保证所填值为空或大于7位
      if (
        _this.contentForm.contentType === 3 &&
        (value.length > 0 && value.length < 7)
      ) {
        callback(new Error('教育版本号需为7位以上'))
      } else {
        callback()
      }
    }
    const checkWebpageUrl = function(rule, value, callback) {
      if (value === '') {
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
      activeType: 'normal',
      activeIndex: 0,
      normalContentList: [this.getDefaultContentForm()],
      specContentList: [],
      blockContents: this.data.blockInfo,
      contentRule: {
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
          { max: 50, message: '不超过 50 个字符', trigger: 'blur' }
        ],
        subTitle: [{ max: 50, message: '不超过 50 个字符', trigger: 'blur' }],
        pictureUrl: [
          { required: true, message: '请选择内容海报', trigger: 'blur' }
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
  props: ['mode', 'data', 'pannel', 'hideTitleOptions'],
  computed: {
    title() {
      if (this.mode === 'read') {
        return '推荐位内容查看'
      }
      return '推荐位内容设置'
    },
    isReadonly() {
      return this.mode === 'read'
    },
    source() {
      return this.data.pannelResource
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
    contentList() {
      return this[this.activeType + 'ContentList']
    },
    contentForm() {
      return this.contentList[this.activeIndex]
    },
    isMall() {
      return this.data.blockInfo.type === 'Mall'
    },
    shouldHaveBackupPicture() {
      const contentForm = this.contentForm
      const pictureUrl = contentForm.pictureUrl
      return contentForm.coverType !== 'block' && !this.isNormalPicture(pictureUrl)
    }
  },
  methods: {
    isNormalPicture(pictureUrl) {
      return !pictureUrl || pictureUrl.slice(-4).toLowerCase() !== 'webp'
    },
    getDefaultContentForm() {
      return {
        coverType: 'media',
        title: '',
        showTitle: 0,
        subTitle: '',
        showSubTitle: 0,
        singleSubTitle: '',
        pictureUrl: '',
        alternativePictureUrl: '',
        extraValue1: '',
        extraValue5: '',
        singleId: '',
        vContentId: '',
        resourceType: 0,
        cornerList: [{}, {}],
        blockResourceType: -1,
        moviePercent: 100,
        versionCode: '',
        price: '',
        secKillPrice: '',
        flagIsSetad: 0,
        redundantParams: {
          // openMode: 'webpage',
          openMode: 'app',
          webpageUrl: '',
          webpageType: '',
          webAppVersion: '102007',
          videoName: '',
          videoUrl: '',
          pictureUrl: '',
          tabId: '',
          packagename: '',
          versioncode: '-1',
          dowhat: 'startActivity',
          bywhat: 'action',
          byvalue: '',
          data: undefined,
          extendedParams: [{ key: '', value: '' }]
        }
      }
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
    handleCoverTypeChange(val) {

    },
    setContentList() {

    },
    parseContentList() {

    }
  },
  created() {
    this.setContentList()
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
