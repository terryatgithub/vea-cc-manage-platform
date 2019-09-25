<template>
  <div>
    <el-dialog title="看数据"
      :visible.sync="visible"
      :show="show"
      width="70%"
      @close="$emit('update:show', false)"
      @open="fetchData"
    >
      1111
    </el-dialog>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        visible: this.show
      }
    },

    watch: {
      show () {
        this.visible = this.show
      }
    },

    props: {
      show: {
        type: Boolean,
        default () {
          return false
        }
      }
    },

    methods: {
      fetchData () {

      }
    },

    created() {},
  }
</script>

<style lang="stylus" scoped></style>
