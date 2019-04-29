// directives
// shadow-drag
// @author William
const DATA = {}
function genId() {
  var id
  do {
    id = '' + Date.now() + Math.random()
  } while (DATA[id])
  return id
}
function handleDragStart(event) {
  event.stopPropagation()
  const target = event.currentTarget
  const shadowDragId = target.dataset.shadowDragId
  const data = DATA[shadowDragId]
  const binding = data.binding
  const transData = binding.value
  event.dataTransfer.setData('text/plain', JSON.stringify(transData))
  target.dispatchEvent(new Event('shadow-drag-start'))
}
function handleDragEnd(event) {
  event.currentTarget.dispatchEvent(new Event('shadow-drag-end'))
}

export default {
  bind: function(el, binding, vnode) {
    if (binding) {
      const shadowDragId = genId()
      DATA[shadowDragId] = {
        binding: binding,
        vnode: vnode
      }
      el.dataset.shadowDragId = shadowDragId
      el.addEventListener('dragstart', handleDragStart)
      el.addEventListener('dragend', handleDragEnd)
      el.setAttribute('draggable', true)
    }
  },
  inserted: function(el, binding, vnode) {
  },
  update: function(el, binding, vnode) {
    const shadowDragId = el.dataset.shadowDragId
    const data = DATA[shadowDragId]
    data.binding = binding
  },
  unbind: function(el, binding, vnode) {
    const shadowDragId = el.dataset.shadowDragId
    delete DATA[shadowDragId]
    el.removeEventListener('dragstart', handleDragStart)
    el.removeEventListener('dragend', handleDragEnd)
  }
}
