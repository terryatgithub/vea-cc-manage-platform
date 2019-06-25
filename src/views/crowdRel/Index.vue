<script>
import BaseResourceManager from '@/components/BaseResourceManager'
import ResourceList from './List'
import ResourceContent from './Content'
export default {
  extends: BaseResourceManager,
  components: {
    ResourceList,
    ResourceContent
  },
  data() {
    return {}
  },
  computed: {
    resourceInfo() {
      return {
        type: 'crowdRel',
        idField: 'policyId'
      }
    }
  },
  methods: {
    handleDelete(selected) {
      const resourceInfo = this.resourceInfo
      const idField = 'id'
      this.$service
        .deleteResource({
          type: resourceInfo.type,
          id: selected.map(item => item[idField]).join(',')
        }, '删除成功')
        .then(() => {
          this.$refs.list.fetchData()
        })
    }
  }
}
</script>
