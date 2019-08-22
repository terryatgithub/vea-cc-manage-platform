<template>
  <PageWrapper>
    <PageContentWrapper>
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <div class="action-list">
          <el-button v-if="mode === 'edit'" type="primary" @click="handleSave">保存</el-button>
          <el-button v-if="mode === 'read'" type="primary" @click="mode = 'edit'">编辑</el-button>
        </div>
        <DataForm label-width="120px">
          <DataString label="版块ID" 
            v-model="panelRecommend.panelGroupId" 
            :readonly="true" />
          <DataString label="版块名称" 
            v-model="panelRecommend.panelGroupName" 
            :readonly="true" />
          <DataEnum label="内容源" 
            v-model="panelRecommend.source" 
            :options="$consts.sourceOptions" 
            :readonly="true" />
          <DataAny label="允许推荐流设置">
            <div slot="edit" class="stream-sign-list">
              <div 
                class="stream-sign-item"
                v-for="(item, index) in recommendStreamSignOptions" 
                :key="index">
                <el-checkbox 
                  :disabled="mode === 'read'"
                  @input="handleInputCategoryItem(item.value)"
                  :value="panelRecommend.panelGroupCategory.indexOf(item.value) > -1" 
                  :label="item.label">
                </el-checkbox>
                <el-radio 
                  :disabled="mode === 'read'"
                  @click.native.prevent="handleInputLockItem(item.value)"
                  :value="panelRecommend.recLockCategory.indexOf(item.value) > -1" 
                  :label="true">
                  锁定
                </el-radio>
              </div>
            </div>
          </DataAny>
        </DataForm>
      </ContentCard>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import ContentCard from '@/components/ContentCard'
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import titleMixin from '@/mixins/title'
import { pick, cloneDeep } from 'lodash'
export default {
  components: {
    PageWrapper,
    PageContentWrapper,
    ContentCard
  },
  mixins: [titleMixin],
  data() {
    return {
      resourceName: '版块推荐流',
      mode: 'create',
      panelRecommend: {
        panelGroupId: '',
        panelGroupName: '',
        panelGroupVersion: '',
        source: '',
        flagRecommend: 0,
        panelGroupCategory: [],
        recLockCategory: []
      },
      recommendStreamSignOptions: []
    }
  },
  props: ['id', 'initMode'],
  methods: {
    handleInputCategoryItem(category) {
      const panelRecommend = this.panelRecommend
      const panelGroupCategory = panelRecommend.panelGroupCategory
      if (panelGroupCategory.indexOf(category) === -1) {
        panelGroupCategory.push(category)
      } else {
        panelRecommend.panelGroupCategory = panelGroupCategory.filter(item => item !== category )
      }
    },
    handleInputLockItem(category) {
      const panelRecommend = this.panelRecommend
      const recLockCategory = panelRecommend.recLockCategory
      const isChecked = recLockCategory.indexOf(category) > -1
      if (!isChecked) {
        recLockCategory.push(category)
      } else {
        panelRecommend.recLockCategory = recLockCategory.filter(item => item !== category )
      }
    },
    getRecommendStreamSignOptions() {
      return this.$service.getDictType({ type: 'recommendStreamSign' }).then(data => {
        return data.map(function(item) {
          return {
            label: item.dictCnName,
            value: item.dictCnName
          }
        })
      })
    },
    setPanelRecommend(data) {
      const panelRecommend = this.panelRecommend
      const panelGroupCategory = data.panelGroupCategory
      const recLockCategory = data.recLockCategory
      if (panelGroupCategory) {
        panelRecommend.panelGroupCategory = panelGroupCategory.split(',')
      }
      if (recLockCategory) {
        panelRecommend.recLockCategory = recLockCategory.split(',')
      }
      Object.assign(panelRecommend, pick(data, [
        'panelGroupId',
        'panelGroupName',
        'panelGroupVersion',
        'source',
        'flagRecommend']))
    },
    fetchData(version) {
      this.$service.panelRecommendGetDetail({id: this.id})
        .then(this.setPanelRecommend)
    },
    parseDataToApi(data) {
      data = cloneDeep(data)
      data.panelGroupCategory = data.panelGroupCategory.join(',')
      data.recLockCategory = data.recLockCategory.join(',')
      return data
    },
    handleSave() {
      this.$service
      .panelRecommendUpsert(this.parseDataToApi(this.panelRecommend))
      .then(() => {
        this.$emit('upsert-end')
      })
    }
  },
  created() {
    this.mode = this.initMode
    this.fetchData(this.version)
    this.getRecommendStreamSignOptions().then((result) => this.recommendStreamSignOptions = result)
  }

}
</script>

<style lang="stylus" scoped>
.action-list
  margin-bottom 20px
.stream-sign-list
  width 600px
.stream-sign-item
  display inline-block
  width 200px

</style>
