function insertIframe (name, src) {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('name', name)
  iframe.setAttribute('src', src)
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
}

function createDirective (name, src) {
  return {
    bind (el, binding, vnode) {
      let form = vnode.elm
      if (form.tagName !== 'FORM') {
        form = form.querySelector('form')
      }
      if (form) {
        form.setAttribute('target', name)
        form.setAttribute('action', src)
      }
    }
  }
}

export default {
  install (Vue, options = {}) {
    const { name = 'form-autocomplete-iframe', target = 'blank.html' } = options
    insertIframe(name, target)
    Vue.directive('form-autocomplete', createDirective(name, target))
  }
}
