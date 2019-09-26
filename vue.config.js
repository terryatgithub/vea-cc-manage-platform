const ENV = process.env.NODE_ENV
// dev地址172.20.155.101:8090,bate的地址是172.20.155.91:8090
const BACKEND = process.env.BACKEND || '172.20.155.91:8090' // 172.20.155.91:8090 localhost:9090
// const path = require('path')
// const dist = path.resolve('./dist')
const baseUrl = ENV === 'production' ? '' : 'http://127.0.0.1:8081'

module.exports = {
  publicPath: baseUrl,
  devServer: {
    public: '127.0.0.1:8081',
    port: '8081',
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
