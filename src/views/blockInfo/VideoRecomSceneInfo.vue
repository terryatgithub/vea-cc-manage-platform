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
                v-if="contentForm.dmpRegistryInfo"
            >已选择: {{ contentForm.dmpRegistryInfo.dmpPolicyName}}({{ contentForm.dmpRegistryInfo.dmpPolicyId }}) / {{ contentForm.dmpRegistryInfo.dmpCrowdName}}({{ contentForm.dmpRegistryInfo.dmpCrowdId }})</el-tag>
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
  data () {
    return {
      contentForm: {
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
      console.log(this.contentForm, '-----d')
    },
    handleSelectCrowdStart () {
      this.showCrowdSelector = true
    },
    handleSelectCrowdCancel () {
      this.showCrowdSelector = false
    },
    handleSelectCrowdEnd (policy, crowd) {
      this.$set(this.contentForm, 'dmpRegistryInfo', {
        dmpPolicyId: policy.value,
        dmpCrowdId: crowd.value,
        dmpPolicyName: policy.label,
        dmpCrowdName: crowd.label
      })
      this.$sendEvent({
        type: 'create_block_dmp',
        payload: {
          type: 'common'
        }
      })
      this.showCrowdSelector = false
    },
    handleCreate () {
      let contentForm = {}
      contentForm.scene = '4'
      contentForm.recStreamId = this.contentForm.id
      contentForm.dmpPolicyId = this.contentForm.dmpRegistryInfo.dmpPolicyId
      contentForm.dmpCrowdId = this.contentForm.dmpRegistryInfo.dmpCrowdId
      contentForm.dmpCrowdName = this.contentForm.dmpRegistryInfo.dmpCrowdName
      contentForm.dmpPolicyName = this.contentForm.dmpRegistryInfo.dmpPolicyName
      console.log(contentForm, '-----fuuds')
      this.$service.saveMediaRecStreamDmp(contentForm).then(res => {
        this.$emit('upsert-end')
      })
    }
  }
}
</script>
