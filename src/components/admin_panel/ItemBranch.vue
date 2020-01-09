<template>
  <b-list-group-item>
    <b-row class="row">
      <b-col cols="8" lg="3">
        <span class="user-name">{{branch.name}}</span>
      </b-col>
      <b-col cols="4" lg="4" >
           
          <strong class="branch-code">{{branch.id}}</strong>
       
      </b-col>
      <b-col cols="4" lg="3" >
        <b-badge pill>
          <font-awesome-icon icon="user" class="fa-admin available" />
          <strong>{{users}} users</strong>
        </b-badge>
      </b-col>
      <b-col cols="12" lg="2">
        <div class="bot-options">
          <div>
            <font-awesome-icon class="fa" icon="cog" @click="editBranch()"/>
          </div>
          <div class="trash-box">
            <font-awesome-icon class="fa" icon="trash" @click="deleteBranch()"/>
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
      users: 0
    };
  },
  props: {
    branch: {
      type: Object,
      required: true
    }
  },
  methods: {
    editBranch() {
      this.$emit("editbranch");
    },
    deleteBranch() {
      this.$emit("deletebranch");
    }
  },
  watch: {},
  computed: {
    /*selectedUser() {
      return this.$store.getters.user;
    }*/
  },
  created() {
    //var context = this;
    firebase
      .database()
      .ref("/users/")
      .on("value", snapshot => {
        var count = 0;
        snapshot.forEach((child) => {
          var val = child.val()          
          if(val.branches && val.branches.includes(this.branch.id)) {
            count++;
          }          
        }); 
        this.users = count;       
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
}

.fa-admin {
  font-size: 12px;
  color: #fff;
  margin-right: 5px;
}

.user-name { 
}

.row {
  width: 100%;
}

.trash-box:hover > .fa{
 color: #dc3545
}

.branch-code {
    color: #4f94c2;
}
</style>