<template>
  <PageWrapper class="tab-info-wrapper">
    <PageContentWrapper>
      <ContentCard title="京东版面" @go-back="$emit('go-back')">
        <span class="auditway">审核方式：</span>
        <el-radio-group :value="tabData.enableAutoAudited" @input="handleInputAuditType">
          <el-radio :label="true">自动审核</el-radio>
          <el-radio :label="false">手动审核</el-radio>
        </el-radio-group>
        <template v-if="!tabData.enableAutoAudited">
          <el-button
            v-if="auditPassed"
            type="success"
            size="medium"
            style="margin-left:20px">
            审核已通过
          </el-button>
          <el-button
            v-else
            type="primary"
            size="medium"
            style="margin-left:20px"
            @click="handleAudit">
            审核
          </el-button>
        </template>

        <template v-if="tabData">
          <div class="panels-wrapper" v-for="(item,index) in tabData.rows" :key="index">
            <span class="title" v-if="item.groupTitle">{{item.groupTitle}}</span>
            <JDPanel
              :layoutData="item.layout.contents" 
              :imgData="item.items">
            </JDPanel>
          </div>
        </template>
      </ContentCard>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import JDPanel from './jd/JDPanel.vue'
export default {
  components: {
    JDPanel,
    PageWrapper,
    PageContentWrapper
  },
  props: ['id'],
  data() {
    return {
      tabData: {
        enableAutoAudited: undefined,
        currentClientUsedVersion: undefined,
        currentUpdateVersion: undefined,
        rows: []
      },
      dialogVisible: false
    }
  },
  computed: {
    auditPassed () {
      const { currentClientUsedVersion, currentUpdateVersion } = this.tabData
      return currentClientUsedVersion === currentUpdateVersion
    }
  },
  methods: {
    handleInputAuditType (val) {
      const tabData = this.tabData
      const msg = val ? '确定切换为自动审核' : '确定切换为手动审核'
      this.$confirm(msg, '提示').then(() => {
        tabData.enableAutoAudited = val
        this.$service.updateThirdPartTabAuditType({ id: this.id, enableAuto: val})
        .catch(() => {
          // 请求失败，改回原来的
          tabData.enableAutoAudited = !val
        })
      }).catch(() => {})
    },
    handleAudit () {
      this.$confirm('是否审核通过?', '京东版面审核')
        .then(() => {
          // 请求接口
          this.$service.updateThirdPartTabAudit({id: this.id}, '审核成功').then(() => {
            const tabData = this.tabData
            tabData.currentClientUsedVersion = tabData.currentUpdateVersion
            this.$emit('upsert-end')
          })
        })
        .catch(() => {

        })
    },
    fetchData () {
      this.$service.getThirdpartTabLayout().then(expanderLayout => {
        this.$service.getThirdpartTabInfoDetail({id: this.id}).then(tabData => {
          // 当版本相同时，表示已审核
          tabData.rows.forEach(item => {
            const layout = JSON.parse(item.layout)
            if (layout.type === 'Expander') {
              layout.contents = expanderLayout.contents
            }
            item.layout = layout
          })
          this.tabData = tabData
        })
      })
    }
  },
  created() {
    this.fetchData()
  },
}
</script>

<style lang="stylus" scoped>
.tab-info 
  position relative
  left 10%
  .auditway 
    margin-top 25px
    display inline-block
  .panels-wrapper 
    margin-top 28px
    text-align left
    padding 0px 10px
    box-sizing border-box
    .title 
      margin-left 20px
      font-size 28px
      font-weight 800
</style>
