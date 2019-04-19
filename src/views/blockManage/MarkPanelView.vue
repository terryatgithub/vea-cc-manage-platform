<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div id="preview" v-cloak>
      <div class="audit-tip" v-show="releaseTime">该版块为定时任务，审核通过后将于{{ releaseTime }}上线</div>
      <div id="pannelStatus">
        <el-form :inline="true">
          <!-- <el-form-item label="版本" v-if="isShowVersion">
            <el-select v-model="versions" @change="handleSelectVersion" placeholder="请选择">
              <el-option
                v-for="item in versionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <HistoryTool :id="id" :type="type" :initialStatus="status" @change="changeVsersion"/>
          <!-- <el-form-item>
            <div class="form-status">{{pannelStatus}}</div>
          </el-form-item>-->
        </el-form>
      </div>
      <div class="base-tit">
        <span class="el-icon-edit">基本信息</span>
      </div>
      <el-form label-width="120px">
        <el-form-item label="版块名称">
          <div>{{pannelName}}</div>
        </el-form-item>
        <el-form-item label="版块标题">
          <div>{{pannelTitle}} {{ showTitle === 0 ? '(前端不显示)' : '' }}</div>
        </el-form-item>
        <el-form-item label="功能类型">
          <div>{{clientType}}</div>
        </el-form-item>
        <el-form-item label="内容源">
          <div>{{pannelResourceText[pannelResource] || '不限'}}</div>
        </el-form-item>
      </el-form>
      <div class="base-tit auditor-title">
        <span class="el-icon-edit">审核者备注</span>
      </div>
      <div class="up-addlist">
        <table>
          <tbody class="auditor-wrapper">
            <tr v-for="(item, index) in auditHistories" :key="index">
              <td>{{ item.lastUpdateDate }}</td>
              <td>{{ item.auditor }}</td>
              <td v-if="item.auditFlag == 4">通过</td>
              <td v-else>不通过</td>
              <td>{{ item.auditDesc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <AuditDetailButton
        :id="id"
        :version="version"
        :type="type"
        :not-contain-btn="notContainBtn"
        :status="status"
        :menuElId="menuElId"
        @go-edit-Page="goEditPage"
        @delete-item="deleteItem"
        @copy="createCopy"
      ></AuditDetailButton>
    </div>
  </ContentCard>
</template>
<script>
var param = {}
import AuditDetailButton from './../../components/AuditDetailButton'
import HistoryTool from './../../components/HistoryTool'
export default {
  components: {
    AuditDetailButton,
    HistoryTool
  },
  props: {
    viewData: Object
  },
  data() {
    return {
      title: '预览',
      id: null,
      version: '',
      type: 'pannel',
      status: null,
      menuElId: 'pannelInfo',
      notContainBtn: ['claim', 'unclaim'],
      pannelType: 'pannel',
      auditHistories: [],
      blockContentProps: {},
      releaseTime: undefined,
      activePannelIndex: 0,
      buttonGroup: {
        params: {
          //   status: param.pannelList[0].pannelStatus,
          //   resourceId: param.pannelGroupId,
          //   version: param.currentVersion,
          //   type: 'pannel',
          //   menuElId: 'pannelInfo'
        },
        options: {
          isAllowCopy: true
        }
      },
      pannelResourceText: {
        o_iqiyi: '爱奇艺',
        o_tencent: '腾讯',
        o_voole: '优朋'
      },
      clientType: '',
      showTitle: 1,
      pannelResource: '',
      pannelName: '',
      pannelTitle: '',
      versions: '',
      versionList: [],
      isShowVersion: false,
      pannelStatus: ''
    }
  },
  methods: {
    /**请求数据 */
    getViewData() {
      return this.$service
        .getViewData({ id: this.viewData.pannelGroupId })
        .then(data => {
          console.log(data)
          this.buttonGroup.params = data
          this.pannelName = data.pannelList[0].pannelName
          this.pannelTitle = data.pannelList[0].pannelTitle
          this.pannelResource = data.pannelList[0].pannelResource
          this.pannelStatus = this.parasNumToStr(
            data.pannelList[0].pannelStatus
          )
          this.versions = data.currentVersion
          this.clientType = data.clientType
          this.getHandlePerson(data)
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
    //获取上架时间
    getTimedInfo() {
      const timeObj = {
        id: this.viewData.pannelGroupId,
        version: this.buttonGroup.params.currentVersion,
        type: this.pannelType
      }
      this.$service.getTimedInfo(timeObj).then(data => {
        this.releaseTime = data.releaseTime
      })
    },
    changeVsersion(version) {
      this.$service
        .getViewData({ id: this.viewData.pannelGroupId, version: version })
        .then(data => {
          console.log(data)
           this.getHandlePerson(data)
          this.buttonGroup.params = data
          this.pannelName = data.pannelList[0].pannelName
          this.pannelTitle = data.pannelList[0].pannelTitle
          this.pannelResource = data.pannelList[0].pannelResource
          this.pannelStatus = this.parasNumToStr(
            data.pannelList[0].pannelStatus
          )
          this.versions = data.currentVersion
          this.clientType = data.clientType
        })
     
    },
    getHandlePerson(data) {
      return this.$service
        .getHandlePerson({
          id: data.pannelGroupId,
          version: data.currentVersion,
          type: 'pannel'
        })
        .then(data => {
          this.auditHistories = data
        })
    },
    handleSelectVersion(version) {
      const timeObj = {
        id: this.viewData.pannelGroupId,
        version: version,
        type: this.pannelType
      }
      this.$service.getTimedInfo(timeObj).then(data => {
        this.releaseTime = data.releaseTime
      })
      this.getViewData()
    },
    goEditPage() {
      this.$emit('open-add-page', this.viewData.pannelGroupId)
    },
    deleteItem() {
      if (window.confirm('确定要删除吗')) {
        this.$service
          .deleteMarkPanel({ id: this.viewData.pannelGroupId }, '删除成功')
          .then(data => {
            this.$emit('open-list-page')
          })
      }
    },
    createCopy() {
      this.$emit('open-add-page', this.viewData.pannelGroupId)
    }
  },
  created() {
    this.id = this.viewData.pannelGroupId
    this.status = this.viewData.pannelStatus
    this.version = this.viewData.currentVersion
    this.getViewData().then(() => {
      this.getTimedInfo()
    })
    // this.getHistoryList()
  }
}
</script>
<style  scoped>
.audit-tip {
  color: #aaa;
  padding: 10px 0px;
}
.form-status {
  background-color: #409eff;
  padding: 0px 5px;
  color: #fff;
}
.base-tit {
  background-color: #e6e6e6;
  padding: 10px 2px;
  margin: 5px 0px;
}
.base-tit span {
  padding: 0px 5px;
}
</style>

