<template>
  <b-list-group-item :class="{disabled : user.uid == selectedUser.uid}">
    <b-row class="row">
      <b-col cols="8" lg="6">
        <span class="user-name">{{ user.username }}</span>
      </b-col>
      <b-col cols="4" lg="4">
        <b-badge v-if="user.admin" pill>
          <font-awesome-icon icon="user-shield" class="fa-admin available" />
          <strong>Admin</strong>
        </b-badge>
      </b-col>
      <b-col cols="12" lg="2">
        <div class="bot-options">
          <div v-if="user.uid != selectedUser.uid" @click="editUser(user)">
            <font-awesome-icon class="fa" icon="cog" />
          </div>
          <div v-if="user.uid != selectedUser.uid" class="trash-box" @click="deleteUser()">
            <font-awesome-icon class="fa" icon="trash" />
          </div>
        </div>
      </b-col>
    </b-row>
  </b-list-group-item>
</template>

<script>
export default {
  name: "ItemBot",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      convs: 0
    };
  },
  computed: {
    selectedUser() {
      return this.$store.getters.user;
    }
  },
  watch: {},
  created() {},
  methods: {
    editUser() {
      this.$emit("edituser");
    },
    deleteUser() {
      this.$emit("deleteuser");
    }
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

.trash-box:hover > .fa {
  color: #dc3545;
}
</style>
