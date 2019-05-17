<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <div v-if="mode!== 'read'">
      <el-row :gutter="40">
        <el-col :span="24">
          <el-form
            :model="form"
            :rules="formRules"
            ref="form"
            label-width="110px"
            class="el-form-add"
          >
            <el-form-item label="策略名称" prop="policyName">
              <el-input v-model="form.policyName" placeholder="策略名称"></el-input>
            </el-form-item>
            <el-form-item label="机型机芯" prop="chipModel">
              <el-button type="primary" plain @click="selectChipModel">选择机型机芯</el-button>
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
                  <el-input-number v-model="form.homePageVerStart" :min="1000000" :max="9999999"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2" style="padding-left:0px;padding-right:0px;">-</el-col>
              <el-col :span="11" style="padding-left:0px;padding-right:0px;">
                <el-form-item prop="homePageVerEnd">
                  <el-input-number v-model="form.homePageVerEnd" :min="1000000" :max="9999999"></el-input-number>
                  <!-- <el-input placeholder="首页版本号结尾" v-model="form.homePageVerEnd" style="width: 100%;"></el-input> -->
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="Mac地址" required class="linkwork">
              <el-form-item prop="macStart">
                <el-input placeholder="Mac地址" v-model="form.macStart"></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item label="策略优先级" prop="priority">
              <el-input-number v-model="form.priority" placeholder="策略优先级" :min="1" :max="9999"></el-input-number>
              <span class="tip">注：数值越大优先级越高，数值越小优先级越低</span>
            </el-form-item>
            <el-form-item label="关联首页方案">
              <el-button type="primary" plain @click="selectHomePageModel('normal')">选择标准模式首页</el-button>
              <span v-if="typeof(form.homepageInfoListObj['normal'])!=='undefined'" class="tip">
                已选首页：
                <el-tag type="success">{{form.homepageInfoListObj['normal'].homepageName}}</el-tag>
              </span>
            </el-form-item>
            <el-form-item label="关联首页方案">
              <el-button type="primary" plain @click="selectHomePageModel('child')">选择儿童模式首页</el-button>
              <span v-if="typeof(form.homepageInfoListObj['child'])!=='undefined'" class="tip">
                已选首页：
                <el-tag type="success">{{form.homepageInfoListObj['child'].homepageName}}</el-tag>
              </span>
            </el-form-item>
            <el-form-item label="定向首页方案">
              <el-button type="primary" plain @click="addHomePage('normal')">添加标准模式</el-button>
              <el-button type="primary" plain @click="addHomePage('child')">添加儿童模式</el-button>
              <el-button type="primary" plain @click="cancel">解绑所有方案</el-button>
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
            <el-form-item>
              <el-button type="primary" @click="submitBtn(3)">提交审核</el-button>
              <el-button type="warning" @click="submitBtn(2)">保存草稿</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div v-if="mode==='read'">
      <CommonContent
        :mode="mode"
        :resource-info="resourceInfo"
        @replicate="mode = 'replicate'; this.title='创建副本'"
        @edit="mode = 'edit'"
        @unaudit="$emit('upsert-end')"
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
                      <el-tag type="success">{{item.model}}_{{item.chip}}</el-tag>
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
            </el-form>
          </el-col>
        </el-row>
      </CommonContent>
    </div>
    <el-dialog :dialogTitle="dialogTitle" :visible.sync="dialogVisible" width="80%">
      <ChipModel
        ref="chipModelSelected"
        v-if="mode==='modelChip'"
        :selectionType="selectionType"
        @row-click="ChipModelRowClick"
      ></ChipModel>
      <HomePageModel
        :homepageModel="model"
        :homepageResource="platform"
        homepageStatusArray="4"
        v-if="mode==='HomePageModel'"
        @row-click="rowClick"
        @row-selection-change="rowClick"
      ></HomePageModel>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false;mode=''">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <PolicyManageAddHomePage
      v-if="addHomePageDialogVisible"
      :itemType="model"
      :editHomePageData="editHomePageData"
      @add-home-page-close="addHomePageClose"
      @create-home-page="createHomePage"
    ></PolicyManageAddHomePage>
  </ContentCard>
</template>
<script>
import ChipModel from './../../components/ChipModel'
import SelectedTag from './../../components/SelectedTag'
import HomePageModel from './../../components/HomePageModel'
import PolicyManageAddHomePage from './PolicyManageAddHomePage'
import SelectedHomePage from './../../components/SelectedHomePage.vue'
import CommonContent from '@/components/CommonContent.vue'
export default {
  components: {
    ChipModel,
    SelectedTag,
    HomePageModel,
    PolicyManageAddHomePage,
    SelectedHomePage,
    CommonContent
  },
  props: ['id', 'initMode', 'version'],
  data() {
    return {
      mode: undefined,
      title: null,
      selectionType: 'multiple',
      dialogTitle: null,
      mode: null,
      dialogVisible: false,
      addHomePageDialogVisible: false, //是否显示addHomePage组件
      model: 'normal',
      platform: 'tencent', //内容源
      editHomePageData: {}, //编辑定向首页方案
      editHomePageMode: undefined, //编辑定向首页方案的模式 normal,child
      editHomePageIndex: undefined, //编辑定向首页方案数据索引
      form: {
        policyId: null,
        policyName: null,
        macStart: undefined,
        macEnd: 'ffffffffffff',
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
      },
      formRules: {
        // 表单规则
        policyName: [
          { required: true, message: '请输入策略名称', trigger: 'blur' }
        ],
        macStart: [
          { required: true, message: '请输入MAC起始地址', trigger: 'blur' },
          {
            validator: this.$checkMacType,
            message: '请输入12位以字母数字组成的MAC地址',
            trigger: 'blur'
          }
        ],
        macEnd: [
          {
            validator: this.$checkMacType,
            message: '请输入12位以字母数字组成的MAC地址',
            trigger: 'blur'
          }
        ],
        homePageVerStart: [
          { required: true, message: '请输入首页版本起始值', trigger: 'blur' }
        ],
        homePageVerEnd: [
          { required: true, message: '请输入首页版本结束值', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    platform: function(newV) {
      this.form.homepageInfoList = []
      this.form.homepageInfoListObj = {}
      this.form.specialNormalHp = []
      this.form.specialChildHp = []
      this.form.schemeFilterEntity.partner = newV
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
    ChipModelRowClick(row) {
      this.dialogVisible = false
      this.form.deviceInfos = [
        {
          chip: row.chip,
          model: row.model
        }
      ]
    },
    cancel() {
      this.form.specialNormalHp = []
      this.form.specialChildHp = []
      // this.form.schemeFilterEntity = {}
    },
    /** 关联首页选择*/
    rowClick(row) {
      this.dialogVisible = false
      this.form.homepageInfoListObj[this.model] = {
        homepageId: row.homepageId,
        homepageModel: row.homepageModel,
        homepageName: row.homepageName,
        homepageVersion: row.homepageVersion
      }
    },
    addHomePageClose() {
      this.addHomePageDialogVisible = false
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
    /**
     * 生存一个定向首页方案
     */
    createHomePage(form) {
      let crowdPolicyIds = form.attribute.crowdPolicyIds[0]
      let crowdId = form.attribute.crowdIds[0]
      this.$service.getCrowdOfPolicy(crowdPolicyIds).then(data => {
        for (var i = 0; i < data.length; i++) {
          if (data[i].value === crowdId) {
            form.attribute.crowdName = data[i].label
            break
          }
        }
        if (this.model === 'normal') {
          if (isEdit) {
            this.form.specialNormalHp[this.editHomePageIndex] = form
          } else {
            this.form.specialNormalHp.push(form)
          }
        } else {
          if (isEdit) {
            this.form.specialChildHp[this.editHomePageIndex] = form
          } else {
            this.form.specialChildHp.push(form)
          }
        }
      })
      this.addHomePageDialogVisible = false
    },
    getCrowdNames(data) {
      let form = data.map(e => {
        let crowdPolicyIds = e.attribute.crowdPolicyIds[0]
        let crowdId = e.attribute.crowdIds[0]
        this.$service.getCrowdOfPolicy(crowdPolicyIds).then(data => {
          for (var i = 0; i < data.length; i++) {
            if (data[i].value === crowdId) {
              this.$set(e.attribute, 'crowdName', data[i].label)
              break
            }
          }
        })
        return e
      })
      return form
    },
    /**
     * 添加定向首页
     */
    addHomePage(model) {
      this.addHomePageDialogVisible = true
      // this.title = '添加定向首页方案'
      this.model = model
      this.editHomePageData = {}
    },
    /*
    移除机型机芯
    */
    modelChipSelectedRemove(item) {
      this.form.deviceInfos.splice(item, 1)
    },
    dialogSubmit() {
      this.dialogVisible = false
      switch (this.mode) {
        case 'modelChip':
          let platform = this.$refs.chipModelSelected.platform
          if (platform !== this.platform) {
            //更新首页
            this.platform = platform
          }
          this.form.deviceInfos = this.$refs.chipModelSelected.selected.map(
            e => {
              return {
                chip: e.chip,
                model: e.model
              }
            }
          )
          break
      }
    },

    selectChipModel() {
      this.dialogVisible = true
      this.dialogTitle = '选择机型机芯'
      this.mode = 'modelChip'
    },
    selectHomePageModel(model) {
      this.dialogVisible = true
      this.dialogTitle = '选择首页方案模式'
      this.mode = 'HomePageModel'
      this.model = model
    },
    submitBtn(status) {
      this.$refs.form.validate(valid => {
        let form = this.form
        form.homepageInfoList = []
        let obj = form.homepageInfoListObj
        Object.keys(obj).forEach(e => {
          form.homepageInfoList.push(obj[e])
        })
        form.policyStatus = status
        if (valid) {
          if (obj['normal'] === undefined) {
            this.$message({
              type: 'error',
              message: '请选择标准模式首页'
            })
            return
          }
          if (obj['child'] === undefined) {
            this.$message({
              type: 'error',
              message: '请选择儿童模式首页'
            })
            return
          }
          form.macEnd = form.macStart
          if (form.deviceInfos.length === 0) {
            this.$message({
              type: 'error',
              message: '机型机芯不能为空'
            })
            return
          }
          this.$service
            .testPolicyConfSave({ jsonStr: JSON.stringify(form) }, '保存成功')
            .then(data => {
              this.$emit('upsert-end')
            })
        }
      })
    },

    fetchData(version) {
      this.$service
        .getTestPolicyConfDetail({ id: this.id, version })
        .then(data => {
          this.form = {
            currentVersion:
              this.mode === 'replicate' ? '' : data.currentVersion,
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
            specialNormalHp: this.getCrowdNames(data.specialNormalHp),
            specialChildHp: this.getCrowdNames(data.specialChildHp)
          }
        })
    }
  },
  created() {
    // if (this.editId !== null && this.editId !== undefined) {
    //   this.isReplicate ? (this.title = '创建副本') : (this.title = '编辑')
    //   this.selectionType = 'single'
    //   this.getEditData()
    // } else {
    //   this.title = '新增'
    // }

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
      case 'read':
        this.title = '预览'
        break
    }
    if (this.id) {
      this.selectionType = 'single'
      this.fetchData(this.version)
    }
  }
}
</script>
<style lang="stylus" scoped>
.tip
  font-size: 12px
  margin-left: 10px
</style>




