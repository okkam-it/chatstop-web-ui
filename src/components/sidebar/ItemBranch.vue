<template>
  <div
    v-if="branch"
    class="branch-box"
  >
    <p class="branch-name">
      {{ branch.name }}
    </p>
    <item-bot
      v-for="bot in bots"
      :key="bot.id"
      :bot="bot"
      :branch="branch"
      :searchstring="searchstring"
    />
  </div>
</template>

<script>
import services from "@/config/services";
import ItemBot from "./ItemBot";
export default {
  name: "ItemBranch",
  components: {
    ItemBot
  },
  props: {
    branch: {
      type: Object,
      required: true
    },
    searchstring: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      bots: []
    };
  },
  computed: {},
  watch: {
    branch: function() {
      this.loadBranchBots();
      // console.log("Branch updated " + newBranch + " " + oldBranch);
    }
  },
  mounted() {
    this.loadBranchBots();
  },
  methods: {
    loadBranchBots() {
      var url = services.FIND_BOTS_BY_BRANCH;
      url = url.replace("{branchId}", this.branch.id);
      this.axios
        .get(url)
        .then(response => {
          this.bots = response.data;
        })
        .catch(e => {
          this.msg_error = e.message;
        });
    }
  }
};
</script>
<style scoped>
.branch-box {
  margin-bottom: 20px;
}

.branch-name {
  font-weight: bold;
  margin-bottom: 6px;
}
</style>
