export function sendEvent (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/syslog/addLog.html',
    data: {
      type: 'click',
      name: data.type,
      data: data.payload
    }
  })
}
