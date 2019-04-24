<template>
   <div class="selectedItem" :style="{maxHeight:maxHeight}">
     <slot></slot>
   </div>
</template>
<script>
export default {
  props: {
    maxHeight:String
  },
  data(){
    return {
      
    }
  }
}
</script>

<style lang="stylus" scoped>
ul,li
  margin 0px
  padding 0px
.selectedItem li
  float left 
  margin 5px
  list-style-type none
.selectedItem li >>> .el-tag
  width 100%
.selectedItem
  max-height 150px
  overflow auto
  border 1px solid #DCDFE6
  border-radius 4px
</style>

