<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="二级菜单" name="first">
      <AppStorePushSecondaryMenu class="el-tab-pane-preview" />
    </el-tab-pane>
    <el-tab-pane label="内页" name="second">
      <AppStorePushInnerPage class="el-tab-pane-preview" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AppStorePushSecondaryMenu from './secondaryMenu.vue'
import AppStorePushInnerPage from './innerPage.vue'
export default {
  name: 'appStorePushIndex',
  components: {
    AppStorePushSecondaryMenu,
    AppStorePushInnerPage
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick () {
      console.log('handleClick...')
    }
  },
  activated () {
    if (this.$route.query.tabType === 'innerPage') {
      this.activeName = 'second'
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-tab-pane-preview >>> .page-content-wrapper
  position: relative;
  width: 100%;
  top: 0;
</style>
