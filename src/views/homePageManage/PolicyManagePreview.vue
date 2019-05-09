<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <CommonContent
      mode="read"
      :resource-info="resourceInfo"
      @replicate="replicate"
      @edit="edit"
      @unaudit="fetchData"
      @shelves="fetchData"
      @audit="$emit('upsert-end')"
      @select-version="fetchData"
    >
      <div>
        <div class="form-legend-header">
          <span>基本信息</span>
        </div>
      </div>
      <!--预览界面-->
      <el-row :gutter="40">
        <el-col :span="24">
          <el-form :model="form" ref="form" label-width="100px" class="el-form-add">
            <el-form-item label="策略名称" prop="policyName">{{form.policyName}}</el-form-item>
            <el-form-item label="机型机芯" prop="chipModel">
              <SelectedTag v-if="form.deviceInfos.length>0">
                <ul>
                  <li v-for="(item, index) in form.deviceInfos" :key="index">
                    <el-tag
                      type="success"
                      closable
                      @close="modelChipSelectedRemove(item)"
                    >{{item.model}}_{{item.chip}}</el-tag>
                  </li>
                </ul>
              </SelectedTag>
            </el-form-item>
            <el-form-item label="首页版本号" required class="linkwork">
              <el-col :span="11" style="padding-left:0px;padding-right:0px;">
                <el-form-item prop="homePageVerStart">
                  <el-input-number
                    v-model="form.homePageVerStart"
                    disabled="disabled"
                    :min="1000000"
                    :max="9999999"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2" style="padding-left:0px;padding-right:0px;">-</el-col>
              <el-col :span="11" style="padding-left:0px;padding-right:0px;">
                <el-form-item prop="homePageVerEnd">
                  <el-input-number
                    v-model="form.homePageVerEnd"
                    disabled="disabled"
                    :min="1000000"
                    :max="9999999"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="Mac地址" required class="linkwork">
              <el-col :span="11" style="padding-left:0px;padding-right:0px;">
                <el-form-item prop="macStart">
                  <el-input
                    placeholder="Mac地址起始"
                    disabled="disabled"
                    v-model="form.macStart"
                    style="width: 100%;"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2" style="padding-left:0px;padding-right:0px;">-</el-col>
              <el-col :span="11" style="padding-left:0px;padding-right:0px;">
                <el-form-item prop="macEnd">
                  <el-input
                    placeholder="Mac地址起始"
                    disabled="disabled"
                    v-model="form.macEnd"
                    style="width: 100%;"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="策略优先级" prop="priority">
              {{form.priority}}
              <span class="tip">注：数值越大优先级越高，数值越小优先级越低</span>
            </el-form-item>
            <el-form-item label="关联首页方案">
              <span v-if="typeof(form.homepageInfoListObj['normal'])!=='undefined'" class="tip">
                <el-tag type="success">{{form.homepageInfoListObj['normal'].homepageName}}</el-tag>
              </span>
            </el-form-item>
            <el-form-item label="关联首页方案">
              <span v-if="typeof(form.homepageInfoListObj['child'])!=='undefined'" class="tip">
                <el-tag type="success">{{form.homepageInfoListObj['child'].homepageName}}</el-tag>
              </span>
            </el-form-item>
            <el-form-item label="定向首页方案">
              <SelectedHomePage
                :dataArr="form.specialNormalHp"
                @edit-item="editHomePage"
                @remove-item="removeHomePage"
                title="标准模式"
                v-if="form.specialNormalHp.length>0"
              ></SelectedHomePage>
              <SelectedHomePage
                :dataArr="form.specialChildHp"
                @edit-item="editHomePage"
                @remove-item="removeHomePage"
                v-if="form.specialChildHp.length>0"
                title="儿童模式"
              ></SelectedHomePage>
            </el-form-item>
            <!-- <el-form-item>
            <el-button type="primary" @click="submitBtn(3)">提交审核</el-button>
            <el-button type="warning" @click="submitBtn(2)">保存草稿</el-button>
            </el-form-item>-->
          </el-form>
        </el-col>
      </el-row>
    </CommonContent>
  </ContentCard>
</template>
<script>
// import ChipModel from './../../components/ChipModel'
import SelectedTag from './../../components/SelectedTag'
// import HomePageModel from './../../components/HomePageModel'
// import PolicyManageAddHomePage from './PolicyManageAddHomePage'
import SelectedHomePage from './../../components/SelectedHomePage.vue'
import CommonContent from '@/components/CommonContent.vue'
export default {
  components: {
    // ChipModel,
    SelectedTag,
    // HomePageModel,
    // PolicyManageAddHomePage,
    SelectedHomePage,
    CommonContent
  },
  props: {
    editId: Number,
    version: String
  },
  data() {
    return {
      title: null,
      dialogTitle: null,
      mode: null,
      dialogVisible: false,
      addHomePageDialogVisible: false, //是否显示addHomePage组件
      model: 'normal',
      platform: 'tencent', //内容源
      editHomePageData: {}, //编辑定向首页方案
      status: null,
      form: {
        policyId: null,
        policyName: null,
        macStart: null,
        macEnd: null,
        homePageVerEnd: '',
        homePageVerStart: '',
        priority: null,
        policyStatus: 3,
        deviceInfos: [], //机型机芯{chip:'',model:''}
        homepageInfoList: [],
        homepageInfoListObj: {},
        schemeFilterEntity: {
          partner: 'tencent'
        },
        regionCityPairs: [],
        specialNormalHp: [],
        specialChildHp: []
        // NormalHomeScheme: '', // 标准模式首页
        // ChildHomeScheme: '' // 儿童模式首页
      }
    }
  },
  computed: {
    resourceInfo() {
      const form = this.form
      if (form.policyId) {
        return {
          id: form.policyId,
          type: 'policy',
          menuElId: 'policyConf',
          version: form.currentVersion,
          status: form.policyStatus
        }
      }
    }
  },
  methods: {
    replicate(id) {
      this.$emit('open-add-page', this.editId, true)
    },
    edit() {
      this.$emit('open-add-page', this.editId)
    },
    handleSubmitAudit() {},
    handleSaveDraft() {},
    audit() {},
    unaudit() {},
    shelves() {},
    selectVersion(version) {
      this.getEditData(version)
    },
    /*定向首页方案编辑*/
    editHomePage(model, index) {
      this.addHomePageDialogVisible = true
      if (model === 'normal') {
        this.editHomePageData = this.form.specialNormalHp[index]
      } else {
        this.editHomePageData = this.form.specialChildHp[index]
      }
    },
    /*定向首页方案编辑*/
    removeHomePage(model, index) {
      if (model === 'normal') {
        this.editHomePageData = this.form.specialNormalHp.splice(index, 1)
      } else {
        this.editHomePageData = this.form.specialChildHp.splice(index, 1)
      }
    },
    fetchData(version) {
      this.$service
        .getTestPolicyConfDetail({ id: this.editId, version })
        .then(data => {
         // this.version = data.currentVersion
          this.status = data.policyStatus
          this.form = {
            currentVersion: data.currentVersion,
            policyId: data.policyId,
            policyName: data.policyName,
            macStart: data.macStart,
            macEnd: data.macEnd,
            homePageVerEnd: data.homePageVerEnd,
            homePageVerStart: data.homepageVerStart,
            priority: data.priority,
            policyStatus: data.policyStatus,
            deviceInfos: [{ chip: data.chip, model: data.model }], //机型机芯{chip:'',model:''}
            homepageInfoList: data.homepageInfoList,
            homepageInfoListObj: {
              normal:
                data.homepageInfoList.length > 0
                  ? data.homepageInfoList[0]
                  : {},
              child:
                data.homepageInfoList.length === 2
                  ? data.homepageInfoList[1]
                  : {}
            },
            schemeFilterEntity: {
              partner: data.platform
            },
            regionCityPairs: [],
            specialNormalHp: data.specialNormalHp,
            specialChildHp: data.specialChildHp
          }
        })
    }
  },
  created() {
    this.title = '预览'
    this.fetchData(this.version)
  }
}
</script>
<style lang="stylus" scoped>
.tip
  font-size: 12px
  margin-left: 10px
</style>




