export default function login(data) {
  return this.fetch({
    method: 'post',
    url: '/api/userlogin.html',
    data 
  }).then((user) => {
    this.state = user
    return user
  })
}