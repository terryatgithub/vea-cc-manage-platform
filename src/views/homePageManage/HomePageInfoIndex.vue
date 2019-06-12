<script>
import BaseResourceManager from '@/components/BaseResourceManager'
import HomePageInfo from './HomePageInfo'
import HomePageInfoList from './HomePageInfoList'
export default {
  extends: BaseResourceManager,
  components: {
    ResourceList: HomePageInfoList,
    ResourceContent: HomePageInfo
  },
  data() {
    return {}
  },
  computed: {
    resourceInfo() {
      return {
        type: 'homepage',
        idField: 'homepageId'
      }
    }
  }
}
</script>

<style>

</style>
