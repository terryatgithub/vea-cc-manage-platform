<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div v-if="mode === 'create' || mode === 'edit' || mode === 'replica'" class="private-panel-info-upsert">
      <div style="padding: 10px;">
          <el-button type="warning" @click="handleSubmitAudit">提交审核</el-button>
          <el-button type="primary" @click="handleSaveDraft">保存草稿</el-button>
      </div>
      <div class="base-info">
          <div>专属影院版块：</div>
          <div>专属影院，影片数据 由大数据和媒资库提供，运营人员只需配置相应内容块的影片类型（0 会员影片，1 非会员影片，2 单点影片）。</div>
      </div>
      <el-form ref="upsertForm" :model="panel" label-width="120px" :rules="rules">
        <div class="base-tit">
         <span>基本信息</span>
        </div>
        <el-form-item label="业务分类">
          <el-select 
            :value="panel.panelGroupCategory" 
            @input="handlePanelGroupCategoryChange"
          >
            <el-option
              :label="item.label"
              v-for="(item,index) in panelGroupCategoryOptions"
              :key="index"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="spform">注：只有一个权限的操作者不能选择业务分类</span>
        </el-form-item>
        <el-form-item
          label="内容源"
          v-if="panelGroupCategoryValue === 'common' || panelGroupCategoryValue === 'video'"
        >
          <el-radio-group
            :value="panel.pannelResource"
            @input="handlePannelResourceChange"
            :disabled="isReplica"
          >
            <el-radio label="o_tencent">腾讯</el-radio>
            <el-radio label="o_iqiyi">爱奇艺</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="版块名称" prop="pannelList.0.pannelName" :rules="rules.pannelName">
          <el-input v-model="panel.pannelList[0].pannelName"></el-input>
        </el-form-item>
        <template v-if="panel.panelGroupType === 9 || panel.panelGroupType === 10">
          <el-form-item label="二级分类">
            <el-select value="1">
              <el-option value="1" label="电视剧">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐维度">
            <el-radio-group v-model="panel.panelGroupType">
              <el-radio :label="9">
                根据用户近期观影偏好推荐
              </el-radio>
              <el-radio :label="10">
                根据用户近期观看的影片推荐
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <div class="base-tit">
         <span>内容配置</span>
        </div>
        <el-form-item label="版块标题" prop="pannelList.0.pannelTitle" :rules="rules.pannelTitle">
          <el-input
            v-model="panel.pannelList[0].pannelTitle"
            placeholder="请输入版本标题"
          />
          <el-checkbox :value="!panel.showTitle" @input="panel.showTitle=!$event">前端不显示标题</el-checkbox>
        </el-form-item>

        <div>
          <el-form-item v-if="panel.panelGroupType === 5" label="版块布局">
            <span
              class="spform J-selected J_select J_layout-selected"
              v-if="panel.layoutId > 0"
            >
              {{panel.layoutId}}
            </span>
            <el-checkbox v-model="panel.lucenyFlag">
              设置前端推荐位底色透明
            </el-checkbox>
            <div class="content-list">
              <div class="content-list__item" v-for="(item, index) in panel.pannelList[0].contentList" :key="index">
                <el-select size="mini" v-model="item.blockVideoType">
                  <el-option 
                    v-for="(type, tIndex) in blockVideoTypeOptions" 
                    :key="tIndex"
                    :value="type.value"
                    :label="type.label">
                  </el-option>
                </el-select>
                <span class="content-list__item-id">{{ index + 1}}</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <el-form-item v-if="panel.panelGroupType === 9 || panel.panelGroupType === 10" label="内容免/付费比例">
            <el-form-item class="amount-input" prop="pannelList.0.firstPageVipContentAmount" label="首屏付费内容数" :rules="rules.amount">
              <el-input-number v-model="panel.pannelList[0].firstPageVipContentAmount" :max="6" :min="0" />
            </el-form-item>
            <el-form-item class="amount-input" prop="pannelList.0.vipContentAmount"  label="总付费内容数" :rules="rules.amount">
              <el-input-number v-model="panel.pannelList[0].vipContentAmount" :max="15" :min="0" />
            </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="mode === 'read'" class="private-panel-info-read">
      <div class="private-panel-info-wrapper">
        <div style="margin-left: 10px">
          <el-form :inline="true">
              <el-form-item label="版本" v-if="versionList && versionList.length > 0">
                  <el-select 
                      class="version-selector"
                      v-model="panel.currentVersion" 
                      @change="handleSelectVersion" 
                      placeholder="请选择"
                  >
                      <el-option 
                          v-for="item in versionList" 
                          :key="item.version" 
                          :label="item.label" 
                          :value="item.value"
                      >
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                  <div class="status">{{ STATUS_TEXT[panel.pannelList[0].pannelStatus] }}</div>
              </el-form-item>
          </el-form>
          <!-- <cc-button-group
              :url="urls.tools"
              :params="buttonGroupParams"
              :options="{isAllowCopy: isAllowCopy, isAllowCancelTiming: false}"
              @edit="handleEdit"
              @delete="handleDelete"
              @audit="showAuditDialog = true"
              @unaudit="handleUnAudit"
              @copy="handleCopy"
              @shelves="handleShelves"
          >
          </cc-button-group> -->
        </div>
      </div>
      <div class="base-info">
          <div>专属影院版块：</div>
          <div>专属影院，影片数据 由大数据和媒资库提供，运营人员只需配置相应内容块的影片类型（0 会员影片，1 非会员影片，2 单点影片）。</div>
      </div>
      <el-form label-width="120px">
        <div class="base-tit">
        <span>基本信息</span>
        </div>
        <el-form-item label="业务分类">
          <span>
            {{ getCategoryLabel(panel.panelGroupCategory) }}
          </span>
        </el-form-item>
        <el-form-item
          label="内容源"
          v-if="panelGroupCategoryValue === 'common' || panelGroupCategoryValue === 'video'"
        >
          <span>
            {{ getResourceLabel(panel.pannelResource) }}
          </span>
        </el-form-item>
        <el-form-item label="版块名称" prop="pannelList.0.pannelName">
          {{ panel.pannelList[0].pannelName }}
        </el-form-item>
        <template v-if="panel.panelGroupType === 9 || panel.panelGroupType === 10">
          <el-form-item label="二级分类">
            {{ '电视剧' }}
          </el-form-item>
          <el-form-item label="推荐维度">
            {{ getPanelGroupTypeLabel(panel.panelGroupType) }}
          </el-form-item>
        </template>
        <div class="base-tit">
          <span>内容配置</span>
        </div>
        <el-form-item
          label="版块标题"
          prop="pannelList.0.pannelTitle"
        >
          {{ panel.pannelList[0].pannelTitle }}
          ({{ panel.showTitle ? '显示' : '不显示' }})
        </el-form-item>
        <el-form-item v-if="panel.panelGroupType === 5" label="版块布局">
          <span
            class="spform J-selected J_select J_layout-selected"
            v-if="panel.layoutId > 0"
          >
            {{panel.layoutId}}
          </span>
          ({{ panel.lucenyFlag ? '透明' : '非透明' }})
          <div class="content-list">
            <div class="content-list__item" v-for="(item, index) in panel.pannelList[0].contentList" :key="index">
              <el-select :disabled="mode === 'read'" size="mini" v-model="item.blockVideoType">
                <el-option 
                  v-for="(type, tIndex) in blockVideoTypeOptions" 
                  :key="tIndex"
                  :value="type.value"
                  :label="type.label">
                </el-option>
              </el-select>
              <span class="content-list__item-id">{{ index + 1}}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="panel.panelGroupType === 9 || panel.panelGroupType === 10" label="内容免/付费比例">
            <el-form-item class="amount-input"  label="首屏付费内容数" >
              {{ panel.pannelList[0].firstPageVipContentAmount}}
            </el-form-item>
            <el-form-item class="amount-input"  label="总付费内容数">
              {{ panel.pannelList[0].vipContentAmount}}
            </el-form-item>
        </el-form-item>
      </el-form>
      <div class="base-tit auditor-title">
            <span>审核者备注</span>
        </div>
        <div class="up-addlist">
            <table>
            <tbody class="auditor-wrapper">
                <tr v-for="(item, index) in auditHistories" :key='index'>
                <td>
                    {{ item.lastUpdateDate }}
                </td>
                <td>
                    {{ item.auditor }}
                </td>
                <!-- <td>
                    {{ basicFn.numToAuditStatus(item.auditFlag)}}
                </td> -->
                <td>
                    {{ item.auditDesc }}
                </td>
                </tr>
            </tbody>
            </table>
        </div>
      </div>
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
  </ContentCard>
</template>

<script>
export default {
    props: ['viewData'],
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
      mode: null,
      title: null,
      showAuditDialog: false,
      STATUS: STATUS,
      STATUS_TEXT: STATUS_TEXT,
      auditHistories: [],
      panelGroupCategoryOptions: [],
      blockVideoTypeOptions: blockVideoTypeOptions,
      rules: {
        pannelName: [
          { required: true, message: '请填写板块名称'}
        ],
        pannelTitle: [
          { required: true, message: '请填写标题'}
        ],
        amount: [
          {            
            validator(rule,value,callback){               
              if(Number.isInteger(Number(value)) && Number(value) > 0){                
                callback();
              }else{                 
                callback(new Error("请输入整数"));               
              }             
            },             
            trigger: 'blur',           
          }
        ]
      },
    //   urls: {
    //     preview: $basePath + '/privatePannelInfo/preview.html',
    //     edit: $basePath + '/privatePannelInfo/edit.html',
    //     tools: $basePath + '/buttonManage/getAuditDetailButton.html',
    //     edit_history_view: $basePath + '/privatePannelInfo/editHistory.html',
    //   },
      auditForm: {
        auditFlag: 4,
        auditDesc: ''
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
        dictInfoList: "",
        content: "",
        priority: "1",
        pannelList:[
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
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0},
              {blockVideoType: 0}
            ]
          }
        ]
      }
    }
  },
  computed: {
      panelGroupCategoryValue() {
        const options = this.panelGroupCategoryOptions;
        const panelGroupCategory = this.panel.panelGroupCategory;
        if (options) {
          const target = options.find(function(item) {
            return item.id === panelGroupCategory;
          });
          return target && target.value;
        }
      },
      isReplica() {
        return this.mode === 'replica'
      },
      buttonGroupParams() {
        const panel = this.panel || {}
        return  {
          type: 'pannel',
          menuElId: 'privatePannelInfo',
          status: panel.pannelList[0].pannelStatus,
          resourceId: panel.pannelGroupId,
          version: panel.currentVersion
        }
      },
      isAllowCopy() {
        const STATUS = this.STATUS
        const found = this.versionList.some(function(item) {
          const status = item.row.status
            return status === STATUS.draft || status === STATUS.waiting || status === STATUS.rejected
        })
        return !found
      },
  },
  methods: {
    getCategoryLabel(value) {
      const selected = this.panelGroupCategoryOptions.find(function(item) {
        return item.id === value
      })
      return selected && selected.label
    },
    getPanelGroupTypeLabel(value) {
      const labelMap = {
        9: '根据用户近期观影偏好推荐',
        10: '根据用户近期观看的影片推荐'
      }
      return labelMap[value]
    },
    getResourceLabel(value) {
      const labelMap =  {
        o_iqiyi: '爱奇艺',
        o_tencent: '腾讯'
      }
      return labelMap[value]
    },
    handlePanelGroupCategoryChange(val) {
      this.panel.panelGroupCategory = val;
      const panelGroupCategoryValue = this.panelGroupCategoryValue
      if (panelGroupCategoryValue === 'common' || panelGroupCategoryValue === 'video') {
        this.panel.pannelResource = 'o_tencent'
      } else {
        this.panel.pannelResource = ''
      }
    },
    handlePannelResourceChange(val) {
      this.panel.pannelResource = val;
    },
    handleSaveDraft() {
      const data = JSON.parse(JSON.stringify(this.panel))
      data.pannelStatus = 2
      this.submit(data)
    },
    handleSubmitAudit() {
      const data = JSON.parse(JSON.stringify(this.panel))
      data.pannelStatus = 3
      this.submit(data)
    },
    validate(data, cb) {
      this.$refs.upsertForm.validate(function(valid) {
        if (valid) {
          cb()
        }
      })
    },
    submit(data) {
      this.validate(data, function(err) {
        if (!err) {
          this.$service.privatePanelUpsert(this.parseDataToApi(data)).then(function(result) {
            const winId = this.mode === 'create' ? 'add-view' : 'edit-view'
            this.FastDevTool.closeParentDialogWin(winId, 'list-view');
          }.bind(this))
        } else {
          this.$message({
            type: 'error',
            message: err
          })
        }
      }.bind(this))
    },
    parseDataToApi(data) {
      const panel = JSON.parse(JSON.stringify(data))
      const panelGroupCategory = panel.panelGroupCategory
      const pannelResource = panel.pannelResource
      const pannelStatus = panel.pannelStatus
      const layoutId = panel.layoutId
      const showTitle = panel.showTitle ? 1 : 0
      const lucenyFlag = panel.lucenyFlag ? 1 : 0
      panel.pannelList.forEach(function(item) {
        item.pannelCategory = panelGroupCategory
        item.pannelResource = pannelResource
        item.pannelStatus = pannelStatus
        item.layoutId = layoutId
        item.showTitle = showTitle

        if (item.contentList) {
          item.contentList.forEach(function(cItem) {
            cItem.lucenyFlag = lucenyFlag
          })
        }
      })
      delete panel.pannelResource
      delete panel.showTitle
      delete panel.lucenyFlag
      delete panel.pannelStatus
      delete panel.layoutId
      return panel
    },
    parseApiToData(data) {
      panel = JSON.parse(JSON.stringify(data))
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
    handleEdit() {
      const panel = this.panel
    //   window.location.href = this.urls.edit + '?id=' + panel.pannelGroupId + '&version=' + panel.currentVersion
    },
    handleSelectVersion(version) {
        const panel = this.panel
        const href = location.pathname + '?id=' + panel.pannelGroupId + '&version=' + version
        location.href = href
    },
    handleDelete() {
        // const FastDevTool = this.FastDevTool
        // const urls = this.urls
        // const panel = this.panel
        // FastDevTool.createConfirmWin({ // 审核
        //     title: '提示',
        //     content: '确认删除该版本吗?'
        // }, function () {
        //   this.$service.panelDeleteHistory({
        //     id: panel.pannelGroupId, 
        //     version: panel.currentVersion
        //   }, '删除成功').then(function() {
        //     FastDevTool.closeParentDialogWin('edit-view', 'list-view');
        //   }.bind(this))
        // }.bind(this));
    },
    handleAudit() {
        const FastDevTool = this.FastDevTool
        const auditForm = this.auditForm
        const panel = this.panel
        if (auditForm.auditDesc.trim() === '') {
            FastDevTool.createAlertWin('请填写意见说明');
        } else {
            this.$service.audit({
                id: panel.pannelGroupId,
                version: panel.currentVersion,
                type: 'pannel',
                auditFlag: auditForm.auditFlag,
                auditDesc: auditForm.auditDesc
            }).then(function(result) {
              this.showAuditDialog = false
              FastDevTool.closeParentDialogWin('edit-view', 'list-view');
            }.bind(this), '操作成功')
        }
    },
    handleUnAudit() {
      const panel = this.panel
      const FastDevTool = this.FastDevTool
      this.$confirm('您确定要撤销审核吗?', '提示')
        .then(function() {
          this.$service.revokeAudit({
            id: panel.pannelId,
            version: panel.currentVersion,
            type: 'pannel'
          }).then(function() {
            FastDevTool.closeParentDialogWin('edit-view', 'list-view');
          }.bind(this))
        }.bind(this))
        .catch(function(){})
    },
    handleCopy() {
      const panel = this.panel
    //   const href = this.urls.edit_history_view + '?id=' + panel.pannelGroupId + '&version=' + panel.currentVersion
      window.location.href = href
    },
    handleShelves() {
      const panel = this.panel
      this.$service.shelves({
        id: panel.pannelGroupId,
        version: panel.currentVersion,
        type: 'pannel'
      }).then(function() {
        window.location.reload();
      })
    },
    getDictType() {
         this.$service.getDictType().then(data => {
            console.log(data)
            this.panelGroupCategoryOptions = data
        })
    },
    getHistory() {
      this.$service.getHistory({id: this.viewData.pannelGroupId, type: 'pannel'})
        .then(data => {
            console.log(data)
          this.versionList = data
        })
    }
  },
  created() {
    this.title ='预览'
    this.mode = 'read'
    this.auditHistories = this.viewData
    this.getDictType()
    this.getHistory()
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
  margin-bottom: 0px
}
.private-panel-info-read .el-form-item {
  margin-bottom: 0
}
.amount-input {
  display: inline-block;
  width: 320px;
}
.version-selector {
  width: 350px;
}

</style>