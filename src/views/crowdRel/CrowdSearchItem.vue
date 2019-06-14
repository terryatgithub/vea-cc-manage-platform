<script>
export default {
  functional: true,
  render: function (h, ctx) {
    var item = ctx.props.item;
    return h('li', ctx.data, item.label);
  },
  props: {
    item: { type: Object, required: true }
  }
}
</script>
