<template>
  <b-list-group-item>
    <b-row class="row">
      <b-col cols="12" lg="3">
        <span>{{bot.name}}</span>
      </b-col>
      <b-col cols="5" lg="2">
        <div class="bot-state">
          <span v-if="bot.available">
            <font-awesome-icon icon="circle" class="fa-bot available" />Online
          </span>
          <span v-else>
            <font-awesome-icon icon="circle" class="fa-bot" />Offline
          </span>
        </div>
      </b-col>
      <b-col cols="7" lg="2">
        <div class="bot-state">
          Showed to:
          <strong>{{bot.showTo}}</strong>
        </div>
      </b-col>
      <b-col cols="6" lg="2">
        <b-badge pill>{{convs}} conversations</b-badge>
      </b-col>
      <b-col cols="12" lg="3">
        <div class="bot-options">
          <!--<div>
        <font-awesome-icon class="fa" icon="eye-slash" v-if="bot.hidden" />
        <font-awesome-icon class="fa" icon="eye" v-else />
          </div>-->
          <div @click="editBot()">
            <font-awesome-icon class="fa" icon="cog" />
          </div>
          <div @click="deleteBot()" class="trash-box">
            <font-awesome-icon class="fa" icon="trash" />
          </div>
        </div>
      </b-col>
    </b-row>
  </b-list-group-item>
</template>

<script>
import firebase from "../../config/firebase";
export default {
  name: "ItemBot",
  data() {
    return {
      convs: 0
    };
  },
  props: {
    bot: {
      type: Object,
      required: true
    }
  },
  methods: {
    editBot() {
      this.$emit("editbot");
    },
    deleteBot() {
      this.$emit("deletebot");
    }
  },
  watch: {},
  computed: {
    
  },
  created() {
    var context = this;
    firebase
      .database()
      .ref("/chatrooms/" + this.bot.id)
      .on("value", snapshot => {
        if (snapshot.val()) {
          context.convs = snapshot.numChildren();
        }
      });
  }
};
</script>
<style scoped>
.hidden {
  background-color: #e2e2e2;
}

.bot-options {
  float: right;
}

.bot-options div {
  display: inline;
  text-align: center;
  cursor: pointer;
  padding: 10px;

  margin-right: 5px;
  margin-left: 5px;
  line-height: 30px;
  border-radius: 5px;
}

.bot-options div:hover {
  background-color: #e6e6e6;
}

.bot-options .fa {
  font-size: 18px;
  color: #4d4d4d;
}

.bot-state {
  color: #4d4d4d;
  font-size: 12px;
  line-height: 2;
}

.fa-bot {
  font-size: 12px;
  color: #cc6600;
  margin-right: 5px;
}

.fa-bot.available {
  color: #206020;
}

.row {
  width: 100%;
}

.trash-box:hover > .fa{
 color: #dc3545
}
</style>
