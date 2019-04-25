<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
          <el-form-item label="策略名称" prop="policyName">
            <el-input v-model="form.policyName" placeholder="策略名称"></el-input>
          </el-form-item>
          <el-form-item label="机型机芯" prop="chipModel">
            <el-button
              v-if="form.deviceInfos.length===0"
              type="info" plain
              @click="selectChipModel"
            >选择机型机芯</el-button>
            <SelectedTag v-if="form.deviceInfos.length>0">
              <ul>
                <li v-for="(item, index) in form.deviceInfos" :key="index">
                  <el-tag
                    type="success"
                    closable
                    @close="modelChipSelectedRemove(item)"
                  >{{item.model}}_{{item.chip}}</el-tag>
                </li>
                <li>
                  <el-button type="info" plain @click="selectChipModel">选择机型机芯</el-button>
                </li>
              </ul>
            </SelectedTag>
          </el-form-item>
          <el-form-item label="首页版本号" required class="homePageVersion">
            <el-col :span="11" style="padding-left:0px;padding-right:0px;">
              <el-form-item prop="homePageVerStart">
                <el-input-number v-model="form.homePageVerStart"  :min="1000000" :max="9999999"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">-</el-col>
            <el-col :span="11" style="padding-left:0px;padding-right:0px;">
              <el-form-item prop="homePageVerEnd">
                <el-input-number v-model="form.homePageVerEnd"   :min="1000000" :max="9999999"></el-input-number>
                <!-- <el-input placeholder="首页版本号结尾" v-model="form.homePageVerEnd" style="width: 100%;"></el-input> -->
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="Mac地址" required>
            <el-col :span="11" style="padding-left:0px;padding-right:0px;">
              <el-form-item prop="macStart">
                <el-input placeholder="Mac地址起始" v-model="form.macStart" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">-</el-col>
            <el-col :span="11" style="padding-left:0px;padding-right:0px;">
              <el-form-item prop="macEnd">
                <el-input placeholder="Mac地址结尾" v-model="form.macEnd" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="策略优先级" prop="priority">
            <el-input-number v-model="form.priority" placeholder="策略优先级"></el-input-number>
            <span class="tip">注：数值越大优先级越高，数值越小优先级越低</span>
          </el-form-item>
          <el-form-item label="关联首页方案">
            <el-button type="info" plain @click="selectHomePageModel('normal')">选择标准模式首页</el-button>
            <span v-if="typeof(form.homepageInfoListObj['normal'])!=='undefined'"  class="tip">已选首页：
               <el-tag
                    type="success"
                  >{{form.homepageInfoListObj['normal'].homepageName}}</el-tag>
              </span>
          </el-form-item>
          <el-form-item label="关联首页方案">
            <el-button type="info" plain @click="selectHomePageModel('child')">选择儿童模式首页</el-button>
            <span v-if="typeof(form.homepageInfoListObj['child'])!=='undefined'"  class="tip">已选首页：
               <el-tag
                    type="success"
                  >{{form.homepageInfoListObj['child'].homepageName}}</el-tag>
              </span>
          </el-form-item>
           <el-form-item label="定向首页方案">
            <el-button type="info" plain @click="addHomePage('normal')">添加标准模式</el-button>
            <el-button type="info" plain  @click="addHomePage('child')">添加儿童模式</el-button>
            <el-button  type="info" plain @click="cancel">解绑所有方案</el-button>
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
    <el-dialog :dialogTitle="dialogTitle" :visible.sync="dialogVisible" width="80%">
      <ChipModel ref="chipModelSelected" v-if="mode==='modelChip'"></ChipModel>
      <HomePageModel 
      :homepageModel="model" 
      :homepageResource="platform"
      homepageStatusArray=4
      v-if="mode==='HomePageModel'" 
      @row-click="rowClick">
      </HomePageModel>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
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
export default {
  components: {
    ChipModel,
    SelectedTag,
    HomePageModel,
    PolicyManageAddHomePage,
    SelectedHomePage
  },
  props: {
    editId: Number,
    default: null
  },
  data() {
    return {
      title: null,
      dialogTitle: null,
      mode: null,
      dialogVisible: false,
      addHomePageDialogVisible: false,//是否显示addHomePage组件
      model: 'normal',
      platform: 'tencent',//内容源
      editHomePageData: {},//编辑定向首页方案
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
          { required: true, message: '请输入MAC结束地址', trigger: 'blur' },
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
  methods: {
    cancel(){
      this.form.homepageInfoList = []
      this.form.homepageInfoListObj = {}
      this.form.specialNormalHp = [] 
      this.form.specialChildHp = []
      this.form.schemeFilterEntity = {}
    },
    /** 关联首页选择*/
    rowClick(row){
      this.dialogVisible = false
      this.form.homepageInfoListObj[this.model] = {
        homepageId: row.homepageId,
        homepageModel: row.homepageModel,
        homepageName: row.homepageName,
        homepageVersion: row.homepageVersion
      }
    },
   addHomePageClose(){
     this.addHomePageDialogVisible = false
    
   },
   /*定向首页方案编辑*/
   editHomePage(model, index){
     this.addHomePageDialogVisible = true
     if (model === 'normal') {
       this.editHomePageData = this.form.specialNormalHp[index]
     } else {
       this.editHomePageData = this.form.specialChildHp[index]
     }
   },
   /*定向首页方案编辑*/
   removeHomePage(model, index){
     if (model === 'normal') {
       this.editHomePageData = this.form.specialNormalHp.splice(index, 1)
     } else {
       this.editHomePageData = this.form.specialChildHp.splice(index, 1)
     }
   },
   /** 
    * 生存一个定向首页方案
   */
   createHomePage(form){
     this.addHomePageDialogVisible = false
     if(this.model === 'normal') {
       this.form.specialNormalHp.push(form)
     } else {
       this.form.specialChildHp.push(form)
     }
   },
    /** 
     * 添加定向首页
    */
    addHomePage(model){
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
          let platform =this.$refs.chipModelSelected.platform
          if (platform !== this.platform ) { //更新首页
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
        let obj = this.form.homepageInfoListObj
        Object.keys(obj).forEach((e) => {
          this.form.homepageInfoList.push(obj[e])
        })
        this.form.policyStatus = status
        if (valid) {
          this.$service
            .policyConfSave(
              { jsonStr: JSON.stringify(this.form) },
              '保存成功'
            )
            .then(data => {
              this.$emit('open-list-page')
            })
        }
      })
    },
    getEditData() {
      let obj = this
      this.$service
        .globalCornerIconTypeDetail({ id: this.editId })
        .then(data => {
          Object.keys(this.form).forEach(v => {
            this.form[v] = data[v]
          })
        })
    }
  },
  created() {
    if (this.editId !== null && this.editId !== undefined) {
      this.title = '编辑'
      this.typeId = this.editId
      this.getEditData()
    } else {
      this.title = '新增'
    }
  }
}
</script>
<style lang="stylus" scoped>
.homePageVersion >>> .el-input-number
  width: 100%
.tip
  font-size 12px
  margin-left 10px
</style>




