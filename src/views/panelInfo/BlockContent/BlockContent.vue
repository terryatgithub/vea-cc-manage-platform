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
          <el-form-item label="内容资源">
            <el-select filterable v-show="mode !== 'read'" v-model="normalContentWrapper.selectionType" style="margin-bottom: 10px">
              <el-option value="manual" label="手动添加"></el-option>
            </el-select>
            <div v-if="mode !== 'read'">
              <ResourceSelector
                v-if="!isInterveneBlock"
                ref="resourceSelector"
                :is-live="false"
                :disable-partner="!!source"
                :selectors="['video', 'app', 'edu', 'pptv', 'live', 'topic', 'rotate', 'good']"
                selection-type="multiple"
                :source="source"
                @select-end="handleSelectResourcesEnd"
              >
                <el-button>批量选择资源</el-button>
              </ResourceSelector>
            </div>

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
                    <img referrerpolicy="no-referrer" :src="getPictureUrl(content.pictureUrl)" >
                  </el-card>
                </component>

                <el-card v-if="mode !== 'read'" @click.native="handleAddContent('normal')">
                  <i class="el-icon-plus">添加资源</i>
                </el-card>
              </div>
              <BlockForm
                v-if="activeType === 'normal'"
                :key="`active_index_${activeIndex}`"
                ref="normalBlockForm"
                @click.stop
                @cover-type-change="handleCoverTypeChange"
                :mode="mode"
                :check-crowd="checkCrowd"
                content-type="normal"
                :source="source"
                :data="data"
                :pannel="pannel"
                :pannel-group-id="pannelGroupId"
                :content-form="contentForm"
                :hide-title-options="hideTitleOptions"
                :is-intervene-block="isInterveneBlock"
              />
            </div>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item v-if="!isInterveneBlock" v-show="contentForm.coverType !== 'block'" title="精细化定向内容" name="specific">
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
              <img referrerpolicy="no-referrer" :src="getPictureUrl(content.pictureUrl)" >
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
          :pannel-group-id="pannelGroupId"
          :pannel="pannel"
          :content-form="contentForm"
          :hide-title-options="hideTitleOptions"
          :is-intervene-block="isInterveneBlock"
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
import {
  genDefaultContentForm,
  genResourceContentList,
  genDefaultTvLiveInfo
} from '../panelInfoUtil'
export default {
  components: {
    draggable,
    BlockForm,
    CommonSelector,
    ResourceSelector
  },
  data () {
    return {
      activeNames: ['normal', 'specific'],
      activeType: 'normal',
      activeIndex: 0,
      normalContentWrapper: this.genDefaultNormalContentWrapper(),
      normalContentList: [this.genDefaultContentForm()],
      specificContentList: []
    }
  },
  props: ['mode', 'data', 'source', 'pannel', 'hideTitleOptions', 'pannelGroupId', 'isInterveneBlock'],
  computed: {
    title () {
      if (this.mode === 'read') {
        return '推荐位内容查看'
      }
      return '推荐位内容设置'
    },
    isMall () {
      return this.data.blockInfo.type === 'Mall'
    },
    contentForm () {
      return this[this.activeType + 'ContentList'][this.activeIndex]
    },
    coverTypeEnums () {
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
    error (message) {
      return this.$message({
        type: 'error',
        message
      })
    },
    handleSelectResourcesEnd (resources) {
      console.log(resources)
      const contentPreset = {
        coverType: this.isMall ? 'custom' : 'media',
        // hideTitleOptions 表示强制需要标题，无法关闭
        showTitle: this.hideTitleOptions ? 1 : 0
      }
      const contentList = genResourceContentList(resources, contentPreset)
      this.normalContentList.splice(this.activeIndex, contentList.length, ...contentList)
    },
    getPictureUrl (pictureUrl) {
      if (pictureUrl) {
        const BLOCK_SIGN_IMG_SRC = process.env.BASE_URL + 'block/sign.png'
        return pictureUrl === '/themes/images/block/sign.png'
          ? BLOCK_SIGN_IMG_SRC
          : pictureUrl
          // block.style['background-image'] = 'url(' + content.pictureUrl + ')'
      }
    },
    handleDragConentStart (event) {
    },
    handleDragConentEnd (event, type) {
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
    handleSave () {
      this.validateCurrentContent(() => {
        // 验证所有资源
        const normalContentList = this.normalContentList
        const normalContentListLength = normalContentList.length
        const resourcesIndexed = {}
        const idFieldMap = {
          media: 'extraValue1',
          block: 'vContentId',
          mall: 'extraValue1'
        }
        if (normalContentListLength > 100) {
          return this.error(`通用内容最多配 100 个, 当前 ${normalContentListLength}`)
        }
        for (let i = 0, length = normalContentList.length; i < length; i++) {
          const content = normalContentList[i]
          const coverType = content.coverType
          const shouldCheck = coverType === 'media' || coverType === 'block' || coverType === 'mall'
          let id = content[idFieldMap[coverType]]
          if (id && shouldCheck) {
            // 单集的 extraValue1 相同，可能有 extraValue4 或 extraValue5
            id = id + (content.extraValue4 || '') + (content.extraValue5 || '')
            const existsId = resourcesIndexed[id]
            if (existsId !== undefined) {
              return this.error(`通用内容第 ${existsId + 1} 个资源与第 ${i + 1} 相同`)
            } else {
              resourcesIndexed[id] = i
            }
          }

          if (!content.pictureUrl) {
            return this.error(`第 ${i + 1} 个通用内容缺少内容海报`)
          }
        }

        this.$emit('save', {
          videoContentList: this.parseContentList(this.normalContentList),
          specificContentList: this.parseContentList(this.specificContentList)
        })
        console.log(this.normalContentList, '---handleSave-保存----')
      })
    },
    genDefaultNormalContentWrapper () {
      return {
        selectionType: 'manual',
        props: {
        }
      }
    },
    genDefaultContentForm (preset) {
      const contentPreset = {
        coverType: this.isMall ? 'custom' : 'media',
        // hideTitleOptions 表示强制需要标题，无法关闭
        showTitle: this.hideTitleOptions ? 1 : 0
      }
      return genDefaultContentForm(contentPreset)
    },
    handleCoverTypeChange (coverType) {
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
      if (coverType === 'maskLife') {
        contentForm.videoContentType = 'maskLife'
      }
      if (coverType === 'tvLive') {
        contentForm.tvLiveInfo = genDefaultTvLiveInfo()
        contentForm.videoContentType = 'tvLive'
      }
      if (coverType !== 'media' && contentForm.flagTagVector === 1) {
        contentForm.flagTagVector = 0
      }
      this.$set(contentList, activeIndex, contentForm)
    },
    handleRemoveContent (index, contentType) {
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
    handleAddContent (contentType) {
      if (this.isInterveneBlock) {
        return this.$message.error('插入推荐位仅允许添加一个资源')
      }
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
    handleActivate (contentType, index) {
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
    validateCurrentContent (cb) {
      const contentForm = this.contentForm
      console.log(contentForm, 'submit12')
      this.$refs[this.activeType + 'BlockForm'].validate(contentForm, (err) => {
        if (!err) {
          if (contentForm.flagSetRec === 1) {
            if (!contentForm.mediaAutomationBlockRls.mediaAutomationId && !contentForm.mediaAutomationBlockRls.recId) {
              return this.$message.error('开关开启时，推荐流选择必须选择其一')
            } else if (contentForm.mediaAutomationBlockRls.mediaAutomationId && contentForm.mediaAutomationBlockRls.recId) {
              return this.$message.error('开关开启时，推荐流只能保存其一')
            }
            if (contentForm.mediaAutomationBlockRls.recName) {
              contentForm.mediaAutomationBlockRls.mediaAutomationId = contentForm.mediaAutomationBlockRls.recId
              contentForm.mediaAutomationBlockRls.mediaAutomationName = contentForm.mediaAutomationBlockRls.recName
              delete contentForm.mediaAutomationBlockRls.recId
              delete contentForm.mediaAutomationBlockRls.recName
            }
          }
          cb()
        } else {
          return this.error(err)
        }
      })
    },
    setContentList () {
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

        if (data.coverType === 'custom') {
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
    },
    parseContentList (contentList) {
      contentList = JSON.parse(JSON.stringify(contentList))

      const parse = function (content) {
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
              var isValueType = ''
              if (tabType === '1') {
                isValueType = 'coocaa.intent.action.HOME_COMMON_LIST'
              } else if (tabType === '13') {
                isValueType = 'coocaa.intent.action.HOME_SPECIAL_TOPIC_PAGE_EDU'
              } else {
                isValueType = 'coocaa.intent.action.HOME_SPECIAL_TOPIC'
              }
              onclick = JSON.stringify({
                packagename: tabType === '13' ? 'com.coocaa.educate' : 'com.tianci.movieplatform',
                versioncode: '',
                dowhat: 'startActivity',
                bywhat: 'action',
                // eslint-disable-next-line
                byvalue: isValueType,
                params: {
                  id: currentOnclick.tabId
                },
                exception: tabType === '13' ? {
                  'name': 'onclick_exception',
                  'value': {
                    'packagename': 'com.tianci.appstore',
                    'dowhat': 'startActivity',
                    'versioncode': '-1',
                    'params': {
                      'id': 'com.coocaa.educate'
                    },
                    'byvalue': 'coocaa.intent.action.APP_STORE_DETAIL',
                    'bywhat': 'action'
                  }
                } : {}
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
        // 如果媒资传了onclick，就直接给后端
        if (!content.onclick) {
          content.onclick = onclick
        }
        content.params = params
        if (content.bgParams) {
          delete content.bgParams.title
          content.bgParams = JSON.stringify(content.bgParams)
        }

        if (this.isInterveneBlock) {
          delete content.redundantParams
        }
        return content
      }.bind(this)
      return contentList.map(parse)
    },
    checkCrowd (crowd) {
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
  created () {
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
