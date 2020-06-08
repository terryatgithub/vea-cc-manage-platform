<template>
  <div>
    <div
      v-for="(block, index) in blocks"
      :key="`${content[index].vContentId}-${index}`"
      class="block-item--wrapper">
      <div class="intervene-input--wrapper">
        <InputPositiveInt
          ref="posInput"
          clearable
          :value="block.intervenePos"
          :disabled="disabled"
          @input="handleInputValue($event, index)"
          @blur="$emit('end-intervene-input', index)"
          style="width: 65px"/>
        <i v-if="!disabled" class="el-icon-circle-close intervene-remove-icon" @click.stop="$emit('remove-block', index)" />
      </div>
      <div class="intervene-block" @click="handleClickBlock(index)">
        <img
            referrerpolicy="no-referrer"
            loading="lazy"
            class="block-post"
            v-if="content[index].pictureUrl"
            :src="content[index].pictureUrl"
            :key="content[index].pictureUrl"
          />
      </div>
    </div>
  </div>
</template>

<script>
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  components: {
    InputPositiveInt
  },
  props: {
    blocks: Array,
    maxCount: {
      type: Number,
      default: 9
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    content () {
      return this.blocks.map(item => {
        const content = item.videoContentList[0] || {}
        const pictureUrl = content.pictureUrl
        if (pictureUrl) {
          const BLOCK_SIGN_IMG_SRC = process.env.BASE_URL + 'block/sign.png'
          content.pictureUrl = pictureUrl === '/themes/images/block/sign.png'
            ? BLOCK_SIGN_IMG_SRC
            : pictureUrl
        }
        return content
      })
    }
  },
  methods: {
    handleRemoveBlock (index) {
      this.$emit('remove-block', index)
    },
    handleClickBlock (index) {
      this.$emit('click-block', index)
    },
    handleInputValue (val, index) {
      const oldVal = this.blocks[index].intervenePos
      const maxCount = this.maxCount
      // alert(this.maxCount)
      if (val !== '' && (val < 1 || val > maxCount)) {
        const ref = this.$refs.posInput[index]
        ref.inputValue = oldVal
        return this.$message.error(`插入位置必须在1~${maxCount}之间`)
      } else {
        this.blocks[index].intervenePos = val
      }
    }
  },
  created () {
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
  position relative
.block-post
  width 100%
.intervene-input--wrapper
  margin 5px 0
  text-align center
.intervene-remove-icon
  color red
  cursor pointer
  float right
  margin 9px 0
</style>
