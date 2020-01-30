<template>
  <div class="back-color">
    <!--<div class="menu">
      <b-row>
        <b-col cols="9" class="col col-text right-border">
          <span class="username">
            {{username}}
            <span v-if="admin" class="admin-label">Admin</span>
          </span>
        </b-col>
        <b-col cols="3" class="col col-button" @click="signOut()" v-b-tooltip.hover title="Log out">
          <font-awesome-icon class="fa-signout" icon="sign-out-alt" />
        </b-col>
      </b-row>
    </div>-->
    <div class="background">
      <div class="search-bar">
        <font-awesome-icon icon="search" class="fa-search" />
        <input class="input-field" type="text" v-model="search_string" />
        <div class="btn-add-code">
          <p @click="showBranchCodeModal()">Add an invitation code</p>
        </div>
      </div>
      <div class="bot-list">
        <item-branch v-for="(branch, key) in branches" :key="key" :branch="branch" :searchstring="search_string"/>
        <!--<p class="branch-name">Sentiment analysys</p>
        <item-bot v-for="bot in filteredBots" :key="bot.id" :bot="bot" />-->
      </div>
    </div>
    <!--<div class="admin-box" v-if="admin" :class="{ selected: adminSelected}" @click="openAdmin()">
      <p>
        <font-awesome-icon class="fa" icon="cog" />Admin Panel
      </p>
    </div>-->
    <branch-code-modal ref="branchCodeModal"/>
  </div>
</template>

<script>
import ItemBranch from "./ItemBranch";
import BranchCodeModal from "./modals/BranchCodeModal"
export default {
  name: "Bots",
  components: {    
    ItemBranch,
    BranchCodeModal
  },
  data() {
    return {
      admin: this.$store.getters.user.admin,
      search_string: ""
    };
  },
  props: {
    branches: {
      type: Array,
      required: false      
    },
    username: {
      type: String,
      required: true
    }
  },
  methods: {
    signOut() {
      this.$store.dispatch("signOutAction");
    },
    openAdmin() {
      //this.$store.dispatch("setAdminPage", true);
      this.$router.push({ name: 'AdminPanel' })
    },
    showBranchCodeModal() {
      this.$refs.branchCodeModal.show();
    }
  },
  computed: {
    adminSelected() {
      return this.$store.getters.adminPage;
    },
    /*filteredBots() {
      return this.bots.filter(bot => {
        return bot.name
          .toLowerCase()
          .includes(this.search_string.toLowerCase());
      });
    }*/
  }
};
</script>
<style scoped>
.back-color {
  background-color: #21252b;
}
.background {
  color: rgba(255, 255, 255, 0.8);
  width: 100%;
  height: calc(100vh - 0px);
  padding: 15px;
  position: relative;
}

.bot-list {
  height: calc(100%);
  overflow: auto;
  padding-top: 150px;
}

.search-bar {
  padding: 10px;
  padding-top: 20px;
  width: 100%;
  text-align: center;
  position: absolute;
  background-color: #21252b;
  top: 0;
  left: 0;
}

.input-field {
  width: 90%;
  background-color: #2c313a;
  border: 1px solid #2c313a;
  border-radius: 30px;
  padding: 6px;
  padding-left: 35px;
  color: rgba(255, 255, 255, 0.8);
}

.fa-search {
  position: absolute;
  color: rgba(255, 255, 255, 0.8);
  margin: 10px;
  margin-top: 10px;
  font-size: 18px;
}

.menu {
  border-bottom-color: #2c313a;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  color: #f2f2f2;
}

.menu .right-border {
  border-right: 1px solid #2c313a;
}

.menu .col {
  height: 50px;
}

.menu .col.col-button {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.menu .col.col-text {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: left;
}

.menu .username {
  font-size: 18px;
  font-weight: bold;
  padding-left: 20px;
  text-transform: uppercase;
}

.menu .fa-signout {
  margin-right: 10px;
}

.admin-box {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #1b1e23;
  width: 100%;
  border-top: #2c313a solid 1px;
  color: #f2f2f2;
  text-align: center;
  cursor: pointer;
}

.admin-box.selected {
  background-color: #373e48;
}

.admin-box:hover {
  background-color: #21252b;
}

.admin-box p {
  text-align: center;
  vertical-align: middle;
  line-height: 60px;
  margin-bottom: 0;
  font-weight: bold;
  font-size: 18px;
}

.admin-box .fa {
  margin-right: 10px;
}

.admin-label {
  font-weight: normal;
  color: #ccc;
  font-size: 12px;
  text-transform: uppercase;
}

.branch-name {
  font-size: 15px;
  color: #ccc;
  margin-bottom: 2px;
}

.btn-add-code {
  padding-top: 15px;
}

.btn-add-code p {
  color: #ccc;
  padding:10px;
  margin: 15px;
  border: 1px dashed #ccc;
  border-radius: 10px;
  cursor: pointer;
  text-transform: uppercase;
}

.btn-add-code p:hover {
  background-color: #2c313a;
}
</style>
 