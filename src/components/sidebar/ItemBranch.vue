<template>
  <div v-if="branch" class="branch-box">
    <p class="branch-name">{{branch.name}}</p>
    <item-bot v-for="bot in branch.bots" :key="bot" :botid="bot" :branch="branch.id" :searchstring="searchstring"/>
  </div>
</template>

<script>
import firebase from "@/config/firebase";
import ItemBot from "./ItemBot";
export default {
  name: "ItemBranch",
  components: {
    ItemBot
  },
  data() {
    return {
      branch: null
    };
  },
  props: {
    branchid: {
      type: String,
      required: true
    },
    searchstring: {
      type: String,
      required: true
    }
  },
  methods: {},
  watch: {},
  mounted() {
    firebase
      .database()
      .ref("branches")
      .child(this.branchid)
      .on("value", snapshot => {
        this.branch = snapshot.val();
        this.branch.id = snapshot.key
      });
  },
  computed: {}
};
</script>
<style scoped>
.branch-box {
  margin-bottom:20px;
}

.branch-name {
  font-weight: bold;
  margin-bottom: 6px;
}
</style>
