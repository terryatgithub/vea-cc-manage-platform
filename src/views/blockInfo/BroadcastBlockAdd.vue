<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div>
      <el-button type="primary" size="medium">提交审核</el-button>
      <el-button type="warning" size="medium" @click="$emit('go-back')">关闭</el-button>
    </div>

    <div class="split-bar">
      <i class="el-icon-edit"></i>基本信息
    </div>

    <el-form :model="basicForm" ref="basicForm" label-width="100px" class="demo-ruleForm">
      <el-form-item
        label="推荐位名称"
        prop="containerName"
        :rules="[{required: true, message:'请输入控件名称', trigger: 'blur'}]"
      >
        <el-input v-model="basicForm.containerName"></el-input>
      </el-form-item>
      <el-form-item label="推荐位类型">
        <el-select v-model="basicForm.containerType">
          <el-option label="视频列表" value="REFERENCE_BROADCASTING"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配置模式">
        <el-radio-group v-model="basicForm.configModel" @change.native.prevent="modelChange">
          <el-radio label="broadcast">轮播模式</el-radio>
          <el-radio label="group">组合模式</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="split-bar">
      <i class="el-icon-edit"></i>内容配置
    </div>

    <div class="version-title">
      <h2 class="version-title__h">正常版本</h2>
      <el-tag
        class="version-title__tag"
        v-if="basicForm.configModel === 'group' "
        type="warning"
      >短标题模式需至少运营四个资源，长标题模式至少6个，才能填满布局哦~</el-tag>
      <el-button
        v-if="basicForm.configModel === 'group' "
        type="primary"
        style="float: right;"
        size="medium"
        @click.native="selectResource('normal', normalForm, 'multiSelect')"
      >批量选择资源</el-button>
    </div>

    <!-- {{normalVersionContent}} -->
    <div class="form-wrap">
      <el-row
        :gutter="4"
        class="normal-left-list"
        v-if="basicForm.configModel === 'group'"
        :style="classObject"
      >
        <draggable
          v-model="normalVersionContent"
          :options="{group: 'normalVersion' }"
          @start="onDragStart($event)"
          @end="onDragtEnd($event)"
        >
          <el-card
            v-for="(normal, index) in normalVersionContent"
            :key="index"
            :class="{ active: index === currentIndex}"
            class="normal-version-wrap"
            @click.native="switchNormal(index)"
          >
            <i
              v-if="normalVersionContent.length > 1"
              class="el-icon-close"
              @click.stop="deleteNormal(index)"
            ></i>
            <img
              v-if="normal.poster.pictureUrl"
              :src="normal.poster.pictureUrl"
              referrerpolicy="no-referrer"
            >
            <span>{{normal.title}}</span>
          </el-card>
        </draggable>
        <el-card style="cursor: pointer;">
          <span class="add-version" @click="addNormal">+添加资源</span>
        </el-card>
      </el-row>

      <el-form
        :model="normalForm"
        ref="normalForm"
        :rules="normalRules"
        label-width="100px"
        class="demo-ruleForm"
        style="float: left;width: 75%"
        :class="{cutLine: basicForm.configModel === 'group'}"
      >
        <el-form-item
          :label="normalResourceBtn"
          size="medium"
          prop="thirdIdOrPackageName"
          style="width: 600px"
        >
          <!-- <el-button
            v-if="autoWrite"
            type="primary"
            v-model="normalForm.thirdIdOrPackageName"
            @click.native="selectResource('normal', normalForm)"
          >选择资源1</el-button> -->
          <BroadcastSource
            v-if="autoWrite"
            v-model="normalForm.thirdIdOrPackageName"
            title="选择资源"
            ></BroadcastSource>
          <el-input
            v-else
            v-model="normalForm.thirdIdOrPackageName"
            style="float: left"
            @blur="getUrlBlur"
          ></el-input>
          <el-tag
            type="success"
            v-if="normalForm.thirdIdOrPackageName && autoWrite"
          >已选择：{{normalForm.thirdIdOrPackageName}}</el-tag>
          <a
            class="write-play"
            v-if="autoWrite && basicForm.configModel === 'group' "
            href="#"
            @click="autoWriteFun"
          >手动填写播放串</a>
          <a
            class="write-play"
            v-if="!autoWrite && basicForm.configModel === 'group' "
            href="#"
            @click="autoWriteFun"
            style="float: left"
          >自动配置播放资源</a>
        </el-form-item>
        <div v-if="basicForm.configModel === 'group'">
          <el-form-item label="指定子频道" prop="subchannelId" v-if="normalForm.subchannelIs">
            <el-input v-model="normalForm.subchannelId" @blur="getSubchannel(normalForm)"></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="normalForm.title" @blur="getTitleNormal"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="subTitle">
            <el-input v-model="normalForm.subTitle"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="海报" prop="poster.pictureUrl">
          <el-card
            class="post-box"
            style="width: 320px;height: 180px"
            @click.native="openPicture('poster', normalForm)"
          >
            <img
              v-if="normalForm.poster.pictureUrl"
              :src="normalForm.poster.pictureUrl"
              referrerpolicy="no-referrer"
              style="height: 180px;"
            >
          </el-card>
        </el-form-item>
        <el-form-item label="角标">
          <el-card class="corner-box">
            <span
              v-for="(corner, index) in normalForm.cornerIconList"
              :key="index"
              :class="'corner-' + index "
              class="corner"
              @click="openPicture('corner', normalForm, index)"
            >
              <span class="corner-img-wrapper" v-if="corner.imgUrl">
                <img :src="corner.imgUrl" referrerpolicy="no-referrer">
                <i class="el-icon-delete" @click.stop="deleteCorner(normalForm, index)"></i>
              </span>
              <el-tag v-else type="success">
                <i class="el-icon-plus"></i>
              </el-tag>
            </span>
          </el-card>
        </el-form-item>

        <el-form-item label="点击事件" prop="sign" v-if="basicForm.configModel === 'group'">
          <el-radio-group v-model="normalForm.sign" :disabled="signDisabled" size="mini">
            <el-radio label="autoSet">自动生成</el-radio>
            <el-radio label="manualSet">手动设置</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <div v-if="normalForm.sign === 'manualSet'">
          <cc-new-universal-reference
            ref="openWayNormal"
            :vip-reference-data="referenceDataNormal"
            :vip-is-preview="noPreview"
            :open-mode-array="openModeArray"
            :reference-options="referenceOptions"
          ></cc-new-universal-reference>
        </div> -->
      </el-form>
    </div>
    <div class="version-title" style="margin-top: 25px;">
      <h2 style="float: left;margin-top: 7px;">兼容低版本</h2>
      <div
        v-if="basicForm.configModel === 'group'"
        style="display: inline-block;margin-left: 14px;"
      >
        <el-button @click="lowerFill" type="primary" style="margin-right: 10px">快速填充</el-button>
        <span>使用正常版本的第一个资源，快速配置</span>
      </div>
    </div>
    <div class="form-wrap">
      <el-form
        :model="lowerForm"
        ref="lowerForm"
        :rules="lowerRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="资源类别" prop="coverType">
          <el-radio-group v-model="lowerForm.coverType" @change="cleanLowerForm">
            <el-radio label="media">媒体资源</el-radio>
            <el-radio label="app">应用</el-radio>
            <el-radio label="custom">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="内容资源"
          prop="thirdIdOrPackageName"
          v-if="lowerForm.coverType === 'media' || lowerForm.coverType === 'app' "
        >
          <!-- <el-button
            type="primary"
            size="medium"
            v-model="lowerForm.thirdIdOrPackageName"
            @click.native="selectResource('lower', lowerForm)"
          >选择资源</el-button> -->
          <ResourceSelector
            v-model="lowerForm.thirdIdOrPackageName"
            title="选择资源"
            >选择资源</ResourceSelector>
          <el-tag
            type="success"
            v-if="lowerForm.thirdIdOrPackageName"
          >已选择：{{lowerForm.thirdIdOrPackageName}}</el-tag>
        </el-form-item>
        <el-form-item label="指定子频道" prop="subchannelId" v-if="lowerForm.subchannelIs">
          <el-input v-model="lowerForm.subchannelId" @blur="getSubchannel(lowerForm)"></el-input>
        </el-form-item>
        <el-form-item v-if="lowerForm.smallTopicsIs" label="指定小专题" prop="smallTopicsId">
          <el-input v-model="lowerForm.smallTopicsId" @blur="smallTopicsLower"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="lowerForm.title"></el-input>
        </el-form-item>
        <el-form-item label="副标题" prop="subTitle">
          <el-input v-model="lowerForm.subTitle"></el-input>
        </el-form-item>
        <el-form-item
          label="海报"
          prop="poster.pictureUrl"
          @click.native="openPicture('poster', lowerForm)"
        >
          <el-card class="post-box" style="width: 486px;height: 180px">
            <img
              v-if="lowerForm.poster.pictureUrl"
              :src="lowerForm.poster.pictureUrl"
              referrerpolicy="no-referrer"
              style="height: 180px"
            >
          </el-card>
        </el-form-item>
        <el-form-item label="角标">
          <el-card class="corner-box">
            <span
              v-for="(corner, index) in lowerForm.cornerIconList"
              :key="index"
              :class="'corner-' + index "
              class="corner"
              @click="openPicture('corner', lowerForm, index)"
            >
              <span class="corner-img-wrapper" v-if="corner.imgUrl">
                <img :src="corner.imgUrl" referrerpolicy="no-referrer">
                <i class="el-icon-delete" @click.stop="deleteCorner(lowerForm, index)"></i>
              </span>
              <el-tag v-else type="success">
                <i class="el-icon-plus"></i>
              </el-tag>
            </span>
          </el-card>
        </el-form-item>
        <div v-if="lowerForm.coverType === 'media' || lowerForm.coverType === 'app'">
          <el-form-item label="应用版本号" prop="versionCode">
            <el-input v-model="lowerForm.versionCode"></el-input>
          </el-form-item>
        </div>
        <!-- <div v-if="lowerForm.coverType === 'custom'">
          <cc-new-universal-reference
            ref="openWayLower"
            :vip-reference-data="referenceData"
            :vip-is-preview="noPreview"
            :open-mode-array="openModeArray"
            :reference-options="referenceOptions"
          ></cc-new-universal-reference>
        </div> -->
      </el-form>
    </div>
    
    <!-- 海报和角标弹框 start -->
    
    <!-- 海报和角标弹框 end -->

  </ContentCard>
</template>

<script>
import draggable from 'vuedraggable'
import BroadcastSource from '@/components/BroadcastSource'
import ResourceSelector from '@/components/ResourceSelector'
export default {
  components: {
    draggable,
    BroadcastSource,
    ResourceSelector
  },

  props: {
    editId: Number,
    currentVersion: String,
    default: null
  },

  data() {
    return {
      cornerTypes: [],
      materialTypes: null,
      basicForm: {
        containerName: '',
        containerType: 'REFERENCE_BROADCASTING',
        configModel: 'broadcast'
      },
      normalForm: {},
      lowerForm: {},
      auditDisabled: false,
      normalRules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        'poster.pictureUrl': [
          { required: true, message: '请上传海报', trigger: 'blur' }
        ],
        thirdIdOrPackageName: [
          { required: true, message: '请填选择资源', trigger: 'blur' }
        ]
      },
      lowerRules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        'poster.pictureUrl': [
          { required: true, message: '请上传海报', trigger: 'blur' }
        ],
        thirdIdOrPackageName: [
          { required: true, message: '请填选择资源', trigger: 'blur' }
        ]
      },
      normalResourceBtn: '轮播资源',
      currentIndex: 0,
      pictureListOptions: {
        poster: {
          idField: 'pictureId',
          searchParams: {
            pictureId: {
              label: '素材ID'
            },
            pictureName: {
              label: '素材名称'
            },
            pictureCategory: {
              label: '素材类别',
              options: []
            },
            pictureStatus: {
              label: '素材状态',
              options: [
                {
                  label: '审核通过',
                  value: '1'
                },
                {
                  label: '待审核',
                  value: '2'
                }
              ]
            }
          },
          // url: $basePath + '/globalPicture/dataList.html',
          picField: 'pictureUrl',
          textItems: [
            {
              field: 'pictureName'
            },
            {
              field: 'pictureStatus',
              customFormatter: function(row, column) {
                return ['', '审核通过', '待审核'][column]
              }
            }
          ]
        },
        corner: {
          idField: 'cornerIconId',
          searchParams: {
            cornerIconId: {
              label: '角标ID'
            },
            cornerIconName: {
              label: '角标名称'
            },
            'cornerIconType.typeId': {
              label: '角标类别',
              options: []
            }
          },
          // url: $basePath + '/globalCornerIcon/pageList.html',
          picField: 'imgUrl',
          textItems: [
            {
              field: 'cornerIconName'
            },
            {
              field: 'cornerStatus',
              customFormatter: function(row, column) {
                return ['', '审核通过', '待审核'][column]
              }
            }
          ]
        }
      },
      signDisabled: false,
      // smallTopics: false,
      modelType: 'broadcast',
      versionForm: {
        title: '',
        subTitle: '',
        type: '',
        coverType: 'media',
        thirdIdOrPackageName: '',
        subchannelId: '', // 子频道ID
        subchannelIs: '', // 是否显示子频道
        params: {},
        onclick: '',
        sign: 'autoSet',
        contentType: '',
        clickParams: '',
        // jumpAdress: '1',
        poster: {},
        cornerIconList: [{}, {}, {}, {}]
      },
      pictureType: '',
      currentForm: '',
      pannelResource: '',
      autoWrite: true, // 是否自动填写播放串
      // lowFill: false,
      normalVersionContent: [],
      openModeArray: [{ name: '第三方应用', value: 'app' }],
      referenceDataNormal: [],
      noPreview: 'noPreview',
      referenceOptions: {
        picture: false
      },
      resourceVisible: false,
      layoutOptions: {
        contentDataNew: []
      },
      selectPicture: '',
      resourceSeq: '',
      layoutparam: {},
      layouttypenew: '',
      checkresourceis: true,
      customDialogPicture: {},
      pictureOptions: {}
    }
  },

  computed: {
    classObject: function() {
      if (this.normalForm.sign === 'autoSet') {
        return {
          height: '600px'
        }
      } else {
        return {
          height: '1140px'
        }
      }
    }
  },

  methods: {
    autoWriteFun: function() {
      this.autoWrite = !this.autoWrite
      if (this.autoWrite === false) {
        this.normalForm = Object.assign({}, this.versionForm)
        this.normalVersionContent.splice(this.currentIndex, 1, this.normalForm)
        this.normalForm.sign = 'manualSet'
        this.signDisabled = true
        this.normalForm.type = 'url'
        this.normalForm.contentType = 'custom'
        this.normalForm.coverType = 'custom'
        var newForm = Object.assign({}, this.normalForm)
        var newVal = {
          url: this.normalForm.thirdIdOrPackageName,
          source: '',
          name: this.normalForm.title,
          needParse: 'false',
          url_type: 'web'
        }
        newForm.params = JSON.stringify(newVal)
        this.normalForm = newForm
      } else {
        this.normalForm = Object.assign({}, this.versionForm)
        this.normalForm.sign = 'autoSet'
        this.signDisabled = false
        this.normalVersionContent[this.currentIndex] = this.normalForm
      }
    },
    deleteCorner: function(form, index) {
      var list = form.cornerIconList.slice(0)
      list[index] = {
        cornerIconId: '',
        imgUrl: '',
        position: index
      }
      form.cornerIconList = list
      console.log(form)
    },
    // 模式切换
    modelChange: function(val) {
      var _this = this
      this.$confirm('切换后配置数据将被清空, 是否确认切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          _this.$message({
            type: 'success',
            message: '模式切换成功!'
          })
          _this.modelType = _this.basicForm.configModel
          _this.clearFormAll()
        })
        .catch(function() {
          _this.$message({
            type: 'info',
            message: '已取消切换'
          })

          var newForm = Object.assign({}, _this.basicForm)
          newForm.configModel = _this.modelType
          _this.basicForm = newForm
        })
    },
    clearFormAll: function() {
      // 清空正常版本和低版本数据
      this.normalForm = Object.assign({}, this.versionForm)
      this.lowerForm = Object.assign({}, this.versionForm)
      var arr = []
      arr.push(this.normalForm)
      this.normalVersionContent = arr
    },
    selectResource: function(type, form, selectType) {
      this.resourceVisible = true
      this.resourceOptions.activeTabName = 'video'
      this.currentForm = form
      var newOptions = Object.assign({}, this.resourceOptions)
      newOptions.multi = false

      if (selectType === 'multiSelect') {
        newOptions.multi = true
      }

      newOptions.activeTabName = 'video'

      if (type === 'normal') {
        if (this.basicForm.configModel === 'broadcast') {
          newOptions.tabShow = {
            broadcast: true
          }
          newOptions.activeTabName = 'broadcast'
        } else if (this.basicForm.configModel === 'group') {
          newOptions.tabShow = {
            video: true,
            edu: true,
            live: true,
            topics: false,
            broadcast: true
          }
        }
      } else if (type === 'lower') {
        if (this.lowerForm.coverType === 'media') {
          newOptions.tabShow = {
            video: true,
            // 'app': true,
            edu: true,
            live: true,
            topics: true,
            broadcast: true
          }
        } else if (this.lowerForm.coverType === 'app') {
          newOptions.tabShow = {
            app: true
          }
          newOptions.activeTabName = 'app'
        }
      }
      this.resourceOptions = newOptions
    },
    paramIdFun: function(form, seledted) {
      // 封装保存的id
      if (seledted.contentType === 'movie') {
        if (seledted.singleId) {
          var param = {
            id: seledted.thirdIdOrPackageName,
            vid: seledted.singleId
          }
        } else {
          var param = {
            id: seledted.thirdIdOrPackageName
          }
        }
      } else if (
        seledted.contentType === 'app' ||
        seledted.contentType === 'edu' ||
        seledted.contentType === 'txLive'
      ) {
        var param = {
          id: seledted.thirdIdOrPackageName
        }
      } else if (seledted.contentType === 'bigTopic') {
        var param = {
          pTopicCode: seledted.thirdIdOrPackageName
        }
      } else if (seledted.contentType === 'topic') {
        // this.smallTopics = true;
        var param = {
          topicCode: seledted.thirdIdOrPackageName
        }
      } else if (seledted.contentType === 'rotate') {
        var param = {
          rotateId: seledted.thirdIdOrPackageName
        }
      }

      return param
    },
    packageFormParam: function(form, item) {
      form.type = item.type
      if (item.contentType === 'rotate') {
        form.subchannelIs = true
      } else {
        form.subchannelIs = false
      }
      if (item.contentType === 'bigTopic') {
        form.smallTopicsIs = true
      } else {
        form.smallTopicsIs = false
      }
      form.title = item.title
      form.coverType = item.coverType
      form.contentType = item.contentType
      form.subTitle = item.subTitle
      form.thirdIdOrPackageName = item.thirdIdOrPackageName
      if (item.pictureUrl) {
        var newForm = Object.assign({}, form.poster)
        newForm.pictureUrl = item.pictureUrl
        form.poster = newForm
      }

      form.subTitle = item.subTitle
      var param = this.paramIdFun(form, item)
      form.clickParams = JSON.stringify(param)
      form.params = JSON.stringify(param)

      return form
    },
    smallTopicsLower: function() {
      if (this.lowerForm.smallTopicsId) {
        var newObj = JSON.parse(this.lowerForm.params)
        newObj.topicCode = this.lowerForm.smallTopicsId
        this.lowerForm.params = JSON.stringify(newObj)
      }
    },
    getUrlBlur: function() {
      if (this.autoWrite === false) {
        var newForm = Object.assign({}, this.normalForm)
        var newVal = {
          url: this.normalForm.thirdIdOrPackageName,
          source: '',
          name: this.normalForm.title,
          needParse: 'false',
          url_type: 'web'
        }
        newForm.params = JSON.stringify(newVal)
        this.normalForm = newForm
      }
    },
    getTitleNormal: function() {
      if (this.autoWrite === false) {
        var newForm = Object.assign({}, this.normalForm)
        var newVal = {
          url: this.normalForm.thirdIdOrPackageName,
          source: '',
          name: this.normalForm.title,
          needParse: 'false',
          url_type: 'web'
        }
        newForm.params = JSON.stringify(newVal)
        this.normalForm = newForm
        this.normalVersionContent.splice(this.currentIndex, 1, this.normalForm)
      }
    },
    getSubchannel: function(form) {
      if (form.subchannelId) {
        var newObj = JSON.parse(form.params)
        newObj.stationId = form.subchannelId
        form.params = JSON.stringify(newObj)
      }
    },
    // 资源确定
    resourceConfirm: function(sortSelected) {
      var _this = this
      this.resourceVisible = false
      var formArr = []
      var currentForm = this.currentForm

      if (this.resourceOptions.multi) {
        // 多选
        console.log(_this.currentIndex)
        _.each(sortSelected, function(item) {
          var form = _this.packageFormParam(currentForm, item)
          var newVal = Object.assign({}, form)
          formArr.push(newVal)
        })
        var arr = formArr.slice(0)
        console.log(arr)
        _this.normalVersionContent.splice(
          _this.currentIndex,
          sortSelected.length,
          arr
        )
        var FastDevTool1 = new FastDevTool()
        _this.normalVersionContent = FastDevTool1.arrayFlatten(
          _this.normalVersionContent
        )
        console.log(_this.normalVersionContent)
        this.currentIndex = this.normalVersionContent.length - 1
      } else {
        // 单选
        var seledted = sortSelected
        var form = _this.packageFormParam(currentForm, seledted)
      }

      console.log(this.normalForm)
    },
    closeResource: function() {
      this.resourceVisible = false
    },
    checkNormalForm: function(cb) {
      var _this = this
      this.$refs.normalForm.validate(function(valid) {
        if (valid) {
          if (_this.normalForm.sign === 'manualSet') {
            if (_this.$refs.openWayNormal.assembleOnclick()) {
              _this.normalForm.onclick = _this.$refs.openWayNormal.assembleOnclick().onclick
              _this.normalVersionContent.splice(
                _this.currentIndex,
                1,
                _this.normalForm
              )
              cb()
            } else {
              _this.$message('请将表单填写完整')
              return false
            }
          } else {
            cb()
          }
        } else {
          _this.$message('请将表单填写完整')
          return false
        }
      })
    },
    checkLowerForm: function(cb) {
      var _this = this
      this.$refs.lowerForm.validate(function(valid) {
        if (valid) {
          if (_this.lowerForm.coverType === 'custom') {
            if (_this.$refs.openWayLower.assembleOnclick()) {
              _this.lowerForm.onclick = _this.$refs.openWayLower.assembleOnclick().onclick
              cb()
            } else {
              _this.$message('请将表单填写完整')
              return false
            }
          } else {
            cb()
          }
        } else {
          _this.$message('请将表单填写完整')
          return false
        }
      })
    },
    addNormal: function(cb) {
      var _this = this
      this.checkNormalForm(function() {
        _this.normalForm = _this.deepClone(_this.versionForm)
        _this.normalVersionContent.push(_this.normalForm)
        _this.currentIndex = _this.normalVersionContent.length - 1
        _this.referenceDataNormal = []
        _this.autoWrite = true
        _this.signDisabled = false
      })
    },
    deleteNormal: function(index) {
      var _this = this
      this.$confirm('是否删除当前选中项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          _this.$message({
            type: 'success',
            message: '删除成功!'
          })
          _this.normalVersionContent.splice(index, 1)
          _this.currentIndex = 0
          _this.normalForm = _this.normalVersionContent[0]
          if (_this.normalForm.type === 'url') {
            _this.autoWrite = false
          } else {
            _this.autoWrite = true
          }
          if (_this.normalForm.sign === 'manualSet') {
            _this.referenceDataNormal = {
              onclick: _this.normalForm.onclick,
              params: 'openMode==app'
            }
            _this.normalForm.type !== 'url'
              ? (_this.signDisabled = false)
              : (_this.signDisabled = true)
          } else {
            _this.signDisabled = true
          }
        })
        .catch(function() {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    switchNormal: function(index) {
      var _this = this
      this.checkNormalForm(function() {
        _this.$message('请填充或修改当前表单的内容！')
        _this.currentIndex = index
        _this.normalForm = _this.normalVersionContent[index]
        if (_this.normalForm.type === 'url') {
          _this.autoWrite = false
        } else {
          _this.autoWrite = true
        }
        if (_this.normalForm.sign === 'manualSet') {
          _this.referenceDataNormal = {
            onclick: _this.normalForm.onclick,
            params: 'openMode==app'
          }
          _this.normalForm.type === 'url'
            ? (_this.signDisabled = true)
            : (_this.signDisabled = false)
        } else {
          _this.signDisabled = false
        }
        _this.normalVersionContent.splice(index, 1, _this.normalForm)
      })
    },
    openPicture: function(type, form, index) {
      this.pictureType = type
      this.currentForm = form
      var titles = {
        poster: '请选择海报',
        corner: '请选择角标'
      }

      this.customDialogPicture = {
        title: titles[type],
        visible: true
      }

      if (type === 'corner') {
        this.pictureListOptions.corner.url =
          $basePath +
          '/globalCornerIcon/pageList.html?cornerIconType.typePosition=' +
          index
      }

      this.pictureOptions = this.pictureListOptions[type]
    },
    getPicture: function(value) {
      console.log(value)
      this.selectPicture = value
    },
    savePicture: function() {
      var selectPicture = this.selectPicture
      if (JSON.stringify(selectPicture) === '{}') {
        this.$message('请至少选择一项')
      } else {
        this.customDialogPicture.visible = false
        if (this.pictureType === 'poster') {
          this.currentForm.poster = {
            pictureUrl: selectPicture.pictureUrl,
            pictureId: selectPicture.pictureId
          }
        } else if (this.pictureType === 'corner') {
          var index = selectPicture.cornerIconType.typePosition
          var cornerObj = {
            cornerIconId: selectPicture.cornerIconId,
            position: index,
            imgUrl: selectPicture.imgUrl
          }
          var newForm = this.currentForm.cornerIconList.slice(0)
          // var newForm = Object.assign({}, this.currentForm.cornerIconList);
          newForm[index] = cornerObj
          this.currentForm.cornerIconList = newForm
        }
        this.selectPicture = {}
      }
      this.normalVersionContent[this.currentIndex] = this.normalForm
      console.log(this.currentForm)
    },
    onDragStart: function(event) {
      console.log(event)
    },
    onDragtEnd: function(event) {
      console.log(event)
      this.currentIndex = event.newIndex
      this.normalForm = this.normalVersionContent[event.newIndex]
    },
    lowerFill: function() {
      // console.log(val);
      // if (val) {
      //     var newForm = Object.assign({}, this.normalVersionContent[0]);
      //     this.lowerForm = newForm;
      // }
      var newForm = Object.assign({}, this.normalVersionContent[0])
      this.lowerForm = newForm
    },
    cleanLowerForm: function(val) {
      var newForm = Object.assign({}, this.versionForm)
      newForm.type = val
      newForm.coverType = val
      if (val === 'custom') {
        newForm.sign = 'openMode==app'
        newForm.contentType = 'custom'
        newForm.params = '{}'
      }

      this.lowerForm = newForm
    },
    saveNormal: function(cb) {
      var _this = this
      this.checkNormalForm(function() {
        if (_this.basicForm.configModel === 'group') {
          if (_this.normalVersionContent.length < 4) {
            _this.$message(
              '组合模式下，正常版本的配置资源至少4个，才可以进行保存！'
            )
            return false
          } else {
            cb()
          }
        } else {
          cb()
        }
      })
    },
    save: function() {
      var _this = this
      this.$refs.basicForm.validate(function(valid) {
        if (valid) {
          _this.saveNormal(function() {
            _this.checkLowerForm(function() {
              var obj = { normalVersionContent: [], lowerVersionContent: {} }
              if (_this.basicForm.configModel === 'group') {
                _this.normalVersionContent.map(function(item) {
                  delete item.thirdIdOrPackageName
                })
                obj.normalVersionContent = _this.normalVersionContent
              } else {
                obj.normalVersionContent.push(_this.normalForm)
              }

              delete _this.lowerForm.smallTopicsId
              obj.lowerVersionContent = _this.lowerForm
              var resultObj = Object.assign(obj, _this.basicForm)
              resultObj.status = 3
              resultObj.parentType = 'Block'
              console.log(resultObj)

              this.$service.saveBlockInfo(resultObj).then(data => {
                if (data.code === '0') {
                  window.parent.$('#data-list').datagrid('reload')
                  _this.auditDisabled = true
                  setTimeout(function() {
                    window.parent.$('#add-view').dialog('_close')
                  }, 1000)
                }
                _this.$message(data.msg)
              })
              // $.ajax({
              //   type: 'POST',
              //   url: $basePath + '/blockInfo/save.html',
              //   data: JSON.stringify(resultObj),
              //   contentType: 'application/json; charset=utf-8',
              //   success: function(res) {
              //     var data = JSON.parse(res)
              //     if (data.code === '0') {
              //       window.parent.$('#data-list').datagrid('reload')
              //       _this.auditDisabled = true
              //       setTimeout(function() {
              //         window.parent.$('#add-view').dialog('_close')
              //       }, 1000)
              //     }
              //     _this.$message(data.msg)
              //   },
              //   error: function(data) {
              //     console.log(data)
              //   }
              // })
            })
          })
        } else {
          _this.$message('请将表单填写完整')
          return false
        }
      })
    },
    close: function() {
      window.parent.$('#add-view').dialog('_close')
    }
  },
  created() {
    var _this = this
    this.normalForm = Object.assign({}, this.versionForm)
    // this.normalForm.jumpAdress = '1';
    this.lowerForm = Object.assign({}, this.versionForm)
    this.lowerForm.smallTopicsId = ''
    this.lowerForm.smallTopicsIs = false
    this.normalVersionContent.push(this.normalForm)

    this.title = this.editId ? '编辑页面' : '新增页面'
    // 素材类型获取
    this.$service.getMaterialTypes().then(dataAll => {
      const data = dataAll.data
      var materialTypeOptions = []
      for (var i = 0; i < data.length; i++) {
        var materialTypeOption = {
          label: data[i].dictCnName,
          value: data[i].dictId
        }
        materialTypeOptions.push(materialTypeOption)
        _this.pictureListOptions.poster.searchParams.pictureCategory.options = materialTypeOptions
      }
    })
    // 角标类型获取
    this.$service.getCornerTypes().then(dataAll => {
      const data = dataAll.data
      var cornerIconTypeOptions = []
      for (var i = 0; i < data.length; i++) {
        var cornerIconTypeOption = {
          label: data[i].typeName,
          value: data[i].typeId
        }
        cornerIconTypeOptions.push(cornerIconTypeOption)
        _this.pictureListOptions.corner.searchParams[
          'cornerIconType.typeId'
        ].options = cornerIconTypeOptions
      }
    })
  },
  watch: {
    'basicForm.configModel': {
      deep: true,
      handler: function(newVal, oldVal) {
        if (newVal === 'group') {
          this.normalResourceBtn = '播放资源'
        } else if (newVal === 'broadcast') {
          this.normalResourceBtn = '轮播资源'
        }
      }
    },
    'normalForm.sign': {
      deep: true,
      handler: function(newVal, oldVal) {
        // if (newVal === 'manualSet' && this.autoWrite === false) {  // 手动设置
        //     if (this.autoWrite) { // 影视如果是手动时type为custom，自动为res
        //         this.normalForm.coverType = 'custom';
        //         this.normalForm.contentType = 'custom';
        //         this.normalForm.type = 'url';
        //     }
        // } else if (newVal === 'manualSet' && this.autoWrite === true) { // 手动填写（但是选择资源）
        //     this.normalForm.coverType = 'custom';
        //     this.normalForm.contentType = 'custom';
        //     // this.normalForm.type = 'res';
        // }
        if (newVal === 'manualSet') {
          // 手动设置
          this.normalForm.coverType = 'custom'
          this.normalForm.contentType = 'custom'
          if (this.autoWrite === false) {
            // autoWrite为true时，选择资源  coverType为custom
            this.normalForm.type = 'url'
          }
        }
      }
    },
    autoWrite: function(newVal, oldVal) {
      // if (newVal === false) {
      //     this.normalForm = Object.assign({}, this.versionForm);
      //     this.normalVersionContent.splice(this.currentIndex, 1, this.normalForm);
      //     this.normalForm.sign = 'manualSet';
      //     this.signDisabled = true;
      //     this.normalForm.type = 'url';
      //     this.normalForm.contentType = 'custom';
      //     this.normalForm.coverType = 'custom';
      //     var newForm = Object.assign({}, this.normalForm);
      //     var newVal = {
      //         url: this.normalForm.thirdIdOrPackageName,
      //         source: "",
      //         name: this.normalForm.title,
      //         needParse: "false",
      //         url_type: "web"
      //     };
      //     newForm.params = JSON.stringify(newVal);
      //     this.normalForm = newForm;
      // } else {
      //     this.normalForm = Object.assign({}, this.versionForm);
      //     this.normalForm.sign = 'autoSet';
      //     this.signDisabled = false;
      //     this.normalVersionContent[this.currentIndex] = this.normalForm;
      // }
    }
  }
}
</script>

<style lang='stylus' scoped>
.split-bar {
  width: 96%;
  height: 36px;
  margin: 8px 0px;
  padding: 0px 6px;
  font-size: 17px;
  line-height: 36px;
  background: #e5e9f2;
  border-radius: 4px;
}

.form-wrap {
  width: 95%;
  height: auto;
  padding: 10px;
  border: 2px dotted darkgray;
  overflow: auto;
}

.version-title {
  height: 40px !important;
  width: 97% !important;
}

.version-title__h {
  float: left;
  margin-top: 7px;
}

.version-title__tag {
  margin-top: 6px;
  margin-left: 10px;
}

.demo-ruleForm {
}

.key-span {
  width: 100px;
  display: inline-block;
  text-align: center;
  background: #f1f1f1;
  border: 1px solid #ddd;
  margin-right: 10px;
  border-radius: 6px;
}

.button-wraprer {
  padding: 8px 0px;
  border-bottom: 1px solid #ccc;
}

.el-card__body {
  padding: 7px;
}

.el-card__body img {
  width: 100%;
}

.normal-left-list {
  width: 190px;
  /* height: 400px; */
  /* border-right: 1px solid gray; */
  float: left;
  padding: 8px;
  margin-right: 8px;
  /* max-height: 617px; */
  overflow: auto;
}

.write-play {
  color: #20a0ff;
  margin-left: 10px;
}

.el-icon-close {
  font-size: 14px;
  position: absolute;
  right: 2px;
  top: 4px;
  color: red;
}

.active {
  border: 2px dashed #f58b2fd6;
}

.cutLine {
  border-left: 1px solid gray;
  margin-left: 10px;
}

.add-version {
  font-size: 17px;
  height: 100px;
  line-height: 100px;
  display: block;
  text-align: center;
}

.normal-version-wrap {
  width: 160px;
  height: 120px;
  position: relative;
  margin-bottom: 10px;
  text-align: center;
  cursor: pointer;
}

.normal-version-wrap span {
  font-size: 16px;
}

.normal-version-wrap img {
  width: 95%;
  height: 90px;
  border-radius: 8px;
}

/* 角标 */
.corner-box {
  position: relative;
  width: 150px;
  height: 150px;
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

.corner-img-wrapper {
  position: relative;
  height: 100%;
  display: block;
}

.corner-img-wrapper i {
  position: absolute;
  bottom: -10px;
  right: 0;
  color: #FF4949;
  font-size: 20px;
}
.el-input {
    max-width: 280px;
}
</style>