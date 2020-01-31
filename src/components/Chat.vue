<template>
  <div
    class="chat-background"
    :class="{ 'mobile' : isMobile}"
  >
    <div class="chat-header">
      <b-row>
        <b-col
          v-if="isMobile"
          cols="2"
          @click="openSidebarBots()"
        >
          <div class="menu">
            <font-awesome-icon
              class="fa"
              icon="bars"
            />
          </div>
        </b-col>
        <b-col cols="10">
          <p>
            {{ bot.name }}
            <span
              v-if="bot.available"
              class="bot-desc"
            >
              <font-awesome-icon
                icon="circle"
                class="fa-bot available"
              />Online
            </span>
          </p>
        </b-col>
      </b-row>
    </div>

    <div
      v-if="chats.length"
      ref="chatbox"
      v-chat-scroll="{always: false, smooth: false, scrollonremoved:true, smoothonremoved: false}"
      class="chat-box"
      @scroll="onScroll"
    >
      <transition name="fade">
        <b-list-group>
          <b-list-group-item
            v-for="(chat, index) in chats"
            :key="index"
            class="chat-item"
          >
            <!--<div class="chat-status text-center" v-if="chat.type==='join'||chat.type==='exit'">
              <span class="chat-date">{{chat.sendDate}}</span>
              <span class="chat-content-center">{{chat.message}}</span>
            </div>-->
            <!--<div v-else>-->
            <div>
              <div
                v-if="index == 0 || new Date(chat.sendDate).getDay() != new Date(chats[index-1].sendDate).getDay()"
                class="tag-date"
              >
                <p>
                  <span>{{ new Date(chat.sendDate).toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                </p>
              </div>
              <div
                v-if="chat.user === user.username"
                class="chat-message text-right"
              >
                <div class="bubble right-bubble">
                  <p text-wrap>
                    {{ chat.message }}
                  </p>
                  <div class="msg-date">
                    <span>{{ new Date(chat.sendDate).getHours() + ":" + String(new Date(chat.sendDate).getMinutes()).padStart(2, "0") }}</span>
                  </div>
                </div>
              </div>
              <div
                v-if="chat.user !== user.username"
                class="chat-message text-left"
                text-left
              >
                <div class="bubble left-bubble">
                  <p text-wrap>
                    {{ chat.message }}
                  </p>
                  <div class="msg-date">
                    <span>{{ new Date(chat.sendDate).getHours() + ":" + String(new Date(chat.sendDate).getMinutes()).padStart(2, "0") }}</span>
                  </div>
                </div>
              </div>
            </div>
          </b-list-group-item>
          <transition name="fade">
            <b-list-group-item
              v-if="isTyping"
              key="loading"
              class="chat-item chat-item-typing"
            >
              <div
                class="chat-message chat-message-typing text-left"
                text-left
              >
                <div class="bubble left-bubble">
                  <div id="wave">
                    <span class="dot" />
                    <span class="dot" />
                    <span class="dot" />
                  </div>
                </div>
              </div>
            </b-list-group-item>
          </transition>
        </b-list-group>
      </transition>
    </div>
    <div
      v-else
      class="chat-box"
    >
      <p class="no-chats">
        <span>No conversation was found with this bot. Start writing now!</span>
      </p>
    </div>
    <footer class="chat-footer">
      <b-form
        autocomplete="off"
        @submit="onSubmit"
      >
        <b-input-group>
          <b-form-input
            id="message"
            ref="input_message"
            v-model.trim="data.message"
            class="send-input"
            :disabled="!bot.available"
            placeholder="Enter your message"
          />
          <b-button
            type="submit"
            :disabled="!bot.available"
            class="send-button"
          >
            <font-awesome-icon icon="paper-plane" />
          </b-button>
        </b-input-group>
      </b-form>
    </footer>
  </div>
</template>

<script>
import services from "@/config/services";
export default {
  name: "AddBoard",
  props: {
    stompClient: {
      type: Object,
      required: true
    },
    bot: {
      type: Object,
      required: true
    },
    branch: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      data: { type: "", username: "", message: "" },
      chats: [],
      errors: [],
      subscription: null,
      offStatus: false,
      isTyping: false,
      limit: 15,
      last_scroll_top: 0,
      //last_scroll_height: 0,
      last_x: 0,
      chatroom: {},
      loading: false
    };
  },
  watch: {
    // whenever question changes, this function will run
    bot: function(newBot, oldBot) {
      if (newBot.id !== oldBot.id) {
        this.loadChatRoom();
      }
    },
    branch: function(newBranch, oldBranch) {
      if (newBranch.id !== oldBranch.id) {
        this.loadChatRoom();
      }
    }
  },
  created() {
    this.loadChatRoom();
  },
  methods: {
    onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop < 15 && this.last_scroll_top > 15) {
        if (!this.loading) {
          this.limit += 10;
          this.loadmore();
        }
      }
      this.last_x = scrollHeight - clientHeight;
      this.last_scroll_top = scrollTop;
    },
    loadmore() {
      if (!this.loading) {
        this.loading = true;
        this.loadChats(true);
      }
    },
    setLastScrollPos() {
      var s =
        this.$refs.chatbox.scrollHeight -
        this.$refs.chatbox.clientHeight -
        this.last_x;
      this.$refs.chatbox.scrollTop = s;
    },
    loadChatRoom() {
      this.subscribeChatRoom();
      var url = services.FIND_CHATROOM;
      url = url
        .replace("{userId}", this.user.id)
        .replace("{branchId}", this.branch.id)
        .replace("{botId}", this.bot.id);
      this.axios
        .get(url)
        .then(response => {
          if (response.data === null || response.data === "") {
            this.createChatRoom();
          } else {
            this.chatroom = response.data;
            this.loadChats(false);
          }
        })
        .catch(e => {
          this.msg_error = e.message;
        });
    },
    loadChats(loadMore) {
      var url = services.FIND_ALL_CHATS;
      url = url.replace("{chatRoomId}", this.chatroom.id);
      this.axios
        .get(url + this.limit)
        .then(response => {
          this.chats = response.data;
          if (loadMore) {
            this.loading = false;
            this.$nextTick(() => {
              this.setLastScrollPos();
            });
          }
        })
        .catch(e => {
          this.msg_error = e.message;
        });
    },
    createChatRoom() {
      let data = {
        botId: this.bot.id,
        branchId: this.branch.id,
        userId: this.user.id
      };
      this.axios
        .post(services.CREATE_CHATROOM, data)
        .then(response => {
          this.chatroom = response.data;
          this.loadChats(false);
        })
        .catch(e => {
          this.msg_error = e.message;
        });
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.bot.available && this.data.message && this.data.message.length) {
        let data = {
          chatRoomId: this.chatroom.id,
          type: "newmsg",
          user: this.user.username,
          message: this.data.message
        };
        this.stompClient.send(
          "/app/bot/request/" + this.chatroom.id,
          JSON.stringify(data),
          {}
        );
        data.sendDate = new Date();
        this.chats.push(data);
        this.isTyping = true;
        this.data.message = "";
      }
      this.$nextTick(() => this.$refs.input_message.focus());
    },
    openSidebarBots() {
      this.$store.dispatch("setSelectedBot", null);
    },
    subscribeChatRoom() {
      // unsubscribe older connections, if found
      this.unsubscribe();
      this.subscription = this.stompClient.subscribe("/bot/response", tick => {
        this.isTyping = false;
        this.chats.push(JSON.parse(tick.body));
      });
    },
    unsubscribe() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  }
};
</script>
<style scoped>
.chat-background {
  background-color: #e6e6e6;
  height: calc(100vh - 0px);
  position: relative;
}

.chat-header {
  padding: 20px;
  height: 70px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  border-bottom-style: solid;
}

.chat-header p {
  margin-bottom: 0;
  font-size: 19px;
  font-weight: bold;
}

.chat-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #fff;
  width: 100%;
}

.chat-sended {
  background-color: #53c653;
}

.chat-box {
  overflow: auto;
  height: calc(100% - 70px - 60px);
  position: relative;
}

.chat-box .list-group {
  padding-top: 0;
  padding-bottom: 20px;
}

.chat-box p.no-chats {
  text-align: center;
  margin-top: 60px;
}

.chat-box p.no-chats span {
  padding: 20px;
  background-color: #f2f2f2;
  text-align: center;
  border-radius: 10px;
  color: #1a1a1a;
}

.list-group-item.chat-item {
  border: none;
  background-color: transparent;
  height: 100%;
}

.list-group-item.chat-item.chat-item-typing {
  height: 100px;
}

.chat-message {
  margin-top: 10px;
}

.chat-message.chat-message-typing {
  margin-top: 0;
}

.chat-message p {
  margin-bottom: 0;
  color: #1a1a1a;
}

.chat-message .bubble {
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  border-radius: 10px;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  min-width: 50px;
  text-align: left;
  max-width: 65%;
  -webkit-box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.2);
}

.chat-message .bubble.right-bubble {
  float: right;
  /*background-color: #c6ecc6;*/
  background-color: #c6dceb;
}
.chat-message .bubble.left-bubble {
  float: left;
  background-color: #f9f9f9;
}

.msg-date {
  text-align: right;
  font-size: 11px;
  color: #808080;
  margin-bottom: -2px;
}

.tag-date {
  text-align: center;
}

.tag-date p {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #d9d9d9;
  line-height: 0.1em;
  margin: 10px 0 20px;
  color: #808080;
  font-size: 14px;
}

.tag-date span {
  background: #e6e6e6;
  padding: 0 10px;
}

div#wave {
  position: relative;
  text-align: center;
  margin: 0 auto;
  width: 40px;
  height: 20px;
  margin-left: 0;
  margin-right: 0;
  margin-top: 3px;
}
div#wave .dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 3px;
  background: #808080;
  animation: wave 1.3s linear infinite;
}
div#wave .dot:nth-child(2) {
  animation-delay: -1.1s;
}

div#wave .dot:nth-child(3) {
  animation-delay: -0.9s;
}

@keyframes wave {
  0%,
  60%,
  100% {
    transform: initial;
  }

  30% {
    transform: translateY(-15px);
  }
}

.bot-desc {
  font-size: 11px;
  font-weight: normal;
  margin-left: 15px;
}

.fa-bot {
  font-size: 6px;
  color: #cc6600;
  margin-right: 5px;
}

.fa-bot.available {
  font-size: 8px;
  color: #206020;
}

/** CSS MOBILE */

.chat-background.mobile {
  background-color: #e6e6e6;
  /*height: calc(100vh - 60px);*/
  /*height: calc(100vh - 55px);*/
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

.menu {
}

.menu .fa {
  font-size: 30px;
  padding: 3px;
  color: #4f94c2;
}
</style>

<style>
.chat-background .send-button {
  background-color: #ffffff;
  border: none;
  /*color: #2d862d;*/
  color: #4f94c2;
  cursor: pointer;
  width: 60px;
  font-size: 20px;
  border-left-width: 1px;
  border-left-color: #e6e6e6;
  border-left-style: solid;
  border-radius: 0;
  margin-right: 4px;
}

.chat-background .send-button:hover {
  background-color: #f2f2f2;
  color: #4f94c2;
  font-size: 20px;
  border-left-width: 1px;
  border-left-color: #e6e6e6;
  border-left-style: solid;
  border-radius: 0;
}

.chat-background .send-input {
  background-color: #fff;
  border: none;
  color: #111;
  height: 60px;
}

.chat-background .send-input:focus {
  color: #111;
}
</style>
