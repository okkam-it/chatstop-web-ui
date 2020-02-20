<template>
  <b-modal :id="modalid" v-model="state" hide-footer title="Add an invitation code">
    <b-form v-if="showForm" ref="form" @submit="onSubmit" @reset="onReset">
      <b-form-group>
        <b-form-input v-model.trim="code" required placeholder="Enter code" />
      </b-form-group>

      <b-button class="save-button background-primary-color" type="submit">Add Code</b-button>
      <div v-if="msg_error" class="error-box">
        <p>{{ msg_error }}</p>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import services from "@/config/services";
export default {
  name: "BranchCodeModal",
  props: {},
  data() {
    return {
      modalid: "modal-add-branch",
      state: false,
      showForm: true,
      msg_error: null,
      code: null
    };
  },
  watch: {},

  mounted() {},
  methods: {
    show() {
      this.state = true;
    },
    closeModal() {
      this.msg_error = null;
      this.resetForm();
      this.$nextTick(() => {
        this.state = false;
      });
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.addBranch().then(res => {
        if (!res) {
          this.$emit("update-branches");
          this.closeModal();
        } else {
          this.msg_error = res;
        }
      });
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      //this.form = this.getDefaultForm();
      this.code = null;
      // Trick to reset/clear native browser form validation state
      this.showForm = false;
      this.$nextTick(() => {
        this.showForm = true;
      });
    },
    resetForm() {
      this.$refs.form.reset();
    },
    async addBranch() {
      var branch_code = this.code;
      // alert(JSON.stringify(this.$store.getters.user));
      var userid = this.$store.getters.user.uid;
      var url = services.ADD_BRANCH_TO_USER;
      url = url.replace("{userId}", userid) + branch_code;
      if (branch_code) {
        this.axios
          .post(url)
          .then(function() {})
          .catch(e => {
            console.log(e);
          });
      } else {
        return "Invalid code";
      }
    }
  }
};
</script>
<style scoped>
.error-box {
}

.error-box p {
  font-size: 14px;
  margin-top: 5px;
  color: #ff0000;
}

.save-button {
  width: 100%;
}
</style>
