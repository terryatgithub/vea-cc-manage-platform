import qs from 'qs'
import axios from 'axios'
import Vue from 'vue'
export default function fetch ({
  method = 'get',
  url,
  data,
  params,
  isJSON = false,
  useLoading = true
}) {
  let loading
  if (useLoading) {
    loading = Vue.prototype.$loading({
      lock: true,
      body: true
    })
  }
  let option = {
    method,
    url,
    data: isJSON ? data : typeof data === 'string' ? data : qs.stringify(data),
    params
  }
  return axios(option)
    .then(function ({ data }) {
      if (loading) {
        loading.close()
      }
      if (typeof data.success !== 'undefined' && typeof data.msg !== 'undefined') { // 返回success
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
          // eslint-disable-next-line
          if (typeof (data.code) !== 'undefined' && data.code != '0') {
            throw new Error(data.msg)
          } else {
            return data
          }
        }
      }
    })
    .catch(e => {
      if (loading) {
        loading.close()
      }
      throw e
    })
}
