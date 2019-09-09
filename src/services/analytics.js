import axios from 'axios'
import qs from 'qs'
export function sendEvent (data) {
  data = qs.stringify({
    jsonStr: JSON.stringify({
      type: 'click',
      name: data.type,
      data: data.payload
    })
  })
  return axios({
    method: 'post',
    url: 'api/v1/syslog/addLog.html',
    data
  }).catch(() => {})
}
