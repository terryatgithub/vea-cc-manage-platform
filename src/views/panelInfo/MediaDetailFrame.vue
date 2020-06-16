<template>
  <FrameDialog
    title="影片详情"
    :url="url"
    :frame-style="{padding: '0 10px'}"
    :fullscreen="true"
    @close="handleClose">
  </FrameDialog>
</template>

<script>
import FrameDialog from '@/components/FrameDialog'
export default {
  components: {
    FrameDialog
  },
  props: ['id'],
  data () {
    return {
    }
  },
  computed: {
    url () {
      const server = /^(127|172|beta)/.test(location.host)
        ? 'http://dev-mgr-media.tc.cc0808.com'
        : 'http://mgrnew.media.tc.skysrt.com'
      return server + `/#/ownMediaResManage/view.html?origin=${location.origin}&reqFrom=1&coocaaVId=` + this.id
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>
