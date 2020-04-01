<template>
  <TabPage>
  <PageWrapper>
    <PageContentWrapper v-show="activePage == 'matching'">
      <ContentCard title="主页匹配">
        <div slot="actions"></div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form
              v-form-autocomplete
              @reset.native.prevent="handleFilterReset"
              @submit.native="handleFilter"
              :model="filter"
              :rules="rules"
              ref="form"
              label-width="80px">
              <el-form-item label="模式">
                <el-radio-group v-model="filter.pattern">
                  <el-radio v-for="item in patternOptions" :key="item.value" :label="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="fMode">
                <el-radio-group v-model="filter.fMode">
                  <el-radio v-for="item in fModeOptions" :key="item.value" :label="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="机型" prop="model">
                <el-input autocomplete="on" name="model" v-model.trim="filter.model" placeholder="机型" clearable></el-input>
              </el-form-item>
              <el-form-item label="机芯" prop="chip">
                <el-input autocomplete="on" name="chip" v-model.trim="filter.chip" placeholder="机芯" clearable></el-input>
              </el-form-item>
              <el-form-item label="Mac" prop="mac">
                <el-input autocomplete="on" name="mac" v-model="filter.mac" placeholder="mac地址, 12 位[0-9a-fA-F]字符" clearable></el-input>
              </el-form-item>
              <el-form-item label="屏幕尺寸" prop="screenSize">
                <el-input autocomplete="on" name="screenSize" v-model.number="filter.screenSize" placeholder="屏幕尺寸, 正整数，例如 60" clearable></el-input>
              </el-form-item>
              <el-form-item label="主页版本" prop="homepageVersion">
                <el-input autocomplete="on" name="homepageVersion" v-model="filter.homepageVersion" placeholder="主页版本" clearable></el-input>
              </el-form-item>
              <el-form-item label="设备ID" prop="devId">
                <el-input autocomplete="on" name="devId" v-model="filter.devId" placeholder="设备ID" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button native-type="submit" type="primary">查询</el-button>
                <el-button native-type="reset">重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="16">
            <pre class="result-viwer">{{ matchResultStr }}</pre>
            <div >
              <el-button v-show="matchResult.policy_id" @click="handlePreviewPolicy(matchResult.policy_id)" type="primary">预览策略（{{ matchResult.policy_id }}）</el-button>
              <el-button v-show="matchResult.homepage_id" @click="handlePreviewHomepage(matchResult.homepage_id)" type="primary">预览首页方案（{{ matchResult.homepage_id }}）</el-button>
            </div>
          </el-col>
        </el-row>
      </ContentCard>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage == 'policy'">
      <ChildPolicy v-if="policyPattern === 'child'" :id="policyId" init-mode="read" @upsert-end="activePage = 'matching'" @go-back="activePage = 'matching'"/>
      <Policy v-else :id="policyId" init-mode="read" @upsert-end="activePage = 'matching'" @go-back="activePage = 'matching'"/>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage == 'homepage'">
      <HomePageInfo :id="homepageId" init-mode="read" @upsert-end="activePage = 'matching'" @go-back="activePage = 'matching'" />
    </PageContentWrapper>
  </PageWrapper>
  </TabPage>
</template>
<script>
import TabPage from '@/components/TabPage'
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import HomePageInfo from '../homePageManage/HomePageInfo'
import Policy from './Policy'
import ChildPolicy from '../homePageManage/child-policy/ChildPolicyInfo'
export default {
  components: {
    TabPage,
    Policy,
    ChildPolicy,
    HomePageInfo,
    PageWrapper,
    PageContentWrapper
  },
  data () {
    return {
      activePage: 'matching',
      homepageId: undefined,
      policyId: undefined,
      policyPattern: undefined,
      matchResult: '',
      fModeOptions: [
        {
          label: '无',
          value: 'Default'
        },
        {
          label: '卖场模式',
          value: 'Other'
        }
      ],
      patternOptions: [
        {
          label: '标准模式',
          value: 'normal'
        },
        {
          label: '儿童模式',
          value: 'child'
        }
      ],
      filter: this.genDefaultFilter(),
      rules: {
        model: [
          {
            required: true,
            message: '请输入机型'
          }
        ],
        chip: [
          {
            required: true,
            message: '请输入机芯'
          }
        ],
        screenSize: [
          {
            validator: (rule, value, cb) => {
              const reg = /^[1-9]\d*$/
              if (value !== '' && !reg.test(value)) {
                return cb(new Error('屏幕尺寸应该为一个正整数'))
              }
              cb()
            }
          }
        ],
        mac: [
          {
            validator: (rule, value, cb) => {
              const reg = /^[0-9a-fA-F]{12}$/
              if (value && !reg.test(value)) {
                return cb(new Error('请输入 12 位[0-9a-fA-F]字符'))
              }
              cb()
            }
          }
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
    // eslint-disable-next-line
    matchResultStr () {
      const matchResult = this.matchResult
      if (matchResult) {
        return JSON.stringify(matchResult, undefined, 2)
      }
    }
  },
  methods: {
    genDefaultFilter () {
      return {
        pattern: 'normal',
        fMode: 'Default',
        chip: '',
        model: '',
        mac: '',
        screenSize: '',
        homepageVersion: '',
        devId: ''
      }
    },
    handleFilter (event) {
      this.matchResult = ''
      this.$refs.form.validate((valid) => {
        if (valid) {
          const filter = this.filter
          const policyPattern = filter.pattern
          this.$service.homepageMatchingList(filter).then((result) => {
            this.policyPattern = policyPattern
            this.matchResult = result
          })
        } else {
          this.$message.error('请把表单填写完整')
        }
      })
    },
    handleFilterReset () {
      this.filter = this.genDefaultFilter()
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      this.matchResult = ''
    },
    handlePreviewHomepage (id) {
      this.activePage = 'homepage'
      this.homepageId = id
    },
    handlePreviewPolicy (id) {
      this.activePage = 'policy'
      this.policyId = id
    }
  }
}
</script>
<style lang="stylus" scoped>
.result-viwer
  height 360px
  padding 5px
  overflow auto
  border 1px solid #ccc
</style>
