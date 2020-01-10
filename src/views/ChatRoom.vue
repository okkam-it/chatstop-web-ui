<template>
  <div class="chatroom-background">
    <!--<sidebar/> -->   
    <b-row class="main" :class="{ 'mobile' : isMobile}">
      <b-col cols="0" sm="0" xl="3" class="col" v-if="!isMobile">
        <sidebar-chats :branches="branches" :username="username" />
      </b-col>
      <b-col cols="12" xl="9" class="col">
        <!--<admin-panel v-if="admin && adminPage" />
        <chat v-else-if="!adminPage && bot" :key="bot.id" :bot="bot" :username="username" />
        -->
        <chat v-if="bot" :key="branch + '_' + bot.id" :bot="bot" :branch="branch" :username="username" />
      
        <div class="chat-void" v-else>
          <div class="logo-box">
            <b-img class="logo" alt="stop_logo" :src="logo"></b-img>
            <p>
              <strong>ST</strong>
              <span>op</span>
              <strong>O</strong>
              <span>besity</span>
              <strong>P</strong>
              <span>latform</span>
            </p>
            <p class="desc">Choose a bot and start chatting!</p>
          </div>
        </div>
      </b-col>
    </b-row>
    
    <!--<div v-if="isMobile && !selectedBot && !adminPage" class="sidebar-mobile">-->
      <div v-if="isMobile && !bot" class="sidebar-mobile">
       <sidebar-chats :branches="branches" :username="username" />
    </div>

    <!--<div class="test-socket" @click="sendSocket()">
        SEND

    </div>-->
  </div>
</template>

<script>
import firebase from "../config/firebase";

import Chat from "@/components/Chat";
import SidebarChats from "@/components/sidebar/SidebarChats";
//import Sidebar from "@/components/sidebar/Sidebar";
//import AdminPanel from "@/components/admin_panel/AdminPanel";
// import { stringify } from 'querystring';


//import SockJS from "sockjs-client";
//import Stomp from "webstomp-client";

export default {
  name: "ChatRoom",
  components: {
    Chat,
    SidebarChats,
    //Sidebar
    //AdminPanel
  },
  data() {
    return {
      // botid: this.$route.params.roomid,
      // botid: this.$store.state.botStore.selectedBot,
      // username: this.$route.params.username,
      // username: this.clearUsername(this.$store.getters.user.username),      
      branches: [],
      admin: this.$store.getters.user.admin,
      logo: require("@/assets/stop_logo_grey.png"),
      stompClient: null
    };
  },
  created() {    
    //console.log(JSON.stringify(this.$store.getters.user.email))
    //console.log(JSON.stringify(this.$store.getters.user.uid))

    /*firebase
      .database()
      .ref("bots")
      .on("value", snapshot => {
        this.bots = [];
        snapshot.forEach(doc => {
          let item = doc.val();
          item.id = doc.key;
          if (!item.hidden) {
            this.bots.push(item);
          }
        });
      });*/

      this.loadUserBranches()
      
   // alert(JSON.stringify(this.$store.getters.user.uid))



      

    /*const auth = firebase.auth()
    auth.onAuthStateChanged(user => {
      if(!user) {
        this.$router.push('/login')
      }
    })*/
  },
  mounted() {
    // this.testSocket()
  },

  computed: {
    bot() {      
      return this.$store.getters.selectedBot;
    },
    branch() {
      return this.$store.getters.selectedBranch;
    },
    /*selectedBot() {
      return this.bots.find(obj => {
        return obj.id === this.botid;
      });
    },*/
    /*adminPage() {
      return this.$store.getters.adminPage;
    },*/
    username() {
      var un = this.$store.getters.user.email;
      if (!un) {
        return null;
      }
      return this.clearUsername(un);
    }
  },
  watch: {},

  methods: {
    clearUsername(un) {
      return un.replace("@fakemail.ie", "");
    },
    loadUserBranches() {
      // console.log("load branches")
      firebase
        .database()
        .ref("users")
        .child(this.$store.getters.user.uid) 
        .child("branches")
        .on("value", snapshot => {
          this.branches = []
          snapshot.forEach(doc => {
            this.branches.push(doc.val())
          })
          
        });
    }
    /*sendSocket() {
      var msg = {
      'receiver': 'http://localhost:8080/stop_api/',
      'sender': 'MAtte',
      'text': "Hello Matteeee"
    };
      this.stompClient.send("ws://localhost:8080/stop_api/secured/room", {}, msg);
    },
    testSocket() {
      // Create WebSocket connection.
        console.log("Init socket")
        var socket = new SockJS("http://localhost:8080/stop_api/stop/secured/");
        // var socket = new SockJS("http://localhost:8080/secured/chat/");
        this.stompClient = Stomp.over(socket);

        /*var stompClient = Stomp.over(function(){
          return new SockJS("http://localhost:8080/stop_api/secured/room/");
        });*/

        /*this.stompClient.reconnect_delay = 5000;

        this.stompClient.connect({}, frame => {
            //this.connected = true;
            console.log(frame);
            this.stompClient.subscribe('secured/user/queue/specific-user'
            , function (msgOut) {
              console.log("Msg out: " + msgOut)
          })
          },
          error => {
            console.log(error);
            //this.connected = false;
          }
        );
    }*/
  }
};
</script>
<style scoped>

.chatroom-background {
  /*display: flex;*/
  width: 100%;
}

.main {
  height: calc(100vh - 0px);
  margin-left: 0;
  margin-right: 0;
  padding: 0px;
  width: 100%;
  background-color: #373e48;
}

.main .col {
  padding-right: 0;
  padding-left: 0;
}

.chat-void {
  width: 100%;
  height: 100%;
  background-color: #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 90px;
  margin-top: -40px;
  margin-bottom: -20px;
}

.logo-box {
  color: #4d4d4d;
  text-align: center;
  font-size: 18px;
}

.logo-box .desc {
  color: #f2f2f2;
  font-size: 20px;
  background-color: #4f94c2;
  border-radius: 50px;
  padding-left: 15px;
  padding-right: 15px;
  opacity: 0.8;
}


/** CSS MOBILE */

.main.mobile {
  max-height: calc(100vh - 0px);
}
.sidebar-mobile {
  position: fixed;
  width: calc(100% - 80px);
  height: 100%;
  top: 0;
  left: 80px;
  z-index: 100;

}







.test-socket {
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 1000;
  background-color: #fff;
  padding:40px;

}
</style>