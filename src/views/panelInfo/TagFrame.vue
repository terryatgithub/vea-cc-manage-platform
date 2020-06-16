<template>
  <FrameDialog
    title="批量打标签"
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
  props: ['ids', 'isBatch'],
  data () {
    return {
    }
  },
  computed: {
    server () {
      return /^(127|172|beta)/.test(location.host)
        ? 'http://dev-mgr-media.tc.cc0808.com'
        : 'http://mgrnew.media.tc.skysrt.com'
    },
    url () {
      const ids = this.ids || []
      const server = this.server
      return server + `/#/ccGlobalMediaTag/com.html?origin=${location.origin}&referrer=homepage&enableDelete=0&coocaaVId=` + ids.join(',')
    }
  },
  methods: {
    handleClose (event) {
      if (!event || (event.data === 'close' && event.origin === this.server)) {
        this.$emit('close')
      }
    }
  },
  mounted () {
    window.addEventListener('message', this.handleClose)
  },
  beforeDestroy () {
    window.removeEventListener('message', this.handleClose)
  }
}
</script>
