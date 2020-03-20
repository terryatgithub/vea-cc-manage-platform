<template>
  <PageWrapper>
    <PageContentWrapper v-show="activePage == 'policy'">
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <CommonContent
          :mode="mode"
          :resource-info="resourceInfo"
          @replicate="mode = 'replicate'"
          @edit="mode = 'edit'"
          @unaudit="$emit('upsert-end')"
          @shelves="fetchData"
          @audit="$emit('upsert-end')"
          @copy="handleCopy($event)"
          @submit-audit="handleSubmitAudit"
          @save-draft="handleSaveDraft"
          @select-version="fetchData"
          @delete="$emit('upsert-end', $event)">
        <DataForm ref="dataForm" :readonly="mode === 'read'" :model="policy" label-width="120px" style="margin-top: 10px">
          <DataString
            label="策略组名称"
            v-model="policy.policyGroupName"
            :rules="rules.policyGroupName"
            prop="policyGroupName">
          </DataString>
          <DataAny
            label="机型机芯"
            :rules="rules.rlsModelChipList"
            prop="rlsModelChipList">
            <div slot="edit">
              <ModelChipSelector
                ref='modelChipSelector'
                title="添加"
                :platform="policy.platform"
                @select-end="handleSelectChipEnd" />
                <div>
                  <el-tag
                    v-for="(item, index) in policy.rlsModelChipList"
                    :key="`${index}-${item.model}-${item.chip}`"
                    :disable-transitions="true"
                    class="chip-item"
                    @close="handleDelModelChip(index)"
                    closable>
                    {{ item.model }}_{{ item.chip }}
                  </el-tag>
                </div>
            </div>
            <div slot="read">
              <el-tag
                v-for="(item, index) in policy.rlsModelChipList"
                :key="`${index}-${item.model}-${item.chip}`"
                :disable-transitions="true"
                class="chip-item">
                {{ item.model }}_{{ item.chip }}
              </el-tag>
            </div>
          </DataAny>
          <DataAny
            label="首页方案"
            :rules="rules.homepageId"
            prop="homepageId">
            <div slot="edit">
              <HomepageSelector
                  title="选择"
                  homepageModel="normal"
                  @select-end="handleSelectHomepageEnd" selection-type="single" />
                <span v-if="policy.homepageId" class="tip">
                  已选择：
                  <el-tag style="cursor: pointer" class="el-tag" @click.native="showHomePageDetail(policy.normalHomepage)">
                    {{ policy.normalHomepage.homepageName }}
                  </el-tag>
                </span>
            </div>
            <div slot="read">
              <span v-if="policy.homepageId" class="tip">
                <el-tag style="cursor: pointer" class="el-tag" @click.native="showHomePageDetail(policy.normalHomepage)">
                  {{ policy.normalHomepage.homepageName }}
                </el-tag>
              </span>
            </div>
          </DataAny>
          <template v-if="isTestPolicyGroup">
            <DataAny label="MAC地址" :rules="rules.mac">
              <div slot="edit" class="form-item-mac">
                <InputMac
                  v-for="(item, index) in policy.mac"
                  :key="index"
                  v-model="policy.mac[index]"
                  :form-prop="`mac.${index}`">
                  <i v-show="policy.mac.length > 1" @click="handleDelMac(index)" class="el-icon-circle-close" />
                </InputMac>
                <el-button @click="handleAddMac" type="primary"><i class="el-icon-plus" /></el-button>
              </div>
              <div slot="read">
                <el-tag class="mac-item" v-for="(item, index) in policy.mac" :key="index">
                  {{ item }}
                </el-tag>
              </div>
            </DataAny>
            <DataAny label="主页版本" >
              <div slot="edit" class="homepage-version">
                <el-form-item :rules="rules.homepageVersion" prop="homepageVerStart">
                  <el-input v-model="policy.homepageVerStart" placeholder="最小版本"></el-input>
                </el-form-item>
                -
                <el-form-item :rules="rules.homepageVersion" prop="homepageVerEnd">
                  <el-input v-model="policy.homepageVerEnd" placeholder="最大版本"></el-input>
                </el-form-item>
              </div>
              <div slot="read">
                {{ homepageVersion }}
              </div>
            </DataAny>
          </template>
        </DataForm>
        </CommonContent>
      </ContentCard>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage === 'showHomePageDetail'">
      <HomePageInfo
        :id="homePageId"
        init-mode="read"
        :version="homePageVersion"
        :title-prefix="title"
        @upsert-end="activePage = 'policy'"
        @go-back="activePage = 'policy'"
      />
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import CommonContent from '@/components/CommonContent.vue'
import titleMixin from '@/mixins/title'
import { cloneDeep } from 'lodash'
import HomePageInfo from '../homePageManage/HomePageInfo'
import ModelChipSelector from '@/components/selectors/ModelChipSelector'
import HomepageSelector from '@/components/selectors/HomepageSelector'
import InputMac from '@/components/InputMac'
export default {
  mixins: [titleMixin],
  components: {
    PageWrapper,
    PageContentWrapper,
    CommonContent,
    ModelChipSelector,
    HomepageSelector,
    HomePageInfo,
    InputMac
  },
  props: ['initMode', 'id', 'version', 'policyGroupCategory'],
  data () {
    return {
      mode: 'create',
      activePage: 'policy',
      resourceName: '策略组',
      policy: this.genDefaultPolicy(),
      rules: {
        policyGroupName: [
          { required: true, message: '请输入策略组名', trigger: 'blur' },
          { max: 45, message: '不超过 45 个字符' }
        ],
        platform: [
          { required: true, message: '请选择内容源', trigger: 'blur' }
        ],
        rlsModelChipList: [
          { required: true, message: '请选择机芯机型', trigger: 'blur' }
        ],
        homepageId: [
          { required: true, message: '请选择首页方案', trigger: 'blur' }
        ],
        mac: [
          { required: true, message: '请填写 mac', trigger: 'blur' }
        ],
        homepageVersion: [
          {
            validator: (rule, value, cb) => {
              const regExp = /^[0-9]{7}$/
              if (value && !regExp.test(value)) {
                return cb(new Error('格式不正确，应该 7 位数字'))
              }
              cb()
            }
          }
        ]
      }

    }
  },
  computed: {
    resourceInfo () {
      const data = this.policy
      let result
      if (data.id) {
        result = {
          id: data.id,
          version: data.currentVersion,
          status: data.status,
          type: 'policyGroup',
          menuElId: 'policyGroup'
        }
      }
      return result
    },
    isReplica () {
      return this.mode === 'replicate' || this.policy.duplicateVersion === 'yes'
    },
    isTestPolicyGroup () {
      return this.policyGroupCategory === 2
    },
    homepageVersion () {
      const { homepageVerStart = '', homepageVerEnd = '' } = this.policy
      if (homepageVerStart && homepageVerEnd) {
        return `${homepageVerStart} ~ ${homepageVerEnd}`
      } else if (homepageVerStart) {
        return `>= ${homepageVerStart}`
      } else if (homepageVerEnd) {
        return `<= ${homepageVerEnd}`
      }
      return ''
    }
  },
  methods: {
    showHomePageDetail (homepage) {
      this.homePageId = homepage.homepageId
      this.homePageVersion = homepage.currentVersion
      this.activePage = 'showHomePageDetail'
    },
    genDefaultPolicy () {
      return {
        id: undefined,
        currentVersion: '',
        policyGroupCategory: this.policyGroupCategory,
        policyGroupName: '',
        platform: '',
        homepageId: undefined,
        normalHomepage: {
        },
        homepageVerEnd: '',
        homepageVerStart: '',
        mac: [''],
        rlsModelChipList: [],
        screenSize: '',
        status: 2,
        duplicateVersion: ''
      }
    },
    handleAddMac () {
      this.policy.mac.push('')
    },
    handleDelMac (index) {
      this.policy.mac.splice(index, 1)
    },
    handleDelModelChip (index) {
      const policy = this.policy
      const rlsModelChipList = policy.rlsModelChipList
      rlsModelChipList.splice(index, 1)
      if (rlsModelChipList.length === 0) {
        policy.platform = ''
      }
    },
    getModelChipInfo (modelChipList) {
      const modelChip = modelChipList.map(item => `${item.model}_${item.chip}`).join(',')
      return this.$service.modelChipList({ modelChip })
    },
    handleInputPlatform (val) {
      const policy = this.policy
      policy.platform = val
      policy.rlsModelChipList = []
      policy.homepageId = ''
      policy.normalHomepage = {}
    },
    handleSelectHomepageEnd (selected) {
      const item = selected[0]
      const policy = this.policy
      policy.homepageId = item.homepageId
      policy.normalHomepage = {
        homepageId: item.homepageId,
        homepageName: item.homepageName,
        currentVersion: item.currentVersion
      }
    },
    clearModelChipAndHomepage () {
      const policy = this.policy
      policy.platform = ''
      policy.rlsModelChipList = []
      policy.homepageId = ''
      policy.normalHomepage = {}
    },
    splitModelChip (policy, selected) {
      const rlsModelChipList = policy.rlsModelChipList
      const key = item => `${item.model}_${item.chip}`
      const indexed = rlsModelChipList.reduce((result, item) => {
        result[key(item)] = true
        return result
      }, {})
      const existsList = []
      const appendList = []
      selected.forEach(item => {
        if (indexed[key(item)]) {
          existsList.push(item)
        } else {
          appendList.push(item)
        }
      })
      return { existsList, appendList }
    },
    handleSelectChipEnd (selected, options = {}) {
      const { isReset, platform } = options
      if (isReset) {
        // 先清除原来的
        this.clearModelChipAndHomepage()
      }
      const policy = this.policy
      const rlsModelChipList = policy.rlsModelChipList
      const { appendList, existsList } = this.splitModelChip(policy, selected)
      policy.rlsModelChipList = rlsModelChipList.concat(appendList)
      policy.platform = platform
      let htmlMsg = ''
      const showMsg = (msg) => {
        if (msg) {
          this.$alert(htmlMsg, { title: '添加成功', dangerouslyUseHTMLString: true, confirmButtonText: '知道了' })
        }
      }
      if (existsList.length > 0) {
        htmlMsg += `
          <div>以下机型机芯已存在本策略中，无法添加</div>
          <div>${existsList.map(({ model, chip }) => `${model}_${chip}`).join(' , ')}</div>
        `
      }
      if (appendList.length > 0) {
        this.getModelChipInfo(appendList).then((modelChipList) => {
          modelChipList = modelChipList || []
          const alertModelChipList = modelChipList.filter(({ rlsPolicyGroupList = [] }) => rlsPolicyGroupList.length > 0).map(item => item.modelChip)
          if (alertModelChipList.length > 0) {
            htmlMsg += `
              <div>以下机型机芯添加成功，但他们已在其它策略中，请尽快处理，保证一个机型机芯只存在一个策略中</div> 
              <div>${alertModelChipList.join(' , ')}</div>
            `
          }
          showMsg(htmlMsg)
        })
      } else {
        showMsg(htmlMsg)
      }
    },
    // handleSelectPolicyEnd (selected, options) {
    //   const { isReset, platform } = options
    //   if (isReset) {
    //     this.clearModelChipAndHomepage()
    //   }
    //   const selectedPolicy = selected[0]
    //   const policy = this.policy
    //   const rlsModelChipList = policy.rlsModelChipList
    //   const { appendList, existsList } = this.splitModelChip(policy, selectedPolicy.rlsModelChipList)
    //   policy.rlsModelChipList = rlsModelChipList.concat(appendList)
    //   policy.platform = platform
    //   const message = existsList.length > 0
    //     ? `添加成功， 其中 ${existsList.map(({ model, chip }) => `${model}_${chip}`).join(' , ')} 添加之前已存在`
    //     : `添加成功`
    //   this.$message.success(message)
    // },
    fetchData (version) {
      this.$service.policyGroupGetDetail({ id: this.id, version }).then((data) => {
        this.setData(data)
      })
    },
    setData (data) {
      const mac = data.mac.split(',')
      data.mac = mac.length === 0 ? [''] : mac
      this.policy = {
        ...this.policy,
        ...data
      }
    },
    handleSubmitAudit () {
      const data = cloneDeep(this.policy)
      data.status = this.$consts.status.waiting
      this.validate(data, () => {
        this.upsert(this.parseDataToApi(data))
      })
    },
    handleSaveDraft () {
      const data = cloneDeep(this.policy)
      data.status = this.$consts.status.draft
      this.validate(data, () => {
        this.upsert(this.parseDataToApi(data))
      })
    },
    handleCopy (status) {
      const data = cloneDeep(this.policy)
      data.id = undefined
      data.status = status
      data.currentVersion = ''
      this.validate(data, () => {
        this.upsert(this.parseDataToApi(data))
      })
    },
    validate (data, cb) {
      this.$refs.dataForm.$refs.form.validate((valid) => {
        if (valid) {
          const showError = (msg) => {
            return this.$message.error(msg)
          }
          const { rlsModelChipList, mac, homepageVerStart, homepageVerEnd } = data
          if (rlsModelChipList.length === 0) {
            return showError('请至少选择一个机芯机型')
          }
          const macIndex = {}
          for (let i = 0, length = mac.length; i < length; i++) {
            const index = macIndex[mac[i]]
            if (index !== undefined) {
              return showError(`第 ${index + 1} 个 mac 与 第 ${i + 1} 个重复`)
            } else {
              macIndex[mac[i]] = i
            }
          }
          if (homepageVerStart && homepageVerEnd && homepageVerStart > homepageVerEnd) {
            return showError('主页版本的 最小版本 不能大于 最大版本')
          }
          // mac 重复检验
          cb()
        } else {
          this.$message.error('请把表单填写完整')
        }
      })
    },
    parseDataToApi (data) {
      const mode = this.mode
      data.normalHomepage = undefined
      if (mode === 'replicate') {
        data.currentVersion = ''
      }
      if (mode === 'copy') {
        data.id = undefined
        data.currentVersion = ''
      }
      data.mac = data.mac.filter(item => item).join(',')
      return data
    },
    upsert (data) {
      this.$service.policyGroupUpsert(data, '保存成功').then(() => {
        this.$emit('upsert-end')
      })
    }
  },
  created () {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.fetchData(this.version)
    }
  }

}
</script>

<style lang="stylus" scoped>
.chip-item
  margin-right 5px
.homepage-version >>>  .el-form-item
  display inline-block
  width 180px
.form-item-mac
  >>>
    .el-form-item
      display inline-block
      margin-right 10px
    .el-input
      width 220px
    .el-input__inner
      padding-right 20px
  .el-icon-circle-close
    position relative
    left -20px
    cursor pointer
    color #888
.mac-item
  margin-right 5px
</style>
