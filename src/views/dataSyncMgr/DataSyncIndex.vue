<template>
  <div>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    editData() {
      if( this.$isAllowEdit(this.selected)) {
         this.$emit('open-add-page',this.selected[0])
      }
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>


