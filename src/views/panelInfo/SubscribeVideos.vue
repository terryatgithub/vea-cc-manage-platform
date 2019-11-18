<template>
  <div class="video-list">
    <template v-for="(item, index) in blocks">
      <Var
        :class="{
          'video-item': true,
          'video-item--duplicated': item.duplicated
        }"
        :key="index"
        v-if="item.videoContentList[0]"
        :video="item.videoContentList[0]">
        <template slot-scope="{video}">
          <img class="video-item__img" referrerpolicy="no-referrer" :src="video.pictureUrl" />
          <div class="video-item__release" :title="video.title">
            {{ video.subscribeOnlineTime || '敬请期待' }}
          </div>
          <div class="video-item__info" :title="video.title">
            {{ video.title }}
          </div>
          <i v-if="mode !== 'read'" title="移除" @click="handleRemoveItem(index)" class="video-item__remove el-icon-circle-close"></i>
        </template>
      </Var>
    </template>
  </div>
</template>
<script>
import Var from '@/components/Var'
export default {
  components: {
    Var
  },
  props: ['mode', 'blocks'],
  data () {
    return {
    }
  },
  computed: {
    videoContentList () {
      return (this.blocks || []).map(item => item.videoContentList[0])
    }
  },
  methods: {
    handleRemoveItem(index) {
      this.$emit('remove-block', index)
    }
  }
}
</script>
<style lang="stylus" scoped>
.video-item
  position relative
  width 143px
  height 200px
  border 1px solid #ccc
  display  inline-block
  margin-right 30px
  margin-top 30px
  margin-bottom 30px
.video-item--duplicated
  border 2px solid red
.video-item__img
  max-width 100%
  max-height 100%
  margin 0 auto
  display block
.video-item__release
  position absolute
  width 100%
  top -30px
  text-align center
.video-item__info
  position absolute
  width 100%
  text-overflow ellipsis
  overflow hidden
  white-space nowrap
  bottom -30px
.video-item__remove
  position absolute
  right -10px
  top -10px
  font-size 18px
  color #555
  cursor pointer
  &:hover
    color red
</style>
