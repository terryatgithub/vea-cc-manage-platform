<script>
import { components } from 'admin-base'
import ResourceContent from './TabInsertionTaskContent'
import ResourceList from './TabInsertionTaskList'
export default {
  extends: components.ResourceBaseIndex,
  components: {
    TabPage: components.TabPage,
    ResourceList,
    ResourceContent
  },
  data() {
    return {}
  },
  computed: {
    listProps() {
      return {}
    },
    contentProps() {
      return {}
    },
    resourceInfo() {
      return {
        idField: 'TabInsertionTask'
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
