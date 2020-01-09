<template>
  <b-modal v-model="state" hide-footer title="Add an invitation code" :id="modalid">
    <b-form ref="form" @submit="onSubmit" @reset="onReset" v-if="showForm">
      <b-form-group>
        <b-form-input v-model.trim="code" required placeholder="Enter code"></b-form-input>
      </b-form-group>

      <b-button class="save-button background-primary-color" type="submit">Add Code</b-button>
      <div class="error-box" v-if="msg_error">
        <p>{{msg_error}}</p>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import firebase from "../../../config/firebase";
export default {
  name: "BranchCodeModal",
  data() {
    return {
      modalid: "modal-add-branch",
      state: false,
      showForm: true,
      msg_error: null,
      code: null
    };
  },
  props: {},
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
      if (branch_code) {
        var branches_ref = firebase
          .database()
          .ref("branches")
          .child(this.code);

        var branch_snap = await branches_ref.once("value");

        if (branch_snap.val()) {
          var user_ref = firebase
            .database()
            .ref("users")
            .child(this.$store.getters.user.uid)
            .child("branches");
          var user_branches_snap = await user_ref.once("value");
          var list = user_branches_snap.val();
          if (!list) {
            list = [];
          }
          
          if(list.includes(this.code)) {
            return "This code already exists."
          }

          list.push(branch_code);
          var res = user_ref.set(list);
          if(res) {
            return null;
          } else {
            return "Error";
          }
          
        } else {
          return "Invalid code"
        }
      } else {
        return "Invalid code"
      }           
    }    
  },
  watch: {},

  mounted() {}
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
