<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <template v-if="mode === 'create'">
      <el-form :model="createForm" label-width="80px" ref="createForm">
        <el-form-item label="流名称" prop="name" :rules="basicFormRules.name">
          <el-input v-model="createForm.name" class="title-input"></el-input>
        </el-form-item>
        <el-form-item label="源" prop="source">
          <el-radio-group v-model="createForm.source">
            <el-radio v-for="item in $consts.sourceOptions" :label="item.value" :key="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="流类型">
          <el-select v-model="createForm.type" placeholder="请选择">
            <el-option-group
              v-for="group in streamTypeGroup"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
          <div v-if="createForm.type !== 'normal'" class="type-tip">Tip：基本流仅适用于标准尺寸的推荐位 (标准尺寸：260*364，498*280)</div>
        </el-form-item>
      </el-form>
      <div class="base-info">
        创建流后，默认是关闭状态的。填充完内容后，找产品或开发去开启状态;
      </div>
      <el-row class="createBtn-container">
        <el-button type="primary" @click="handleCreate">创建</el-button>
        <el-button type="success" @click="$emit('go-back')">取消</el-button>
      </el-row>
    </template>

    <template v-else>
      <CommonContent
        :mode="mode"
        :resource-info="resourceInfo"
        @replicate="mode = 'replicate'"
        @copy="handleCopy"
        @edit="mode = 'edit'"
        @unaudit="$emit('upsert-end')"
        @shelves="fetchData"
        @audit="$emit('upsert-end')"
        @submit-audit="handleSubmitAudit"
        @save-draft="handleSaveDraft"
        @select-version="fetchData"
        @cancel-timing="fetchData(tabInfo.currentVersion)"
        @delete="$emit('upsert-end', $event)"
      >
      <div class="form-legend-header" @click="isCollapseBase = !isCollapseBase">
        <i v-if="isCollapseBase" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
        <span>&nbsp;流基本设置</span>
      </div>
      <div :style="{display: isCollapseBase ? 'none' : 'block'}">
        <el-form :model="basicForm" ref="basicForm" label-width="150px" :rules="basicFormRules">
          <el-form-item label="推荐流ID">{{basicForm.id}}</el-form-item>
          <el-form-item label="推荐流名称" prop="name">
            <el-input class="title-input" v-model="basicForm.name" :disabled="isRead"/>
          </el-form-item>
          <el-form-item label="源" prop="source">
            <el-radio-group :value="basicForm.source" :disabled="isRead || isReplica" @input="handleSourceChange">
              <el-radio v-for="item in $consts.sourceOptions" :label="item.value" :key="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="流类型">
            {{streamType}}
          </el-form-item>
          <el-form-item label="流状态">
            {{['关闭', '开启'][basicForm.openStatus]}}
          </el-form-item>
        </el-form>
      </div>

      <div class="form-legend-header" @click="isCollapseVideo = !isCollapseVideo">
        <i v-if="isCollapseVideo" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
        <span>&nbsp;影片选择</span>
      </div>
      <div :style="{display: isCollapseVideo ? 'none' : 'block'}">
        <div class="video-select--header">
          <InputPositiveInt v-model="newVideoTabNum" class="num-input" :disabled="isRead"/>
          <el-button type="primary" @click="handleAddVideoTab(newVideoTabNum)" :disabled="isRead">添加</el-button>
          <ResourceSelector
            ref="resourceSelector"
            :is-live="false"
            :selectors="['video', 'edu', 'pptv', 'live', 'topic', 'rotate']"
            selection-type="multiple"
            :source="basicForm.source"
            :disable-partner="true"
            :disabled="isRead"
            @select-end="handleSelectResourcesEnd"
          >
            <el-button type="primary" class="batch-btn" :disabled="isRead" title="若260*364或498*280的尺寸存在，选择资源后自动填充默认图">批量选择资源</el-button>
          </ResourceSelector>
          <el-button type="primary" @click="isVisibleSize = !isVisibleSize" title="若260*364或498*280的尺寸存在，选择资源后自动填充默认图" :disabled="isRead">添加尺寸</el-button>
          <el-button type="text" :disabled="isRead" @click="handleAddTabSize($event, 260, 364)">添加260*364</el-button>
          <el-button type="text" :disabled="isRead" @click="handleAddTabSize($event, 498, 280)">添加498*280</el-button>
          <el-tag
            v-for="(sizeTag, index) in sizeTags"
            :key="index"
            type="primary"
            :closable="!isRead && sizeTag.closable"
            class="size-tag"
            @close="handleTagClose(sizeTag)"
          >
              {{sizeTag.width}}&nbsp;x&nbsp;{{sizeTag.height}}
          </el-tag>
        </div>
        <div v-for="(videoTab, index) in videoTabs" :key="index" class="videoTab--wrapper">
          <AssignVideoTab
            v-model="videoTabs[index]"
            :index="index"
            :source="basicForm.source"
            :input-tags="sizeTags"
            :disabled="isRead"
            @handle-delTab="handleDelTab"
            @select-clicked-source="handleSelectClickedSource($event, index)"
            @select-normal-source="handleSelectNormalSource($event, index)"
            @blur="handleBlurSort(index)"
            @del-normal-source="handleDelNormalSource(index)"
          />
        </div>
      </div>
      </CommonContent>
    </template>

    <!-- 添加尺寸dialog -->
    <el-dialog title="添加尺寸" :visible.sync="isVisibleSize" width="30%">
      <el-row :gutter="10"><el-col :span="12" class="text-center-align">宽</el-col><el-col :span="12" class="text-center-align">高</el-col></el-row>
      <el-row>
        <el-col :span="10"><InputPositiveInt v-model="newTabSize.width"/></el-col>
        <el-col :span="4" class="text-center-align">X</el-col>
        <el-col :span="10"><InputPositiveInt v-model="newTabSize.height"/></el-col>
      </el-row>
      <div class="size-btn-group">
        <el-button type="primary" @click="handleAddTabSize">确定</el-button>
        <el-button type="success" @click="newTabSize={};isVisibleSize=!isVisibleSize">取消</el-button>
      </div>
    </el-dialog>
  </ContentCard>
</template>

<script>
import InputPositiveInt from '@/components/InputPositiveInt'
import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
import AssignVideoTab from './AssignVideoTab'
import CommonContent from '@/components/CommonContent.vue'
import titleMixin from '@/mixins/title'
import { cloneDeep } from 'lodash'
const videoListParams = ['mediaResourceId', 'title', 'showSeries', 'showScore', 'picInfoList'] // picInfoList兼容预览，可转换为picList
const params = ['name', 'source', 'status']
const streamTypeGroupOption = [
  {
    label: '普通流',
    options: [
      {
        label: '普通',
        value: 'normal'
      }
    ]
  },
  {
    label: '基本流',
    options: [
      {
        label: '电影',
        value: 'movie'
      },
      {
        label: '电视剧',
        value: 'series'
      },
      {
        label: '少儿',
        value: 'child'
      }
    ]
  }
]

export default {
  mixins: [titleMixin],
  components: {
    InputPositiveInt,
    ResourceSelector,
    AssignVideoTab,
    CommonContent
  },
  data() {
    return {
      resourceName: '指定影片推荐流',
      createForm: {
        name: '',
        source: 'o_tencent',
        type: 'normal'
      },
      mode: 'create',
      basicForm: {
        id: undefined,
        name: undefined,
        source: 'o_tencent',
        openStatus: undefined,
        currentVersion: undefined,
        flagAllVideoPoster: 0,
        type: 'normal'
      },
      isCollapseBase: false,
      isCollapseVideo: false,
      isVisibleSize: false,
      videoTabs: [],
      newVideoTabNum: undefined,
      sizeTags: [],
      delSizeTagIndex: -1,
      newTabSize: {
        width: undefined,
        height: undefined
      },
      basicFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 45, message: '推荐流名称不得超出45个字符', trigger: 'blur' }
        ]
      },
      videoListParams, // 必填参数
      params,
      streamTypeGroup: streamTypeGroupOption
    }
  },

  props: ['id', 'initMode', 'version'],

  computed: {
    // eslint-disable-next-line
    resourceInfo() {
      const basicForm = this.basicForm
      if (basicForm.id) {
        return {
          id: basicForm.id,
          version: basicForm.currentVersion,
          status: basicForm.status,
          type: 'mediaAutomation',
          menuElId: 'mediaAutomation'
        }
      }
    },
    isRead () {
      const mode = this.mode
      if (this.basicForm.type !== 'normal') {
        return true
      }
      return mode === 'read'
    },
    isReplica() {
      return this.mode === 'replicate' || this.basicForm.duplicateVersion === 'yes'
    },
    streamType () {
      const typeIndex = {
        normal: '普通', child: '少儿', movie: '电影', series: '电视剧'
      }
      return typeIndex[this.basicForm.type]
    }
  },

  methods: {
    getDefaultVideoTab() {
      return {
        id: undefined, //  影片自增id
        clickTemplateType: undefined, // 点击事件模板类型,refer资源类型
        coverType: 'media',
        videoContentType: undefined, // refer资源类型
        params: undefined, // 播放参数json, refer资源id
        clickParams: undefined, // 点击事件中的参数
        clickType: 'detail',
        mediaResourceId: undefined,
        title: '',
        subTitle: '',
        showSeries: 1,
        showScore: 1,
        videoId: undefined,
        priority: undefined,
        flagRec: 0,
        picList: [],
        picInfoList: []
      }
    },
    genPicInfo() {
      return {
        pictureResolution: '',
        pictureUrl: undefined,
        pictureId: undefined,
        pictureStatus: undefined
      }
    },
    judgeAvailableTag () {
      if (this.isRead) {
        return false
      }
      if (this.videoTabs.length === 0) {
        return true
      } else {
        return false
      }
    },
    handleCreate() {
      const createForm = this.createForm
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.$service.saveMediaAutomation({ jsonStr: JSON.stringify(createForm) }, '保存成功').then(() => {
            this.$emit('upsert-end')
          })
        } else {
          this.$message.error('表单填写不完整')
        }
      })
    },
    messageCancel() {
      this.$message({
        type: 'info',
        message: '已取消切换源'
      })
    },
    handleSourceChange(val) {
      const messageCancel = this.messageCancel
      this.$confirm('修改源，会删除所有影片和素材，确定要修改', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$confirm('第二次警告，确定要修改', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$confirm('最后一个警告，删除后素材无法恢复！', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.basicForm.source = val
            this.videoTabs = []
            this.$message.success('成功切换内容源')
          }).catch(messageCancel)
        }).catch(messageCancel)
      }).catch(messageCancel)
    },
    handleAddVideoTab(tabNum) {
      let sizetagsLen = this.sizeTags.length
      if (!tabNum) {
        let newVideoTab = this.getDefaultVideoTab()
        for (let count = 0; count < sizetagsLen; count++) {
          newVideoTab.picInfoList.push(this.genPicInfo())
        }
        this.videoTabs.push(newVideoTab)
        this.$message.success('添加成功')
      } else if (!this.newVideoTabNum || this.newVideoTabNum > 100 || this.newVideoTabNum <= 0) {
        this.$message.error('请输入0~100之间的数字')
      } else {
        for (let i = 0; i < tabNum; i++) {
          let newVideoTab = this.getDefaultVideoTab()
          for (let count = 0; count < sizetagsLen; count++) {
            newVideoTab.picInfoList.push(this.genPicInfo())
          }
          this.videoTabs.push(newVideoTab)
        }
        this.newVideoTabNum = undefined
        this.$message.success('添加成功')
      }
    },
    handleAddTabSize(e, width, height) {
      if (width) {
        const isRepeatSize = this.judgeIsRepeatSize({ width, height })
        if (isRepeatSize) {
          this.$message.error('尺寸不允许重复！')
          return
        }
        this.sizeTags.push({ width, height, closable: true })
      } else {
        let newTabSize = Object.assign({ closable: true }, this.newTabSize)
        if (!newTabSize.width || !newTabSize.height) {
          this.$message.error('宽或高不能为空')
          return
        }
        const isRepeatSize = this.judgeIsRepeatSize(newTabSize)
        if (isRepeatSize) {
          this.$message.error('尺寸不允许重复！')
          return
        }
        this.sizeTags.push(newTabSize)
        this.newTabSize = {}
      }
      this.videoTabs.forEach(video => {
        video.picInfoList.push(this.genPicInfo())
      })
      this.dealFillDefaultImg()
      this.isVisibleSize = false
    },
    judgeIsRepeatSize (newTabSize) {
      return this.sizeTags.some(item => {
        // 有可能不全等
        return item.width === newTabSize.width && item.height === newTabSize.height
      })
    },
    handleTagClose(tag) {
      this.$confirm('删除本尺寸后，本流中配置的本尺寸海报图也会删除，确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const delSizeTagIndex = this.sizeTags.indexOf(tag)
        this.delSizeTagIndex = delSizeTagIndex
        this.sizeTags.splice(delSizeTagIndex, 1)
        this.videoTabs.forEach(video => {
          video.picInfoList.splice(delSizeTagIndex, 1)
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDelTab(index) {
      const videoTabs = this.videoTabs
      videoTabs.splice(index, 1)
      this.videoTabs = []
      this.$nextTick(() => {
        this.videoTabs = videoTabs.slice()
        this.$message.success('删除成功')
      })
    },
    handleSelectResourcesEnd(resources) {
      console.log('resources', resources)
      const source = this.basicForm.source
      ;['video', 'edu', 'pptv', 'live', 'topic', 'rotate'].forEach(name => {
        const nameRS = resources[name]
        this.handleDiffResources(nameRS, name, source, resources)
      })
      this.dealFillDefaultImg()
    },
    dealCommonParams(resources) {
      console.log('resources', resources)
      const source = this.basicForm.source
      // sigle, length === 1
      const tabName = ['video', 'edu', 'pptv', 'live', 'topic', 'rotate'].filter(name => {
        return resources[name].length !== 0
      }).join('')
      let data = this.callbackParam(tabName, resources[tabName][0], source)
      let selected = Object.assign({}, data)
      selected.vid = data.vid
      selected.sid = data.sid

      const categoryId = resources[tabName][0].categoryId

      let anotherName = tabName
      switch (tabName) {
        case 'video':
          anotherName = 'movie'
          break
        case 'live':
          anotherName = 'txLive'
          break
      }
      const jsonParams = JSON.stringify(this.paramIdFun(selected))
      return {
        tabName,
        anotherName,
        jsonParams,
        title: data.title,
        subTitle: data.subTitle,
        thirdIdOrPackageName: data.thirdIdOrPackageName,
        categoryId
      }
    },
    handleSelectClickedSource(resources, index) {
      const { tabName, anotherName, jsonParams, title, subTitle, thirdIdOrPackageName, categoryId } = this.dealCommonParams(resources)
      Object.assign(this.videoTabs[index], {
        clickParams: jsonParams,
        clickTemplateType: anotherName,
        videoContentType_click: anotherName,
        title,
        subTitle,
        mediaResourceId: thirdIdOrPackageName,
        coverType: 'media',
        categoryId
      })
      const videoTabs = this.videoTabs
      videoTabs[index].imageInfoList = resources[tabName][0].imageInfoList
      // 有尺寸填充默认图
      this.dealFillDefaultImg()
      if (tabName === 'video') {
        const entity = resources[tabName][0].ccVideoSourceEntities[0]
        const score = entity.score
        const updatedSegment = entity.updatedSegment
        const publishSegment = entity.publishSegment
        // eslint-disable-next-line
        const isUnknown = publishSegment == 0
        const publishStatus = isUnknown
          ? 'unknown'
          : updatedSegment === publishSegment
            ? 'ended'
            : 'updating'
        Object.assign(this.videoTabs[index], {
          publishStatus,
          score,
          series: isUnknown ? null : updatedSegment,
          variety: entity.lastCollection
        })
      }
      videoTabs[index].picList = []
    },
    dealFillDefaultImg () {
      const { sizeTags, videoTabs } = this
      if (sizeTags.length !== 0) {
        sizeTags.forEach((item, index) => {
          // 寻找标准分辨率
          const resolution = item.width + '*' + item.height
          if (resolution === '260*364' || resolution === '498*280') {
            videoTabs.forEach(videoTab => {
              // 有url就不填充
              if (!videoTab.picInfoList[index].pictureUrl) {
                // 不存在imageInfoList时访问媒资
                if (videoTab.clickTemplateType === 'movie') {
                  const filter = {
                    resType: 'vod',
                    callbackparam: 'result',
                    sources: this.basicForm.source,
                    id: videoTab.mediaResourceId
                  }
                  this.$service.getMediaVideoInfos(filter).then(data => {
                    videoTab.imageInfoList = data.rows[0] ? data.rows[0].imageInfoList : undefined
                    const currentImageInfo = (videoTab.imageInfoList || []).find(imageInfoList => {
                      return imageInfoList.size === resolution
                    })
                    videoTab.picInfoList[index].pictureUrl = currentImageInfo ? currentImageInfo.url : undefined
                  })
                } else if (videoTab.clickTemplateType === 'edu') {
                  const filter = {
                    resType: 'vod',
                    callbackparam: 'result',
                    businessType: 1, // 业务线类型:0影视, 1教育
                    id: videoTab.mediaResourceId
                  }
                  this.$service.getMediaVideoInfos(filter).then(data => {
                    videoTab.imageInfoList = data.rows[0] ? data.rows[0].imageInfoList : undefined
                  })
                } else {
                  // 填充
                  const currentImageInfo = (videoTab.imageInfoList || []).find(imageInfoList => {
                    return imageInfoList.size === resolution
                  })
                  videoTab.picInfoList[index].pictureUrl = currentImageInfo ? currentImageInfo.url : undefined
                }
              }
            })
          }
        })
      }
    },
    handleSelectNormalSource(resources, index) {
      const { anotherName, jsonParams, thirdIdOrPackageName } = this.dealCommonParams(resources)
      Object.assign(this.videoTabs[index], {
        params: jsonParams,
        videoContentType: anotherName,
        videoId: thirdIdOrPackageName
      })
    },
    handleDelNormalSource(index) {
      if (this.isRead) {
        return
      }
      this.videoTabs[index].videoId = undefined
      this.videoTabs[index].params = undefined
    },
    handleDiffResources(resourceArr, resourceName, source, resources) {
      let anotherName = resourceName
      switch (resourceName) {
        case 'video':
          anotherName = 'movie'
          break
        case 'live':
          anotherName = 'txLive'
          break
      }
      let videoTabs = this.videoTabs
      resourceArr.map((item, index) => {
        const categoryId = item.categoryId
        const data = this.callbackParam(resourceName, item, source)
        let selected = Object.assign({}, data)
        selected.vid = item.vid
        selected.sid = item.sid
        const clickParams = JSON.stringify(this.paramIdFun(selected))
        if (resourceName === 'video') {
          const entity = resources['video'][index].ccVideoSourceEntities[0]
          const score = entity.score
          const updatedSegment = entity.updatedSegment
          const publishSegment = entity.publishSegment
          // eslint-disable-next-line
          const isUnknown = publishSegment == 0
          const publishStatus = isUnknown
            ? 'unknown'
            : updatedSegment === publishSegment
              ? 'ended'
              : 'updating'
          data.publishStatus = publishStatus
          data.score = score
          data.series = isUnknown ? null : updatedSegment
          data.variety = entity.lastCollection
        }
        let newTab = this.getDefaultVideoTab()
        Object.assign(newTab, {
          title: data.title,
          subTitle: data.subTitle,
          mediaResourceId: data.thirdIdOrPackageName,
          clickParams,
          coverType: 'media',
          clickTemplateType: anotherName,
          videoContentType_click: anotherName,
          clickType: 'detail',
          publishStatus: data.publishStatus,
          score: data.score,
          series: data.series,
          variety: data.variety,
          categoryId
        })
        for (let count = 0; count < this.sizeTags.length; count++) {
          newTab.picInfoList.push(this.genPicInfo())
        }
        newTab.imageInfoList = item.imageInfoList
        videoTabs.push(newTab)
      })
    },
    handleBlurSort(index) {
      const videoTabs = this.videoTabs
      this.videoTabs = []
      this.$nextTick(() => {
        this.videoTabs = videoTabs.sort((a, b) => {
          return b['priority'] - a['priority']
        })
      })
    },
    handleSubmit(status) {
      let isFormValid = true
      this.$refs.basicForm.validate((valid) => {
        if (!valid) {
          isFormValid = false
        }
      })
      if (!isFormValid) {
        return
      }

      const { basicForm, videoTabs } = this
      // 清除空的tab
      let videoList = videoTabs.filter(item => {
        return typeof (item.mediaResourceId) !== 'undefined'
      })
      // 是否所有都配置了videoId
      let isAll = videoList.every(item => {
        return item.videoId
      })
      if (isAll) {
        basicForm.flagAllVideoPoster = 1
      }
      // 检查重复的
      let repeatArr = []
      for (let i = 0; i < videoTabs.length - 1; i++) {
        for (let j = i + 1; j < videoTabs.length - i; j++) {
          if (videoTabs[i].mediaResourceId === videoTabs[j].mediaResourceId) {
            repeatArr[0] = i + 1
            repeatArr[1] = j + 1
            break
          }
        }
      }
      if (repeatArr.length !== 0) {
        let tipText = '影片 ' + repeatArr[0] + ' 和影片 ' + repeatArr[1] + ' 资源重复'
        this.$alert(tipText, '提示', {
          confirmButtonText: '确定'
        })
        return
      }

      let basicParam = {
        ...basicForm,
        status
      }
      this.checkParams(basicParam, videoList, function() {
        let saveForm = Object.assign({}, basicParam)
        saveForm.videoList = videoList.length === 0 ? undefined : cloneDeep(videoList)
        // parse
        if (this.mode === 'replicate') {
          saveForm.currentVersion = undefined
        }
        if (saveForm.videoList && saveForm.videoList.length !== 0) {
          saveForm.videoList.map(video => {
            // parse videoList
            video.picList = video.picInfoList.map(item => {
              return item.pictureUrl
            })
            video.picInfoList = undefined
            video.imageInfoList = undefined
            // 推荐流若没有配置视频海报，则用点击资源代替视频海报
            if (!video.params) {
              video.params = video.clickParams
            }
            if (!video.videoContentType) {
              video.videoContentType = video.videoContentType_click
            }
            video.videoContentType_click = undefined
          })
        }

        console.log('save', saveForm)
        this.$service.saveMediaAutomation({ jsonStr: JSON.stringify(saveForm) }, '保存成功').then(() => {
          this.$emit('upsert-end')
        })
      }.bind(this))
    },
    handleSubmitAudit() {
      this.handleSubmit(3)
    },
    handleSaveDraft() {
      this.handleSubmit(2)
    },
    checkParams(basicParam, videos, cb) {
      const sizeTags = this.sizeTags
      if (!this.checkBasicParam(basicParam)) {
        this.$message.error('流基本设置，信息不完整')
      } else {
        if (videos.length === 0) {
          if (sizeTags.length !== 0) {
            this.$message.error('若未配置影片，请删除尺寸')
            return false
          } else {
            cb()
          }
        } else {
          const picSize = sizeTags.map(item => {
            return item.width + '*' + item.height
          })
          basicParam.picSize = picSize
          let isAll = true
          videos.some((item, index) => {
            if (!this.checkVideoList(item)) {
              const msg = '影片 ' + (index + 1) + '  配置不完整，无法保存'
              this.$alert(msg, {
                confirmButtonText: '确定'
              })
              isAll = false
              return true
            }
          })
          if (isAll) {
            cb()
          }
        }
      }
    },
    checkVideoList(video) {
      const { videoListParams } = this
      let isPass = true
      videoListParams.forEach(param => {
        if (param === 'picInfoList') { // 兼容预览
          isPass = !video.picInfoList.some(item => {
            return item.pictureUrl === undefined || item.pictureUrl === ''
          })
        } else if (!video[param]) {
          isPass = false
        }
      })
      if (!isPass) {
        return isPass
      } else {
        if (video.picInfoList.length === 0) {
          isPass = false
        }
      }
      return isPass
    },
    checkBasicParam(basicParams) {
      const params = this.params
      let isPass = true
      params.forEach(item => {
        if (!basicParams[item]) {
          isPass = false
        }
      })
      return isPass
    },
    /**
     * 审核按钮组
     */
    handleCopy(status) {
      const STATUS = this.$consts.status
      if (status === STATUS.waiting) {
        this.handleSubmitAudit()
      } else {
        this.handleSaveDraft()
      }
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
            s.thumb = selectedEpisode.thumb
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
          break
        }
        case 'app': {
          s.contentType = 'app'
          s.coverType = 'app'
          s.thirdIdOrPackageName = selected.appPackageName
          s.pictureUrl = selected.appImageUrl
          s.title = selected.appName
          s.type = 'app'
          break
        }
        case 'edu': {
          s.contentType = 'edu'
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
          break
        }
        case 'rotate': {
          s.contentType = 'rotate'
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
    paramIdFun(selected) {
      // 封装保存的id
      let param
      if (selected.contentType === 'movie') {
        param = {
          id: selected.thirdIdOrPackageName
        }
        if (selected.vid) {
          param.vid = selected.vid
        }
        if (selected.sid) {
          param.sid = selected.sid
        }
      } else if (
        selected.contentType === 'app' ||
        selected.contentType === 'edu' ||
        selected.contentType === 'txLive'
      ) {
        param = {
          id: selected.thirdIdOrPackageName
        }
      } else if (selected.contentType === 'bigTopic') {
        param = {
          pTopicCode: selected.thirdIdOrPackageName
        }
      } else if (selected.contentType === 'topic') {
        // this.smallTopics = true;
        param = {
          topicCode: selected.thirdIdOrPackageName
        }
      } else if (selected.contentType === 'rotate') {
        param = {
          rotateId: selected.thirdIdOrPackageName
        }
      }

      return param
    },
    fetchData(version) {
      this.$service.getMediaAutomationDetial({ id: this.id, version }).then(data => {
        this.setBasicInfo(data)
      })
    },
    setBasicInfo(data) {
      let basicForm = this.basicForm
      basicForm.id = data.id
      basicForm.name = data.name
      basicForm.openStatus = data.openStatus
      basicForm.type = data.type || 'normal'
      basicForm.currentVersion = data.currentVersion
      basicForm.duplicateVersion = data.duplicateVersion
      basicForm.status = data.status
      basicForm.source = data.source
      this.videoTabs = []
      this.videoTabs = (data.videoList || [])
        .map(item => {
          item.picList = item.picList || []
          return item
        })
        .sort((a, b) => {
          return b.priority - a.priority
        })
      this.sizeTags = []
      if (data.picSize.length !== 0) {
        data.picSize.map(item => {
          const picInfo = data.picInfoList.find(picInfo => {
            return item === picInfo.picSize
          })
          this.sizeTags.push(
            {
              width: item.split('*')[0],
              height: item.split('*')[1],
              closable: picInfo.canDelete
            }
          )
        })
      }
      console.log('dataDetail', data)
    }
  },

  created() {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.$service.getMediaAutomationDetial({ id: this.id, version: this.version }).then(data => {
        this.setBasicInfo(data)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.base-info
  margin 10px 0
  padding 10px
  font-size 13px
  border 1px solid #e7e4c2
  background #fef8b8
.el-row .el-button
  width 85px
.createBtn-container
  margin 27px 0 0 27px
.video-select--header
  margin 20px 0
.num-input
  width 100px
  margin 0 20px
.title-input
  width 357px
.text-center-align
  text-align center
.size-btn-group
  margin-top 20px
.size-btn-group .el-button
  width 85px
.size-tag
  margin-left 10px
.videoTab--wrapper
  width 80%
  margin 20px
.batch-btn
  margin 0 10px
.type-tip
  display inline-block
  margin 0 5px
  border 1px solid #e7e4c2
  background #fef8b8
  padding 0 5px
  font-size 10px
</style>
