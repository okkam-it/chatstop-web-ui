<template>
  <b-list-group-item>
    <b-row class="row">
      <b-col cols="8" lg="3">
        <span class="user-name">{{ branch.name }}</span>
      </b-col>
      <b-col cols="4" lg="4">
        <strong class="branch-code">{{ branch.code }}</strong>
      </b-col>
      <b-col cols="4" lg="3">
        <b-badge pill>
          <font-awesome-icon icon="user" class="fa-admin available" />
          <strong>{{ users }} users</strong>
        </b-badge>
      </b-col>
      <b-col cols="12" lg="2">
        <div class="bot-options">
          <div>
            <font-awesome-icon class="fa" icon="cog" @click="editBranch()" />
          </div>
          <div class="trash-box">
            <font-awesome-icon class="fa" icon="trash" @click="deleteBranch()" />
          </div>
        </div>
      </b-col>
    </b-row>
  </b-list-group-item>
</template>

<script>
import services from "@/config/services";
export default {
  name: "ItemBranch",
  props: {
    branch: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      users: 0
    };
  },
  computed: {
    /*selectedUser() {
      return this.$store.getters.user;
    }*/
  },
  watch: {},
  created() {
    //var context = this;
    var url = services.FIND_USERS_BY_BRANCH;
    url = url.replace("{branchId}", this.branch.id);
    this.axios.get(url).then(response => {
      this.users = response.data.length;
    });
  },
  methods: {
    editBranch() {
      this.$emit("editbranch");
    },
    deleteBranch() {
      this.$emit("deletebranch");
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

.branch-code {
  color: #4f94c2;
}
</style>