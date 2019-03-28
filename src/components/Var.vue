<script>
export default {
  props: ['element'],
  render(h) {
    return h(this.element || 'div', {class: 'cc-var'}, this.$scopedSlots.default(this.$vnode.data.attrs))
  }
}
</script>