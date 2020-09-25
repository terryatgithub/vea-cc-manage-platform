<template>
  <div>
    <div slot="footer" class="dialog-footer">
      <el-button type="success" @click="create">
        确认
      </el-button>
      <el-button @click="cancel">
        取消
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      footerForm: {
        DeviceID: ''
      }
    }
  },
  methods: {
    create () {
      this.$emit('create')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss">
.footerEdit {
  border-bottom: 2px solid #e4e7ed;
  .el-form-item {
    .el-form-item__label {
      width: 90px;
      text-align: left;
    }
    .el-form-item__content {
      width: 200px;
      display: inline-block;
    }
  }
}
</style>
<style lang="scss" scoped>
.dialog-footer {
  margin-top: 20px;
  text-align: left;
}
</style>
