<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div class="multi-func-block-read">
      <div class="toolbar-container" style="padding: 16px;">
        <el-button
          type="primary"
          v-if="block.pluginInfo.pluginStatus === STATUS.waiting"
          @click="showAuditDialog = true"
        >审核</el-button>
      </div>
      <div class="base-tit">
        <span>基本信息</span>
      </div>
      <el-form ref="blockForm" label-width="140px">
        <el-form-item label="系统功能名称" prop="pluginInfo.pluginName">{{ block.pluginInfo.pluginName }}</el-form-item>
        <template v-if="block.pluginInfo.pluginParentType === 'builtIn'">
          <el-form-item
            label="固定刷新时间"
            prop="pluginInfo.refreshTime"
          >{{ parseMinToStr(block.pluginInfo.refreshTime) }}</el-form-item>
          <el-form-item label="活动形式" prop="hasActivity">
            <el-radio-group disabled v-model="block.hasActivity">
              <el-radio :label="0">非活动</el-radio>
              <el-radio :label="1">活动</el-radio>
            </el-radio-group>
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
        >{{ SOURCE_TEXT[block.pluginInfo.source] }}</el-form-item>
        <template v-if="pluginParentType === 'sign'">
          <el-form-item
            label="标记推荐位类型"
            prop="pluginInfo.pluginType"
          >{{ block.pluginInfo.pluginType }}</el-form-item>
        </template>
        <el-form-item
          v-if="pluginParentType !== 'sign' && pluginTypes.length > 0 && pluginTypeText"
          label="多功能推荐位类型"
          prop="pluginInfo.pluginType"
        >{{ pluginTypeText }}</el-form-item>
        <template v-if="baseHasTitle">
          <el-form-item label="标题" prop="helper.title">{{ block.helper.title }}</el-form-item>
          <el-form-item label="副标题" prop="helper.subTitle">{{ block.helper.subTitle }}</el-form-item>
        </template>
        <template v-if="pluginParentType !== 'sign'">
          <div v-for="(item, index) in block.rlsInfo" :key="index">
            <div class="base-tit">
              <span>{{ item.label }}</span>
            </div>
            <template v-if="versionHasTitle">
              <el-form-item label="标题">{{ item.title }}</el-form-item>
              <el-form-item label="副标题">{{ item.subTitle }}</el-form-item>
            </template>
            <template v-if="block.pluginInfo.pluginParentType === 'builtIn'">
              <el-form-item
                label="状态栏文字"
              >{{ item.title }} {{ item.subTitle ? (' | ' + item.subTitle) : '' }}</el-form-item>
            </template>
            <template v-if="block.pluginInfo.pluginParentType === 'secKill'">
              <el-form-item label="商品ID">{{ item.goodsId }}</el-form-item>
              <el-form-item label="商品名称">{{ item.title }}</el-form-item>
            </template>
            <el-form-item label="海报">
              <div class="poster">
                <img
                  class="poster__img"
                  v-if="item.poster.pictureUrl"
                  :src="item.poster.pictureUrl"
                >
              </div>
            </el-form-item>
            <template v-if=" pluginType === 'REFERENCE_ACTIVITY'">
              <el-form-item label="异形焦点">
                <div v-if="item.extendInfo.focusImgUrl" class="focus-transition">
                  <img class="focus-transition__img" :src="item.extendInfo.focusImgUrl">
                </div>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="存活时间">{{ parseMinToStr(item.extendInfo.aliveTime) }}</el-form-item>
              <el-form-item label="点击次数">{{ item.extendInfo.clickCount}}</el-form-item>
            </template>
            <el-form-item
              v-if="pluginParentType === 'multi' || pluginParentType === 'secKill'"
              label="打开方式"
            >{{ OPEN_MODE_TEXT[item.openMode] }}</el-form-item>
            <template v-if="item.openMode === 'webpage'">
              <el-form-item label="网页地址">{{ item.onclick.webpageUrl }}</el-form-item>
              <el-form-item label="网页类型">{{ ['', '浮窗网页', '全屏网页'][+item.onclick.webpageType] }}</el-form-item>
              <el-form-item label="应用版本号">{{ item.onclick.webpageAppVersion }}</el-form-item>
            </template>
            <template v-if="item.openMode === 'video'">
              <el-form-item label="视频名称">{{ item.onclick.videoName }}</el-form-item>
              <el-form-item label="视频地址">{{ item.onclick.videoUrl }}</el-form-item>
            </template>
            <template v-if="item.openMode === 'picture'">
              <el-form-item label="图片">
                <div class="open-picture">
                  <img class="open-picture__img" :src="item.onclick.picture[0].url">
                </div>
              </el-form-item>
            </template>
            <template v-if="item.openMode === 'tab'">
              <el-form-item label="版面">{{ item.onclick.tab.tabId }}</el-form-item>
            </template>
            <AppParamsRead
              v-if="item.openMode === 'app'"
              v-model="item.onclick"
              label-width="140px"
            />
          </div>
        </template>
      </el-form>
      <el-dialog title="审核" :visible.sync="showAuditDialog">
        <el-form>
          <el-form-item label="审核意见">
            <el-radio class="radio" v-model="auditForm.auditFlag" :label="4">通过</el-radio>
            <el-radio class="radio" v-model="auditForm.auditFlag" :label="5">打回</el-radio>
          </el-form-item>
          <el-form-item label="意见说明">
            <el-input type="textarea" v-model="auditForm.auditDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAuditDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleAudit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </ContentCard>
</template>

<script>
import _ from 'gateschema'
import { ContentWrapper, Table, utils, AppParamsRead } from 'admin-toolkit'
const SOURCE_TEXT = {
  '0': '无',
  '1': '腾讯',
  '2': '爱奇艺'
}
const OPEN_MODE_TEXT = {
  webpage: '网页',
  app: '第三方应用',
  video: '视频',
  tab: '版面',
  picture: '图片'
}
const STATUS = {
  draft: 2,
  waiting: 3,
  accepted: 4,
  reject: 5,
  processing: 7
}
export default {
  components: {
    AppParamsRead
  },
  props: {
    viewId: Number,
    default: null
  },
  data() {
    return {
      showAuditDialog: false,
      title: undefined,
      STATUS: STATUS,
      SOURCE_TEXT: SOURCE_TEXT,
      OPEN_MODE_TEXT: OPEN_MODE_TEXT,
      pluginParentTypes: [],
      pluginTypes: [],
      pluginVersions: {},
      auditForm: {
        auditFlag: 4,
        auditDesc: ''
      },
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
          refreshTime: 240
        },
        rlsInfo: [],
        hasActivity: 0
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
    pluginParentTypeText() {
      const pluginParentType = this.pluginParentType
      const pluginParentTypes = this.pluginParentTypes
      if (pluginParentTypes.length > 0) {
        const target = pluginParentTypes.find(function(item) {
          return item.value === pluginParentType
        })
        if (target) {
          return target.label
        }
      }
    },
    pluginTypeText() {
      const pluginType = this.pluginType
      const pluginTypes = this.pluginTypes
      console.log(pluginType)
      console.log(pluginTypes)
      if (pluginTypes.length > 0) {
        const target = pluginTypes.find(function(item) {
          return item.value === pluginType
        })
        if (target) {
          return target.label
        }
      }
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
  methods: {
    parseMinToStr(min) {
      const hours = Math.floor(min / 60)
      const mins = min % 60
      const hoursStr = hours > 9 ? '' + hours : '0' + hours
      const minsStr = mins > 9 ? '' + mins : '0' + mins
      return hoursStr + ':' + minsStr
    },
    //获取数据
    getData() {
      this.$service.getData({ id: this.viewId }).then(data => {
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
                    const rlsItem = rlsInfoIndexed[item.value]
                    if (rlsItem) {
                      this.$set(rlsItem, 'label', item.label)
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
      })
    },
    //父数据字典查询接口
    getPluginParentTypes() {
      this.$service.getPluginParentTypes().then(data => {
        console.log(data)
        if (data) {
          this.pluginParentTypes = data.filter(function(item) {
            return item.value !== 'builtIn'
          })
        }
      })
    },
    //数据字典查询
    getPluginTypes(pluginParentType) {
      this.$service
        .getPluginTypes({ pluginParentType: pluginParentType })
        .then(data => {
          console.log(data)
          if (data) {
            this.pluginTypes = data
          }
        })
    },
    getPluginVersions(type) {
      const urls = this.urls
      var that = this
      const FastDevTool = this.FastDevTool
      const pluginVersions = this.pluginVersions
      return new Promise(function(resolve, reject) {
        if (!pluginVersions[type]) {
          that.$service.getPluginVersions(type).then(data => {
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
    handleAudit() {
      const block = this.block
      const auditForm = this.auditForm
      if (auditForm.auditDesc.trim() === '') {
        this.$message('请填写意见说明')
      } else {
        this.$service
          .SaveAudit({
            id: block.pluginInfo.pluginId,
            type: 'systemPlugin',
            auditFlag: auditForm.auditFlag,
            auditDesc: auditForm.auditDesc
          }, '审核成功')
          .then(data => {
            this.showAuditDialog = false
            this.$emit('open-list-page')
          })
      }
    },
    handleClose() {
      window.parent.$('#edit-view').dialog('close')
    }
  },
  created() {
    this.basicFn = basicFn
    this.getPluginParentTypes()
    window.mode = 'read'
    if (window.mode) {
      this.mode = window.mode
      this.title = '预览'
    }
    this.getData()
  }
}
</script>
<style>
.multi-func-block-read .poster,
.multi-func-block-read .focus-transition,
.multi-func-block-read .open-picture {
  height: 200px;
  width: 200px;
  border: 1px solid #eee;
  cursor: pointer;
}
.multi-func-block-read .poster img,
.multi-func-block-read .focus-transition img,
.multi-func-block-read .open-picture img {
  max-width: 100%;
  max-height: 100%;
}
</style>