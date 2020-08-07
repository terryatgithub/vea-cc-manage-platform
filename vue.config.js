const ENV = process.env.NODE_ENV
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || '8081'
// dev地址172.20.155.101:8222,bate的地址是172.20.155.91:8222
const BACKEND = process.env.BACKEND || '172.20.155.91:8222'
// liteOS测试
// const BACKEND = process.env.BACKEND || '172.20.130.202:6085'
const BACKEND1 = process.env.BACKEND || '172.20.151.117:7003'
// const path = require('path')
// const dist = path.resolve('./dist')
const baseUrl = ENV === 'production' ? '' : `http://${HOST}:${PORT}`
console.log('backend: ', BACKEND1);
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
        target: 'http://' + BACKEND1,
        pathRewrite: { '^/api': '/api' }
      },
      'captcha.jpg': {
        target: 'http://' + BACKEND1
      }
    }
  }
}
