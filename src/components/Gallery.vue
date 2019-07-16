<template>
  <div class="gallery__wrapper">
    <div class="gallery__list">
      <div 
        v-for="(item, index) in items"
        :key="index"
        :class="['gallery__item', index === activeIndex ? 'active' : '']"
        @click="handleActivate(index)">
        <slot name="item" :item="item" :index="index">
        </slot>
      </div>
      <div
        v-if="addable"
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
export default {
  props: ['items', 'activeIndex', 'addable'],
  methods: {
    handleActivate(index) {
      this.$emit('activate', index)
    },
    handleAdd(event) {
      event.stopPropagation()
      this.$emit('add')
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

