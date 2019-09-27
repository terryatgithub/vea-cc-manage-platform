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
            <el-button type="primary" class="batch-btn" :disabled="isRead">批量选择资源</el-button>
          </ResourceSelector>
          <el-button type="primary" @click="isVisibleSize = !isVisibleSize" :disabled="isRead">添加尺寸</el-button>
          <el-tag 
            v-for="(sizeTag, index) in sizeTags"
            :key="index"
            type="primary" 
            :closable="!isRead"
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
const videoListParams = ['mediaResourceId', 'title', 'showSeries', 'showScore', 'picInfoList']  // picInfoList兼容预览，可转换为picList
const params = ['name', 'source', 'status']

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
        source: 'o_tencent'
      },
      mode: 'create',
      basicForm: {
        id: undefined,
        name: undefined,
        source: 'o_tencent',
        openStatus: undefined,
        currentVersion: undefined,
        flagAllVideoPoster: 0
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
      videoListParams,  // 必填参数
      params
    }
  },

  props: ['id', 'initMode', 'version'],

  computed: {
    resourceInfo() {
      const basicForm = this.basicForm
      if(basicForm.id) {
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
      return mode === 'read'
    },
    isReplica() {
      return this.mode === 'replicate' || this.basicForm.duplicateVersion === 'yes'
    }
  },

  methods: {
    getDefaultVideoTab() {
      return {
        id: undefined,//  影片自增id
        clickTemplateType: undefined,// 点击事件模板类型,refer资源类型
        coverType: 'media',
        videoContentType: undefined, //refer资源类型
        params: undefined,//播放参数json, refer资源id
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
        pictureUrl: '',
        pictureId: undefined,
        pictureStatus: undefined
      }
    },
    handleCreate() {
      const createForm = this.createForm
      this.$refs.createForm.validate(valid => {
        if(valid) {
          this.$service.saveMediaAutomation({jsonStr: JSON.stringify(createForm)}, '保存成功').then(() => {
            this.$emit('upsert-end')
          })
        }else {
          this.$message.error("表单填写不完整")
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
      let old = this.basicForm.source
      this.$confirm('修改源，会删除所有影片和素材，确定要修改', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$confirm('第二次警告，确定要修改' , '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$confirm('最后一个警告，删除后素材无法恢复！' , '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.basicForm.source = val
            this.videoTabs = []
            this.$message.success("成功切换内容源")
          }).catch(messageCancel)
        }).catch(messageCancel)
      }).catch(messageCancel)
    },
    handleAddVideoTab(tabNum) {
      let sizetagsLen = this.sizeTags.length
      if(!tabNum) {
        let newVideoTab = this.getDefaultVideoTab()
        for(let count = 0 ; count < sizetagsLen ; count++ ) {
          newVideoTab.picInfoList.push(this.genPicInfo())
        }
        this.videoTabs.push(newVideoTab)
        this.$message.success("添加成功")
      }else if(!this.newVideoTabNum || this.newVideoTabNum >100 || this.newVideoTabNum <=0){
        this.$message.error("请输入0~100之间的数字")
      }else {
        for(let i=0; i<tabNum; i++) {
          let newVideoTab = this.getDefaultVideoTab()
          for(let count = 0 ; count< sizetagsLen ; count++ ) {
            newVideoTab.picInfoList.push(this.genPicInfo())
          }
          this.videoTabs.push(newVideoTab)
        }
        this.newVideoTabNum = undefined
        this.$message.success("添加成功")
      }
    },
    handleAddTabSize() {
      let newTabSize = Object.assign({}, this.newTabSize)
      if(!newTabSize.width || !newTabSize.height) {
        this.$message.error("宽或高不能为空")
        return
      }
      this.sizeTags.push(newTabSize)
      this.videoTabs.forEach(video => {
        video.picInfoList.push(this.genPicInfo())
      })
      this.newTabSize = {}
      this.isVisibleSize = false
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
        this.$message.success("删除成功")
      })
      
    },
    handleSelectResourcesEnd(resources) {
      console.log('resources', resources);
      const source = this.basicForm.source
      ;['video', 'edu', 'pptv', 'live', 'topic', 'rotate'].forEach(name => {
        const nameRS = resources[name]
        this.handleDiffResources(nameRS, name, source, resources)
      })
    },
    dealCommonParams(resources) {
      console.log('resources', resources);
      const source = this.basicForm.source
      // sigle, length === 1
      const tabName = ['video', 'edu', 'pptv', 'live', 'topic', 'rotate'].filter(name => {
        return resources[name].length !== 0
      }).join("")
      let data = this.callbackParam(tabName, resources[tabName][0], source)
      let selected = Object.assign({}, data)
      selected.vid = data.vid
      selected.sid = data.sid

      const categoryId = resources[tabName][0].categoryId

      let anotherName = tabName
      switch(tabName){
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
      if(tabName === 'video') {
        const entity = resources[tabName][0].ccVideoSourceEntities[0]
        const score = entity.score
        const updatedSegment = entity.updatedSegment
        const publishSegment = entity.publishSegment
        const isUnknown = publishSegment == 0
        const publishStatus = isUnknown
          ? 'unknown'
          : updatedSegment == publishSegment
            ? 'ended'
            : 'updating'
        Object.assign(this.videoTabs[index], {
          publishStatus,
          score,
          series: isUnknown ? null : updatedSegment,
          variety: entity.lastCollection
        })
      }
      this.videoTabs[index].picList = []
    },
    handleSelectNormalSource(resources, index) {
      const { tabName, anotherName, jsonParams, thirdIdOrPackageName } = this.dealCommonParams(resources)
      Object.assign(this.videoTabs[index], {
        params: jsonParams,
        videoContentType: anotherName,
        videoId: thirdIdOrPackageName
      })
    },
    handleDelNormalSource(index) {
      if(this.isRead) {
        return
      }
      this.videoTabs[index].videoId = undefined
      this.videoTabs[index].params = undefined
    },
    handleDiffResources(resourceArr, resourceName, source, resources) {
      let anotherName = resourceName
      switch(resourceName){
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
        if(resourceName === 'video') {
          const entity = resources['video'][index].ccVideoSourceEntities[0]
          const score = entity.score
          const updatedSegment = entity.updatedSegment
          const publishSegment = entity.publishSegment
          const isUnknown = publishSegment == 0
          const publishStatus = isUnknown
            ? 'unknown'
            : updatedSegment == publishSegment
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
        for(let count = 0 ; count < this.sizeTags.length ; count++ ) {
          newTab.picInfoList.push(this.genPicInfo())
        }
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
      if(!isFormValid) {
        return
      }

      const { basicForm, videoTabs } = this
      // 清除空的tab
      let videoList = videoTabs.filter(item => {
        return typeof(item.mediaResourceId) !== 'undefined'
      })
      // 是否所有都配置了videoId
      let isAll = videoList.every(item => {
        return item.videoId
      })
      if(isAll) {
        basicForm.flagAllVideoPoster = 1
      }
      // 检查重复的
      let repeatArr = []
      for(let i = 0; i < videoTabs.length-1; i++ ) {
        for(let j=i+1 ; j< videoTabs.length - i ; j++) {
          if(videoTabs[i].mediaResourceId === videoTabs[j].mediaResourceId) {
            repeatArr[0] = i + 1
            repeatArr[1] = j + 1
            break
          }
        }
      }
      if(repeatArr.length !== 0) {
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
        if(saveForm.videoList && saveForm.videoList.length !== 0) {
          saveForm.videoList.map(video => {
            // parse videoList
            video.picList = video.picInfoList.map(item => {
              return item.pictureUrl
            })
            video.picInfoList = undefined
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

        console.log('save', JSON.stringify(saveForm));
        this.$service.saveMediaAutomation({jsonStr: JSON.stringify(saveForm)}, '保存成功').then(() => {
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
      if(!this.checkBasicParam(basicParam)) {
        this.$message.error("流基本设置，信息不完整")
      }else {
        if(videos.length === 0) {
          cb()
        }else {
          const sizeTags = this.sizeTags
          const picSize = sizeTags.map(item => {
            return item.width + "*" + item.height
          })
          basicParam.picSize = picSize
          let isAll = true
          videos.some((item, index) => {
            if(!this.checkVideoList(item)) {
              const msg = '影片 ' + (index + 1) + '  配置不完整，无法保存'
              this.$alert(msg, {
                confirmButtonText: '确定'
              })
              isAll = false
              return true
            }
          })
          if(isAll) {
            cb()
          }
        }
      }
    },
    checkVideoList(video) {
      const { videoListParams } = this
      let isPass = true
      videoListParams.forEach(param => {
        if(param === 'picInfoList') { // 兼容预览
          isPass = !video[param] || video[param].length === 0 ? false : true
        }else if(!video[param]) {
          isPass = false
          return
        }
      })
      if(!isPass) {
        return isPass
      }else {
        if(video.picInfoList.length === 0){
          isPass = false
        }
      }
      return isPass
    },
    checkBasicParam(basicParams) {
      const params = this.params
      let isPass = true
      params.forEach(item => {
        if(!basicParams[item]){
          isPass = false
          return 
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
    paramIdFun: function(selected) {
      // 封装保存的id
      if (selected.contentType === 'movie') {
        var param = {
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
        var param = {
          id: selected.thirdIdOrPackageName
        }
      } else if (selected.contentType === 'bigTopic') {
        var param = {
          pTopicCode: selected.thirdIdOrPackageName
        }
      } else if (selected.contentType === 'topic') {
        // this.smallTopics = true;
        var param = {
          topicCode: selected.thirdIdOrPackageName
        }
      } else if (selected.contentType === 'rotate') {
        var param = {
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
      if(data.picSize.length !== 0) {
        data.picSize.map(item => {
          this.sizeTags.push(
            {
              width: item.split('*')[0],
              height: item.split('*')[1]
            }
          )
        })
      }
      console.log('dataDetail', data);
    }
  },

  created() {
    this.mode = this.initMode || 'create'
    if(this.id) {
      this.$service.getMediaAutomationDetial({id: this.id, version: this.version}).then(data => {
        this.setBasicInfo(data)
      })
    }
  }
}
</script>

<style  type="stylus" scoped>
.base-info {
  margin: 10px 0;
  padding: 10px;
  font-size: 13px;
  border: 1px solid #e7e4c2;
  background: #fef8b8;
}
.el-row .el-button {
  width: 85px;
}
.createBtn-container {
  margin: 27px 0 0 27px;
}
.video-select--header {
  margin: 20px 0;
}
.num-input {
  width: 100px;
  margin: 0 20px;
}
.title-input {
  width: 357px;
}
.text-center-align {
  text-align: center;
}
.size-btn-group {
  margin-top: 20px;
}
.size-btn-group .el-button{
  width: 85px;
}
.size-tag {
  margin-left: 10px;
}
.videoTab--wrapper {
  width: 75%;
  margin: 20px;
}
.batch-btn {
  margin: 0 10px;
}
</style>