<template>
  <ContentCard :title="title" @go-back="$emit('cancel')">
    <el-button
      v-if="mode !== 'read'"
      style="margin-bottom: 10px"
      @click="handleSave"
      type="primary">
      保存
    </el-button>
    <el-collapse class="wrapper-collapse" v-model="activeNames">
      <el-collapse-item title="通用内容" name="normal">
        <el-form label-width="120px">
          <el-form-item label="资源类别" prop="coverType">
            <CommonSelector
              :disabled="mode === 'read'"
              type="radio"
              :value="normalContentWrapper.props.coverType"
              @input="handleInputNormalContentWrapperCoverType"
              :options="coverTypeEnums"
            />
          </el-form-item>
          <el-form-item label="内容资源">
            <el-select v-show="mode !== 'read'" v-model="normalContentWrapper.selectionType" style="margin-bottom: 10px">
              <el-option value="manual" label="手动添加"></el-option>
            </el-select>
            <template v-if="mode !== 'read'">
              <div v-if="normalContentWrapper.props.coverType === 'media'">
                <ResourceSelector
                  ref="resourceSelector"
                  :is-live="false"
                  :disable-partner="!!source"
                  :selectors="['video', 'edu', 'pptv', 'live', 'topic', 'rotate']"
                  selection-type="multiple"
                  :source="source"
                  @select-end="handleSelectMediaEnd"
                >
                  <el-button>选择资源</el-button>
                </ResourceSelector>
              </div>
              <div v-if="normalContentWrapper.props.coverType === 'app'">
                <ResourceSelector
                  ref="resourceSelector"
                  :is-live="false"
                  :selectors="['app']"
                  :disable-partner="!!source"
                  selection-type="multiple"
                  :source="source"
                  @select-end="handleSelectAppEnd"
                >
                  <el-button>选择资源</el-button>
                </ResourceSelector>
              </div>
              <div v-if="normalContentWrapper.props.coverType === 'mall'">
                <ResourceSelector
                  ref="resourceSelector"
                  :is-live="false"
                  :selectors="['good']"
                  selection-type="multiple"
                  :auto-fetch-selectors="['good']"
                  @select-end="handleSelectGoodEnd"
                >
                  <el-button>选择商品</el-button>
                </ResourceSelector>
              </div>
            </template>

            <div class="normal-content-wrapper__list">
              <div class="added-contents-wrapper" :gutter="8">
                <component :is="mode === 'read' ? 'div': 'draggable'"
                  class="added-contents-list"
                  v-model="normalContentList"
                  @start="handleDragConentStart"
                  @end="handleDragConentEnd($event, 'normal')">
                  <el-card
                    v-for="(content, index) in normalContentList" 
                    :key="index"
                    :class="{activeContent: activeType === 'normal' && index === activeIndex}"
                    :body-style="{ padding: '0px' }"
                    @click.native="handleActivate('normal', index)"
                  >
                    <i
                      v-if="mode !== 'read' && normalContentList.length > 1"
                      class="remove-handle el-icon-close"
                      @click.stop.prevent="handleRemoveContent(index, 'normal')"
                    ></i>
                    <img :src="getPictureUrl(content.pictureUrl)" referrerpolicy="no-referrer">
                  </el-card>
                </component>

                <el-card v-if="mode !== 'read'" @click.native="handleAddContent('normal')">
                  <i class="el-icon-plus">添加资源</i>
                </el-card>
              </div>
              <BlockForm
                v-if="activeType === 'normal'"
                ref="normalBlockForm"
                @click.stop
                @cover-type-change="handleCoverTypeChange"
                :mode="mode"
                :check-crowd="checkCrowd"
                content-type="normal"
                :source="source"
                :data="data"
                :pannel="pannel"
                :content-form="contentForm"
                :hide-title-options="hideTitleOptions"
              />
            </div>
          </el-form-item>
          <el-form-item label="应用版本号" prop="versionCode" v-if="normalContentWrapper.props.coverType === 'media'">
            <el-input v-model.trim="normalContentWrapper.props.versionCode" :disabled="mode === 'read'"></el-input>
          </el-form-item>
          <el-form-item
            label="设置广告位"
            v-if="data.pannelParentType !== 'group' && data.blockInfo.type !== 'Mall' && (normalContentWrapper.props.coverType === 'media' || normalContentWrapper.props.coverType === 'app' || normalContentWrapper.props.coverType === 'custom')"
            prop="flagIsSetad"
          >
            <el-radio-group v-model="normalContentWrapper.props.flagIsSetad" :disabled="mode === 'read'">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item v-show="contentForm.coverType !== 'block'" title="精细化定向内容" name="specific">
        <el-row class="added-contents-wrapper" :gutter="8">
          <component :is="mode === 'read' ? 'div': 'draggable'"
            class="added-contents-list"
            v-model="specificContentList"
            @start="handleDragConentStart"
            @end="handleDragConentEnd($event, 'specific')">
            <el-card
              v-for="(content, index) in specificContentList" 
              :key="index"
              :class="{activeContent: activeType === 'specific' && index === activeIndex}"
              :body-style="{ padding: '0px' }"
              @click.native="handleActivate('specific', index)">
              <i
                v-if="mode !== 'read'"
                class="remove-handle el-icon-close"
                @click.stop.prevent="handleRemoveContent(index, 'specific')"
              ></i>
              <img :src="getPictureUrl(content.pictureUrl)" referrerpolicy="no-referrer">
              <span class="content-id" v-if="content.vContentId"> {{ content.vContentId }} </span>
            </el-card>
          </component>
          <el-card v-if="mode !== 'read'" @click.native="handleAddContent('specific')">
            <i class="el-icon-plus">添加资源</i>
          </el-card>
        </el-row>
        <BlockForm
          v-if="activeType === 'specific'"
          ref="specificBlockForm"
          @click.stop
          @cover-type-change="handleCoverTypeChange"
          content-type="specific"
          :mode="mode"
          :check-crowd="checkCrowd"
          :data="data"
          :source="source"
          :pannel="pannel"
          :content-form="contentForm"
          :hide-title-options="hideTitleOptions"
        />
      </el-collapse-item>
    </el-collapse>
  </ContentCard>
</template>

<script>
import draggable from 'vuedraggable'
import BlockForm from './BlockForm'
import CommonSelector from '@/components/CommonSelector'
import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
import { getSelectedResource, setMediaContent, setAppContent, setGoodContent } from '../panelInfoUtil'
export default {
  components: {
    draggable,
    BlockForm,
    CommonSelector,
    ResourceSelector
  },
  data() {
    return {
      activeNames: ['normal', 'specific'],
      activeType: 'normal',
      activeIndex: 0,
      normalContentWrapper: this.genDefaultNormalContentWrapper(),
      normalContentList: [this.genDefaultContentForm()],
      specificContentList: []
    }
  },
  props: ['mode', 'data', 'source', 'pannel', 'hideTitleOptions'],
  computed: {
    title() {
      if (this.mode === 'read') {
        return '推荐位内容查看'
      }
      return '推荐位内容设置'
    },
    isMall() {
      return this.data.blockInfo.type === 'Mall'
    },
    contentForm() {
      return this[this.activeType + 'ContentList'][this.activeIndex]
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
      return enums
    }
  },
  methods: {
    handleInputNormalContentWrapperCoverType(coverType) {
      if (this.mode === 'read') {
        return
      }
      const props = this.normalContentWrapper.props
      props.coverType = coverType
      this.normalContentList = [this.genDefaultContentForm(props)]
      if (coverType === 'block') {
        // 清除定向内容
        // 类型为 推荐位管理时 没有定向内容
        this.specificContentList = []
      }
      this.activeIndex = 0
    },
    handleSelectMediaEnd(resources) {
      const selectedResult = getSelectedResource(resources)
      const selectedType = selectedResult.selectedType
      const selected = selectedResult.selected
      const selectedEpisode = selectedResult.selectedEpisode
      const contentFormPreset = this.normalContentWrapper.props
      const contentList = selected.map(item => {
        const content = this.genDefaultContentForm(contentFormPreset)
        setMediaContent(content, {
          partner: selectedResult.partner,
          selectedType,
          selected: item, 
          selectedEpisode: selectedEpisode[item.coocaaVId],
        })
        return content
      })
      this.normalContentList.splice(this.activeIndex, 1, ...contentList)
    },
    handleSelectAppEnd(resources) {
      const contentFormPreset = this.normalContentWrapper.props
      const contentList = resources.app.map((item) => {
        const content = this.genDefaultContentForm(contentFormPreset)
        setAppContent(content, item)
        return content
      })
      this.normalContentList.splice(this.activeIndex, 1, ...contentList)
    },
    handleSelectGoodEnd(resources) {
      const contentFormPreset = this.normalContentWrapper.props
      const contentList = resources.good.map((item) => {
        const content = this.genDefaultContentForm(contentFormPreset)
        setGoodContent(content, item)
        return content
      })
      this.normalContentList.splice(this.activeIndex, 1, ...contentList)
    },
    getPictureUrl(pictureUrl) {
      if (pictureUrl) {
        const BLOCK_SIGN_IMG_SRC = process.env.BASE_URL + 'block/sign.png'
        return pictureUrl === '/themes/images/block/sign.png'
          ? BLOCK_SIGN_IMG_SRC
          : pictureUrl
          // block.style['background-image'] = 'url(' + content.pictureUrl + ')'
      }
    },
    handleDragConentStart(event) {
    },
    handleDragConentEnd(event, type) {
      const { oldIndex, newIndex } = event
      const currentIndex = this.activeIndex
      if (this.activeType === type) {
        if (oldIndex === currentIndex) {
          this.activeIndex = newIndex
        } else if (oldIndex < currentIndex && newIndex >= currentIndex) {
          this.activeIndex = currentIndex - 1
        } else if (oldIndex > currentIndex && newIndex <= currentIndex) {
          this.activeIndex = currentIndex + 1
        }
      }
    },
    handleSave() {
      this.validateCurrentContent(() => {
        this.$emit('save', {
          videoContentList: this.parseContentList(this.normalContentList),
          specificContentList: this.parseContentList(this.specificContentList)
        })
      })
    },
    genDefaultNormalContentWrapper() {
      return {
        selectionType: 'manual',
        props: {
          coverType: this.isMall ? 'custom' : 'media',
          versionCode: '',
          flagIsSetad: 0
        }
      }
    },
    genDefaultContentForm(preset) {
      return {
        // 如果是购物，默认是 custom 类型
        coverType: this.isMall ? 'custom' : 'media',
        title: '',
        // hideTitleOptions 表示强制需要标题，无法关闭
        showTitle: this.hideTitleOptions ? 1 : 0,
        subTitle: '',
        showSubTitle: 0,
        singleSubTitle: '',
        pictureUrl: '',
        showSeries: 1,
        showScore: 1,
        alternativePictureUrl: '',
        extraValue1: '',
        extraValue5: '',
        singleId: '',
        vContentId: '',
        resourceType: 0,
        cornerList: [{}, {}],
        blockResourceType: -1,
        moviePercent: 100,
        // 推荐位点击跳转
        jumpType: 'detail',
        versionCode: '',
        price: '',
        secKillPrice: '',
        flagIsSetad: 0,
        redundantParams: this.getDefaultParams(),
        // Sprint2.8.2 背景图片和视频
        bgImgUrl: '',
        bgParams: {
          id: '',
          title: ''
        },
        bgType: '',
        ...preset
      }
    },
    getDefaultParams() {
      return {
        openMode: 'app',
        webpageUrl: '',
        webpageType: '2',
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
        params: [{ key: '', value: '' }]
      }
    },
    handleCoverTypeChange(coverType) {
      if (this.mode === 'read') {
        return
      }
      const { activeType, activeIndex } = this
      const contentList = this[activeType + 'ContentList']
      const originContentForm = contentList[activeIndex]
      const contentForm = this.genDefaultContentForm()
      contentForm.coverType = coverType
      if (activeType === 'specific') {
        // 定向运营时保留内容类别和关联人群
        contentForm.resourceType = originContentForm.resourceType // 内容类别
        contentForm.dmpRegistryInfo = originContentForm.dmpRegistryInfo // 关联人群
      } else {
        if (coverType === 'block') {
          // 清除定向内容
          // 类型为 推荐位管理时 没有定向内容
          this.specificContentList = []
        }
      }
      this.$set(contentList, activeIndex, contentForm)
    },
    handleRemoveContent(index, contentType) {
      this.$confirm('确认删除该内容', '提示', {
        callback: (result) => {
          if (result === 'confirm') {
            const activeType = this.activeType
            const activeIndex = this.activeIndex
            const currentContentList = this[contentType + 'ContentList']
            currentContentList.splice(index, 1)
            if (activeType === contentType) {
              if (currentContentList.length > 0) {
                if (currentContentList[activeIndex] === undefined) {
                  this.handleActivate(contentType, index - 1)
                }
              } else {
                this.handleActivate(contentType === 'normal' ? 'specific' : 'normal', 0)
              }
            }
          }
        }
      })
    },
    handleAddContent(contentType) {
      this.$refs[this.activeType + 'BlockForm'].validate(this.contentForm, (err) => {
        if (!err) {
          const contentList = this[contentType + 'ContentList']
          if (contentType === 'normal') {
            contentList.push(this.genDefaultContentForm(this.normalContentWrapper.props))
          } else {
            contentList.push(this.genDefaultContentForm())
          }
          this.activeType = contentType
          this.activeIndex = contentList.length - 1
        } else {
          this.$message({
            type: 'error',
            message: err
          })
        }
      })
    },
    handleActivate(contentType, index) {
      if (this[this.activeType + 'ContentList'][this.activeIndex]) {
        this.validateCurrentContent(() => {
          this.activeType = contentType
          this.activeIndex = index
        })
      } else {
        // 内容被删除
        this.activeType = contentType
        this.activeIndex = index
      }
    },
    validateCurrentContent(cb) {
      this.$refs[this.activeType + 'BlockForm'].validate(this.contentForm, (err) => {
        if (!err) {
          cb()
        } else {
          this.$message({
            type: 'error',
            message: err
          })
        }
      })
    },
    setContentList() {
      const block = JSON.parse(JSON.stringify(this.data.block || '{}'))
      const normalContentList = block.videoContentList || []
      const specificContentList = block.specificContentList || []
      const parse = (data) => {
        let redundantParams
        const defaultContentForm = this.genDefaultContentForm()
        data.cornerList = (data.cornerList || []).reduce((result, item) => {
          result[item.position] = item
          return result
        }, defaultContentForm.cornerList)

        if (data.coverType == 'custom') {
          const onclick = JSON.parse(data.onclick)
          // 处理格式奇怪的params属性
          const params = data.params.split(',').reduce((result, item) => {
            const [key, val] = item.split('==')
            result[key] = val
            return result
          }, {})
          const openMode = params.openMode || 'app' // 为兼容业务专辑中没有openMode的params参数 采用app作为默认值
          switch (openMode) {
            case 'webpage': {
              onclick.webpageUrl = onclick.params.url
              if (onclick.byvalue === 'coocaa.intent.action.browser') {
                onclick.webpageType = '1'
              }
              if (onclick.byvalue === 'coocaa.intent.action.browser.no_trans') {
                onclick.webpageType = '2'
              }
              break
            }
            case 'video': {
              onclick.videoName = onclick.params.name
              onclick.videoUrl = onclick.params.url
              break
            }
            case 'picture': {
              onclick.pictureUrl = onclick.params.url
              break
            }
            case 'tab': {
              onclick.tabId = onclick.params.id
              onclick.tabType = params.tabType
              break
            }
            case 'app': {
              const onclickParams = onclick.params
              onclick.params = Object.keys(onclick.params).map(key => {
                return {
                  key,
                  value: onclickParams[key]
                }
              })
              break
            }
            default:
              break
          }

          redundantParams = onclick
          redundantParams.openMode = openMode
          delete data.onclick
        }

        if (redundantParams) {
          data.redundantParams = redundantParams
        }

        if (data.bgParams) {
          data.bgParams = JSON.parse(data.bgParams)
        }
        return Object.assign({}, defaultContentForm, data)
      }
      this.normalContentList = normalContentList.length > 0
        ? normalContentList.map(parse)
        : [this.genDefaultContentForm()]
      this.specificContentList = specificContentList.map(parse)
      
      const normalContentWrapperProps = this.normalContentWrapper.props
      const firstNormalContent = this.normalContentList[0]
      ;['coverType', 'versionCode', 'flagIsSetad'].forEach((key) => {
        normalContentWrapperProps[key] = firstNormalContent[key]
      })
    },
    parseContentList(contentList) {
      const normalContentWrapperProps = this.normalContentWrapper.props
      contentList = JSON.parse(JSON.stringify(contentList))

      function parse(content) {
        const coverType = content.coverType
        let onclick = ''
        let params = ''
        if (coverType === 'custom') {
          content.contentType = 0
        }
        if (coverType === 'block') {
          content.contentType = 1
        }
        if (coverType === 'custom') {
          const currentOnclick = content.redundantParams
          const openMode = currentOnclick.openMode
          params = 'openMode==' + openMode
          const webpageType = currentOnclick.webpageType
          switch (openMode) {
            case 'webpage': {
              if (webpageType === '1') {
                // 浮窗网页
                onclick = JSON.stringify({
                  packagename: 'com.coocaa.app_browser',
                  versioncode: currentOnclick.versioncode,
                  dowhat: 'startActivity',
                  bywhat: 'action',
                  byvalue: 'coocaa.intent.action.browser',
                  params: {
                    url: currentOnclick.webpageUrl
                  },
                  exception: {}
                })
              } else if (webpageType === '2') {
                // 全屏网页
                onclick = JSON.stringify({
                  packagename: 'com.coocaa.app_browser',
                  versioncode: currentOnclick.versioncode,
                  dowhat: 'startActivity',
                  bywhat: 'action',
                  byvalue: 'coocaa.intent.action.browser.no_trans',
                  params: {
                    url: currentOnclick.webpageUrl
                  },
                  exception: {}
                })
              }
              break
            }
            case 'video': {
              onclick = JSON.stringify({
                packagename: 'com.tianci.movieplatform',
                versioncode: '-1',
                dowhat: 'startService',
                bywhat: 'action',
                byvalue: 'coocaa.intent.player.video',
                params: {
                  name: currentOnclick.videoName,
                  url: currentOnclick.videoUrl,
                  needParse: 'false',
                  url_type: 'web'
                },
                exception: {}
              })
              break
            }
            case 'picture': {
              onclick = JSON.stringify({
                packagename: 'com.tianci.movieplatform',
                versioncode: '',
                dowhat: 'startService',
                bywhat: 'action',
                byvalue: 'coocaa.intent.player.image',
                params: {
                  name: '',
                  url: currentOnclick.pictureUrl
                },
                exception: {}
              })
              break
            }
            case 'tab': {
              var tabType = currentOnclick.tabType
              params += ',tabType==' + tabType
              onclick = JSON.stringify({
                packagename: 'com.tianci.movieplatform',
                versioncode: '',
                dowhat: 'startActivity',
                bywhat: 'action',
                byvalue:
                              tabType == 1
                                ? 'coocaa.intent.action.HOME_COMMON_LIST'
                                : 'coocaa.intent.action.HOME_SPECIAL_TOPIC',
                params: {
                  id: currentOnclick.tabId
                },
                exception: {}
              })
              break
            }
            case 'app': {
              let convertedParams = {}
              let params = currentOnclick.params
              for (var i = 0; i < params.length; i++) {
                var p = params[i]
                if (p.key !== '' && p.value !== '') {
                  convertedParams[p.key] = p.value
                }
              }
              onclick = JSON.stringify({
                byvalue: currentOnclick.byvalue,
                packagename: currentOnclick.packagename,
                dowhat: currentOnclick.dowhat,
                versioncode: currentOnclick.versioncode,
                params: convertedParams,
                bywhat: currentOnclick.bywhat,
                data: currentOnclick.data,
                exception: {
                  name: 'onclick_exception',
                  value: {
                    packagename: 'com.tianci.appstore',
                    dowhat: 'startActivity',
                    versioncode: '-1',
                    params: {
                      id: currentOnclick.packagename
                    },
                    byvalue: 'coocaa.intent.action.APP_STORE_DETAIL',
                    bywhat: 'action'
                  }
                }
              })
              break
            }
            default:
              break
          }
        }
        content.onclick = onclick
        content.params = params
        if (content.bgParams) {
          delete content.bgParams.title
          content.bgParams = JSON.stringify(content.bgParams)
        }
        // contentWrapperProps
        ;['coverType', 'versionCode', 'flagIsSetad'].forEach((key) => {
          content[key] = normalContentWrapperProps[key]
        })

        delete content.redundantParams
        return content
      }
      return contentList.map(parse)
    },
    checkCrowd(crowd) {
      const specificContentList = this.specificContentList
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
    }
  },
  created() {
    this.setContentList()
  }
}
</script>

<style lang="stylus" scoped>
.block-content-form >>> .el-input {
  max-width: 280px;
}

.post-box {
  border: 1px solid #ccc;
  overflow: hidden;

  img {
    width: 100%;
  }
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

  .score {
    right: 0;
  }

  .episode {
    left: 0;
  }
}

.post-info .post-title, .post-info .post-sub-title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.post-info .episode, .post-info .score {
  position: absolute;
  top: -20px;
  background: #000;
  padding: 0 5px;
}

.corner-box {
  position: relative;

  span {
    &.corner {
      position: absolute;
      width: 50px;
      height: 50px;
      text-align: center;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
      }
    }

    &.corner-0 {
      top: 0;
      left: 0;
    }

    &.corner-1 {
      top: 0;
      right: 0;
    }

    &.corner-2 {
      bottom: 0;
      right: 0;
    }

    &.corner-3 {
      bottom: 0;
      left: 0;
    }
  }
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

  i {
    position: absolute;
    top: 0;
    right: 0;
    color: #ff4949;
    font-size: 20px;
  }
}

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

.activeContent {
  border: 2px dashed #F7BA2A;
}
</style>
<style lang="stylus" scoped>
.content-id
  position absolute
  top 0
  left 0
  background #000
  color #fff
  opacity 0.8
.normal-content-wrapper__list
  margin-top 10px
  padding 10px 5px
  border 1px solid #ccc
</style>
