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
        @delete="$emit('upsert-end', $event)">
        <div class="form-legend-header">
          <i class="el-icon-edit">基本信息</i>
        </div>
        <DataForm ref="form" :model="form" label-width="120px">
          <el-form-item label="策略名称">
            {{ form.policyName }}
          </el-form-item>
          <el-form-item label="首页方案">
            <Table
            selection-type="none"
            :header="homepageTableHeader"
            :data="form.childHpList"/>
          </el-form-item>
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
      @upsert-end="activePage = 'policy_info'"
      @go-back="activePage = 'policy_info'"
    />
  </PageContentWrapper>
</PageWrapper>
</template>
<script>
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import CommonContent from '@/components/CommonContent.vue'
import HomePageInfo from '../HomePageInfo'
import HomepageSelector from '@/components/selectors/HomepageSelector'
import titleMixin from '@/mixins/title'
import { cloneDeep } from 'lodash'
import { Table } from 'admin-toolkit'
export default {
  mixins: [titleMixin],
  components: {
    Table,
    CommonContent,
    HomePageInfo,
    PageWrapper,
    PageContentWrapper
  },
  props: ['id', 'initMode', 'version', 'policyType'],
  data() {
    const isTestPolicy = this.isTestPolicy
    return {
      activePage: 'policy_info',
      mode: undefined,
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
        regionCityPairs: [],
        specialNormalHp: [],
        specialChildHp: []
      },
      formRules: {
      },
      ageOptions: [],
      ageEnums: {}
    }
  },
  computed: {
    // eslint-disable-next-line
    resourceInfo() {
      const form = this.form
      const menuElId = 'childPolicy'
      if (form.policyId) {
        return {
          id: form.policyId,
          type: 'policy',
          menuElId,
          version: form.currentVersion,
          status: form.policyStatus
        }
      }
    },
    resourceName () {
      const resourceNameMap = {
        normal: '策略',
        test: '测试策略',
        child: '儿童策略'
      }
      return resourceNameMap[this.policyType]
    },
    homepageTableHeader () {
      const header = [
        {
          label: '年龄',
          prop: 'age',
          width: '100px',
          render: (h, { row }) => {
            const age = row.age
            if (age === 0) {
              return '不限'
            }
            return age + '岁'
          }
        },
        {
          label: '首页方案ID',
          prop: 'homepageId',
          width: '150px'
        },
        {
          label: '首页方案名称',
          prop: 'homepageName',
          render: (h, { row }) => {
            if (row.homepageId) {
              return h('el-button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handlePreviewHomepage(row)
                  }
                }
              }, row.homepageName)
            }
          }
        }
      ]
      if (this.mode !== 'read') {
        header.push({
          label: '操作',
          width: '200px',
          render: (h, { row, $index }) => {
            return h(HomepageSelector, {
              props: {
                title: '选择方案',
                selectionType: 'single',
                homepageModel: 'child'
              },
              on: {
                'select-end': (result) => {
                  this.handleSelectHomepageEnd($index, result)
                }
              }
            })
          }
        })
      }
      return header
    }
  },
  methods: {
    getHomepageInfo(homepage, preset) {
      return {
        homepageId: homepage.homepageId,
        homepageModel: homepage.homepageModel,
        homepageName: homepage.homepageName,
        homepageVersion: homepage.homepageVersion,
        ...preset
      }
    },
    handlePreviewHomepage(homepage) {
      this.homePageId = homepage.homepageId
      this.homePageVersion = homepage.currentVersion
      this.activePage = 'showHomePageDetail'
    },
    handleSelectHomepageEnd(index, [homepage]) {
      const childHpList = this.form.childHpList
      const oldHomepage = childHpList[index]
      childHpList.splice(index, 1, this.getHomepageInfo(homepage, { age: oldHomepage.age }))
    },
    getFormData() {
      const data = cloneDeep(this.form)
      return data
    },
    validateFormData(data, cb) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          const { childHpList } = data
          const unset = childHpList.find(item => !item.homepageId)
          if (unset) {
            return this.$message.error(`每一个年龄都需要设置首页方案`)
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
        this.$service.childPolicyConfSave(options, '保存成功').then(data => {
          this.$emit('upsert-end')
        })
      })
    },
    setData(data) {
      data = cloneDeep(data)
      const childHpListIndexed = data.childHpList.reduce((result, item) => {
        result[item.age + ''] = item
        return result
      }, {})
      const childHpList = this.ageOptions.map(item => {
        return {
          age: item.value,
          ...childHpListIndexed[item.value + '']
        }
      })
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
        deviceInfos: [],
        normalHpList: data.normalHpList,
        childHpList: childHpList,
        platform: data.platform,
        regionCityPairs: [],
        specialNormalHp: [],
        specialChildHp: []
      }
    },
    fetchData(version) {
      const options = { id: this.id, version }
      this.$service.getChildPolicyConfDetail(options).then(this.setData)
    }
  },
  created() {
    this.mode = this.initMode || 'create'
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
      if (this.id) {
        this.fetchData(this.version)
      }
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
