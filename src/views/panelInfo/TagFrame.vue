<template>
  <FrameDialog :url="url" @close="handleClose"></FrameDialog>
</template>

<script>
import FrameDialog from '@/components/FrameDialog'
export default {
  components: {
    FrameDialog
  },
  props: ['ids', 'isBatch'],
  data() {
    return {
    }
  },
  computed: {
    url() {
      const ids = this.ids || []
      const server = /^(127|172)/.test(location.host)
        ? 'http://dev-mgr-media.tc.cc0808.com'
        : 'http://mgr.media.tc.skysrt.com'
      return server + `/ccGlobalMediaTag/com.html?origin=${location.origin}&referrer=homepage&enableDelete=0&coocaaVId=` + ids.join(',')
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  },
  mounted() {
    window.addEventListener('message', this.handleClose)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleClose)
  }
}
</script>
