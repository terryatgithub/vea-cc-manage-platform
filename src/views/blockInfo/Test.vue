<script>
export default {
  data() {
    return {
      val: 1
    }
  },
  render(h) {
    console.log('render')
    return h('el-input', {
      props: {
        value: this.val
      },
      on: {
        input: (val) => {
          this.val = val
        }
      }
    })
  }
}
</script>

<style>

</style>
