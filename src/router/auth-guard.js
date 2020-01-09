import store from '../store'

export default (to, from, next) => {  
  //console.log(to)
  if(to.name == 'ChatRoom') {
    if (store.getters.user) {
      next()
    } else {
      next('/login')
    }
  } else if(to.name == 'AdminPanel') {
    if (store.getters.user && store.getters.user.admin) {      
      next()
    } else {
      next('/chat')
    }
  } else if(to.name == 'Login') {
    if (store.getters.user) {
      next()
    } else {
      next()
    }
  }
  
}