import Vue from 'vue'

/**
 * {
 *    type: 'menu_click',
 *    payload: {
 *      id: '123'
 *    }
 * }
 */
Vue.prototype.$sendEvent = function sendEvent (data) {
  this.$service.sendEvent(data)
}
