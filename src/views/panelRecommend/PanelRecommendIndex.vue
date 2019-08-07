<script>
import BaseResourceManager from '@/components/BaseResourceManager'
import ResourceContent from './PanelRecommendContent'
import ResourceList from './PanelRecommendList'
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
        type: 'panelRecommend',
        idField: 'panelGroupId'
      }
    }
  }
}
</script>

<style>

</style>
