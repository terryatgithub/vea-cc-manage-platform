<template>
  <div>
    <el-form
      ref="normalForm"
      :model="normalForm"
      class="el-form-add"
      :rules="normalRules"
      label-width="120px"
      style="float: left;width: 75%">
      <el-form-item v-if="normalForm.isDmpContent" label="关联定向人群" prop="dmpRegistryInfo">
        <el-button type="primary" @click="handleSelectCrowdStart" :disabled="isReadonly">添加人群</el-button>
        <el-tag
          type="primary"
          v-if="normalForm.dmpRegistryInfo"
        >已选择: {{ normalForm.dmpRegistryInfo.dmpPolicyName}} / {{ normalForm.dmpRegistryInfo.dmpCrowdName}}</el-tag>
      </el-form-item>
      <el-form-item :label="normalResourceBtn" prop="thirdIdOrPackageName">
        <ResourceSelector
          ref="resourceSelector"
          :disable-partner="!!source"
          :source="source"
          v-if="!isManualSetResource && normalResourceBtn==='轮播资源' && !disabled "
          :selectors="['rotate']"
          :is-live="false"
          selection-type="single"
          @select-end="handleSelectNormalSingleResourceEnd($event, 'single')">
          <el-button type="primary" plain>选择资源</el-button>
        </ResourceSelector>
        <ResourceSelector
          ref="resourceSelector"
          :source="source"
          :disable-partner="!!source"
          v-if="!isManualSetResource && normalResourceBtn==='播放资源' && !disabled "
          :selectors="resourceOptionsNormalForm"
          :is-live="false"
          selection-type="single"
          @select-end="handleSelectNormalSingleResourceEnd($event, 'Multiple')"
        >
          <el-button type="primary" plain>选择资源</el-button>
        </ResourceSelector>
        <el-input
          v-if="isManualSetResource"
          v-model="normalForm.thirdIdOrPackageName"
          style="float: left"
          :disabled="disabled"
        ></el-input>
        <el-tag
          type="success"
          class="marginL"
          v-if="normalForm.thirdIdOrPackageName && !isManualSetResource"
        >已选择：{{normalForm.thirdIdOrPackageName}}</el-tag>
        <a
          class="write-play"
          v-if="!isManualSetResource && isGroupModel && !disabled "
          href="#"
          @click="$emit('toggle-manaulset-resource', true)"
        >手动填写播放串</a>
        <a
          class="write-play"
          v-if="isManualSetResource && isGroupModel &&!disabled "
          href="#"
          @click="$emit('toggle-manaulset-resource', false)"
          style="float: left"
        >自动配置播放资源</a>
        <div v-if="configModel === 'sign' && showResourceTip" class="sign-tip">
          信号源模式的第一个资源必须是轮播资源
        </div>
      </el-form-item>
      <div v-if="isGroupModel">
        <el-form-item label="指定子频道" prop="subchannelId" v-if="normalForm.subchannelIs">
          <el-input
            v-model="normalForm.subchannelId"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="normalForm.title" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="副标题" prop="subTitle">
          <el-input v-model="normalForm.subTitle" :disabled="disabled"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="海报" prop="poster.pictureUrl">
        <GlobalPictureSelector
          :disabled="isReadonly"
          picture-resolution='797*449'
          @select-end="handleSelectPostEnd">
          <el-card
            class="post-box"
            style="height: 180px">
            <img
              v-if="normalForm.poster.pictureUrl"
              :src="normalForm.poster.pictureUrl"
              referrerpolicy="no-referrer"
              style="height: 180px;">
          </el-card>
        </GlobalPictureSelector>

      </el-form-item>
      <el-form-item label="角标">
        <el-card class="corner-box">
          <span
            v-for="(corner, index) in normalForm.cornerIconList"
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
                <img :src="corner.imgUrl" referrerpolicy="no-referrer">
                <i
                  class="el-icon-delete"
                  v-if="!disabled"
                  @click.stop="handleRemoveCorner(index)">
                </i>
              </span>
              <el-tag v-else type="success">
                <i class="el-icon-plus"></i>
              </el-tag>
            </CornerSelector>
          </span>
        </el-card>
      </el-form-item>
      <el-form-item label="点击跳转" v-if="isGroupModel">
        <el-radio-group v-model="normalForm.clickType">
          <el-radio label="detail" :disabled="disabled">点击进详情页</el-radio>
          <el-radio
            v-show="couldFullscreen"
            label="play-fullscreen"
            :disabled="disabled"
          >点击直接全屏播放</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="点击事件" prop="sign" v-if="isGroupModel">
        <el-radio-group
          :value="normalForm.sign"
          @input="handleChangeSign"
          :disabled="isManualSetResource"
        >
          <el-radio label="autoSet" :disabled="disabled">跳转本播放资源</el-radio>
          <el-radio label="manualResource" :disabled="disabled">跳转其他播放资源</el-radio>
          <el-radio label="manualSet" :disabled="disabled">手动设置</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label prop="clickParams">
        <div v-if="normalForm.sign === 'manualResource'">
          <ResourceSelector
            ref="resourceSelector"
            v-if="!disabled "
            :disable-partner="!!source"
            :source="source"
            :selectors="resourceOptionsManualResource"
            :is-live="false"
            selection-type="single"
            @select-end="handleSelectNormalSingleOtherResourceEnd($event)"
          >
            <el-button type="primary" plain>选择资源</el-button>
          </ResourceSelector>
          <span v-show="thirdIdOrPackageNameForClick">已选择: {{ thirdIdOrPackageNameForClick }}</span>
        </div>
      </el-form-item>
      <div v-if="normalForm.sign === 'manualSet'">
        <el-form-item label="打开方式">
          <el-select value="第三方应用" :disabled="disabled">
            <el-option value="app">第三方应用</el-option>
          </el-select>
          <el-button
            type="primary"
            class="marginL"
            plain
            :disabled="disabled"
            @click="handleSelectClickEventStart"
          >快速填充</el-button>
        </el-form-item>
        <AppParams prop-prefix="onclick." v-model="normalForm.onclick" v-if="!disabled">
        </AppParams>
        <AppParamsRead :value="normalForm.onclick" v-if="disabled"></AppParamsRead>
      </div>
    </el-form>

    <CrowdSelector
      v-if="showCrowdSelector"
      @select-cancel="handleSelectCrowdCancel"
      @select-end="handleSelectCrowdEnd"
    />
    <!-- 第三方运用快速填充弹框 -->
    <el-dialog :visible.sync="onclickEventVisible" width="1200px">
      <selectClick @row-click="handleSelectClickEvent"></selectClick>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onclickEventVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSelectClickEventEnd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 第三方运用快速填充弹框end -->
  </div>
</template>
<script>
import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
import GlobalPictureSelector from '@/components/selectors/GlobalPictureSelector'
import CornerSelector from '@/components/selectors/CornerIconSelector'

import AppParams from '@/components/AppParams.vue'
import AppParamsRead from '@/components/AppParamsRead.vue'
import CrowdSelector from '@/components/CrowdSelector.vue'

import DialogPicture from '@/components/DialogPicture'
import DialogCorner from '@/components/DialogCorner'
import selectClick from '@/views/blockInfo/selectClick'
import { getSelectedResource, parseResourceContent, setContentForm, getParams } from './broadcastBlockUtil'
export default {
  components: {
    ResourceSelector,
    GlobalPictureSelector,
    CornerSelector,
    AppParams,
    AppParamsRead,
    CrowdSelector,

    DialogPicture,
    DialogCorner,
    selectClick
  },
  data () {
    return {
      onclickEventVisible: false,
      showCrowdSelector: false
    }
  },
  props: ['configModel', 'normalForm', 'normalRules', 'isGroupModel', 'isReadonly', 'source', 'checkCrowd', 'showResourceTip'],
  computed: {
    isManualSetResource () {
      return this.normalForm.type === 'url'
    },
    normalResourceBtn () {
      return this.isGroupModel ? '播放资源' : '轮播资源'
    },
    disabled () {
      return this.isReadonly
    },
    resourceOptionsManualResource (){
      return ['video', 'edu', 'live', 'rotate']
    },
    resourceOptionsNormalForm (){
      return this.showResourceTip && this.configModel === 'sign' 
        ? ['rotate'] 
        : ['video', 'edu', 'live', 'rotate']
    },
    couldFullscreen() {
      const contentType = this.normalForm.contentType
      return ['movie', 'custom', 'edu', 'txLive'].indexOf(contentType) > -1
    },
    thirdIdOrPackageNameForClick() {
      return this.getThirdId(this.normalForm.clickParams)
    },
  },
  methods: {
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
    handleSelectClickEventStart() {
      this.onclickEventVisible = true
    },
    handleSelectClickEvent(data) {
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
      this.normalForm.onclick = o
    },
    handleSelectClickEventEnd() {

    },
    handleSelectNormalSingleResourceEnd(selectedResources, mode) {
      const result = getSelectedResource(selectedResources)
      const resourceContent = parseResourceContent(result.selectedType, result.selected[0], result.partner)
      setContentForm(this.normalForm, resourceContent)
    },
    handleSelectNormalSingleOtherResourceEnd(selectedResources) {
      const result = getSelectedResource(selectedResources)
      const resourceContent = parseResourceContent(result.selectedType, result.selected[0], result.partner)
      this.normalForm.clickParams = getParams(resourceContent)
      this.normalForm.clickTemplateType = resourceContent.contentType
    },
    handleSelectPostEnd (selected) {
      this.normalForm.poster = {
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
      this.$set(this.normalForm.cornerIconList, index, corner)
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
    handleRemoveCorner (index) {
      const corner = {
        cornerIconId: '',
        position: index,
        imgUrl: ''
      }
      this.$set(this.normalForm.cornerIconList, index, corner)
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
          message: '第' + (existsIndex + 1) + '个人群内容已关联该人群'
        })
      } else {
        this.$set(this.normalForm, 'dmpRegistryInfo', {
          dmpPolicyId: policy.value,
          dmpCrowdId: crowd.value,
          dmpPolicyName: policy.label,
          dmpCrowdName: crowd.label
        })
        this.$sendEvent({
          type: 'create_block_dmp',
          payload: {
            type: 'broadcast'
          }
        })
        this.showCrowdSelector = false
      }
    }
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
</style>
