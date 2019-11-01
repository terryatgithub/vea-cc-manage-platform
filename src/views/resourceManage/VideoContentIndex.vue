<template>
  <ContentCard class="content">
    <VideoSelector selection-type="none" ref="video-selector" />
  </ContentCard>
</template>

<script>
import VideoSelector from '@/components/ResourceSelector/VideoSelector'
export default {
  components: {
    VideoSelector
  }
}
</script>

<style lang="stylus" scoped>
.content
  height 100%
  >>> .content-card__main
    height 100%
  >>> .remote-selector-main__actions
    display none;
</style>
