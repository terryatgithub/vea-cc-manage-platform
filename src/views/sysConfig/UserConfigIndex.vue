<template>
  <div>
    <UserConfigList v-if='isShowList'></UserConfigList>
    <UserConfigAdd v-if='!isShowList'></UserConfigAdd>
  </div>
</template>
<script>
import UserConfigAdd from './UserConfigAdd'
import UserConfigList from './UserConfigList'
export default {
  components: {
    UserConfigAdd,
    UserConfigList
  },
  data () {
    return {
      isShowList: true
    }
  }
}
</script>
