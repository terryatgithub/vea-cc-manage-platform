<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div class="multi-func-block-upsert">
       <div class="form-legend-header">
        <span>基本信息</span>
      </div>
      <el-form ref="blockForm" :rules="rules" :model="block" label-width="140px" class="el-form-add">
        <el-form-item
          label="系统功能名称"
          prop="pluginInfo.pluginName"
          :rules="rules.pluginInfo.pluginName"
        >
          <el-input v-model.trim="block.pluginInfo.pluginName"></el-input>
        </el-form-item>
        <template v-if="block.pluginInfo.pluginParentType === 'builtIn'">
          <el-form-item label="固定刷新时间" prop="pluginInfo.refreshTime">
            <div class="el-input" style="max-width: 400px">
              <el-time-select
                v-model="block.pluginInfo.refreshTime"
                :picker-options="{  start: '00:00', step: '00:10',  end: '24:00' }"
                placeholder="选择时间"
                @change="handleTime"
              ></el-time-select>
            </div>
          </el-form-item>
          <el-form-item label="活动形式" prop="hasActivity">
            <el-radio-group v-model="block.hasActivity" @change="handleChangeActivityFlag">
              <el-radio :label="0">非活动</el-radio>
              <el-radio :label="1">活动</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
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
            :disabled="mode === 'edit'"
            placeholder="请选择"
          >
            <el-option
              v-for="item in pluginParentTypes"
              :key="item.dictId"
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
            <el-radio v-for="(item, key) in SOURCE" :key="key" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--类型位标记推荐位-->
        <template v-if="pluginParentType === 'sign'">
          <el-form-item
            label="标记推荐位类型"
            prop="pluginInfo.pluginType"
            :rules="rules.pluginInfo.pluginType"
          >
            <el-input v-model.trim="block.pluginInfo.pluginType"></el-input>
          </el-form-item>
        </template>
        <!--end-->
        <!--多版本推荐类型-->
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
        <template v-if="baseHasTitle">
          <el-form-item label="标题" prop="helper.title" :rules="rules.title">
            <el-input v-model.trim="block.helper.title"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="helper.subTitle" :rules="rules.subTitle">
            <el-input v-model.trim="block.helper.subTitle"></el-input>
          </el-form-item>
        </template>
        <template v-if="pluginParentType !== 'sign'">
          <div v-for="(item, index) in block.rlsInfo" :key="index">
             <div class="form-legend-header">
              <span>{{ item.label }}</span>
            </div>
            <!--builtIn-->
            <template v-if="block.pluginInfo.pluginParentType === 'builtIn'">
              <el-form-item
                label="状态栏文字"
                :prop="'rlsInfo.' + index + '.title'"
                :rules="rules.barText"
              >
                <el-input v-model.trim="item.title"></el-input>|
                <el-input v-model.trim="item.subTitle"></el-input>
              </el-form-item>
            </template>
            <template v-if="versionHasTitle">
              <el-form-item label="标题" :prop="'rlsInfo.' + index + '.title'" :rules="rules.title">
                <el-input v-model.trim="item.title"></el-input>
              </el-form-item>
              <el-form-item
                label="副标题"
                :prop="'rlsInfo.' + index + '.subTitle'"
                :rules="rules.subTitle"
              >
                <el-input v-model.trim="item.subTitle"></el-input>
              </el-form-item>
            </template>
            <!--builtIn-->
            <template v-if="block.pluginInfo.pluginParentType === 'secKill'">
              <el-form-item
                label="商品ID"
                :prop="'rlsInfo.' + index + '.goodsId'"
                :rules="rules.goodsId"
              >
                <el-input v-model.trim="item.goodsId"></el-input>
              </el-form-item>
              <el-form-item
                label="商品名称"
                :prop="'rlsInfo.' + index + '.title'"
                :rules="rules.goodsId"
              >
                <el-input v-model.trim="item.title"></el-input>
              </el-form-item>
            </template>
            <el-form-item
              label="海报"
              :prop="'rlsInfo.' + index + '.poster.pictureUrl'"
              :rules="rules.poster.pictureUrl"
            >
              <div class="poster" @click="handleSelectPosterStart(index)">
                <img
                  class="poster__img"
                  v-if="item.poster.pictureUrl"
                  :src="item.poster.pictureUrl"
                >
              </div>
            </el-form-item>
            <template v-if=" pluginType === 'REFERENCE_ACTIVITY'">
              <el-form-item
                label="异形焦点"
                :prop="'rlsInfo.' + index + '.extendInfo.focusImgUrl'"
                :rules="rules.focusImgUrl"
              >
                <el-button
                  type="primary"
                  @click="handleSelectFocusImgStart(index)"
                  style="margin-bottom: 10px"
                >选择异形焦点</el-button>
                <div v-if="item.extendInfo.focusImgUrl" class="focus-transition">
                  <i
                    title="移除异形焦点"
                    class="focus-transition__remove el-icon-circle-close"
                    @click="handleRemoveFocusImg(index)"
                  ></i>
                  <img class="focus-transition__img" :src="item.extendInfo.focusImgUrl">
                </div>
              </el-form-item>
              <el-form-item
                label="存活时间"
                :prop="'rlsInfo.' + index + '.extendInfo.aliveTime'"
                :rules="rules.aliveTime"
              >
                <div class="el-input" style="max-width: 400px">
                  <el-time-select
                    v-model="item.extendInfo.aliveTime"
                    :picker-options="{  start: '00:00', step: '00:10',  end: '24:00' }"
                    placeholder="选择时间"
                    @change="handleTime1"
                  ></el-time-select>
                  <!-- <ccTimeSpinner
                    v-model.number="item.extendInfo.aliveTime"
                    :options="{ min: '00:05',height: 34}"
                  ></ccTimeSpinner>-->
                </div>
              </el-form-item>
              <el-form-item
                label="点击次数"
                :prop="'rlsInfo.' + index + '.extendInfo.clickCount'"
                :rules="rules.clickCount"
              >
                <el-input v-model.number="item.extendInfo.clickCount"></el-input>
              </el-form-item>
            </template>
            <el-form-item
              v-if="pluginParentType === 'multi' || pluginParentType === 'secKill' || pluginParentType === 'builtIn'"
              label="打开方式"
              :rules="rules.openMode"
            >
              <el-select :value="item.openMode" @input="handleChangeOpenMode(item, $event)">
                <el-option
                  v-if="pluginParentType === 'builtIn' ||  pluginType === 'REFERENCE_MOVIE_VIP' || pluginType === 'REFERENCE_ACTIVITY'"
                  label="网页"
                  value="webpage"
                ></el-option>
                <template v-if=" pluginType === 'REFERENCE_ACTIVITY'">
                  <el-option label="视频" value="video"></el-option>
                  <el-option label="图片" value="picture"></el-option>
                  <el-option label="版面" value="tab"></el-option>
                </template>
                <el-option label="第三方应用" value="app"></el-option>
              </el-select>
              <el-button
                class="marginL"
                v-if="item.openMode === 'app' "
                type="primary"
                plain
                @click="handleSelectClickStart(index)"
              >快速填充</el-button>
            </el-form-item>
            <template v-if="item.openMode === 'webpage'">
              <el-form-item
                label="网页地址"
                :prop="'rlsInfo.' + index + '.onclick.webpageUrl'"
                :rules="rules.webpageUrl"
              >
                <el-input v-model.trim="item.onclick.webpageUrl"></el-input>
              </el-form-item>
              <el-form-item label="网页类型" :prop="'rlsInfo.' + index + '.onclick.webpageType'">
                <el-radio-group v-model="item.onclick.webpageType">
                  <el-radio label="1">浮窗网页</el-radio>
                  <el-radio label="2">全屏网页</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="应用版本号"
                :prop="'rlsInfo.' + index + '.onclick.webpageAppVersion'"
                :rules="rules.webpageAppVersion"
              >
                <el-input v-model.trim="item.onclick.webpageAppVersion"></el-input>
              </el-form-item>
            </template>
            <template v-if="item.openMode === 'video'">
              <el-form-item
                label="视频名称"
                :prop="'rlsInfo.' + index + '.onclick.videoName'"
                :rules="rules.videoName"
              >
                <el-input v-model.trim="item.onclick.videoName"></el-input>
              </el-form-item>
              <el-form-item
                label="视频地址"
                :prop="'rlsInfo.' + index + '.onclick.videoUrl'"
                :rules="rules.videoUrl"
              >
                <el-input v-model.trim="item.onclick.videoUrl"></el-input>
              </el-form-item>
            </template>
            <template v-if="item.openMode === 'tab'">
              <el-form-item
                label="版面"
                :prop="'rlsInfo.' + index + '.onclick.tab'"
                :rules="rules.tab"
              >
              <TabSelector selectionType="single" :selected-close="true" @select-single="handleSelectTabEnd($event, item)"/>
                <!-- <el-button type="primary" @click="handleSelectTabStart(index)">选择版面</el-button> -->
                <el-tag type="primary" v-if="item.onclick.tab">已选择: {{ item.onclick.tab.tabId }}</el-tag>
              </el-form-item>
            </template>
            <template v-if="item.openMode === 'picture'">
              <el-form-item
                label="选择图片"
                :prop="'rlsInfo.' + index + '.onclick.picture'"
                :rules="rules.picture"
              >
                <el-upload
                  :action="urls.uploadImg"
                  :on-success="createUploadSuccessHandler(index)"
                  :on-remove="createUploadRemoveHandler(index)"
                  :multiple="false"
                  :file-list="item.onclick.picture"
                  accept="image/png, image/gif, image/jpeg, image/bmp"
                  list-type="picture"
                >
                  <el-button type="primary">点击上传</el-button>
                  <span slot="tip" class="el-upload__tip">提示:只能上传png/gif/jpg/bmp文件</span>
                </el-upload>
              </el-form-item>
            </template>
            <!-- <ccAppParamsForm
              v-if="item.openMode === 'app'"
              v-model="item.onclick"
              label-width="140px"
              :prop-prefix="'rlsInfo.' + index + '.onclick.'"
            /> -->
             <AppParams
              v-if="item.openMode === 'app'"
              :prop-prefix="'rlsInfo.' + index + '.onclick.'"
              v-model="item.onclick"
              >
            </AppParams>
          </div>
        </template>
        <el-form-item>
          <el-button type="primary" @click="handleSubmitAudit">提交审核</el-button>
        </el-form-item>
      </el-form>
      <!--海报素材弹框-->
      <el-dialog :visible.sync="dialogTableVisible" width="1200px">
        <selectResource @selected="getSelectResource"></selectResource>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <!-- <el-button type="primary" @click="dialogTableVisible = false;selectSubmit()">确 定</el-button> -->
        </div>
      </el-dialog>
      <!--点击事件弹框-->
      <el-dialog :visible.sync="dialogClickTableVisible" width="1200px">
        <selectClick @row-click="getClickData"></selectClick>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogClickTableVisible = false">取 消</el-button>
          <!-- <el-button type="primary" @click="dialogClickTableVisible = false;clickSubmit()">确 定</el-button> -->
        </div>
      </el-dialog>
      <!--选择异形焦点-->
      <el-dialog :visible.sync="showFocusImgSelectorVisible" width="1200px">
        <selectImg @selectImg="getSelectImg"></selectImg>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showFocusImgSelectorVisible = false">取 消</el-button>
          <!-- <el-button type="primary"  @click="showFocusImgSelectorVisible = false;selectImgSubmit()">确 定</el-button> -->
        </div>
      </el-dialog>
       <!-- <div style="padding: 10px;text-align:right">
        <el-button type="primary" @click="handleSubmitAudit">提交审核</el-button>
      </div> -->
    </div>
  </ContentCard>
</template>
<script>
const PARENT_TYPES = {
  sign: 'sign', //标记推荐位
  multi: 'multi',
  builtIn: 'builtIn',
  secKill: 'secKill'
}
const SOURCE = {
  none: {
    label: '无',
    value: 0
  },
  tencent: {
    label: '腾讯',
    value: 1
  },
  iqiyi: {
    label: '爱奇艺',
    value: 2
  },
  youku: {
    label: '优酷',
    value: 3
  }
}
const STATUS = {
  draft: 2,
  waiting: 3,
  accepted: 4,
  rejected: 5,
  processing: 7
}
window.basicFn = {}
import ccAppParamsForm from './ccAppParamsForm'
import ccTimeSpinner from './ccTimeSpinner'
import selectResource from './selectResource'
import TabSelector from '@/components/selectors/TabSelector'
import selectClick from './selectClick'
import selectImg from './selectImg'
import { AppParams } from 'admin-toolkit'
export default {
  components: {
    ccAppParamsForm,
    ccTimeSpinner,
    selectResource,
    selectClick,
    selectImg,
    AppParams,
    TabSelector
  },
  props: {
    editId: Number,
    default: null
  },
  data() {
    return {
      title: null,
      dialogTableVisible: false,
      dialogClickTableVisible: false,
      showFocusImgSelectorVisible: false,
      clickData: {}, //点击事件
      selectResource: {}, //素材选择事件
      selectImgData: {},
      urls: {
        uploadImg: '/api' + '/uploadHomeImg.html' // 上传图片接口
      },
      STATUS: STATUS,
      PARENT_TYPES: PARENT_TYPES,
      SOURCE: SOURCE,
      mode: 'create',
      pluginParentTypes: [],
      pluginTypes: [],
      pluginVersions: {},
      // showPostSelector: false,
      selectingPostForIndex: undefined,
      // showselectClickor: false,
      selectingClickForIndex: undefined,
      showTabSelector: false,
      selectingTabForIndex: undefined,
      selectingFocusImgForIndex: undefined,
      block: {
        helper: {
          title: undefined,
          subTitle: undefined,
          webpageUrl: undefined,
          webpageType: '1',
          webpageAppVersion: undefined
        },
        pluginInfo: {
          pluginId: undefined,
          pluginName: '',
          pluginParentType: undefined,
          // 0，1，2	否	Integer	内容源，0-默认, 1-腾讯，2-爱奇艺
          source: 0,
          // sport-体育， edu-教育，movie-影视
          channel: '',
          // 系统功能类型，系统功能-数据字典查询接口
          pluginType: undefined,
          enableEdit: 1,
          // 系统功能状态，2-草稿，3-待审核，4-审核通过，5-审核不通过
          pluginStatus: undefined,
          refreshTime: ''
        },
        rlsInfo: [],
        hasActivity: 0
      },
      rules: {
        pluginInfo: {
          pluginName: [
            { required: true, message: '请输入系统功能名称', trigger: 'blur' },
            { max: 45, message: '不超过 45 个字符', trigger: 'blur' }
          ],
          pluginParentType: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ],
          pluginType: [{ required: true, message: '不能为空', trigger: 'blur' }]
        },
        barText: [{ max: 45, message: '不超过 45 个字符', trigger: 'blur' }],
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
          { required: true, message: '请填写应用版本号', trigger: 'blur' }
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
            validator: function(_, value, cb) {
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
            validator: function(_, value, cb) {
              cb(!!value ? undefined : new Error('请选择版面'))
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
            validator: function(_, value, cb) {
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
          // { type: 'number', message: '请填入数字' }
        ],
        focusImgUrl: [{ required: true, message: '请选择异形焦点' }],
        poster: {
          pictureUrl: [
            { required: true, message: '请选择海报', trigger: 'blur' }
          ]
        }
      }
    }
  },
  computed: {
    pluginParentType() {
      return this.block.pluginInfo.pluginParentType
    },
    pluginType() {
      return this.block.pluginInfo.pluginType
    },
    isDisabledSource() {
      return this.mode === 'edit'
    },
    versionHasTitle() {
      // 版本信息里是否有 title 字段
      const pluginParentType = this.pluginParentType
      const pluginType = this.pluginType
      return pluginType === 'REFERENCE_MOVIE_VIP'
    },
    baseHasTitle() {
      // 基本信息里是否有 title 字段
      const pluginParentType = this.pluginParentType
      const pluginType = this.pluginType
      return (
        pluginParentType !== 'secKill' &&
        pluginParentType !== 'builtIn' &&
        (pluginType && pluginType !== 'REFERENCE_MOVIE_VIP')
      )
    }
  },
  watch: {},
  methods: {
       /** 选择版面*/
    handleSelectTabEnd(data, item){
      this.$set(item.onclick, 'tab', data)
    },
    //时间处理-:转换为数值
    parseMinToStr(str) {
      if(str !== undefined){
        const timeArr = str.split(':')
        const hours = parseInt(timeArr[0])
        const mins = parseInt(timeArr[1])
        return hours * 60 + mins
      }

    },
    //转换位时间格式 ：hh:mm
    parseStrToMin(min) {
      const hours = Math.floor(min / 60)
      const mins = min % 60
      const hoursStr = hours > 9 ? '' + hours : '0' + hours
      const minsStr = mins > 9 ? '' + mins : '0' + mins
      return hoursStr + ':' + minsStr
    },
    //数据回显
    getEditData() {
      this.$service.editSysPlugin({ id: this.editId }).then(data => {
        if (data) {
          this.setData(data)
          if (this.pluginType) {
            this.getPluginVersions(this.pluginType).then(
              function(versions) {
                if (versions) {
                  const rlsInfo = this.block.rlsInfo
                  const rlsInfoIndexed = rlsInfo.reduce(function(result, item) {
                    result[item.dataType] = item
                    return result
                  }, {})
                  this.block.rlsInfo = versions.reduce(
                    function(result, item) {
                      const rlsItem = rlsInfoIndexed[item.dictEnName]
                      if (rlsItem) {
                        this.$set(rlsItem, 'label', item.dictCnName)
                        result.push(rlsItem)
                      }
                      return result
                    }.bind(this),
                    []
                  )
                }
              }.bind(this)
            )
          }
        }
      })
    },
    //父数据字典查询接口
    getPluginParentTypes() {
      this.$service.getPluginParentTypes().then(data => {
        if (data) {
          this.pluginParentTypes = data.filter(function(item) {
            return item.dictEnName !== 'builtIn'
          })
        }
      })
    },
    //数据字典查询
    getPluginTypes(pluginParentType) {
      this.$service
        .getPluginTypes({ pluginParentType: pluginParentType })
        .then(data => {
          if (data) {
            this.pluginTypes = data
          }
        })
    },
     /**时间选择时间 */
     handleTime() {},
    handleTime1() {
    },
    getPluginVersions(type) {
      var that = this
      const pluginVersions = this.pluginVersions
      return new Promise(function(resolve, reject) {
        if (!pluginVersions[type]) {
          that.$service.getPluginVersions(type).then(data => {
            console.log(data)
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
    handleChangeSource(val) {
      this.$confirm('确定切换内容源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(
          function() {
            this.block.pluginInfo.source = val
          }.bind(this)
        )
        .catch(function(e) {
          throw e
        })
    },
    handleChangePluginParentType(val) {
      const originType = this.block.pluginInfo.pluginParentType
      const confirmOK = function() {
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
          .catch(function(e) {
            throw e
          })
      } else if (!originType) {
        confirmOK()
      }
    },
    setPluginParentType(val) {
      const PARENT_TYPES = this.PARENT_TYPES
      const SOURCE = this.SOURCE
      const block = this.block
      const pluginInfo = block.pluginInfo
      const helper = block.helper
      block.rlsInfo = []
      pluginInfo.source = SOURCE.none.value
      pluginInfo.pluginType = undefined
      pluginInfo.pluginParentType = val
      helper.title = ''
      helper.subTitle = ''
    },
    handleChangePluginType(val) {
      const originType = this.block.pluginInfo.pluginType
      const confirmOK = function() {
        this.setPluginType(val)
      }.bind(this)
      if (originType && originType !== val) {
        this.$confirm('切换类型将清空版本等相关数据，确定切换？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(confirmOK)
          .catch(function() {})
      } else if (!originType) {
        confirmOK()
      }
    },
    setPluginType(val) {
      const block = this.block
      const helper = block.helper
      this.getPluginVersions(val)
        .then(
          function(versions) {
            block.pluginInfo.pluginType = val
            helper.title = ''
            helper.subTitle = ''
            block.rlsInfo = versions.map(
              function(item) {
                return this.genRlsInfo(
                  {
                    label: item.dictCnName,
                    dataType: +item.dictEnName
                  },
                  val
                )
              }.bind(this)
            )
          }.bind(this)
        )
        .then(function() {})
    },
    genRlsInfo(preset, pluginType) {
      let extendInfo = {}
      if (pluginType === 'REFERENCE_ACTIVITY') {
        extendInfo = {
          focusImgUrl: undefined,
          aliveTime: '',
          clickCount: 5
        }
      }
      return Object.assign(
        {
          openMode: 'app',
          pluginDataId: undefined,
          dataType: 5,
          onclick: {},
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
    handleSelectPosterStart(index) {
      this.selectingPostForIndex = index
      this.dialogTableVisible = true
    },
    handleSelectClickStart(index) {
      // this.showselectClickor = true
      this.selectingClickForIndex = index
      this.dialogClickTableVisible = true
    },
    handleSelectTabStart(index) {
      this.showTabSelector = true
      this.selectingTabForIndex = index
    },
    handleSelectFocusImgStart(index) {
      this.showFocusImgSelectorVisible = true
      this.selectingFocusImgForIndex = index
    },
    handleRemoveFocusImg(index) {
      this.block.rlsInfo[index].extendInfo.focusImgUrl = undefined
    },
    createUploadSuccessHandler: function(index) {
      return function uploadSuccess(response) {
        if (response.success) {
          const item = this.block.rlsInfo[index]
          this.$set(item.onclick, 'picture', [
            {
              name: '已上传',
              url: response.url
            }
          ])
        } else {
          this.$message(response.msg)
        }
      }.bind(this)
    },
    createUploadRemoveHandler(index) {
      return function uploadRemove() {
        const item = this.block.rlsInfo[index]
        item.onclick.picture = []
      }.bind(this)
    },
    parseOnclick(onclick) {
      if (onclick.params) {
        const params = onclick.params
        onclick.params = Object.keys(onclick.params).map(function(key) {
          return {
            key: key,
            value: params[key]
          }
        })
      }
      return onclick
    },
    handleChangeOpenMode(item, openMode) {
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
    getData() {
      const STATUS = this.STATUS
      const data = JSON.parse(JSON.stringify(this.block))
      data.pluginInfo.pluginStatus = STATUS.waiting
      return data
    },
    validateData(data, cb) {
      this.$refs.blockForm.validate(
        function(valid) {
          if (valid) {
            cb(data)
          } else {
            this.$message({
              type: 'error',
              message: '请把表单填写完整'
            })
          }
        }.bind(this)
      )
    },
    setData(data) {
      const helper = this.block.helper
      const block = JSON.parse(JSON.stringify(data))
      const pluginParentType = block.pluginInfo.pluginParentType
      const pluginType = block.pluginInfo.pluginType
      block.rlsInfo.forEach(
        function(item) {
          item.openMode = item.params.split(',')[0].split('==')[1]
          if (item.onclick) {
            item.onclick = this.parseOnclick(JSON.parse(item.onclick))
            const originOnclick = item.onclick
            const paramsIndexed = originOnclick.params.reduce(function(
              result,
              item
            ) {
              result[item.key] = item.value
              return result
            },
            {})
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

      if (
        pluginParentType !== 'secKill' &&
        (pluginType && pluginType !== 'REFERENCE_MOVIE_VIP')
      ) {
        const firstRls = block.rlsInfo[0]
        if (firstRls) {
          helper.title = firstRls.title
          helper.subTitle = firstRls.subTitle
        }
      }

      this.block = Object.assign(this.block, block)
      this.block.pluginInfo.refreshTime = this.parseStrToMin(
        this.block.pluginInfo.refreshTime
      )
      for (let i=0; i<this.block.rlsInfo.length;i++) {
        this.block.rlsInfo[i].extendInfo.aliveTime = this.parseStrToMin(this.block.rlsInfo[i].extendInfo.aliveTime)
      }
    },
    parseData(data) {
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
      }
      data.rlsInfo.forEach(function(item) {
        const originOnclick = item.onclick
        if (item.openMode) {
          item.params = 'openMode==' + item.openMode
        }
        switch (item.openMode) {
          case 'webpage':
            if (originOnclick.webpageType === '1') {
              //浮窗网页
              item.onclick = {
                packagename: 'com.coocaa.app_browser', //setPackage
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
              //全屏网页
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
          item.onclick.params = item.onclick.params.reduce(function(result, p) {
            result[p.key] = p.value
            return result
          }, {})
          item.onclick = JSON.stringify(item.onclick)
        }
        delete item.openMode
      })
      delete data.helper
      return data
    },
    //提交审核
    handleSubmitAudit() {
      const data = this.getData()
      this.validateData(
        data,
        function() {
          this.submit(data)
        }.bind(this)
      )
    },
    /**弹框选择素材 */
    getSelectResource(data) {
      this.selectResource = data
      this.dialogTableVisible = false
      const selectObj = {
        pictureId: this.selectResource.pictureId,
        pictureStatus: this.selectResource.pictureStatus,
        pictureUrl: this.selectResource.pictureUrl
      }
      this.block.rlsInfo[this.selectingPostForIndex].poster = selectObj
    },
    // selectSubmit() {
    //   const selectObj = {
    //     pictureId: this.selectResource.pictureId,
    //     pictureStatus: this.selectResource.pictureStatus,
    //     pictureUrl: this.selectResource.pictureUrl
    //   }
    //   this.block.rlsInfo[this.selectingPostForIndex].poster = selectObj
    // },
    /**点击事件弹框 */
    getClickData1(data) {
      this.clickData = data
      this.dialogClickTableVisible = false
      var selectClick = this.clickData
      selectClick = JSON.parse(selectClick.onlickJson)
      const index = this.selectingClickForIndex
      const item = this.block.rlsInfo[index]
      item.onclick = this.parseOnclick(selectClick)
      this.showselectClickor = false
      this.selectingClickForIndex = undefined
    },
    getClickData(data) {
      this.dialogClickTableVisible = false
      let params = JSON.parse(data.params) 
      let keys = Object.keys(params)
      let paramsArr = keys.reduce((result, current, index) => {
         var obj = {}
         obj.key = current
         obj.value = params[current]
         result.push(obj)
         return result
      },[])
      let o ={
                packagename: data.packagename,
                versioncode: data.versioncode,
                dowhat: data.dowhat,
                bywhat: data.bywhat,
                byvalue: data.byvalue,
                params: paramsArr,
                exception: data.exception
        }
      const index = this.selectingClickForIndex
      const item = this.block.rlsInfo[index]
      item.onclick = o;
    },
    clickSubmit() {
      // var selectClick = this.clickData
      // selectClick = JSON.parse(selectClick.onlickJson)
      // const index = this.selectingClickForIndex
      // const item = this.block.rlsInfo[index]
      // item.onclick = this.parseOnclick(selectClick)
      // this.showselectClickor = false
      // this.selectingClickForIndex = undefined
    },
    /**异形焦点选择 */
    getSelectImg(data) {
      this.selectImgData = data
      this.showFocusImgSelectorVisible = false
      const index = this.selectingFocusImgForIndex
      const item = this.block.rlsInfo[index]
      this.$set(item.extendInfo, 'focusImgUrl', this.selectImgData.pictureUrl)
      this.selectingFocusImgForIndex = undefined
    },
    selectImgSubmit() {
      // const index = this.selectingFocusImgForIndex
      // const item = this.block.rlsInfo[index]
      // this.$set(item.extendInfo, 'focusImgUrl', this.selectImgData.pictureUrl)
      // this.selectingFocusImgForIndex = undefined
    },
    submit(formData) {
      this.validateData(
        formData,
        function() {
          formData.pluginInfo.refreshTime = this.parseMinToStr(
            formData.pluginInfo.refreshTime
          )
          for(let i=0;i<formData.rlsInfo.length;i++) {
            formData.rlsInfo[i].extendInfo.aliveTime = this.parseMinToStr(formData.rlsInfo[i].extendInfo.aliveTime)
          }
          formData = this.parseData(formData)
          this.$service.SavePlugin(formData, '保存成功').then(data => {
            this.$emit('open-list-page')
          })
        }.bind(this)
      )
    },
    handleChangeActivityFlag(val) {
      // 非常丑陋， 改变活动形式，要控制某个版本的显示和隐藏
      if (val) {
        this.block.rlsInfo.unshift(
          this.genRlsInfo({
            label: '活动形式',
            dataType: 4
          })
        )
      } else {
        this.block.rlsInfo = this.block.rlsInfo.filter(function(item) {
          return item.dataType !== 4
        })
      }
    }
  },
  created() {
    this.basicFn = basicFn
    this.getPluginParentTypes()
    if (this.editId !== null && this.editId !== undefined) {
      this.title = '编辑'
      this.mode = 'edit'
      this.getEditData()
    } else {
      this.title = '新增'
      this.mode = 'create'
    }
  }
}
</script>

<style scoped>
.multi-func-block-upsert .poster,
.multi-func-block-upsert .focus-transition {
  position: relative;
  height: 200px;
  width: 200px;
  border: 1px solid #eee;
  cursor: pointer;
}

.multi-func-block-upsert .poster img,
.multi-func-block-upsert .focus-transition__img {
  max-width: 100%;
  max-height: 100%;
}
.multi-func-block-upsert .focus-transition__remove {
  position: absolute;
  top: 5px;
  right: 5px;
  color: red;
}
</style>


