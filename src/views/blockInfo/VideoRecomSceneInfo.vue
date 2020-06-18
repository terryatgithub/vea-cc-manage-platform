<template>
   <ContentCard title="影片应用场景" @go-back="$emit('go-back')">
     <el-form
      class="video-content-form"
      :model="contentForm"
      ref="contentForm"
      label-width="160px"
    >
        <el-form-item
        label="选择推荐流"
        >
            <NewBlockRecStreamSelector
                title="选择推荐流"
                :scene="scene"
                selection-type="single"
                @select-end="handleSelectBlockRecStreamEnd">
            </NewBlockRecStreamSelector>
            <template v-if="contentForm.id">
                已选择: <el-tag>
                {{ contentForm.id }}
                ({{ contentForm.recName }})
                </el-tag>
            </template>
        </el-form-item>
        <el-form-item label="关联定向人群">
             <el-button type="primary" @click="handleSelectCrowdStart">添加人群</el-button>
            <el-tag
                type="primary"
                v-if="dmpRegistryInfo.dmpPolicyName"
            >已选择: {{ dmpRegistryInfo.dmpPolicyName}}({{ dmpRegistryInfo.dmpPolicyId }}) / {{ dmpRegistryInfo.dmpCrowdName}}({{ dmpRegistryInfo.dmpCrowdId }})</el-tag>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreate">确定</el-button>
        </el-form-item>
     </el-form>
     <CrowdSelector
          v-if="showCrowdSelector"
          @select-cancel="handleSelectCrowdCancel"
          @select-end="handleSelectCrowdEnd"
        />
   </ContentCard>
</template>
<script>
import NewBlockRecStreamSelector from '@/components/selectors/NewBlockRecStreamSelector'
import CrowdSelector from '@/components/CrowdSelector.vue'
export default {
  components: {
    NewBlockRecStreamSelector,
    CrowdSelector
    // Table,
    // ContentWrapper
  },
  props: ['scene'],
  data () {
    return {
      contentForm: {
        id: '',
        recName: ''
      },
      dmpRegistryInfo: {
        dmpPolicyId: '',
        dmpCrowdId: '',
        dmpPolicyName: '',
        dmpCrowdName: ''
      },
      showCrowdSelector: false,
      dialogFormVisible: false
    }
  },
  methods: {
    handleSelectBlockRecStreamEnd (selected) {
      this.contentForm = selected[0]
      this.contentForm = Object.assign(this.dmpRegistryInfo, this.contentForm)
    },
    handleSelectCrowdStart () {
      this.showCrowdSelector = true
    },
    handleSelectCrowdCancel () {
      this.showCrowdSelector = false
    },
    handleSelectCrowdEnd (policy, crowd) {
      this.dmpRegistryInfo.dmpPolicyId = policy.value
      this.dmpRegistryInfo.dmpCrowdId = crowd.value
      this.dmpRegistryInfo.dmpPolicyName = policy.label
      this.dmpRegistryInfo.dmpCrowdName = crowd.label
      this.showCrowdSelector = false
    },
    handleCreate () {
      if (this.contentForm.id === '') {
        return this.$message.error('请选择推荐流')
      }
      // if (this.contentForm.dmpRegistryInfo === undefined) {
      //   return this.$message.error('未选择')
      // }
      let contentForm = {}
      contentForm.scene = this.scene
      contentForm.recStreamId = this.contentForm.id
      contentForm.dmpPolicyId = this.contentForm.dmpPolicyId
      contentForm.dmpCrowdId = this.contentForm.dmpCrowdId
      contentForm.dmpCrowdName = this.contentForm.dmpCrowdName
      contentForm.dmpPolicyName = this.contentForm.dmpPolicyName
      console.log(contentForm, '--con')
      this.$service.saveMediaRecStreamDmp(contentForm).then(res => {
        this.$emit('upsert-end')
      })
    }
  }
}
</script>
