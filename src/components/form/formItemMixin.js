export default {
  inject: ['dataForm'],
  props: {
    value: {},
    label: String,
    disabled: Boolean,
    readonly: {},
    prop: String,
    placeholder: String,
    errors: {},
    rules: {}
  },
  computed: {
    isReadonly() {
      const readonly = this.readonly
      if (readonly !== undefined) {
        return readonly
      }
      return this.dataForm.readonly
    }
  }
}
