<template>
  <div class="box" @click="selectBot()" :class="{ selected: isSelected}" v-if="bot && showItem">
    <!--<b-img class="bot-image background-primary-color" src="https://via.placeholder.com/150/4f94c2/ffffff?text=BOT" />-->
    <font-awesome-icon class="fa-bot-logo" icon="robot"/>
    <div>
      <p class="bot-name">{{bot.name}}</p>
      <span class="bot-desc" v-if="bot.available">
        <font-awesome-icon icon="circle" class="fa-bot available" />Online
      </span> 
      <span class="bot-desc" v-else>
        <font-awesome-icon icon="circle" class="fa-bot" />Offline
      </span>
    </div>
  </div>
</template>

<script>
import firebase from "@/config/firebase";
export default {
  name: "ItemBot",
  data() {
    return {
      bot: null,   
      bot_image: require("@/assets/marker.png"),
      
    };
  },
  props: {
    botid: {
      type: String,
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
  created() {
    firebase
      .database()
      .ref("bots")
      .child(this.botid)
      .on("value", snapshot => {
        var id = snapshot.key
        this.bot = snapshot.val();
        this.bot.id = id;
      });
  },
  methods: {
    
    selectBot() {   
      if(this.bot.available) {
        this.$store.dispatch("setSelectedBot", this.bot);
      } else {
        alert("Bot unavailable!")
      }
      
    },
    
  }, 
  watch: {
    
  },
  computed: {
    isSelected () {
      var s = this.$store.getters.selectedBot
      if(s && s.id == this.botid) {
          return true 
      }
      return false
    },
    showItem() {
      var bot = this.bot;

      var s = this.searchstring;

      if(s.length && !bot.name.toLowerCase().includes(s.toLowerCase())) {
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

.fa-bot.available{
  font-size: 8px;
  color: #206020;
  
}

.fa-bot-logo {
  font-size: 45px;
  color: #f2f2f2;
  background-color: #4f94c2;
  padding:10px;
  padding-top: 6px;
  border-radius: 100%;
  height: 50px;
  width: 50px;
}
</style>
