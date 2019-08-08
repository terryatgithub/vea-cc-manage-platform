<template>
  <div class="gallery__wrapper">
    <div class="gallery__list">

      <component
        :is="mode === 'read' ? 'div' : 'draggable'"
        :value="value"
        @input="$emit('input', $event)"
        @start="handleDragStart"
        @end="handleDragEnd">
        <div
          v-for="(item, index) in value"
          :key="index"
          :class="['gallery__item', index === activeIndex ? 'active' : '']"
          @click="handleActivate(index)">
          <slot name="item" :item="item" :index="index">
          </slot>
        </div>
      </component>
      <div
        v-if="mode !== 'read'"
        class="gallery__item" @click="handleAdd">
        <slot name="add">
          <div class="gallery__add">
            +
          </div>
        </slot>
      </div>
    </div>
    <div class="gallery__detail">
      <slot name="detail">
      </slot>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: ['value', 'activeIndex', 'mode'],
  methods: {
    handleActivate(index) {
      this.$emit('activate', index)
    },
    handleAdd(event) {
      event.stopPropagation()
      this.$emit('add')
    },
    handleDragStart(event) {
      event.preventDefault()
      return false
    },
    handleDragEnd(event) {
      const { oldIndex, newIndex } = event
      const currentIndex = this.activeIndex
      let nextActiveIndex
      if (oldIndex === currentIndex) {
        nextActiveIndex = newIndex
      } else if (oldIndex < currentIndex && newIndex >= currentIndex) {
        nextActiveIndex = currentIndex - 1
      } else if (oldIndex > currentIndex && newIndex <= currentIndex) {
        nextActiveIndex = currentIndex + 1
      }
      if (nextActiveIndex !== undefined) {
        this.$emit('active-index-change', nextActiveIndex)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.gallery__wrapper
  position relative
  border 2px dotted #a9a9a9
  padding 5px
  min-height 600px
.gallery__list
  position absolute
  top 10px
  left 0
  width 200px
  height 600px
  overflow-y auto

.gallery__item
  position relative
  width 160px
  height 120px
  padding 10px
  margin 0px auto 10px auto
  cursor pointer
  box-shadow 0 2px 12px 0 rgba(0,0,0,.1)
  transition 0.3s
  background #fff
  &.active
    border 2px dashed #f49e54
.gallery__detail
  margin-left 200px
  border-left 1px solid #808080
.gallery__add
  text-align center
  font-size 20px
  margin-top 45px
</style>
