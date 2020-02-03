<template>
  <div
    class="manage-background"
    :class="{'mobile' : isMobile}"
  >
    <div class="manage-container">
      <b-container>
        <b-row class="header">
          <!--<b-col cols="12" v-if="isMobile" @click="openSidebarBots()">
          <div class="menu">
            <p>Admin Panel</p>
            <font-awesome-icon class="fa" icon="bars" />
          </div>
          </b-col>-->

          <b-col cols="12">
            <div class="menu-fixed">
              <div class="title title-panel">
                <p>
                  Admin panel
                </p>
              </div>
            </div>
          </b-col>
        </b-row>

        <div class="border-box">
          <b-row class="header">
            <b-col>
              <p class="title">
                Bots
              </p>
            </b-col>
            <b-col>
              <div class="new-btn">
                <b-button
                  class="background-primary-color"
                  @click="newBot()"
                >
                  Add new Bot
                </b-button>
              </div>
            </b-col>
          </b-row>
          <div class="box bots-box">
            <b-list-group>
              <item-bot
                v-for="(bot, key) in bots"
                :key="key"
                class="d-flex justify-content-between align-items-center"
                :class="{hidden: bot.hidden}"
                :bot="bot"
                @editbot="editBot(bot)"
                @deletebot="askDeleteBot(bot)"
              />
            </b-list-group>
          </div>

          <div>
            <p class="sub-title">
              Download csv data
            </p>
            <b-row>
              <b-col
                v-for="(bot, key) in bots"
                :key="key"
                cols="6"
                md="2"
                lg="2"
              >
                <div
                  class="csv"
                  @click="downloadCSV(bot)"
                >
                  <font-awesome-icon
                    class="fa"
                    icon="file-csv"
                  />
                  <p>
                    {{ bot.name }}
                    <br />
                  </p>
                  <p class="btn-csv-download">
                    Download
                  </p>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>

        <div class="border-box">
          <b-row class="header">
            <b-col>
              <p class="title">
                Branches
              </p>
            </b-col>
            <b-col>
              <div class="new-btn">
                <b-button
                  class="background-primary-color"
                  @click="newBranch()"
                >
                  Add new Branch
                </b-button>
              </div>
            </b-col>
            <!--<b-col cols="2">
          <div class="new-bot">
            <b-button @click="newBot()">Create new</b-button>
          </div>
            </b-col>-->
          </b-row>
          <div class="box users-box">
            <b-list-group>
              <!--<item-user
              v-for="(user, key) in users"
              :key="key"
              class="d-flex justify-content-between align-items-center"
              :user="user"
              @edituser="editUser(user)"
              @deleteuser="askDeleteUser(user)"
              />-->
              <item-branch
                v-for="(branch, key) in branches"
                :key="key"
                :branch="branch"
                class="d-flex justify-content-between align-items-center"
                @editbranch="editBranch(branch)"
                @deletebranch="askDeleteBranch(branch)"
              />
            </b-list-group>
          </div>
        </div>

        <div class="border-box">
          <b-row class="header">
            <b-col>
              <p class="title">
                Users
              </p>
            </b-col>
            <!--<b-col cols="2">
          <div class="new-bot">
            <b-button @click="newBot()">Create new</b-button>
          </div>
            </b-col>-->
          </b-row>
          <div class="box users-box">
            <b-list-group>
              <item-user
                v-for="(user, key) in users"
                :key="key"
                class="d-flex justify-content-between align-items-center"
                :user="user"
                @edituser="editUser(user)"
                @deleteuser="askDeleteUser(user)"
              />
            </b-list-group>
          </div>
        </div>
      </b-container>
    </div>
    <bot-modal
      v-if="!selectedItem || selectedItem.__type != 'user'"
      ref="botModal"
      :bot="selectedItem"
      @update="botsListener()"
    />
    <branch-modal
      ref="branchModal"
      :branch="selectedItem"
      :bots="bots"
      @update="branchesListener()"
    />
    <user-modal
      ref="userModal"
      :user="selectedItem"
    />
    <alert-modal
      ref="alertModal"
      :alertvalues="alertValues"
      @confirm="callbackConfirmAlertModal()"
    />
  </div>
</template>

<script>
import BotModal from "../components/admin_panel/modals/BotModal";
import UserModal from "../components/admin_panel//modals/UserModal";
import BranchModal from "../components/admin_panel/modals/BranchModal";
import AlertModal from "../components/admin_panel/modals/AlertModal";
import ItemBot from "../components/admin_panel/ItemBot";
import ItemUser from "../components/admin_panel/ItemUser";
import ItemBranch from "../components/admin_panel/ItemBranch";
import services from "@/config/services";

export default {
  name: "AdminPanel",
  components: {
    BotModal,
    UserModal,
    BranchModal,
    AlertModal,
    ItemBot,
    ItemUser,
    ItemBranch
  },
  props: {
    /*bot: {
      type: Object,
      required: true
    },
    username: {
      type: String,
      required: true
    }*/
  },
  data() {
    return {
      bots: [],
      users: [],
      branches: [],
      selectedItem: null,
      alertValues: null
    };
  },
  created() {
    this.botsListener();
    this.usersListener();
    this.branchesListener();
  },
  methods: {
    newBranch() {
      this.selectedItem = null;
      this.$nextTick(() => {
        this.$refs.branchModal.show();
      });
    },
    editBranch(branch) {
      branch["__type"] = "branch";
      this.selectedItem = branch;
      this.$nextTick(() => {
        this.$refs.branchModal.show();
      });
    },
    askDeleteBranch(branch) {
      branch["__type"] = "branch";
      this.selectedItem = branch;
      this.alertValues = {
        title: "Delete Branch",
        body: "Are you sure you want to delete this branch?",
        cancelText: "Cancel",
        confirmText: "Delete"
      };
      this.$refs.alertModal.show();
    },
    deleteBranch() {
      var url = services.DELETE_BRANCH;
      url = url.replace("{branchId}", this.selectedItem.id);
      this.axios
        .delete(url)
        .then(response => {
          response.data;
        })
        .catch(e => {
          alert(e.message);
        });
    },
    newBot() {
      this.selectedItem = null;
      this.$nextTick(() => {
        this.$refs.botModal.show();
      });
    },
    editBot(bot) {
      bot["__type"] = "bot";
      this.selectedItem = bot;
      this.$nextTick(() => {
        this.$refs.botModal.show();
      });
    },
    askDeleteBot(bot) {
      bot["__type"] = "bot";
      this.selectedItem = bot;
      this.alertValues = {
        title: "Delete Bot",
        body: "Are you sure you want to delete this bot?",
        cancelText: "Cancel",
        confirmText: "Delete"
      };
      this.$refs.alertModal.show();
    },
    deleteBot() {
      var url = services.DELETE_BOT;
      url = url.replace("{botId}", this.selectedItem.id);
      this.axios
        .delete(url)
        .then(response => {
          return response;
        })
        .catch(e => {
          alert(e.message);
        });
    },
    editUser(user) {
      user["__type"] = "user";
      this.selectedItem = user;
      this.$nextTick(() => {
        this.$refs.userModal.show();
      });
    },
    askDeleteUser(user) {
      user["__type"] = "user";
      this.selectedItem = user;
      this.alertValues = {
        title: "Delete User",
        body: "Are you sure you want to delete this user?",
        cancelText: "Cancel",
        confirmText: "Delete"
      };
      this.$refs.alertModal.show();
    },
    deleteUser() {
      // TODO delete user on firebase?
      var url = services.DELETE_USER;
      url = url.replace("{userId}", this.selectedItem.id);
      this.axios
        .delete(url)
        .then(function() {})
        .catch(e => {
          alert(e.message);
        });
    },
    callbackConfirmAlertModal() {
      if (this.selectedItem.__type == "bot") {
        this.deleteBot();
      } else if (this.selectedItem.__type == "user") {
        this.deleteUser();
      } else if (this.selectedItem.__type == "branch") {
        this.deleteBranch();
      }
    },
    usersListener() {
      this.axios.get(services.GET_ALL_USERS).then(response => {
        let users = response.data;
        var admins = users.filter(obj => {
          return obj.admin === true;
        });

        var normal_users = users.filter(obj => {
          return obj.admin !== true;
        });
        this.users = [].concat(admins, normal_users);
      });
    },
    botsListener() {
      this.axios.get(services.GET_ALL_BOTS).then(response => {
        this.bots = response.data;
      });
    },
    branchesListener() {
      this.axios.get(services.GET_ALL_BRANCHES).then(response => {
        this.branches = response.data;
      });
    },
    openSidebarBots() {
      this.$store.dispatch("setSelectedBot", null);
    },
    downloadCSV(bot) {
      var data = [];
      var ctx = this;
      var url = services.FIND_CHATROOMS_BY_BOT.replace("{botId}", bot.id);
      this.axios.get(url).then(response => {
        let chatrooms = response.data;
        for (var chatroom in chatrooms) {
          var msgs = chatroom.chats;
          var i = 0;
          for (var k in msgs) {
            var msg = msgs[k];
            msg["message_id"] = i;
            msg["convesation_id"] = chatroom.id;
            data.push(msg);
            i++;
          }
        }
        var date = new Date();
        var filename =
          bot.name.replace(new RegExp(" ", "g"), "_") +
          "_" +
          date.getDay() +
          "-" +
          date.getMonth() +
          "-" +
          date.getFullYear() +
          ".csv";

        var csv = ctx.convertToCSV(JSON.stringify(data));
        var encodedUri = encodeURI(csv);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link); // Required for FF
        link.click();
      });
    },
    convertToCSV(objArray) {
      if (!objArray || objArray.length == 0) {
        alert("No data");
      } else {
        var array =
          typeof objArray != "object" ? JSON.parse(objArray) : objArray;
        var str = "";

        var headers = [];
        for (var h in array[0]) {
          headers.push(h);
        }

        for (var i = 0; i < array.length; i++) {
          var line = "";
          for (var index in array[i]) {
            if (line != "") line += ",";

            line += "\"" + array[i][index] + "\"";
          }

          str += line + "\r\n";
        }

        return "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + str;
      }
    }
  }
};
</script>
<style scoped>
.manage-background {
  background-color: #e6e6e6;
  height: calc(100vh - 0px);
  position: relative;
  /*padding: 20px;*/
  /*padding-top: 40px;*/
  /*padding-top: 100px;
  padding-bottom: 40px;
  overflow-y: auto;*/
  /*display: flex;*/
  overflow-y: auto;
  width: 100%;
}

.manage-container {
  max-height: (100vh - 0px);
  overflow: auto;
  padding-top: 20px;
  padding-bottom: 10px;
  width: 100%;
}

.header {
  margin-bottom: 20px;
}

.title {
  font-weight: bold;
  font-size: 18px;
  color: #4d4d4d;
}

.sub-title {
  font-weight: normal;
  font-size: 15px;
  color: #4d4d4d;
  padding-left: 10px;
}

.new-btn {
  text-align: right;
}

.box {
  margin-bottom: 40px;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.csv {
  height: auto;
  width: 130px;
  background-color: #fff;
  padding: 10px;
  padding-top: 25px;
  padding-bottom: 25px;
  text-align: center;
  cursor: pointer;
  margin: 5px auto;
  margin-bottom: 15px;
  border: 1px solid #d9d9d9;
  -webkit-box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.2);
}

.csv .fa {
  font-size: 30px;
  color: #4f94c2;
}

.csv p {
  margin-bottom: 0;
  margin-top: 5px;
  font-size: 14px;
  color: #212529;
}

/*.menu-fixed {
  margin-bottom: 20px;
  text-align: right;
  position: fixed;
  top: 0;
  left: 0; 
  padding-right: 20px;
  width: 100%;
  background-color: #21252b;
  z-index: 10;
  border-bottom: 1px solid #ccc;
  height: 70px;
}*/

.menu-fixed p {
  position: absolute;
  top: 0;
  left: 0;
  padding: 18px;
  font-weight: bold;
  color: #f2f2f2;
}

.menu-fixed .title {
  width: 100%;
  text-align: center;
  color: #f2f2f2;
}

.menu-fixed .title p {
  position: relative;
}

.menu-fixed .fa {
  /*height: 40px;*/
  font-size: 30px;
  padding: 3px;
  color: #f2f2f2;
  cursor: pointer;
}

.title-panel p {
  color: #212529;
}

/** CSS MOBILE */
.manage-background.mobile {
  height: 100%;
  max-height: 100vh;
  width: 100%;
  padding: 0;
  padding-top: 0px;
  padding-bottom: 0px;
  margin: 0;
  overflow-y: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

.manage-background.mobile .manage-container {
  height: 100%;
  padding-top: 0;
  padding-bottom: 0;
}
.menu {
  margin-bottom: 20px;
  text-align: right;
  position: fixed;
  top: 0;
  left: 0;
  padding-right: 20px;
  width: 100%;
  background-color: #e6e6e6;
  z-index: 10;
  border-bottom: 1px solid #ccc;
}

.menu p {
  position: absolute;
  top: 0;
  left: 0;
  padding: 18px;
  font-weight: bold;
}

.menu .fa {
  height: 60px;
  font-size: 30px;
  padding: 3px;
  color: #4f94c2;
}

.border-box {
  /*background-color: transparent;*/
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 40px;
}

.csv p.btn-csv-download {
  background-color: #4f94c2;
  color: #fff;
  border-radius: 5px;
  font-weight: bold;
}
</style>


