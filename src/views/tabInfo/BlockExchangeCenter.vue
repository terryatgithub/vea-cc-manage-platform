<template>
  <div class="block-exchange-center">
    <div class="block-exchange-center-title">推荐位中转站</div>
    <div class="block-item-list">
      <Var
        v-for="(item, index) in blocks"
        :key="item.key"
        :block="getBlockContent(item)"
        @click.native="$emit('activate', index)"
        :class="{'block-item': true, active: index === active}">
        <template v-if="block" slot-scope="{block}">
          <div class="block-item-img-wrapper">
            <img class="block-item-img" referrerpolicy="no-referrer" :src="block.pictureUrl" />
          </div>
          <div class="block-item-title">{{ block.title }}</div>
          <i @click.stop="$emit('remove', index)" class="block-item-remove el-icon-error"></i>
        </template>
      </Var>
    </div>
  </div>
</template>
<script>
import Var from '@/components/Var'
export default {
  components: {
    Var
  },
  props: ['blocks', 'panelData', 'active'],
  methods: {
    getBlockContent ({ panelGroupId, groupIndex, blockIndex }) {
      const panel = this.panelData[panelGroupId]
      if (panel && panel.panelList) {
        const blockContent = panel.panelList[groupIndex].blocks[blockIndex].videoContentList[0]
        return blockContent
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.block-exchange-center
  width 170px
  border 1px solid #ccc
.block-exchange-center-title
  border-bottom 1px solid #ccc
  padding 0 5px
.block-item-list
  width 100%
  height 400px
  padding 5px 10px
  box-sizing border-box
  overflow auto
.block-item
  position relative
  width 100%
  height 100px
  cursor pointer
  margin 10px 0
  border 1px solid #ccc
  filter grayscale(100%)
  &.active
    filter grayscale(0)
    border 1px solid #409EFF
.block-item-img-wrapper
  width 100%
  height 100px
.block-item-img
  display block
  max-width 100%
  max-height 100%
  margin 0 auto
.block-item-title
  position absolute
  background #000
  bottom 0px
  overflow hidden
  border 0
  width 100%
  height 16px
  line-height 16px
  opacity 0.8
  color #fff
  text-align left
  -webkit-box-sizing border-box
  box-sizing border-box
  white-space nowrap
  text-overflow ellipsis
  font-size 12px
.block-item-remove
  position absolute
  right -5px
  top -5px
  color red
</style>
