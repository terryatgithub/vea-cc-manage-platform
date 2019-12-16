<script>
import BaseResourceManager from '@/components/BaseResourceManager'
import Content from './Detail'
import List from './List'
export default {
  extends: BaseResourceManager,
  components: {
    ResourceList: List,
    ResourceContent: Content
  },
  data () {
    return {}
  },
  computed: {
    resourceInfo () {
      return {
        type: 'topicConfig',
        idField: 'id'
      }
    }
  }
}
</script>

<style>

</style>
