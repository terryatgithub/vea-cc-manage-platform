<template>
  <FrameDialog :url="url" @close="$emit('close')"></FrameDialog>
</template>

<script>
import FrameDialog from '@/components/FrameDialog'
export default {
  components: {
    FrameDialog
  },
  data() {
    return {
    }
  },
  computed: {
    url() {
      const ids = this.ids || []
      const server = /^(127|172)/.test(location.host)
        ? "http://dev-mgr-media.tc.cc0808.com" 
        : "http://mgr.media.tc.skysrt.com"
      return server + '/ccGlobalMediaTag/batch.html?referrer=homepage&enableDelete=0&coocaaVIds=' + ids.join(',')
    }
  },
  props: ['ids']
}
</script>