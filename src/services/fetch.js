import qs from 'qs'
import axios from 'axios'
import Vue from 'vue'
axios.interceptors.request.use(
  config => {
    // if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    // config.headers.Authorization = `token ${store.state.token}`;
    config.headers.Authorization = `bearercf5f0f6e-fd21-4219-b2a0-68067a6648a1`
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
export default function fetch ({
  method = 'get',
  headers,
  url,
  data,
  params,
  isHeaders = false,
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
    headers: isHeaders ? {'Content-Type': 'application/json'} : {'Content-Type': 'application/x-www-form-urlencoded'},
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
