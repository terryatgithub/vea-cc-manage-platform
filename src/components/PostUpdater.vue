<template>
  <div>
    <div @click="handleShowDialog">
      <slot>
        <el-button type="success" :disabled="disabled">更换海报</el-button>
      </slot>
    </div>
    <FrameDialog
      v-if="isShowDialog"
      :url="url"
      :fullscreen="true"
      :frame-style="{padding: '0 20px'}"
      @close="handleUpdatePostEnd">
      <div slot="title">
        <span>更换海报</span>
        <el-button class="close-btn" size="mini" @click="handleUpdatePostEnd">关闭</el-button>
      </div>
    </FrameDialog>
  </div>
</template>

<script>
import FrameDialog from '@/components/FrameDialog'
export default {
  components: {
    FrameDialog
  },
  props: ['vid', 'disabled'],
  data () {
    return {
      mountedDialg: false,
      isShowDialog: false
    }
  },
  computed: {
    videoInfo () {
      // _otx_xxxxxxx
      // _otx_wasu_xxxxx
      const vidSplited = this.vid.split('_') || []
      const id = vidSplited.slice(2).join('_')
      // 倒数第二个是内容源
      const source = vidSplited[vidSplited.length - 2]
      // eslint-disable-next-line
      const partnerMap = {
        'otx': 'tencent',
        'oqy': 'yinhe',
        'oyk': 'youku'
      }
      const partner = partnerMap[source] ? partnerMap[source] : source
      return {
        id,
        partner
      }
    },
    url () {
      const { id, partner } = this.videoInfo
      const server = /^(127|172|beta)/.test(location.host)
        ? 'http://dev-mgr-media.tc.cc0808.com'
        : 'http://mgrnew.media.tc.skysrt.com'
      return server + `/#/ownMediaResManage/homeView.html?coocaaVId=${id}&partner=${partner}`
    }
  },
  methods: {
    handleShowDialog () {
      const videoInfo = this.videoInfo
      if (!(videoInfo.id)) {
        return this.$message.error('该影片id不符合规则，无法更换')
      }
      if (!this.disabled) {
        this.mountedDialg = true
        this.$nextTick(() => {
          this.isShowDialog = true
        })
      }
    },
    handleUpdatePostEnd () {
      this.isShowDialog = false
      this.$emit('update-post-end')
    }
  },
  created () {
  }
}
</script>

<style lang="stylus" scoped>
.dialog-iframe
  width 100%
  height 100%
  min-height 300px
  border none
.close-btn
  margin-left 10px
</style>
