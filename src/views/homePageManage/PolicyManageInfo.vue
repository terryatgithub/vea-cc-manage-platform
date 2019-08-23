<template>
<PageWrapper class="policy-info-wrapper">
  <PageContentWrapper v-show="activePage === 'policy_info'">
    <ContentCard :title="title" @go-back="$emit('go-back')">
      <!--新增编辑界面-->
      <CommonContent
        :mode="mode"
        :resource-info="resourceInfo"
        @replicate="mode = 'replicate'"
        @edit="mode = 'edit'"
        @unaudit="$emit('upsert-end')"
        @shelves="fetchData"
        @submit-audit="submitBtn(3)"
        @save-draft="submitBtn(2)"
        @audit="$emit('upsert-end')"
        @select-version="fetchData"
        @delete="$emit('upsert-end', $event)"
      >
        <div class="form-legend-header">
          <i class="el-icon-edit">基本信息</i>
        </div>
        <div v-if="mode!== 'read'">
          <el-row :gutter="40">
            <el-col :span="24">
              <el-form
                :model="form"
                :rules="formRules"
                ref="form"
                label-width="160px"
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
                      <!-- <li>
                      <el-button type="primary" plain @click="selectChipModel">选择机型机芯</el-button>
                      </li>-->
                    </ul>
                  </SelectedTag>
                </el-form-item>
                <el-form-item label="首页版本号" required class="linkwork">
                  <el-col :span="11" style="padding-left:0px;padding-right:0px;">
                    <el-form-item prop="homePageVerStart">
                      <el-input-number v-model="form.homePageVerStart" :min="0" :max="9999999"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2" style="padding-left:0px;padding-right:0px;">-</el-col>
                  <el-col :span="11" style="padding-left:0px;padding-right:0px;">
                    <el-form-item prop="homePageVerEnd">
                      <el-input-number v-model="form.homePageVerEnd" :min="0" :max="9999999"></el-input-number>
                      <!-- <el-input placeholder="首页版本号结尾" v-model="form.homePageVerEnd" style="width: 100%;"></el-input> -->
                    </el-form-item>
                  </el-col>
                </el-form-item>

                <el-form-item v-if="isTestPolicy" label="Mac地址" prop="macStart" class="linkwork">
                  <el-input placeholder="Mac地址" v-model="form.macStart"></el-input>
                </el-form-item>

                <el-form-item v-else label="Mac地址" class="linkwork">
                  <el-col :span="11" style="padding-left:0px;padding-right:0px;">
                    <el-form-item prop="macStart">
                      <el-input placeholder="Mac地址起始" v-model="form.macStart" style="width: 100%;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2" style="padding-left:0px;padding-right:0px;">-</el-col>
                  <el-col :span="11" style="padding-left:0px;padding-right:0px;">
                    <el-form-item prop="macEnd">
                      <el-input placeholder="Mac地址结尾" v-model="form.macEnd" style="width: 100%;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-form-item>


                <el-form-item label="策略优先级" prop="priority">
                  <el-input-number v-model="form.priority" placeholder="策略优先级" :min="1" :max="9999"></el-input-number>
                  <span class="tip">注：数值越大优先级越高，数值越小优先级越低</span>
                </el-form-item>
                <el-form-item label="关联首页方案">
                  <HomepageSelector title="选择首页方案" homepageModel="normal" @select-end="handleSelectNormalHomepageEnd" selection-type="single" />
                  <!-- <el-button type="primary" plain @click="selectHomePageModel('normal')">选择标准模式首页</el-button> -->
                  <span v-if="form.normalHpList[0]" class="tip">
                    已选首页：
                    <el-tag type="success" class="el-tag" @click.native="showHomePageDetail(form.normalHpList[0])">
                      {{ form.normalHpList[0].homepageName }}
                    </el-tag>
                  </span>
                </el-form-item>
                <el-form-item label="关联儿童首页方案">
                  <HomepageSelector title="选择首页方案" homepageModel="child"  @select-end="handleSelectChildHomepageEnd" />
                  <!-- <el-button type="primary" plain @click="selectHomePageModel('child')">选择儿童模式首页</el-button> -->
                  <div class="child-homepage-list">
                    <div 
                      v-for="(item, index) in form.childHpList" 
                      :key="index"
                      class="child-homepage-item">
                      <el-form-item label="首页方案" label-width="80px">
                        {{ item.homepageName }}
                      </el-form-item>
                      <el-form-item label="年龄" label-width="80px">
                        <el-select v-model="item.age" placeholder="请选择" size="small">
                          <el-option
                            v-for="item in ageOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <i class="el-icon-close" @click="handleRemoveChildHpItem(index)"></i>
                    </div>
                  </div>
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
                    :mode="mode"
                    v-if="form.specialNormalHp.length>0"
                  ></SelectedHomePage>
                  <SelectedHomePage
                    :dataArr="form.specialChildHp"
                    @edit-item="editHomePage"
                    @remove-item="removeHomePage"
                    v-if="form.specialChildHp.length>0"
                    :mode="mode"
                    title="儿童模式"
                  ></SelectedHomePage>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div v-if="mode==='read'">
          <!--预览界面-->
          <el-row :gutter="40">
            <el-col :span="24">
              <el-form :model="form" ref="form" label-width="160px">
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
                        :min="0"
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
                        :min="0"
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
                <el-form-item label="关联首页方案(标准)">
                  <span v-if="form.normalHpList[0]" class="tip">
                    已选首页：
                    <el-tag type="success" class="el-tag" @click.native="showHomePageDetail(form.normalHpList[0])">
                      {{ form.normalHpList[0].homepageName }}
                    </el-tag>
                  </span>
                </el-form-item>
                <el-form-item label="关联首页方案(儿童)">
                  <div class="child-homepage-list">
                    <div 
                      v-for="(item, index) in form.childHpList" 
                      :key="index"
                      class="child-homepage-item">
                      <el-form-item label="首页方案" label-width="80px">
                        {{ item.homepageName }}
                      </el-form-item>
                      <el-form-item label="年龄" label-width="80px">
                        {{ ageEnums[item.age] }}
                      </el-form-item>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="定向首页方案">
                  <SelectedHomePage
                    :dataArr="form.specialNormalHp"
                    @edit-item="editHomePage"
                    @remove-item="removeHomePage"
                    :mode="mode"
                    title="标准模式"
                    v-if="form.specialNormalHp.length>0"
                  ></SelectedHomePage>
                  <SelectedHomePage
                    :dataArr="form.specialChildHp"
                    @edit-item="editHomePage"
                    @remove-item="removeHomePage"
                    v-if="form.specialChildHp.length>0"
                    :mode="mode"
                    title="儿童模式"
                  ></SelectedHomePage>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </CommonContent>
      <el-dialog :dialogTitle="dialogTitle" :visible.sync="dialogVisible" width="80%">
        <ChipModel
          ref="chipModelSelected"
          v-if="dialogType ==='modelChip'"
          :selectionType="selectionType"
          @row-click="ChipModelRowClick"
        ></ChipModel>
        <HomePageModel
          :homepageModel="dialogType"
          :homepageResource="platform"
          homepageStatusArray="4"
          v-if="dialogVisible && selectHomePageDialogVisible"
          @row-click="rowClick"
          @row-selection-change="rowClick"
        ></HomePageModel>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false;dialogType=''">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <PolicyManageAddHomePage
        v-if="addHomePageDialogVisible"
        :itemType="dialogType"
        :selected-crowds="selectedCrowds"
        :editHomePageData="editHomePageData"
        @add-home-page-close="addHomePageClose"
        @create-home-page="createHomePage"
      ></PolicyManageAddHomePage>

    </ContentCard>
  </PageContentWrapper>
  <PageContentWrapper v-if="activePage === 'showHomePageDetail'">
    <HomePageInfo
      :id="homePageId"
      init-mode="read"
      :version="homePageVersion"
      :title-prefix="title"
      @upsert-end="activePage = 'policy_info'"
      @go-back="activePage = 'policy_info'"
    />
  </PageContentWrapper>
</PageWrapper>
</template>
<script>
import ChipModel from './../../components/ChipModel'
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import SelectedTag from './../../components/SelectedTag'
import HomePageModel from './../../components/HomePageModel'
import PolicyManageAddHomePage from './PolicyManageAddHomePage'
import SelectedHomePage from './../../components/SelectedHomePage.vue'
import CommonContent from '@/components/CommonContent.vue'
import HomePageInfo from './HomePageInfo'
import HomepageSelector from '@/components/selectors/HomepageSelector'
import titleMixin from '@/mixins/title'
import { cloneDeep } from 'lodash'
export default {
  mixins: [titleMixin],
  components: {
    ChipModel,
    SelectedTag,
    HomePageModel,
    PolicyManageAddHomePage,
    SelectedHomePage,
    CommonContent,
    HomePageInfo,
    PageWrapper,
    PageContentWrapper,
    
    HomepageSelector
  },
  props: ['id', 'initMode', 'version', 'isTestPolicy'],
  data() {
    const isTestPolicy = this.isTestPolicy
    function checkMacType(rule, value, callback) {
      if (value === '') {
        return callback()
      }
      value = value.replace(/(^\s*)|(\s*$)/g, '') // 去掉空格
      var reg = /^[a-zA-Z0-9]{12}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请请输入12位以字母数字组成的MAC地址'))
      } 
    }
    return {
      homePageId: undefined,
      homePageVersion: undefined,
      homePageReadDialogVisible: false,
      activePage: 'policy_info',
      mode: undefined,
      dialogType: undefined,
      resourceName: isTestPolicy ? '测试策略' : '策略管理',
      // title: null,
      selectionType: 'multiple',
      dialogTitle: null,
      mode: 'normal',
      dialogVisible: false,
      selectHomePageDialogVisible: false,
      addHomePageDialogVisible: false, // 是否显示addHomePage组件
      // model: 'normal',
      platform: 'tencent', // 内容源
      selectedCrowds: [],
      editHomePageData: {}, // 编辑定向首页方案
      //  editHomePageMode: undefined, //编辑定向首页方案的模式 normal,child
      editHomePageIndex: undefined, // 编辑定向首页方案数据索引
      form: {
        policyId: null,
        policyName: null,
        macStart: isTestPolicy ? '' : '000000000000',
        macEnd: 'ffffffffffff',
        homePageVerEnd: '9999999',
        homePageVerStart: '',
        priority: null,
        policyStatus: 3,
        deviceInfos: [], // 机型机芯{chip:'',model:''}
        normalHpList: [],
        childHpList: [],
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
          {
            required: isTestPolicy,
            message: '请输入12位以字母数字组成的MAC地址'
          },
          {
            validator: checkMacType,
            trigger: 'blur'
          }
        ],
        macEnd: [
          {
            validator: checkMacType,
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
      },
      ageOptions: [],
      ageEnums: {}
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
      const isTestPolicy = this.isTestPolicy
      if (form.policyId) {
        return {
          id: form.policyId,
          type: 'policy',
          menuElId: isTestPolicy ? 'testPolicyConf' : 'policyConf',
          version: form.currentVersion,
          status: form.policyStatus
        }
      }
    }
  },
  methods: {
    mergeSelected(options) {
      const { idField, parse, selectedList, originSelectedList } = options
      const originSelectedListIndexed = originSelectedList.reduce(function(result, item, index) {
        result[item[idField]] = index
        return result
      }, {})
      const appendList = selectedList
        .filter((item) => originSelectedListIndexed[item[idField]] === undefined)
        .map(parse)
      return [...originSelectedList, ...appendList]
    },
    handleRemoveChildHpItem(index) {
      this.form.childHpList.splice(index, 1)
    },
    getHomepageInfo(homepage, preset) {
      return {
        homepageId: homepage.homepageId,
        homepageModel: homepage.homepageModel,
        homepageName: homepage.homepageName,
        homepageVersion: homepage.homepageVersion,
        ...preset
      }
    },
    handleSelectNormalHomepageEnd([homepage]) {
      this.form.normalHpList = [
        this.getHomepageInfo(homepage)
      ]
    },
    handleSelectChildHomepageEnd(selected) {
      this.form.childHpList = this.mergeSelected({
        idField: 'homepageId',
        parse: (item) => {
          return this.getHomepageInfo(item, {age: 0})
        },
        selectedList: selected,
        originSelectedList: this.form.childHpList
      })
    },
    showHomePageDetail(homepage) {
      this.homePageId = homepage.homepageId
      this.homePageVersion = homepage.currentVersion
      this.activePage = 'showHomePageDetail'
    },
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
    },
    /** 关联首页选择 */
    rowClick(row) {
      this.dialogVisible = false
      this.form.homepageInfoListObj[this.dialogType] = {
        homepageId: row.homepageId,
        homepageModel: row.homepageModel,
        homepageName: row.homepageName,
        homepageVersion: row.homepageVersion
      }
    },
    addHomePageClose() {
      this.addHomePageDialogVisible = false
    },
    /* 定向首页方案编辑 */
    editHomePage(mode, index) {
      this.addHomePageDialogVisible = true
      //  this.editHomePageMode = mode
      this.dialogType = mode
      this.editHomePageIndex = index
      if (mode === 'normal') {
        this.selectedCrowds = this.form.specialNormalHp
        this.editHomePageData = this.form.specialNormalHp[index]
      } else {
        this.selectedCrowds = this.form.specialChildHp
        this.editHomePageData = this.form.specialChildHp[index]
      }
    },
    /* 定向首页方案编辑 */
    removeHomePage(mode, index) {
      if (mode === 'normal') {
        this.editHomePageData = this.form.specialNormalHp.splice(index, 1)
      } else {
        this.editHomePageData = this.form.specialChildHp.splice(index, 1)
      }
    },
    /**
     * 生存一个定向首页方案
     */
    createHomePage(form, isEdit) {
      let crowdPolicyIds = form.attribute.crowdPolicyIds[0]
      let crowdId = form.attribute.crowdIds[0]
      this.$service
        .getTaglist({ id: crowdPolicyIds, type: 'crowd' })
        .then(data => {
          for (var i = 0; i < data.length; i++) {
            if (data[i].value === crowdId) {
              form.attribute.crowdName = data[i].label
              break
            }
          }
          if (this.dialogType === 'normal') {
            if (isEdit) {
              this.$set(this.form.specialNormalHp, this.editHomePageIndex, form)
            } else {
              if (
                !this.isContainCrowdName(this.form.specialNormalHp, crowdId)
              ) {
                this.form.specialNormalHp.push(form)
              } else {
                this.$message({
                  type: 'error',
                  message: '已经存在相同的人群'
                })
              }
            }
          } else {
            if (isEdit) {
              this.$set(this.form.specialChildHp, this.editHomePageIndex, form)
            } else {
              if (!this.isContainCrowdName(this.form.specialChildHp, crowdId)) {
                this.form.specialChildHp.push(form)
              } else {
                this.$message({
                  type: 'error',
                  message: '已经存在相同的人群'
                })
              }
            }
          }
        })
      this.addHomePageDialogVisible = false
    },
    isContainCrowdName(form, crowdId) {
      return form.some(item => {
        return item.attribute.crowdIds[0] === crowdId
      })
    },
    getCrowdNames(data) {
      let form = data.map(e => {
        let crowdPolicyIds = e.attribute.crowdPolicyIds[0]
        let crowdId = e.attribute.crowdIds[0]
        this.$service
          .getTaglist({ id: crowdPolicyIds, type: 'crowd' })
          .then(data => {
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
    addHomePage(mode) {
      this.addHomePageDialogVisible = true
      // this.title = '添加定向首页方案'
      this.dialogType = mode
      if (mode === 'normal') {
        this.selectedCrowds = this.form.specialNormalHp
      } else {
        this.selectedCrowds = this.form.specialChildHp
      }
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
      switch (this.dialogType) {
        case 'modelChip':
          let platform = this.$refs.chipModelSelected.platform
          if (platform !== this.platform) {
            // 更新首页
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
      this.dialogType = 'modelChip'
    },
    selectHomePageModel(mode) {
      this.dialogVisible = true
      this.dialogTitle = '选择首页方案模式'
      //  this.mode = 'HomePageModel'
      this.dialogType = mode
      this.selectHomePageDialogVisible = true
    },
    getFormData() {
      const data = cloneDeep(this.form)
      return data
    },
    validateFormData(data, cb) {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { normalHpList, childHpList, macStart, macEnd, deviceInfos } = data
          const hasSetMac = macStart && macEnd

          if (deviceInfos.length === 0 && hasSetMac) {
            return this.$message({
              type: 'error',
              message: 'mac地址或者机型机芯至少选择一项'
            })
          }

          if (normalHpList.length === 0) {
            return this.$message({
              type: 'error',
              message: '请选择标准模式首页'
            })
          }

          if (childHpList.length === 0) {
            return this.$message({
              type: 'error',
              message: '请选择儿童模式首页'
            })
          }

          const childHpListIndexed = childHpList.reduce((result, item) => {
            result[item.age] = item
            return result
          }, {})
          if (!childHpListIndexed['0']) {
            return this.$message({
              type: 'error',
              message: '至少要有一个不限年龄的儿童模式首页'
            })
          }
          if (Object.keys(childHpListIndexed).length < childHpList.length) {
            return this.$message({
              type: 'error',
              message: '存在重复年龄或多个不限年龄的儿童模式首页'
            })
          }

          cb()
        } else {
          this.$message({
            type: 'error',
            message: '请把表单填写完整'
          })
        }
      })
    },
    parseDataToApi(data) {
      data.childHpList = data.childHpList.map((item) => {
        return {
          homepageId: item.homepageId,
          age: item.age
        }
      })
      data.normalHpList = data.normalHpList.map((item) => {
        return {
          homepageId: item.homepageId
        }
      })

      if (this.isTestPolicy) {
        // 如果是测试策略, 做相应处理
        data.macEnd = data.macStart
      } else {
        if (!(data.macStart && data.macEnd)) {
          data.macStart = data.macEnd = ''
        }
      }

      if (this.mode === 'replicate') {
        data.currentVersion = ''
      }
      return data
    },
    submitBtn(status) {
      const data = this.getFormData()
      data.policyStatus = status
      this.validateFormData(data, () => {
        const options = { 
          jsonStr: JSON.stringify(this.parseDataToApi(data)) 
        }
        if (this.isTestPolicy) {
          this.$service.testPolicyConfSave(options, '保存成功').then(data => {
            this.$emit('upsert-end')
          })
        } else {
          this.$service.policyConfSave(options, '保存成功').then(data => {
            this.$emit('upsert-end')
          })
        }
      })
    },
    setData(data) {
      data = cloneDeep(data)
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
        deviceInfos: [{ chip: data.chip, model: data.model }], // 机型机芯{chip:'',model:''}
        normalHpList: data.normalHpList,
        childHpList: data.childHpList,
        schemeFilterEntity: {
          partner: data.platform
        },
        regionCityPairs: [],
        specialNormalHp: this.getCrowdNames(data.specialNormalHp),
        specialChildHp: this.getCrowdNames(data.specialChildHp)
      }
    },
    fetchData(version) {
      const options = { id: this.id, version }
      if (this.isTestPolicy) {
        this.$service.getPolicyConfDetail(options).then(this.setData)
      } else {
        this.$service.getTestPolicyConfDetail(options).then(this.setData)
      }
    }
  },
  created() {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.selectionType = 'single'
      this.fetchData(this.version)
    }
    this.$service.getDictType({ type: 'childAge' }).then(data => {
      this.ageOptions = data.map(item => {
        return {
          label: item.dictCnName,
          value: +item.dictEnName,
          disabled: item.disabled
        }
      })
      this.ageEnums = data.reduce((result, item) => {
        result[item.dictEnName] = item.dictCnName
        return result
      }, {})
    })
  }
}
</script>
<style lang="stylus" scoped>
.tip
  font-size: 12px
  margin-left: 10px
.el-tag
  cursor: pointer;
.child-homepage-item
  position relative
  width 380px
  border 1px solid #ccc
  display inline-block
  margin 10px 10px 0 0
  padding 10px
  .el-icon-close
    position absolute
    top 10px
    right 10px
    cursor pointer
</style>
