const ENV = process.env.NODE_ENV
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || '8081'
// dev地址172.20.155.101:8090,bate的地址是172.20.155.91:8090
const BACKEND = process.env.BACKEND || '172.20.155.91:8090' // 172.20.155.91:8090 localhost:9090
// const path = require('path')
// const dist = path.resolve('./dist')
const baseUrl = ENV === 'production' ? '' : `http://${HOST}:${PORT}`

module.exports = {
  publicPath: baseUrl,
  devServer: {
    host: HOST,
    port: PORT,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/api': {
        target: 'http://' + BACKEND,
        pathRewrite: { '^/api': '/' }
      },
      'captcha.jpg': {
        target: 'http://' + BACKEND
      }
    }
  }
}
