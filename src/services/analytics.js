import axios from 'axios'
export function sendEvent (data) {
  return axios({
    method: 'post',
    url: 'api/v1/syslog/addLog.html',
    data: {
      jsonStr: JSON.stringify({
        type: 'click',
        name: data.type,
        data: data.payload
      })
    }
  }).catch(() => {})
}
