<template>
    <div class="content-card">
        <div v-if="title !== undefined" class="content-card__header">
            {{ title }}
            <div class="actions">
                <slot name="actions">
                    <el-button type="text" @click="$emit('go-back')">返回</el-button>
                </slot>
            </div>
        </div>
        <div class="content-card__main">
            <slot name="default" />
        </div>
        <content-auth-manager
            v-if="showContentAuthManager"
            ref="contentAuthManager"
            :resource-id="contentAuthInfo.id"
            :menu-elid="contentAuthInfo.menuElId"
            :resource-type="contentAuthInfo.type">
            <div slot="button"></div>
        </content-auth-manager>
    </div>
</template>

<script>
import ContentAuthManager from '@/components/ContentAuthManager'
export default {
  components: {
    ContentAuthManager
  },
  props: ['title'],
  data() {
    return {
      showContentAuthManager: false,
      contentAuthInfo: null
    }
  },
  methods: {
    handleShowContentAuthManager(info) {
      this.showContentAuthManager = true
      this.contentAuthInfo = info
      this.$nextTick(() => {
        this.$refs.contentAuthManager.handleOpenAuthManagement()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.content-card__main
    position relative
    padding 20px
    background #fff
    // >>> .el-input__inner,
    // >>> .el-select
    //     max-width 280px
.content-card__header
    position relative
    height 50px
    text-indent 20px
    line-height 50px
    font-size 18px
    font-weight bold
    border-bottom 1px solid #f0f0f0
    background #fff
    .actions
        padding 0 20px
        float right
</style>
