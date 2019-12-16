<script>
export default {
  provide () {
    return {
      dataForm: this
    }
  },
  props: ['readonly'],
  render (h) {
    return h('el-form', {
      ref: 'form',
      props: {
        ...this.$attrs
      }
    }, this.$slots.default)
  }
}
</script>

<style>

</style>
