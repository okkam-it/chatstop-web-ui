<template>
  <div class="sb">
    <div class="item" :class="{ selected: route == 'ChatRoom'}" @click="openChatroom" title="Chats">
      <p>
        <font-awesome-icon class="fa" icon="comments" />
      </p>
    </div>
    <div
      v-if="user.admin"
      class="item"
      :class="{ selected: route == 'AdminPanel'}"
      @click="openAdmin"
      title="Admin panel"
    >
      <p>
        <font-awesome-icon class="fa" icon="user-shield" />
      </p>
    </div>

    <div
      class="item bottom"
      @click.stop="toggleMenu()"      
      id="popover-options-menu"      
    >
      <p>
        <font-awesome-icon class="fa" icon="ellipsis-h" />
      </p>
    </div>
    <b-popover target="popover-options-menu" placement="right" :show.sync="showMenu">
      <template v-slot:title>
        <span class="username">{{user.email.replace("@fakemail.ie", "")}}</span>
      </template>
      <div class="btn-logout" @click="signOut()">
        <span>
          Log out
          <font-awesome-icon class="fa" icon="sign-out-alt" />
        </span>
      </div>
    </b-popover>
  </div>
</template>

<script>

export default {
  name: "Bots",
  components: {},
  data() {
    return {
      showMenu: false
    };
  },
  props: {},
  methods: {
    openChatroom() {
      this.$router.push({ name: "ChatRoom" });
    },
    openAdmin() {
      this.$router.push({ name: "AdminPanel" });
    },
    signOut() {
      this.$store.dispatch("signOutAction");
    },
    clickOutsideListener() {      
       document.addEventListener('click', this.close)
    },
    removeClickOutsideListener() {
      document.removeEventListener('click',this.close)
    },
    toggleMenu() {     
      
      if(!this.showMenu) {
        this.clickOutsideListener()
      } else {
        this.removeClickOutsideListener()
      }
      this.showMenu = !this.showMenu;
      
    },
    close () {
      if (this.showMenu) {
        this.showMenu = false
      }      
    }
  },
  computed: {
    route() {
      return this.$route.name;
    },
    user() {
      return this.$store.getters.user;
    }
  }  
};
</script>
<style scoped>
.sb {
  width: 80px;
  height: (100vh - 0px);
  /*height: 100%;*/
  background-color: #16191d;
}

.item {
  width: 80px;
  height: 80px;
  background-color: transparent;
  padding: 25px;
  cursor: pointer;
  color: #f2f2f2;
}

.item:hover {
  background-color: #1b1e23;
}

.item.bottom {
  position: absolute;
  bottom: 0;
}

.item.selected {
  background-color: #21252b;
  color: #4f94c2;
}

.item p {
  margin-bottom: 0;
  text-align: center;
}

.item .fa {
  font-size: 25px;
}

.username {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 20px;
}

.btn-logout {
  padding: 10px;
  padding-right: 25px;
  padding-left: 25px;
}

.btn-logout span {
  font-size: 18px;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #f2f2f2;
}

.btn-logout span .fa {
  margin-left: 10px;
}
</style>
 