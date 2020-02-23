<template>
  <div>
    <div
    v-for="(block, index) in blockItems"
    :key="`${block.content.vContentId}-${index}`"
    class="block-item--wrapper">
      <el-input></el-input>
      <div class="intervene-block" @click="handleClickBlock(index)">
        <img
            referrerpolicy="no-referrer"
            loading="lazy"
            class="block-post"
            v-if="block.img"
            :src="block.img"
            :key="block.img"
          />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['blocks'],
  watch: {
    blocks: 'computeBlockItems'
  },
  data () {
    return {
      blockItems: []
    }
  },
  methods: {
    handleRemoveBlock (index) {
      this.$emit('remove-block', index)
    },
    handleClickBlock (index) {
      this.$emit('click-block', index)
    },
    computeBlockItems () {
      const blocks = this.blocks || []
      if (blocks.length === 0) {
        this.blockItems = []
        return
      }
      const blockItems = this.blocks.map(function (item) {
        const block = {
          title: item.title,
          specificContentList: item.specificContentList
        }
        const videoContentList = item.videoContentList || []
        const content = videoContentList[0] || {}

        const pictureUrl = content.pictureUrl
        if (pictureUrl) {
          const BLOCK_SIGN_IMG_SRC = process.env.BASE_URL + 'block/sign.png'
          block.img = pictureUrl === '/themes/images/block/sign.png'
            ? BLOCK_SIGN_IMG_SRC
            : pictureUrl
        }
        block.content = content
        block.cornerList = block.content.cornerList || []
        return block
      })
      this.blockItems = blockItems
    }
  },
  created () {
    this.computeBlockItems()
  }

}
</script>

<style lang='stylus' scoped>
.cc-virtual-pannel
  position relative
  text-align center
  height 50vh
  max-width 80vw
  resize both
.block-item--wrapper
  display inline-block
  margin 10px
.intervene-block
  height 182px
  width 130px
  border 1px solid #ccc
  cursor pointer
.block-post
  height 100%
  width 100%

</style>
