<script>
import BaseResourceManager from '@/components/BaseResourceManager'
import SysPluginList from './SysPluginList'
import SysPluginInfo from './SysPluginInfo'
export default {
  extends: BaseResourceManager,
  components: {
    ResourceList: SysPluginList,
    ResourceContent: SysPluginInfo
  },
  data() {
    return {}
  },
  computed: {
    resourceInfo() {
      return {
        type: 'sysPlugin',
        idField: 'pluginId'
      }
    },
    contentProps() {
      return {
        menuElId: 'sysPlugin',
      }
    }
  }
}
</script>
