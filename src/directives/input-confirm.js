import { MessageBox } from 'element-ui'

function wrapInputFn (binding, vnode) {
  const { value, arg = 'input' } = binding
  const options = typeof value === 'string'
    ? { title: '提示', message: value }
    : value
  const componentInstance = vnode.componentInstance
  const invoker = componentInstance.$listeners[arg]
  const noInputConfirm = componentInstance.$attrs['no-input-confirm']
  const originFn = invoker.fns
  invoker.fns = function () {
    if (noInputConfirm) {
      originFn.apply(this, arguments)
    } else {
      MessageBox.confirm(undefined, undefined, options)
        .then(() => {
          originFn.apply(this, arguments)
        })
        .catch(() => {
        })
    }
  }
}

export default {
  bind (el, binding, vnode) {
    wrapInputFn(binding, vnode)
  },
  update (el, binding, vnode) {
    wrapInputFn(binding, vnode)
  }
}
