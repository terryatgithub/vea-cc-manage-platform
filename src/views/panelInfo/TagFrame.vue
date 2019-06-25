<template>
  <FrameDialog :url="url" @close="$emit('close')"></FrameDialog>
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
      const isBatch = this.isBatch
      const idParamName = isBatch ? 'coocaaVIds' : 'coocaaVId'
      const ids = this.ids || []
      const server = /^(127|172)/.test(location.host)
        ? 'http://dev-mgr-media.tc.cc0808.com'
        : 'http://mgr.media.tc.skysrt.com'
      return server + `/ccGlobalMediaTag/${isBatch ? 'batch' : 'com'}.html?referrer=homepage&enableDelete=0&${idParamName}=` + ids.join(',')
    }
  }
}
</script>
