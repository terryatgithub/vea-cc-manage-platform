<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
          <CommonContent
          :mode="mode"
          :resource-info="resourceInfo"
          @replicate="mode = 'replicate'"
          @edit="mode = 'edit'"
          @unaudit="fetchData"
          @shelves="fetchData"
          @audit="$emit('upsert-end')"
          @select-version="fetchData"
        >
    <div v-if="mode === 'read'" class="private-panel-info-read">
      <!-- <div class="private-panel-info-wrapper">
        <div style="margin-left: 10px">
          <el-form :inline="true" style="margin:10px 0px">
            <HistoryTool :id="id" :type="type" :initialStatus="status" ref="history" @change="changeVersionAndStatus"/>
          </el-form>
        </div>
      </div> -->
      <div class="base-info">
        <div>专属影院版块：</div>
        <div>专属影院，影片数据 由大数据和媒资库提供，运营人员只需配置相应内容块的影片类型（0 会员影片，1 非会员影片，2 单点影片）。</div>
      </div>
      <el-form label-width="120px" label-position="right">
        <div class="base-tit">
          <span >基本信息</span>
        </div>
        <el-form-item label="业务分类">
          <span>{{ getCategoryLabel(panel.panelGroupCategory) }}</span>
        </el-form-item>
        <el-form-item
          label="内容源"
          v-if="panelGroupCategoryValue === 'common' || panelGroupCategoryValue === 'video'"
        >
          <span>{{ getResourceLabel(panel.pannelResource) }}</span>
        </el-form-item>
        <el-form-item
          label="版块名称"
          prop="pannelList.0.pannelName"
        >{{ panel.pannelList[0].pannelName }}</el-form-item>
        <template v-if="panel.panelGroupType === 9 || panel.panelGroupType === 10">
          <el-form-item label="二级分类">{{ '电视剧' }}</el-form-item>
          <el-form-item label="推荐维度">{{ getPanelGroupTypeLabel(panel.panelGroupType) }}</el-form-item>
        </template>
        <div class="base-tit">
          <span>内容配置</span>
        </div>
        <el-form-item label="版块标题" prop="pannelList.0.pannelTitle">
          {{ panel.pannelList[0].pannelTitle }}
          ({{ panel.showTitle ? '显示' : '不显示' }})
        </el-form-item>
        <el-form-item v-if="panel.panelGroupType === 5" label="版块布局">
          <span
            class="spform J-selected J_select J_layout-selected"
            v-if="panel.layoutId > 0"
          >{{panel.layoutId}}</span>
          ({{ panel.lucenyFlag ? '透明' : '非透明' }})
          <div class="content-list">
            <div
              class="content-list__item"
              v-for="(item, index) in panel.pannelList[0].contentList"
              :key="index"
            >
              <el-select :disabled="mode === 'read'" size="mini" v-model="item.blockVideoType">
                <el-option
                  v-for="(type, tIndex) in blockVideoTypeOptions"
                  :key="tIndex"
                  :value="type.value"
                  :label="type.label"
                ></el-option>
              </el-select>
              <span class="content-list__item-id">{{ index + 1}}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          v-if="panel.panelGroupType === 9 || panel.panelGroupType === 10"
          label="内容免/付费比例"
        >
          <el-form-item
            class="amount-input"
            label="首屏付费内容数"
          >{{ panel.pannelList[0].firstPageVipContentAmount}}</el-form-item>
          <el-form-item
            class="amount-input"
            label="总付费内容数"
          >{{ panel.pannelList[0].vipContentAmount}}</el-form-item>
        </el-form-item>
      </el-form>
      <div class="base-tit auditor-title">
        <span>审核者备注</span>
      </div>
      <div class="up-addlist">
        <table>
          <tbody class="auditor-wrapper">
            <tr v-for="(item, index) in auditHistories" :key="index">
              <td>{{ item.lastUpdateDate }}</td>
              <td>{{ item.auditor }}</td>
              <td v-if="item.auditFlag == 4">审核通过</td>
              <td v-else>审核不通过</td>
              <td>{{ item.auditDesc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- <AuditDetailButton
      :id="id"
      :version="version"
      :type="type"
      :not-contain-btn="notContainBtn"
      :status="status"
      :menuElId="menuElId"
      @go-edit-Page="goEditPage"
      @delete-item="deleteItem"
      @copy="CreatCopy"
    ></AuditDetailButton> -->
          </CommonContent>
  </ContentCard>
</template>

<script>
import AuditDetailButton from './../../components/AuditDetailButton'
import HistoryTool from './../../components/HistoryTool'
import CommonContent from '@/components/CommonContent.vue'
export default {
  components: {
    AuditDetailButton,
    HistoryTool,
    CommonContent
  },
  props: ['viewData','version'],
  data() {
    const blockVideoTypeOptions = [
      {
        value: 0,
        label: '会员影片'
      },
      {
        value: 1,
        label: '非会员影片'
      },
      {
        value: 2,
        label: '单点影片'
      }
    ]
    const STATUS = {
      draft: 2,
      waiting: 3,
      accepted: 4,
      reject: 5,
      processing: 7
    }
    const STATUS_TEXT = {
      '0': '下架',
      '2': '草稿',
      '3': '待审核',
      '4': '审核通过',
      '5': '审核不通过',
      '7': '审核通过未上线'
    }
    return {
      id: null,
      type: 'pannel',
      status: null,
      menuElId: 'privatePannelInfo',
      notContainBtn: ['claim', 'unclaim'],
      mode: null,
      title: null,
      STATUS: STATUS,
      STATUS_TEXT: STATUS_TEXT,
      auditHistories: [],
      panelGroupCategoryOptions: [],
      blockVideoTypeOptions: blockVideoTypeOptions,
      rules: {
        pannelName: [{ required: true, message: '请填写板块名称' }],
        pannelTitle: [{ required: true, message: '请填写标题' }],
        amount: [
          {
            validator(rule, value, callback) {
              if (Number.isInteger(Number(value)) && Number(value) > 0) {
                callback()
              } else {
                callback(new Error('请输入整数'))
              }
            },
            trigger: 'blur'
          }
        ]
      },
      versionList: [],
      panel: {
        pannelGroupId: undefined,
        currentVersion: undefined,
        parentType: 'normal',
        groupTitle: '',
        pannelName: undefined,
        pannelTitle: undefined,
        showTitle: true,
        lucenyFlag: false,
        pannelStatus: undefined,
        layoutId: undefined,
        pannelResource: 'o_tencent',
        panelGroupCategory: 67,
        panelGroupType: 9,
        focusConfig: undefined,
        dictInfoList: '',
        content: '',
        priority: '1',
        pannelList: [
          {
            pannelId: undefined,
            pannelCategory: undefined,
            pannelName: undefined,
            pannelTitle: undefined,
            pannelResource: undefined,
            pannelType: 5,
            pannelStatus: undefined,
            showTitle: undefined,
            flagIs4k: 0,
            layoutId: undefined,
            panelIsFocus: undefined,
            focusShape: undefined,
            vipContentAmount: 2,
            firstPageVipContentAmount: 5,
            contentList: [
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 },
              { blockVideoType: 0 }
            ]
          }
        ]
      }
    }
  },
  computed: {
    panelGroupCategoryValue() {
      const options = this.panelGroupCategoryOptions
      const panelGroupCategory = this.panel.panelGroupCategory
      if (options) {
        const target = options.find(function(item) {
          return item.id === panelGroupCategory
        })
        return target && target.value
      }
    },
    resourceInfo() {
      const tab = this.tab
      if (tab.tabId) {
        return {
          id: tab.tabId,
          type: 'tab',
          menuElId: 'tabInfo',
          version: tab.currentVersion,
          status: tab.tabStatus
        }
      }
    },
  },
  methods: {
    //业务分类
    getCategoryLabel(value) {
      const selected = this.panelGroupCategoryOptions.find(function(item) {
        return item.id === value
      })
      return selected && selected.label
    },
    //推荐维度
    getPanelGroupTypeLabel(value) {
      const labelMap = {
        9: '根据用户近期观影偏好推荐',
        10: '根据用户近期观看的影片推荐'
      }
      return labelMap[value]
    },
    //内容源
    getResourceLabel(value) {
      const labelMap = {
        o_iqiyi: '爱奇艺',
        o_tencent: '腾讯'
      }
      return labelMap[value]
    },
    parseApiToData(data) {
      const panel = JSON.parse(JSON.stringify(data))
      const firstPanel = data.pannelList[0]
      panel.pannelResource = firstPanel.pannelResource
      panel.showTitle = firstPanel.showTitle == 1 ? true : false
      panel.pannelStatus = firstPanel.pannelStatus
      panel.layoutId = firstPanel.layoutId

      if (firstPanel.contentList && firstPanel.contentList.length > 0) {
        const firstContent = firstPanel.contentList[0]
        panel.lucenyFlag = firstContent.lucenyFlag == 1 ? true : false
      }
      return panel
    },
    setPanel(data) {
      const panel = this.parseApiToData(data)
      Object.assign(this.panel, panel)
    },
    handleSelectVersion(version) {
      // const panel = this.panel
      // const href =
      //   location.pathname + '?id=' + panel.pannelGroupId + '&version=' + version
      // location.href = href
    },
    //业务分类
    getDictType() {
      this.$service.getDictType().then(data => {
        console.log(data)
        this.panelGroupCategoryOptions = data
      })
    },
    parasNumToStr(status) {
      const methodsMap = [
        '下架',
        '上架',
        '草稿',
        '待审核',
        '审核通过',
        '审核不通过'
      ]
      const method = methodsMap[status]
      return method
    },
    //审核信息
    getHandlePerson(data) {
      console.log(data)
      this.$service
        .getHandlePerson({
          id: data.pannelGroupId,
          version: data.currentVersion,
          type: 'pannel'
        })
        .then(data => {
          this.auditHistories = data
        })
    },
    goEditPage() {
      this.$emit('open-add-page', this.viewData.pannelGroupId)
    },
    deleteItem() {
      console.log(this.version)
      if (window.confirm('确定要删除')) {
      }
    },
    CreatCopy() {
      this.$emit('create-copy', this.viewData.pannelGroupId)
    },
    fetch(version) {
      this.$service
        .privatePannelInfoView({ id: this.viewData.pannelGroupId, version })
        .then(data => {
          this.setPanel(data)
           this.getHandlePerson(data)
        })
    },
     changeVersionAndStatus(obj) {
       this.status = obj.status
       this.version = obj.version
      this.$service
        .privatePannelInfoView({
          id: this.viewData.pannelGroupId,
          version: this.version 
        })
        .then(data => {
          this.setPanel(data)
          this.getHandlePerson(data)
        })
    },
  },
  created() {
    console.log(this.viewData)
    this.title = '预览'
    this.mode = 'read'
    this.fetch(this.version) //预览
    this.id = this.viewData.pannelGroupId
    this.version = this.viewData.currentVersion
    this.status = parseInt(this.viewData.pannelStatus)
    this.getDictType()
  }
}
</script>
<style scoped>
.content-list {
  position: relative;
  width: 770px;
  left: -15px;
}
.content-list .content-list__item {
  width: 130px;
  height: 64px;
  display: inline-block;
  border: 1px solid #ccc;
  margin-left: 15px;
  margin-bottom: 15px;
}
.content-list .content-list__item-id {
  color: red;
}
.content-list .content-list__item .el-select {
  width: 100px;
  float: right;
}
.status {
  display: inline-block;
  width: 120px;
  height: 30px;
  line-height: 30px;
  padding: 0 5px;
  background: #4fc71b;
  color: #fff;
  text-align: center;
}
.private-panel-info-wrapper .el-form-item {
  margin-bottom: 0px;
}
.private-panel-info-read .el-form-item {
  margin-bottom: 0;
}
.amount-input {
  display: inline-block;
  width: 320px;
}
.version-selector {
  width: 350px;
}
.base-info {
  background-color: #fef8b8;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.base-info div {
  padding: 5px;
}
.base-tit,
.base-tit auditor-title span {
  background-color: #e6e6e6;
  padding: 10px 10px;
  margin: 10px;
}
.up-addlist {
  margin: 10px 10px;
}
</style>