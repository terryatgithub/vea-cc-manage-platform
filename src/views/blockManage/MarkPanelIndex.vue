<script>
import BaseResourceManager from '@/components/BaseResourceManager'
import MarkPanelList from  './MarkPanelList'
import MarkPanelInfo from './MarkPanelInfo'
export default {
  extends: BaseResourceManager,
  components: {
    ResourceList: MarkPanelList,
    ResourceContent: MarkPanelInfo
  },
  data() {
    return {}
  },
  computed: {
    resourceInfo() {
      return {
        type: 'markPanel',
        idField: 'pannelGroupId'
      }
    }
  }
}
</script>

<style>

</style>
