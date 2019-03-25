
import Login from '@/views/Login'
const routes = [
  // {
  //   path: '/',
  //   component: Main,
  //   children
  // },
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    }
  }
]

export default routes
