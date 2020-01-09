import Vue from 'vue'
import Vuex from 'vuex'
import botstore from './modules/botstore'
import authstore from './modules/authstore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { 
    botstore,    
    authstore
  }
})
