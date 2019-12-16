<template>
  <PageWrapper class="tab-info-wrapper">
    <PageContentWrapper>
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <div class="multi-func-block-upsert">
          <CommonContent
            :mode="mode"
            :resource-info="resourceInfo"
            @replicate="mode = 'replicate'; title='创建副本'"
            @edit="mode = 'edit'; title='编辑'"
            @unaudit="$emit('upsert-end')"
            @shelves="fetchData"
            @submit-audit="handleSubmitAudit($event, $consts.status.waiting)"
            @save-draft="handleSubmitAudit($event, $consts.status.draft)"
            @audit="$emit('upsert-end')"
            @select-version="fetchData"
            @delete="$emit('upsert-end', $event)"
          >
            <!-- <div slot="auditAndDraft">
              <el-button type="primary" @click="handleSubmitAudit">提交审核</el-button>
            </div> -->
            <div class="form-legend-header">
              <i class="el-icon-edit">基本信息</i>
            </div>
            <div v-if="mode!== 'read'">
              <el-form
                ref="blockForm"
                :rules="rules"
                :model="block"
                label-width="140px">
                <el-form-item
                  label="系统功能名称"
                  prop="pluginInfo.pluginName"
                  :rules="rules.pluginInfo.pluginName"
                >
                  <el-input v-model.trim="block.pluginInfo.pluginName"></el-input>
                </el-form-item>
                <div v-if="block.pluginInfo.pluginParentType === 'builtIn'">
                  <el-form-item label="固定刷新时间" prop="pluginInfo.refreshTime">
                    <InputMinute :min="5" :max="60 * 24 - 1" v-model="block.pluginInfo.refreshTime" />
                  </el-form-item>
                </div>
                <el-form-item
                  v-show="block.pluginInfo.pluginParentType !== 'builtIn'"
                  label="类型"
                  prop="pluginInfo.pluginParentType"
                  :rules="rules.pluginInfo.pluginParentType"
                >
                  <el-select
                    class="plugin-parent-type-selector"
                    :value="block.pluginInfo.pluginParentType"
                    @input="handleChangePluginParentType"
                    :disabled="mode === 'edit' || mode === 'replicate'"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in pluginParentTypes"
                      :key="item.id"
                      :label="item.dictCnName"
                      :value="item.dictEnName"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="pluginParentType !== 'secKill'"
                  label="内容源"
                  prop="pluginInfo.source"
                  :rules="rules.pluginInfo.source"
                >
                  <el-radio-group
                    :value="block.pluginInfo.source"
                    @input="handleChangeSource"
                    :disabled="isDisabledSource"
                  >
                    <el-radio
                      v-for="(item, key) in $consts.sourceNumberOptions"
                      :key="key"
                      :label="item.value"
                    >{{ item.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <!--类型位标记推荐位-->
                <div v-if="pluginParentType === 'sign'">
                  <el-form-item
                    label="标记推荐位类型"
                    prop="pluginInfo.pluginType"
                    :rules="rules.pluginInfo.pluginType"
                  >
                    <el-input :disabled="isReplica" v-model.trim="block.pluginInfo.pluginType"></el-input>
                  </el-form-item>
                </div>
                <!--end-->
                <el-form-item
                  v-if="pluginParentType !== 'sign' && pluginTypes.length > 0"
                  label="多功能推荐位类型"
                  prop="pluginInfo.pluginType"
                  :rules="rules.pluginInfo.pluginType"
                >
                  <el-select
                    class="plugin-type-selector"
                    :value="block.pluginInfo.pluginType"
                    @input="handleChangePluginType"
                    placeholder="请选择"
                    style="width: 300px; max-width: 300px"
                  >
                    <el-option
                      v-for="item in pluginTypes"
                      :key="item.dictId"
                      :label="item.dictCnName"
                      :value="item.dictEnName"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div v-if="baseHasTitle">
                  <el-form-item label="标题" prop="helper.title" :rules="rules.title">
                    <el-input v-model.trim="block.helper.title"></el-input>
                  </el-form-item>
                  <el-form-item label="副标题" prop="helper.subTitle" :rules="rules.subTitle">
                    <el-input v-model.trim="block.helper.subTitle"></el-input>
                  </el-form-item>
                </div>

                <div v-if="pluginParentType === 'sign'">
                  <!-- 扩展参数  -->
                  <Params prop-prefix="helper.appParams." :params="block.helper.appParams" />
                </div>

                <div v-if="pluginParentType && pluginParentType !== 'sign'">
                  <div class="form-legend-header">
                    <span>多版本信息</span>
                  </div>
                  <Gallery
                    class="gallery"
                    :mode="mode"
                    v-model="block.rlsInfo"
                    :active-index="currentIndex"
                    @active-index-change="currentIndex = $event"
                    @activate="handleActivatePluginVersion">
                    <div slot="item" slot-scope="{item, index}">
                      <p class="ellipsis" v-if="item.dmpRegistryInfo">
                        人群: {{ item.dmpRegistryInfo.dmpPolicyName }}({{ item.dmpRegistryInfo.dmpPolicyId }})/{{ item.dmpRegistryInfo.dmpCrowdName }}({{ item.dmpRegistryInfo.dmpCrowdId }})
                      </p>
                      <p class="ellipsis" :title="item.label" v-else>
                        {{ item.label }}
                      </p>
                      <p class="ellipsis" :title="getVersionTitle(item)">{{ getVersionTitle(item) }}</p>
                      <i
                        v-show="item.dataType === 7 || item.dataType === 4"
                        @click.stop="handleRemovePluginVersion(index)"
                        class="el-icon el-icon-close"
                        title="移除">
                      </i>
                    </div>
                    <div class="gallery-add" slot="add">
                      <el-button type="text" @click.stop="handleAddPluginVersion('dmp')">+ 添加DMP</el-button>
                      <br />
                      <el-button v-show="canAddActivity" type="text" @click.stop="handleAddPluginVersion('activity')">+ 添加活动</el-button>
                    </div>
                    <PluginContent
                      slot="detail"
                      ref="pluginContent"
                      :source="source"
                      :mode="mode"
                      :plugin="currentPlugin"
                      :plugin-type="pluginType"
                      :plugin-list="block.rlsInfo"
                      :parent-type="block.pluginInfo.pluginParentType" />
                  </Gallery>
                </div>
              </el-form>
            </div>
            <div v-if="mode=== 'read'">
              <el-form ref="blockForm" label-width="140px">
                <el-form-item
                  label="系统功能名称"
                  prop="pluginInfo.pluginName"
                >{{ block.pluginInfo.pluginName }}</el-form-item>
                <template v-if="block.pluginInfo.pluginParentType === 'builtIn'">
                  <el-form-item
                    label="固定刷新时间"
                    prop="pluginInfo.refreshTime"
                  >
                    {{ parseMinToStr(block.pluginInfo.refreshTime) }}
                  </el-form-item>
                </template>
                <el-form-item
                  v-show="block.pluginInfo.pluginParentType !== 'builtIn'"
                  label="类型"
                  prop="pluginInfo.pluginParentType"
                >{{ pluginParentTypeText }}</el-form-item>
                <el-form-item
                  v-if="pluginParentType !== 'secKill'"
                  label="内容源"
                >{{ $consts.sourceNumberText[block.pluginInfo.source] }}</el-form-item>
                <div v-if="pluginParentType === 'sign'">
                  <el-form-item
                    label="标记推荐位类型"
                    prop="pluginInfo.pluginType"
                  >{{ block.pluginInfo.pluginType }}</el-form-item>
                </div>
                <el-form-item
                  v-if="pluginParentType !== 'sign' && pluginTypes.length > 0 && pluginTypeText"
                  label="多功能推荐位类型"
                  prop="pluginInfo.pluginType"
                >{{ pluginTypeText }}</el-form-item>

                <template v-if="baseHasTitle">
                  <el-form-item label="标题" prop="helper.title">{{ block.helper.title }}</el-form-item>
                  <el-form-item label="副标题" prop="helper.subTitle">{{ block.helper.subTitle }}</el-form-item>
                </template>

                <div v-if="pluginParentType === 'sign'">
                  <Params :params="block.helper.appParams" :readonly="true" />
                </div>

                <template v-if="pluginParentType !== 'sign'">
                  <div class="form-legend-header">
                    <span>多版本信息</span>
                  </div>
                  <Gallery
                    class="gallery"
                    v-model="block.rlsInfo"
                    :active-index="currentIndex"
                    :mode="mode"
                    @activate="handleActivatePluginVersion">
                    <div slot="item" slot-scope="{item}">
                      <p class="ellipsis" v-if="item.dmpRegistryInfo">
                        人群: {{ item.dmpRegistryInfo.dmpPolicyName }}({{ item.dmpRegistryInfo.dmpPolicyId }})/{{ item.dmpRegistryInfo.dmpCrowdName }}({{ item.dmpRegistryInfo.dmpCrowdId }})
                      </p>
                      <p class="ellipsis" :title="item.label" v-else>
                        {{ item.label }}
                      </p>
                      <p class="ellipsis" :title="getVersionTitle(item)">{{ getVersionTitle(item) }}</p>
                    </div>
                    <PluginContent
                      slot="detail"
                      :source="source"
                      :mode="mode"
                      :addable="false"
                      :plugin="currentPlugin"
                      :plugin-type="pluginType"
                      :parent-type="block.pluginInfo.pluginParentType" />
                  </Gallery>
                </template>
              </el-form>
            </div>
          </CommonContent>
        </div>
      </ContentCard>
    </PageContentWrapper>
  </PageWrapper>
</template>
<script>
import CommonContent from '@/components/CommonContent.vue'
import PluginContent from './PluginContent'
import Gallery from '@/components/Gallery'
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import InputMinute from '@/components/InputMinute'
import Params from './Params'
const PARENT_TYPES = {
  sign: 'sign', // 标记推荐位
  multi: 'multi',
  builtIn: 'builtIn',
  secKill: 'secKill'
}
export default {
  components: {
    CommonContent,
    PluginContent,
    Gallery,
    PageWrapper,
    PageContentWrapper,
    InputMinute,
    Params
  },
  props: ['id', 'initMode', 'version', 'contentProps'],
  data () {
    return {
      currentIndex: 0,
      title: null,
      dialogTableVisible: false,
      dialogClickTableVisible: false,
      showFocusImgSelectorVisible: false, // 异形弹框
      clickData: {}, // 点击事件
      selectImgData: {},
      urls: {
        uploadImg: 'api/v1/upload/image.html' // 上传图片接口
      },
      PARENT_TYPES: PARENT_TYPES,
      mode: 'create',
      pluginParentTypes: [],
      pluginTypes: [],
      pluginVersions: {},
      // showPostSelector: false,
      selectingPostForIndex: undefined,
      showClickSelector: false,
      selectingClickForIndex: undefined,
      showTabSelector: false,
      selectingTabForIndex: undefined,
      showFocusImgSelector: false,
      selectingFocusImgForIndex: undefined,
      block: {
        helper: {
          title: undefined,
          subTitle: undefined,
          // 标记推荐位需要扩展参数
          appParams: [],
          webpageUrl: undefined,
          webpageType: '1',
          webpageAppVersion: undefined
        },
        pluginInfo: {
          pluginId: undefined,
          pluginName: '',
          pluginParentType: undefined,
          // 0，1，2 否 Integer 内容源，0-默认, 1-腾讯，2-爱奇艺
          source: 0,
          // sport-体育， edu-教育，movie-影视
          channel: '',
          // 系统功能类型，系统功能-数据字典查询接口
          pluginType: undefined,
          enableEdit: 1,
          // 系统功能状态，2-草稿，3-待审核，4-审核通过，5-审核不通过
          pluginStatus: undefined,
          refreshTime: this.contentProps.menuElId === 'sysPlugin' ? 240 : ''
        },
        rlsInfo: []
      },
      rules: {
        pluginInfo: {
          pluginName: [
            { required: true, message: '请输入系统功能名称', trigger: 'blur' },
            { max: 45, message: '不超过 45 个字符', trigger: 'blur' }
          ],
          refreshTime: [
            { required: true, message: '请选择固定刷新时间', trigger: 'blur' }
          ],
          pluginParentType: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ],
          pluginType: [{ required: true, message: '不能为空', trigger: 'blur' }]
        },
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 45, message: '不超过 45 个字符', trigger: 'blur' }
        ],
        subTitle: [{ max: 45, message: '不超过 45 个字符', trigger: 'blur' }]
      }
    }
  },
  computed: {
    currentPlugin () {
      return this.block.rlsInfo[this.currentIndex]
    },
    source () {
      // 内容源 1-腾讯;2-爱奇艺;3-优酷;0-默认
      const sources = ['', 'o_tencent', 'o_iqiyi', 'o_youku']
      return sources[this.block.pluginInfo.source]
    },
    // eslint-disable-next-line
    resourceInfo() {
      const form = this.block.pluginInfo
      if (form.pluginId) {
        return {
          id: form.pluginId,
          type: 'systemPlugin',
          menuElId: this.contentProps.menuElId,
          version: form.currentVersion,
          status: form.pluginStatus
        }
      }
    },
    // eslint-disable-next-line
    canAddActivity() {
      if (this.contentProps.menuElId === 'sysPlugin') {
        return !this.block.rlsInfo.find(({ dataType }) => dataType === 4)
      }
    },
    // eslint-disable-next-line
    pluginTypeText() {
      const pluginType = this.pluginType
      const pluginTypes = this.pluginTypes
      if (pluginTypes.length > 0) {
        const target = pluginTypes.find(function (item) {
          return item.dictEnName === pluginType
        })
        if (target) {
          return target.dictCnName
        }
      }
    },
    // eslint-disable-next-line
    pluginParentTypeText() {
      const pluginParentType = this.pluginParentType
      const pluginParentTypes = this.pluginParentTypes
      if (pluginParentTypes.length > 0) {
        const target = pluginParentTypes.find(function (item) {
          return item.dictEnName === pluginParentType
        })
        if (target) {
          return target.dictCnName
        }
      }
    },
    pluginParentType () {
      return this.block.pluginInfo.pluginParentType
    },
    pluginType () {
      return this.block.pluginInfo.pluginType
    },
    isDisabledSource () {
      return this.mode === 'edit'
    },
    versionHasTitle () {
      // 版本信息里是否有 title 字段
      const pluginType = this.pluginType
      return pluginType === 'REFERENCE_MOVIE_VIP'
    },
    baseHasTitle () {
      // 基本信息里是否有 title 字段
      const pluginParentType = this.pluginParentType
      const pluginType = this.pluginType
      return (
        pluginParentType !== 'secKill' &&
        pluginParentType !== 'builtIn' &&
        (pluginType && pluginType !== 'REFERENCE_MOVIE_VIP')
      )
    },
    isReplica () {
      return this.mode === 'replicate' || this.block.duplicateVersion === 'yes'
    }
  },
  watch: {},
  methods: {
    getVersionTitle (item) {
      return `${item.title}${item.subTitle ? (' | ' + item.subTitle) : ''}`
    },
    handleActivatePluginVersion (index) {
      if (this.currentIndex !== index) {
        if (this.mode === 'read') {
          this.currentIndex = index
        } else {
          this.$refs.pluginContent.validate(() => {
            this.currentIndex = index
          })
        }
      }
    },
    handleAddPluginVersion (type) {
      this.$refs.pluginContent.validate(() => {
        const options = type === 'activity'
          ? { label: '活动形式', dataType: 4 }
          : { label: '', dataType: 7 }
        const rlsInfo = this.block.rlsInfo
        rlsInfo.push(
          this.genRlsInfo(options, this.block.pluginInfo.pluginType)
        )
        this.currentIndex = rlsInfo.length - 1
      })
    },
    handleRemovePluginVersion (index) {
      const rlsInfo = this.block.rlsInfo
      rlsInfo.splice(index, 1)
      let currentIndex = this.currentIndex
      const length = rlsInfo.length
      if (currentIndex === index && length > 0) {
        while (!rlsInfo[currentIndex]) {
          currentIndex = currentIndex === 0
            ? length - 1
            : (currentIndex - 1)
        }
        this.currentIndex = currentIndex
      }
    },
    // 时间处理-:转换为数值
    parseStrToMin (str) {
      const timeArr = str.split(':')
      const hours = parseInt(timeArr[0])
      const mins = parseInt(timeArr[1])
      return hours * 60 + mins
    },
    // 转换位时间格式 ：hh:mm
    parseMinToStr (min) {
      const hours = Math.floor(min / 60)
      const mins = min % 60
      const hoursStr = hours > 9 ? '' + hours : '0' + hours
      const minsStr = mins > 9 ? '' + mins : '0' + mins
      return hoursStr + ':' + minsStr
    },
    // 数据回显
    fetchData (version) {
      this.$service.editSysPlugin({ id: this.id, version }).then(data => {
        if (data) {
          this.setData(data)
          // this.pluginType = data.pluginInfo.pluginType
          if (this.pluginType) {
            this.getPluginVersions(this.pluginType).then(
              function (versions) {
                if (versions) {
                  const rlsInfo = this.block.rlsInfo
                  const versionIndexed = versions.reduce((result, item) => {
                    result[item.dictEnName] = item
                    return result
                  }, {})
                  rlsInfo.forEach((item) => {
                    const versionItem = versionIndexed[item.dataType]
                    if (versionItem) {
                      this.$set(item, 'label', versionItem.dictCnName)
                    }
                  })
                }
              }.bind(this)
            )
          }
        }
      })
    },
    // 父数据字典查询接口
    getPluginParentTypes () {
      this.$service.getPluginParentTypes().then(data => {
        console.log(data)
        if (data) {
          this.pluginParentTypes = data.filter(function (item) {
            return item.dictEnName !== 'builtIn'
          })
        }
      })
    },
    // 数据字典查询
    getPluginTypes (pluginParentType) {
      this.$service
        .getPluginTypes({ pluginParentType: pluginParentType })
        .then(data => {
          console.log(data)
          if (data) {
            this.pluginTypes = data
          }
        })
    },
    getPluginVersions (type) {
      const pluginVersions = this.pluginVersions
      return new Promise((resolve, reject) => {
        if (!pluginVersions[type]) {
          this.$service.getPluginVersions(type).then(data => {
            if (data) {
              pluginVersions[type] = data
              resolve(pluginVersions[type])
            }
          })
        } else {
          resolve(pluginVersions[type])
        }
      })
    },
    /** 类容源切换事件 */
    handleChangeSource (val) {
      this.$confirm('确定切换内容源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(
          function () {
            this.$refs['blockForm'].clearValidate()
            this.block.pluginInfo.source = val
          }.bind(this)
        )
        .catch(function (e) {
          throw e
        })
    },
    /** 类型选择——父类 */
    handleChangePluginParentType (val) {
      this.$refs['blockForm'].clearValidate()
      const originType = this.block.pluginInfo.pluginParentType
      const confirmOK = function () {
        this.pluginTypes = []
        this.setPluginParentType(val)
        this.getPluginTypes(val)
        if (val === 'secKill') {
          this.setPluginType('REFERENCE_MALL_SECKILL')
        }
      }.bind(this)

      if (originType && originType !== val) {
        this.$confirm('切换类型将清空版本等相关数据，确定切换？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(confirmOK)
          .catch(function (e) {
            throw e
          })
      } else if (!originType) {
        confirmOK()
      }
    },
    setPluginParentType (val) {
      const block = this.block
      const pluginInfo = block.pluginInfo
      const helper = block.helper
      block.rlsInfo = []
      pluginInfo.source = 0
      pluginInfo.pluginType = undefined
      pluginInfo.pluginParentType = val
      helper.title = ''
      helper.subTitle = ''
      helper.appParams = []
    },
    /** 多功能推荐位类型 */
    handleChangePluginType (val) {
      this.$refs['blockForm'].clearValidate()
      const originType = this.block.pluginInfo.pluginType
      const confirmOK = function () {
        this.setPluginType(val)
      }.bind(this)
      if (originType && originType !== val) {
        this.$confirm('切换类型将清空版本等相关数据，确定切换？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(confirmOK)
          .catch(function () {})
      } else if (!originType) {
        confirmOK()
      }
    },
    setPluginType (val) {
      const block = this.block
      const helper = block.helper
      this.getPluginVersions(val)
        .then(
          function (versions) {
            block.pluginInfo.pluginType = val
            helper.title = ''
            helper.subTitle = ''
            block.rlsInfo = versions.map(
              function (item) {
                return this.genRlsInfo(
                  {
                    label: item.dictCnName,
                    dataType: +item.dictEnName
                  },
                  val
                )
              }.bind(this)
            )
            this.currentIndex = 0
          }.bind(this)
        )
        .then(function () {})
    },
    genRlsInfo (preset, pluginType) {
      let extendInfo = {}
      if (pluginType === 'REFERENCE_ACTIVITY') {
        extendInfo = {
          focusImgUrl: undefined,
          aliveTime: 60,
          clickCount: 5
        }
      }
      let appParams
      if (this.pluginParentType === PARENT_TYPES.multi) {
        appParams = []
      }
      return Object.assign(
        {
          openMode: 'app',
          pluginDataId: undefined,
          dataType: 5,
          onclick: {},
          appParams,
          params: 0,
          title: '',
          subTitle: '',
          goodsId: undefined,
          webpageUrl: undefined,
          poster: {
            pictureId: undefined,
            pictureUrl: undefined
          }
        },
        { extendInfo: extendInfo },
        preset
      )
    },
    selectSubmit () {},
    clickSubmit () {},
    parseOnclick (onclick) {
      if (onclick.params) {
        const params = onclick.params
        onclick.params = Object.keys(onclick.params).map(function (key) {
          return {
            key: key,
            value: params[key]
          }
        })
      }
      return onclick
    },
    getData (status) {
      const data = JSON.parse(JSON.stringify(this.block))
      if (this.mode === 'replicate') {
        data.pluginInfo.currentVersion = ''
      }
      data.pluginInfo.pluginStatus = status
      return data
    },
    validateData (data, cb) {
      const error = (msg) => {
        this.$message({
          type: 'error',
          message: msg
        })
      }
      const checkRlsInfo = (cb) => {
        // 可能存在个别版本用户从没切换过去，导致信息没填
        // 海报是每个版本都必填都，所以检查海报信息来确认
        if (data.rlsInfo && data.rlsInfo.length > 0) {
          const invalid = data.rlsInfo.find((item) => {
            return item.poster && !item.poster.pictureUrl
          })
          if (invalid) {
            return error('请把每个版本都信息填写完整')
          }
        }
        cb()
      }
      this.$refs.blockForm.validate(
        function (valid) {
          if (valid) {
            const pluginContent = this.$refs.pluginContent
            // 标记推荐位没有版本信息
            if (pluginContent) {
              pluginContent.validate(() => {
                checkRlsInfo(() => {
                  cb(data)
                })
              })
            } else {
              checkRlsInfo(() => {
                cb(data)
              })
            }
          } else {
            error('请把表单填写完整')
          }
        }.bind(this)
      )
    },
    setData (data) {
      const helper = this.block.helper
      const block = JSON.parse(JSON.stringify(data))
      const pluginParentType = block.pluginInfo.pluginParentType
      const pluginType = block.pluginInfo.pluginType
      block.rlsInfo.forEach(
        function (item) {
          item.openMode = item.params.split(',')[0].split('==')[1]
          if (item.appParams) {
            const appParams = JSON.parse(item.appParams)
            item.appParams = Object.keys(appParams).map(key => ({ key, value: appParams[key] }))
          }
          if (item.onclick) {
            item.onclick = this.parseOnclick(JSON.parse(item.onclick))
            const originOnclick = item.onclick
            const paramsIndexed = originOnclick.params.reduce((result, item) => {
              result[item.key] = item.value
              return result
            }, {})
            switch (item.openMode) {
              case 'webpage':
                item.onclick = {
                  webpageType:
                    originOnclick.byvalue === 'coocaa.intent.action.browser'
                      ? '1'
                      : '2',
                  webpageUrl: paramsIndexed.url,
                  webpageAppVersion: originOnclick.versioncode
                }
                break
              case 'video':
                item.onclick = {
                  videoName: paramsIndexed.name,
                  videoUrl: paramsIndexed.url
                }
                break
              case 'picture':
                item.onclick = {
                  picture: [
                    {
                      name: '已上传',
                      url: paramsIndexed.url
                    }
                  ]
                }
                break
              case 'tab':
                item.onclick = {
                  tab: {
                    tabId: paramsIndexed.id
                  }
                }
            }
          }
          item.extendInfo = item.extendInfo || {}
        }.bind(this)
      )
      if (pluginParentType) {
        this.getPluginTypes(pluginParentType)
      }

      const firstRls = block.rlsInfo[0] || {}
      if (
        pluginParentType !== 'secKill' &&
        (pluginType && pluginType !== 'REFERENCE_MOVIE_VIP')
      ) {
        helper.title = firstRls.title
        helper.subTitle = firstRls.subTitle
      }
      // 标记推荐位
      if (pluginParentType === PARENT_TYPES.sign) {
        if (firstRls.appParams) {
          helper.appParams = firstRls.appParams
        }
      }
      this.block = { ...this.block, ...block }
    },
    parseData (data) {
      const helper = data.helper
      const hasBaseTitle = this.baseHasTitle
      const pluginParentType = this.pluginParentType
      if (pluginParentType === 'sign') {
        data.rlsInfo = data.rlsInfo || []
        data.rlsInfo[0] = data.rlsInfo[0] || {
          dataType: 5,
          title: undefined,
          subTitle: undefined
        }
        data.rlsInfo[0].appParams = helper.appParams
      }
      data.rlsInfo.forEach(function (item) {
        const originOnclick = item.onclick
        if (item.openMode) {
          item.params = 'openMode==' + item.openMode
        }
        switch (item.openMode) {
          case 'webpage':
            if (originOnclick.webpageType === '1') {
              // 浮窗网页
              item.onclick = {
                packagename: 'com.coocaa.app_browser', // setPackage
                versioncode: originOnclick.webpageAppVersion,
                dowhat: 'startActivity',
                bywhat: 'action',
                byvalue: 'coocaa.intent.action.browser',
                params: [
                  {
                    key: 'url',
                    value: originOnclick.webpageUrl
                  }
                ],
                exception: {}
              }
            } else if (originOnclick.webpageType === '2') {
              // 全屏网页
              item.onclick = {
                packagename: 'com.coocaa.app_browser',
                versioncode: originOnclick.webpageAppVersion,
                dowhat: 'startActivity',
                bywhat: 'action',
                byvalue: 'coocaa.intent.action.browser.no_trans',
                params: [
                  {
                    key: 'url',
                    value: originOnclick.webpageUrl
                  }
                ],
                exception: {}
              }
            }
            break
          case 'video':
            item.onclick = {
              packagename: 'com.tianci.movieplatform',
              versioncode: '-1',
              dowhat: 'startService',
              bywhat: 'action',
              byvalue: 'coocaa.intent.player.video',
              params: [
                {
                  key: 'name',
                  value: originOnclick.videoName
                },
                {
                  key: 'url',
                  value: originOnclick.videoUrl
                },
                {
                  key: 'needParse',
                  value: 'false'
                },
                {
                  key: 'url_type',
                  value: 'web'
                }
              ],
              exception: {}
            }
            break
          case 'picture':
            item.onclick = {
              packagename: 'com.tianci.movieplatform',
              versioncode: '',
              dowhat: 'startService',
              bywhat: 'action',
              byvalue: 'coocaa.intent.player.image',
              params: [
                {
                  key: 'name',
                  value: ''
                },
                {
                  key: 'url',
                  value: originOnclick.picture[0].url
                }
              ],
              exception: {}
            }
            break
          case 'tab':
            item.params += ',tabType==' + originOnclick.tab.tabType
            item.onclick = {
              packagename: 'com.tianci.movieplatform',
              versioncode: '',
              dowhat: 'startActivity',
              bywhat: 'action',
              byvalue:
                // eslint-disable-next-line
                originOnclick.tab.tabType == 1
                  ? 'coocaa.intent.action.HOME_COMMON_LIST'
                  : 'coocaa.intent.action.HOME_SPECIAL_TOPIC',
              params: [
                {
                  key: 'id',
                  value: originOnclick.tab.tabId
                }
              ],
              exception: {}
            }
            break
          case 'app':
            item.onclick.exception = {
              name: 'onclick_exception',
              value: {
                packagename: 'com.tianci.appstore',
                dowhat: 'startActivity',
                versioncode: '-1',
                params: [
                  {
                    key: 'id',
                    value: originOnclick.packagename
                  }
                ],
                byvalue: 'coocaa.intent.action.APP_STORE_DETAIL',
                bywhat: 'action'
              }
            }
            break
        }

        if (hasBaseTitle) {
          item.title = helper.title
          item.subTitle = helper.subTitle
        }
        if (item.onclick && item.onclick.params) {
          item.onclick.params = item.onclick.params.reduce(function (result, p) {
            result[p.key] = p.value
            return result
          }, {})
          item.onclick = JSON.stringify(item.onclick)
        }
        if (item.appParams) {
          item.appParams = item.appParams.reduce(function (result, p) {
            result[p.key] = p.value
            return result
          }, {})
          item.appParams = JSON.stringify(item.appParams)
        }
        delete item.openMode
      })
      delete data.helper
      return data
    },
    /** 提交审核 */
    handleSubmitAudit (d, status) {
      const data = this.getData(status)
      this.validateData(
        data,
        function () {
          this.submit(data) // 审核保存方法
        }.bind(this)
      )
    },
    /** 审核保存的方法 */
    submit (formData) {
      this.validateData(
        formData,
        function () {
          formData = this.parseData(formData)
          console.log(formData)
          this.$service.SavePlugin(formData, '保存成功').then(data => {
            this.$emit('upsert-end')
          })
        }.bind(this)
      )
    }
  },
  created () {
    this.getPluginParentTypes()
    this.mode = this.initMode || 'create'
    switch (this.mode) {
      case 'create':
        this.title = '新增'
        break
      case 'copy':
        this.title = '复制'
        break
      case 'edit':
        this.title = '编辑'
        break
      case 'replica':
        this.title = '创建副本'
        break
      case 'read':
        this.title = '预览'
        break
    }
    if (this.id) {
      this.fetchData(this.version)
    }
    // if (this.editId !== null && this.editId !== undefined) {
    //   this.title = '编辑'
    //   this.mode = 'edit'
    //   this.getEditData()
    // } else {
    //   this.title = '新增'
    //   this.mode = 'create'
    // }
  }
}
</script>

<style lang="stylus" scoped>
.gallery .el-icon-close
  position absolute
  top 2px
  right 2px
  color red
  cursor pointer
.gallery-add
  text-align center
  padding-top 20px
.ellipsis
  width 100%
  text-overflow ellipsis
  white-space nowrap
  overflow hidden
</style>
