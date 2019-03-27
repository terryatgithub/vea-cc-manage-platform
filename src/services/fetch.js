import qs from 'qs'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
export default function fetch({
  method = 'get',
  url,
  data,
  params,
  isJSON = false
}) {
  NProgress.start()
  let option = {
    method,
    url,
    data: isJSON ? data : typeof data === 'string' ? data : qs.stringify(data),
    params
  }
  // if (url != "/api/login") option.headers = { Authorization: this.state.token };
  return axios(option)
    .then(function ({data}) {
      NProgress.done()
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
        if (typeof (data.rows) !== 'undefined'&&typeof (data.total) !== 'undefined') {
          return {
            rows: data.rows,
            total: data.total
          }
        } else {
            if(typeof(data.code) !== "undefined" && data.code !== '0') {
              throw new Error(data.msg)
            } else {
              return data 
            }
          
        }
         
      }
    })
    .catch(e => {
      NProgress.done()
      throw e
    })
}

