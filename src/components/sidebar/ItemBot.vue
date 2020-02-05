<template>
  <div v-if="bot && showItem" class="box" :class="{ selected: isSelected}" @click="selectBot()">
    <!--<b-img class="bot-image background-primary-color" src="https://via.placeholder.com/150/4f94c2/ffffff?text=BOT" />-->
    <font-awesome-icon class="fa-bot-logo" icon="robot" />
    <div>
      <p class="bot-name">{{ bot.name }}</p>
      <span v-if="bot.available" class="bot-desc">
        <font-awesome-icon icon="circle" class="fa-bot available" />Online
      </span>
      <span v-else class="bot-desc">
        <font-awesome-icon icon="circle" class="fa-bot" />Offline
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemBot",
  props: {
    bot: {
      type: Object,
      required: true
    },
    branch: {
      type: Object,
      required: true
    },
    searchstring: {
      type: String,
      required: true
    }
    /*selectedBot: {
      type: String      
    }*/
  },
  data() {
    return {
      bot_image: require("@/assets/marker.png")
    };
  },
  computed: {
    isSelected() {
      var sbot = this.$store.getters.selectedBot;
      var sbranch = this.$store.getters.selectedBranch;
      if (
        sbot &&
        sbot.id === this.bot.id &&
        sbranch &&
        sbranch.id === this.branch.id
      ) {
        return true;
      }
      return false;
    },
    showItem() {
      var bot = this.bot;
      var s = this.searchstring;
      if (s.length && !bot.name.toLowerCase().includes(s.toLowerCase())) {
        return false;
      }

      if (bot.showTo == "None") {
        return false;
      } else if (bot.showTo == "Admin") {
        if (this.$store.getters.user.admin) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  },
  watch: {},
  created() {},
  methods: {
    selectBot() {
      if (this.bot.available) {
        this.$store.dispatch("setSelectedBot", this.bot);
        this.$store.dispatch("setSelectedBranch", this.branch);
      } else {
        alert("Bot unavailable!");
      }
    }
  }
  /*created() {
    this.$store.watch(
      state => {
        return state.botStore.selectedBot; // could also put a Getter here
      },
      (newValue) => {       
        if(newValue == this.bot.id) {
          setSelected(true)
        }
         setSelected()      
      }
    );
  }*/
};
</script>
<style scoped>
.box {
  display: flex;
  align-items: center;
  padding: 10px;
  /*background-color: rgba(27, 30, 35, 1);*/
  background-color: #21252b;
  cursor: pointer;
}

.box.selected {
  background-color: #373e48;
}

.box:hover {
  /*background-color: #21252b;*/
  background-color: #2c313a;
}
.background {
  background-color: #2c313a;
  color: rgba(255, 255, 255, 0.8);
  width: 100%;
  height: 100%;
}
.bot-image {
  border-radius: 50%;
  width: 50px;
  background: #fff;
  margin-right: 15px;
}
.bot-name {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: -5px;
  margin-left: 20px;
}
.bot-desc {
  font-size: 11px;
  margin-left: 20px;
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

.fa-bot-logo {
  font-size: 45px;
  color: #f2f2f2;
  background-color: #4f94c2;
  padding: 10px;
  padding-top: 6px;
  border-radius: 100%;
  height: 50px;
  width: 50px;
}
</style>
