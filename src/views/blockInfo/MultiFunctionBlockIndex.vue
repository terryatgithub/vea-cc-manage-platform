<script>
import BaseResourceManager from '@/components/BaseResourceManager'
import MultiFunctionBlockList from './MultiFunctionBlockList'
import MultiFunctionBlockInfo from './SysPluginInfo'

export default {
  extends: BaseResourceManager,
  components: {
    ResourceList: MultiFunctionBlockList,
    ResourceContent: MultiFunctionBlockInfo
  },
  data () {
    return {}
  },
  computed: {
    resourceInfo () {
      return {
        type: 'multiFunctionBlock',
        idField: 'pluginId'
      }
    },
    contentProps () {
      return {
        menuElId: 'multiFunctionBlock'
      }
    }
  }
}
</script>
