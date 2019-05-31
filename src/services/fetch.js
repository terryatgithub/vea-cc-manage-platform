import qs from 'qs'
import axios from 'axios'
import Vue from 'vue'
export default function fetch({
  method = 'get',
  url,
  data,
  params,
  isJSON = false
}) {
  const loading = Vue.prototype.$loading({
    lock: true
  })
  let option = {
    method,
    url,
    data: isJSON ? data : typeof data === 'string' ? data : qs.stringify(data),
    params
  }
  return axios(option)
    .then(function ({ data }) {
      loading.close()
      if (typeof data.success !== 'undefined' && typeof data.msg !== 'undefined') {//返回success
        if (!data.success) {
          throw new Error(data.msg)
        } else {
          if (typeof (data.data) !== 'undefined') {
            if (typeof (data.total) !== 'undefined') {
              return {
                rows: data.data,
                total: data.total
              }
            } else {
              return data.data
            }
          } else if (typeof (data.rows) !== 'undefined') {
            if (typeof (data.total) !== 'undefined') {
              return {
                rows: data.rows,
                total: data.total
              }
            } else {
              return data.rows
            }
          } else {
            return data
          }
        }
      } else {
        if (typeof (data.rows) !== 'undefined' && typeof (data.total) !== 'undefined') {
          return {
            rows: data.rows,
            total: data.total
          }
        } else {
          if (typeof (data.code) !== 'undefined' && data.code !== '0') {
            throw new Error(data.msg)
          } else {
            return data
          }

        }

      }
    })
    .catch(e => {
      loading.close()
      throw e
    })
}

