<template>
  <el-dialog
    class="cc-frame-dialog__dialog"
    :visible="true"
    :append-to-body="true"
    :fullscreen="fullscreen"
    :before-close="handleClose">
    <span class="el-dialog__title" slot="title">
      <slot name="title">
        {{ title }}
      </slot>
    </span>
    <iframe :style="frameStyle" class="cc-frame-dialog__frame" :src="url">
    </iframe>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: ['title', 'url', 'fullscreen', 'frameStyle'],
  methods: {
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>
<style>
.cc-frame-dialog__dialog .is-fullscreen {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.cc-frame-dialog__dialog .el-dialog__body {
  padding: 0;
  flex:1;
  position: relative;
}
.cc-frame-dialog__frame {
  height: 100%;
  width: 100%;
  position: absolute;
  border: none;
}
</style>
