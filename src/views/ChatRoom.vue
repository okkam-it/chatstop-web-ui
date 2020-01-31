<template>
  <div class="chatroom-background" v-if="!loading">
    <!--<sidebar/> -->
    <b-row class="main" :class="{ 'mobile' : isMobile}">
      <b-col cols="0" sm="0" xl="3" class="col" v-if="!isMobile">
        <sidebar-chats :branches="branches" :username="username" @update-branches="loadUser()"/>
      </b-col>
      <b-col cols="12" xl="9" class="col">
        <!--<admin-panel v-if="admin && adminPage" />
        <chat v-else-if="!adminPage && bot" :key="bot.id" :bot="bot" :username="username" />
        -->
        <chat v-if="bot" :key="bot.id" :bot="bot" :branch="branch" :user="user" />
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
      <sidebar-chats :branches="branches" :username="username" @update-branches="loadUser()" />
    </div>
  </div>
</template>

<script>
import services from "@/config/services";

import Chat from "@/components/Chat";
import SidebarChats from "@/components/sidebar/SidebarChats";

export default {
  name: "ChatRoom",
  components: {
    Chat,
    SidebarChats
  },
  data() {
    return {
      branches: [],
      user: null,
      admin: this.$store.getters.user.admin,
      logo: require("@/assets/stop_logo_grey.png"),
      stompClient: null
    };
  },
  created() {
    this.loadUser();
  },
  mounted() {},

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
      if (this.user !== null) {
        return this.user.username;
      } else {
        return "";
      }
    },
    loading() {
      return this.user == null;
    }
  },
  watch: {},

  methods: {
    loadUser() {
      var url = services.FIND_USER_BY_UID;
      let uid = this.$store.getters.user.uid;
      let user_uid = JSON.stringify(uid).replace(/"/g, "");
      url = url.replace("{uid}", user_uid);
      this.axios.get(url).then(response => {
        this.user = response.data;
        this.loadUserBranches(this.user.id);
      });
    },
    loadUserBranches(userId) {
      var url = services.FIND_BRANCHES_BY_USER;
      url = url.replace("{userId}", userId);
      this.axios.get(url).then(response => {
        this.branches = response.data;
      });
    }
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
  padding: 40px;
}
</style>