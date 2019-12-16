<template>
  <el-dialog
    class="cc-frame-dialog__dialog"
    title="批量打标签"
    :visible="true"
    :fullscreen="true"
    :before-close="handleClose">
    <div>
    <iframe class="cc-frame-dialog__frame" :src="url">
    </iframe>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: ['url'],
  methods: {
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
.cc-frame-dialog__dialog .el-dialog--full {
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
