<template>
  <div class="plugin-content">
    <el-form
      v-if="form"
      :model="formWithComputedVal"
      :rules="rules"
      ref="form"
      label-width="120px">
      <template v-if="mode !== 'read'">
        <template v-if="pluginType === 'REFERENCE_VOTE'">
          <template v-if="form.dataType === 7">
            <el-form-item label="人群" prop="dmpRegistryInfo">
              <el-button @click="handleSelectCrowdStart" type="primary" plain>
                选择人群
              </el-button>
              <span v-if="form.dmpRegistryInfo">
                已选择: {{ form.dmpRegistryInfo.dmpPolicyName }}({{ form.dmpRegistryInfo.dmpPolicyId }})/{{ form.dmpRegistryInfo.dmpCrowdName }}({{ form.dmpRegistryInfo.dmpCrowdId }})
              </span>
            </el-form-item>
          </template>
          <el-form-item label="活动id" prop="voteActiveId">
            <InputPositiveInt placeholder="activeId" v-model="voteActiveId"></InputPositiveInt>
          </el-form-item>
          <div>
            <el-form-item
              label="海报"
              prop="poster.pictureUrl"
              :rules="rules.poster.pictureUrl">
              <GlobalPictureSelector
                class="poster"
                :disabled="mode === 'read'"
                @select-end="handleSelectPosterEnd">
                <img
                  class="poster__img"
                  v-if="form.poster.pictureUrl"
                  :src="form.poster.pictureUrl"
                >
                <div v-else class="poster__placeholder">
                </div>
              </GlobalPictureSelector>
            </el-form-item>
          </div>
        </template>
        <template v-else>
          <template v-if="parentType === 'builtIn'">
            <el-form-item
              label="状态栏文字">
              <el-row style="max-width: 450px">
                <el-col :span="11">
                  <el-form-item  :rules="rules.barText" prop="title">
                    <el-input v-model.trim="form.title"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="textAlignCenter">|</el-col>
                <el-col :span="11">
                    <el-form-item prop="subTitle">
                    <el-input v-model.trim="form.subTitle"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-input v-model.trim="item.title"></el-input>|
              <el-input v-model.trim="item.subTitle"></el-input>-->
            </el-form-item>
          </template>
          <template v-if="versionHasTitle">
            <el-form-item
              label="标题"
              prop="title"
              :rules="rules.title"
            >
              <el-input v-model.trim="form.title"></el-input>
            </el-form-item>
            <el-form-item
              label="副标题"
              prop="subTitle"
              :rules="rules.subTitle"
            >
              <el-input v-model.trim="form.subTitle"></el-input>
            </el-form-item>
          </template>
          <template v-if="parentType === 'secKill'">
            <el-form-item
              label="商品ID"
              prop="goodsId"
              :rules="rules.goodsId"
            >
              <el-input v-model.trim="form.goodsId"></el-input>
            </el-form-item>
            <el-form-item
              label="商品名称"
              prop="title"
              :rules="rules.goodsId"
            >
              <el-input v-model.trim="form.title"></el-input>
            </el-form-item>
          </template>

          <template v-if="form.dataType === 7">
            <el-form-item label="人群" prop="dmpRegistryInfo">
              <el-button @click="handleSelectCrowdStart" type="primary" plain>
                选择人群
              </el-button>
              <span v-if="form.dmpRegistryInfo">
                已选择: {{ form.dmpRegistryInfo.dmpPolicyName }}({{ form.dmpRegistryInfo.dmpPolicyId }})/{{ form.dmpRegistryInfo.dmpCrowdName }}({{ form.dmpRegistryInfo.dmpCrowdId }})
              </span>
            </el-form-item>
          </template>

          <div>
            <!-- 不知哪里的问题，要加个 div 才会校验 -->
            <el-form-item
              label="海报"
              prop="poster.pictureUrl"
              :rules="rules.poster.pictureUrl">
              <GlobalPictureSelector
                class="poster"
                :disabled="mode === 'read'"
                @select-end="handleSelectPosterEnd">
                <img
                  class="poster__img"
                  v-if="form.poster.pictureUrl"
                  :src="form.poster.pictureUrl"
                >
                <div v-else class="poster__placeholder">
                </div>
              </GlobalPictureSelector>
            </el-form-item>
          </div>

          <template v-if=" pluginType === 'REFERENCE_ACTIVITY'">
            <el-form-item
              label="异形焦点"
              prop="extendInfo.focusImgUrl"
              :rules="rules.focusImgUrl"
            >
              <GlobalPictureSelector
                class="poster"
                :disabled="mode === 'read'"
                @select-end="handleSelectFocusImgEnd"
              >
                <img
                  class="poster__img"
                  v-if="form.extendInfo.focusImgUrl"
                  :src="form.extendInfo.focusImgUrl"
                >
                <div v-else class="poster__placeholder">
                </div>
              </GlobalPictureSelector>
            </el-form-item>
            <el-form-item
              label="存活时间"
              prop="extendInfo.aliveTime"
              :rules="rules.aliveTime"
            >
              <InputMinute v-model="form.extendInfo.aliveTime" :max="60 * 24 - 1" :min="5" />
            </el-form-item>
            <el-form-item
              label="点击次数"
              prop="extendInfo.clickCount"
              :rules="rules.clickCount"
            >
              <el-input v-model.number="form.extendInfo.clickCount"></el-input>
            </el-form-item>
          </template>
          <el-form-item
            v-if="parentType === 'multi' || parentType === 'secKill' || parentType === 'builtIn'"
            label="打开方式"
            prop="openMode"
            :rules="rules.openMode">
            <el-select :value="form.openMode" @input="handleChangeOpenMode(form, $event)">
                <el-option label="网页" value="webpage"></el-option>
              <!-- <template v-if=" pluginType === 'REFERENCE_ACTIVITY'"> -->
                <el-option label="视频" value="video"></el-option>
                <el-option label="图片" value="picture"></el-option>
                <el-option label="版面" value="tab"></el-option>
              <!-- </template> -->
              <el-option label="第三方应用" value="app"></el-option>
            </el-select>
            <el-button
              class="marginL"
              v-if="form.openMode === 'app'"
              type="primary"
              plain
              @click="handleSelectClickStart()">快速填充</el-button>
          </el-form-item>
          <template v-if="form.openMode === 'webpage'">
            <el-form-item
              label="网页地址"
              prop="onclick.webpageUrl"
              :rules="rules.webpageUrl"
            >
              <el-input v-model.trim="form.onclick.webpageUrl"></el-input>
            </el-form-item>
            <el-form-item label="网页类型" prop="onclick.webpageType">
              <el-radio-group v-model="form.onclick.webpageType">
                <el-radio label="1">浮窗网页</el-radio>
                <el-radio label="2">全屏网页</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              key="webpageAppVersion"
              label="应用版本号"
              prop="onclick.webpageAppVersion"
              :rules="rules.webpageAppVersion">
              <el-input v-model.trim="form.onclick.webpageAppVersion"></el-input>
            </el-form-item>
          </template>
          <template v-if="form.openMode === 'video'">
            <el-form-item
              label="视频名称"
              prop="onclick.videoName"
              :rules="rules.videoName"
            >
              <el-input v-model.trim="form.onclick.videoName"></el-input>
            </el-form-item>
            <el-form-item
              label="视频地址"
              prop="onclick.videoUrl"
              :rules="rules.videoUrl"
            >
              <el-input v-model.trim="form.onclick.videoUrl"></el-input>
            </el-form-item>
          </template>
          <template v-if="form.openMode === 'tab'">
            <el-form-item
              label="版面"
              prop="onclick.tab"
              :rules="rules.tab">
            <TabSelector @select-end="handleSelectTabEnd($event, form)"
              :source="finalSource"
              selectionType="single" />
              <el-tag type="primary" v-if="form.onclick.tab">已选择: {{ form.onclick.tab.tabId }}</el-tag>
            </el-form-item>
          </template>
          <template v-if="form.openMode === 'picture'">
            <el-form-item
              label="选择图片"
              prop="onclick.picture"
              :rules="rules.picture"
            >
              <el-upload
                :action="urls.uploadImg"
                :on-success="handleUploadSuccess"
                :on-remove="handleUploadRemove"
                :multiple="false"
                :file-list="form.onclick.picture"
                accept="image/png, image/gif, image/jpeg, image/bmp"
                list-type="picture"
              >
                <el-button type="primary">点击上传</el-button>
                <span slot="tip" class="el-upload__tip">提示:只能上传png/gif/jpg/bmp文件</span>
              </el-upload>
            </el-form-item>
          </template>
          <AppParams
            v-if="form.openMode === 'app'"
            prop-prefix="onclick."
            v-model="form.onclick">
          </AppParams>
          <Params v-if="form.appParams" :params="form.appParams" prop-prefix="appParams." />
        </template>
      </template>
      <template v-else>
        <template v-if="pluginType === 'REFERENCE_VOTE'">
          <template v-if="form.dataType === 7">
            <el-form-item label="人群" prop="dmpRegistryInfo">
              <span v-if="form.dmpRegistryInfo">
                已选择: {{ form.dmpRegistryInfo.dmpPolicyName }}({{ form.dmpRegistryInfo.dmpPolicyId }})/{{ form.dmpRegistryInfo.dmpCrowdName }}({{ form.dmpRegistryInfo.dmpCrowdId }})
              </span>
            </el-form-item>
          </template>
          <el-form-item label="活动id">{{ voteActiveId }}</el-form-item>
          <el-form-item label="海报">
            <div class="poster">
              <img
                class="poster__img"
                v-if="form.poster.pictureUrl"
                :src="form.poster.pictureUrl"
              >
            </div>
          </el-form-item>
        </template>
        <template v-else>
          <template v-if="versionHasTitle">
            <el-form-item label="标题">{{ form.title }}</el-form-item>
            <el-form-item label="副标题">{{ form.subTitle }}</el-form-item>
          </template>
          <template v-if="parentType === 'builtIn'">
            <el-form-item
              label="状态栏文字"
            >{{ form.title }} {{ form.subTitle ? (' | ' + form.subTitle) : '' }}</el-form-item>
          </template>
          <template v-if="parentType === 'secKill'">
            <el-form-item label="商品ID">{{ form.goodsId }}</el-form-item>
            <el-form-item label="商品名称">{{ form.title }}</el-form-item>
          </template>
          <template v-if="form.dataType === 7">
            <el-form-item label="人群" prop="dmpRegistryInfo">
              <span v-if="form.dmpRegistryInfo">
                已选择: {{ form.dmpRegistryInfo.dmpPolicyName }}({{ form.dmpRegistryInfo.dmpPolicyId }})/{{ form.dmpRegistryInfo.dmpCrowdName }}({{ form.dmpRegistryInfo.dmpCrowdId }})
              </span>
            </el-form-item>
          </template>
          <el-form-item label="海报">
            <div class="poster">
              <img
                class="poster__img"
                v-if="form.poster.pictureUrl"
                :src="form.poster.pictureUrl"
              >
            </div>
          </el-form-item>
          <template v-if=" pluginType === 'REFERENCE_ACTIVITY'">
            <el-form-item label="异形焦点">
              <div v-if="form.extendInfo.focusImgUrl" class="focus-transition">
                <img class="focus-transition__img" :src="form.extendInfo.focusImgUrl">
              </div>
              <span v-else>无</span>
            </el-form-item>
            <el-form-item label="存活时间">{{ parseMinToStr(form.extendInfo.aliveTime) }}</el-form-item>
            <el-form-item label="点击次数">{{ form.extendInfo.clickCount}}</el-form-item>
          </template>
          <el-form-item
            v-if="parentType === 'multi' || parentType === 'secKill'"
            label="打开方式"
          >{{ OPEN_MODE_TEXT[form.openMode] }}</el-form-item>
          <template v-if="form.openMode === 'webpage'">
            <el-form-item label="网页地址">{{ form.onclick.webpageUrl }}</el-form-item>
            <el-form-item label="网页类型">{{ ['', '浮窗网页', '全屏网页'][+form.onclick.webpageType] }}</el-form-item>
            <el-form-item label="应用版本号">{{ form.onclick.webpageAppVersion }}</el-form-item>
          </template>
          <template v-if="form.openMode === 'video'">
            <el-form-item label="视频名称">{{ form.onclick.videoName }}</el-form-item>
            <el-form-item label="视频地址">{{ form.onclick.videoUrl }}</el-form-item>
          </template>
          <template v-if="form.openMode === 'picture'">
            <el-form-item label="图片">
              <div class="open-picture">
                <img class="open-picture__img" :src="form.onclick.picture[0].url">
              </div>
            </el-form-item>
          </template>
          <template v-if="form.openMode === 'tab'">
            <el-form-item label="版面">{{ form.onclick.tab.tabId }}</el-form-item>
          </template>
          <AppParamsRead
            v-if="form.openMode === 'app'"
            v-model="form.onclick"
            label-width="140px"/>
          <Params v-if="form.appParams" :params="form.appParams" :readonly="true" />
        </template>
      </template>
    </el-form>

    <!--点击事件弹框-->
    <el-dialog :visible.sync="showClickSelector" width="1200px">
      <ClickSelector @row-click="handleSelectClickEnd"></ClickSelector>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showClickSelector = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogClickTableVisible = false;clickSubmit()">确 定</el-button> -->
      </div>
    </el-dialog>

    <CrowdSelector
      v-if="showCrowdSelector"
      @select-cancel="handleSelectCrowdCancel"
      @select-end="handleSelectCrowdEnd"
    />

  </div>
</template>

<script>
import AppParams from '@/components/AppParams.vue'
import AppParamsRead from '@/components/AppParamsRead.vue'
import Params from './Params'
import ClickSelector from './selectClick'
import TabSelector from '@/components/selectors/TabSelector'
import CrowdSelector from '@/components/CrowdSelector'
import InputMinute from '@/components/InputMinute'
import InputPositiveInt from '@/components/InputPositiveInt'

import GlobalPictureSelector from '@/components/selectors/GlobalPictureSelector'

const PARENT_TYPES = {
  sign: 'sign', // 标记推荐位
  multi: 'multi',
  builtIn: 'builtIn',
  secKill: 'secKill'
}

const OPEN_MODE_TEXT = {
  webpage: '网页',
  app: '第三方应用',
  video: '视频',
  tab: '版面',
  picture: '图片'
}
export default {
  components: {
    AppParams,
    AppParamsRead,
    Params,
    ClickSelector,
    TabSelector,
    CrowdSelector,
    InputMinute,

    GlobalPictureSelector,
    InputPositiveInt
  },
  data () {
    return {
      form: null,
      showCrowdSelector: false,
      showClickSelector: false,
      showFocusImgSelectorVisible: false,
      PARENT_TYPES,
      OPEN_MODE_TEXT,
      urls: {
        uploadImg: 'api/v1/upload/image.html' // 上传图片接口
      },
      rules: {
        barText: [
          { max: 45, message: '不超过 45 个字符', trigger: 'blur' },
          { required: true, message: '请输入状态栏文字', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 45, message: '不超过 45 个字符', trigger: 'blur' }
        ],
        subTitle: [{ max: 100, message: '不超过 100 个字符', trigger: 'blur' }],
        openMode: [
          { required: true, message: '请选择打开方式', trigger: 'blur' }
        ],
        goodsId: [
          { required: true, message: '请填写商品ID', trigger: 'blur' },
          { max: 45, message: '不超过 45 个字符', trigger: 'blur' }
        ],
        webpageUrl: [
          { required: true, message: '请填写网页地址', trigger: 'blur' }
        ],
        webpageAppVersion: [
          { required: true, message: '请填写应用版本号', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              if (val && !/^(-1|\d*)$/.test(val)) {
                return cb(new Error('应用版本号只能是数字或者-1'))
              }
              cb()
            }
          }
        ],
        videoName: [
          { required: true, message: '请填写视频名称', trigger: 'blur' }
        ],
        videoUrl: [
          { required: true, message: '请填写视频地址', trigger: 'blur' }
        ],
        picture: [
          {
            trigger: 'change',
            validator: function (_, value, cb) {
              cb(
                value && value.length > 0 ? undefined : new Error('请上传图片')
              )
            }
          },
          {
            required: true,
            message: '请上传图片'
          }
        ],
        tab: [
          {
            trigger: 'change',
            validator: function (_, value, cb) {
              cb(value ? undefined : new Error('请选择版面'))
            }
          },
          {
            required: true,
            message: '请选择版面'
          }
        ],
        clickCount: [
          { required: true, message: '请填入点击次数' },
          { type: 'number', message: '请填入数字' },
          {
            validator: function (_, value, cb) {
              if (/^[1-9][0-9]*$/.test(value)) {
                cb()
              } else {
                cb(new Error('请输入正整数'))
              }
            }
          }
        ],
        aliveTime: [
          { required: true, message: '请填入存活时间' },
          { type: 'number', message: '请填入数字' }
        ],
        focusImgUrl: [{ required: true, message: '请选择异形焦点' }],
        poster: {
          pictureUrl: [
            { required: true, message: '请选择海报', trigger: 'blur' }
          ]
        },
        dmpRegistryInfo: [
          { required: true, message: '请选择人群', trigger: 'blur' }
        ],
        voteActiveId: [
          { required: true, message: '请输入活动id (activeId)', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['mode', 'plugin', 'pluginList', 'pluginType', 'parentType', 'source'],
  computed: {
    formWithComputedVal () {
      return {
        ...this.form,
        voteActiveId: this.voteActiveId
      }
    },
    versionHasTitle () {
      return this.pluginType === 'REFERENCE_MOVIE_VIP'
    },
    voteActiveId: {
      get () {
        const paramItem = (this.plugin.appParams || [])[0] || {}
        return paramItem.value
      },
      set (val) {
        this.plugin.appParams[0].value = val
      }
    },
    finalSource () {
      return this.parentType === 'builtIn' ? undefined : this.source
    }
  },
  methods: {
    validate (cb) {
      const currentForm = this.$refs.form
      if (currentForm) {
        currentForm.validate((valid) => {
          if (valid) {
            cb()
          } else {
            this.$message({
              type: 'error',
              message: '请填写完整表单'
            })
          }
        })
      } else {
        cb()
      }
    },
    handlePluginChange (val) {
      this.form = val
      const $form = this.$refs.form
      if ($form) {
        $form.clearValidate()
      }
    },
    /** 弹框选择素材 */
    handleSelectPosterEnd (data) {
      this.form.poster = {
        pictureId: data.pictureId,
        pictureStatus: data.pictureStatus,
        pictureUrl: data.pictureUrl
      }
    },
    handleSelectClickStart () {
      this.showClickSelector = true
    },
    handleSelectClickEnd (data) {
      this.showClickSelector = false
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
      this.form.onclick = o
    },
    /** 打开方式 */
    handleChangeOpenMode (item, openMode) {
      this.$refs['form'].clearValidate()
      item.openMode = openMode
      if (openMode === 'webpage') {
        item.onclick = {
          webpageType: '1',
          webpageUrl: undefined,
          webpageAppVersion: ''
        }
      } else {
        item.onclick = {}
      }
    },
    handleUploadSuccess (response) {
      if (response.success) {
        const item = this.form
        this.$set(item.onclick, 'picture', [
          {
            name: '已上传',
            url: response.data[0].url
          }
        ])
      } else {
        this.$message(response.msg)
      }
    },
    handleUploadRemove (index) {
      const item = this.form
      item.onclick.picture = []
    },
    handleSelectTabEnd (tab, item) {
      this.$set(item.onclick, 'tab', tab)
    },
    handleSelectCrowdStart () {
      this.showCrowdSelector = true
    },
    handleSelectCrowdCancel () {
      this.showCrowdSelector = false
    },
    handleSelectCrowdEnd (policy, crowd) {
      const currentItem = this.form
      const dmpPolicyId = policy.value
      const dmpPolicyName = policy.label
      const dmpCrowdId = crowd.value
      const dmpCrowdName = crowd.label
      const isCrowdHasBeenSelected = this.pluginList.find((item) => {
        return item.dmpRegistryInfo && item.dmpRegistryInfo.dmpCrowdId === dmpCrowdId && item !== currentItem
      })

      if (!isCrowdHasBeenSelected) {
        this.$set(this.form, 'dmpRegistryInfo', {
          dmpPolicyId,
          dmpCrowdId,
          dmpPolicyName,
          dmpCrowdName
        })
        this.showCrowdSelector = false
      } else {
        this.$message({
          type: 'error',
          message: '该人群已被选择'
        })
      }
    },
    parseMinToStr (min) {
      const hours = Math.floor(min / 60)
      const mins = min % 60
      const hoursStr = hours > 9 ? '' + hours : '0' + hours
      const minsStr = mins > 9 ? '' + mins : '0' + mins
      return hoursStr + ':' + minsStr
    },
    handleTime () {},
    handleSelectFocusImgEnd (data) {
      this.$set(this.form.extendInfo, 'focusImgUrl', data.pictureUrl)
    },
    selectImgSubmit () {}
  },
  created () {
    this.$watch('plugin', this.handlePluginChange, {
      immediate: true
    })
  }
}
</script>

<style scoped>
.plugin-content .poster,
.plugin-content .focus-transition {
  position: relative;
  display: inline-block;
  max-height: 200px;
  max-width: 200px;
  cursor: pointer;
}
.plugin-content .poster__img,
.plugin-content .focus-transition__img {
  max-height: 200px;
  max-width: 200px;
}
.plugin-content .poster__placeholder,
.plugin-content .focus-transition__placeholder {
  border: 1px solid #eee;
  width: 200px;
  height: 200px;
}
.plugin-content .focus-transition__remove {
  position: absolute;
  top: 5px;
  right: 5px;
  color: red;
}
.open-picture__img {
  width: 200px;
}
</style>
