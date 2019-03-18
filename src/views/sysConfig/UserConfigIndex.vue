<template>
  <div>
    <UserConfigList v-if='isShowList' @openAddPage="openAddPage"></UserConfigList>
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
  },
  methods: {
    openAddPage () {
       this.isShowList = false
    }
  }
}
</script>
