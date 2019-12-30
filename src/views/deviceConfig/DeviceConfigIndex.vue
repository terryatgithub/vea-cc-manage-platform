<script>
import BaseResourceManager from '@/components/BaseResourceManager'
import List from './DeviceConfigList'
export default {
  extends: BaseResourceManager,
  components: {
    ResourceList: List,
    ResourceContent: 'div'
  },
  data () {
    return {}
  },
  computed: {
    resourceInfo () {
      return {
        type: 'topic',
        idField: 'id'
      }
    }
  }
}
</script>

<style>

</style>