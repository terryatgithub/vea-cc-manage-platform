import Main from '@/components/Main'
import Wrapper from '@/components/Wrapper.vue'
import Login from '@/views/Login'
let children = []
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
