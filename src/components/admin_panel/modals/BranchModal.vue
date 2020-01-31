<template>
  <b-modal v-model="state" hide-footer :title="getModalTitle()" :id="modalid">
    <b-form ref="form" @submit="onSubmit" @reset="onReset" v-if="showForm">
      <b-form-group label="User account type:">
        <b-form-input v-model.trim="form.name" required placeholder="Enter name"></b-form-input>
      </b-form-group>
      <b-form-group label="Select bots:">
        <multiselect
          :multiple="true"
          v-model="form.bots"
          :options="bots"
          :close-on-select="true"
          label="name"
          track-by="id"
          :hide-selected="true"
          :show-labels="false"
        ></multiselect>
      </b-form-group>

      <b-button class="save-button background-primary-color" type="submit">Save Branch</b-button>
      <div class="error-box" v-if="msg_error">
        <p>{{msg_error}}</p>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import services from "@/config/services";
export default {
  name: "UserModal",
  data() {
    return {
      modalid: "modal-branch",
      state: false,
      showForm: true,
      form: this.getDefaultForm(),
      msg_error: null
    };
  },
  props: {
    branch: {
      type: Object
    },
    bots: {
      type: Array
    }
  },
  methods: {
    getModalTitle() {
      if (this.form.id) {
        return "Edit Branch";
      } else {
        return "Create new Branch";
      }
    },
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
      this.saveBranch();
    },
    saveBranch() {
      if (this.form.id) {
        this.saveEditedBranch();
      } else {
        this.saveNewBranch();
      }
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form = this.getDefaultForm();
      // Trick to reset/clear native browser form validation state
      this.showForm = false;
      this.$nextTick(() => {
        this.showForm = true;
      });
    },
    resetForm() {
      this.$refs.form.reset();
    },
    getDefaultForm() {
      return {
        name: "",
        bots: []
      };
    },

    saveNewBranch() {
      var ctx = this;

      var data = {
        name: this.form.name,
        bots: this.form.bots.map(a => a.id),
        created: Date(),
        lastEdit: Date()
        // code: this.generateInvitationCode()
      };
      this.axios
        .post(services.CREATE_BRANCH, data)
        .then(response => {
          this.$emit("update");
          response.data;
          ctx.closeModal();
        })
        .catch(e => {
          this.msg_error = e.message;
        });
    },

    saveEditedBranch() {
      var ctx = this;
      var data = this.form;
      data.bots = this.form.bots.map(a => a.id);
      data.lastEdit = Date();
      var id = this.form.id;
      var url = services.UPDATE_BRANCH;
      url = url.replace("{branchId}", id);
      this.axios
        .put(url, data)
        .then(response => {
          this.$emit("update");
          response.data;
          ctx.closeModal();
        })
        .catch(e => {
          this.msg_error = e.message;
        });
    }
  },
  watch: {
    /*user() {
      if (this.branch) {
        this.form = Object.assign({}, this.branch);
      } else {
        this.form = this.getDefaultForm();
      }
    }   */
  },
  /*computed: {
    selectedOptionUserType() {
      var f = this.form;
      console.log(JSON.stringify(f))
      if (f.admin) {
        return this.options[1].value;
      } else {
        return this.options[0].value;
      }
    }
  },*/
  mounted() {
    this.$root.$on("bv::modal::show", (bvEvent, modalId) => {
      if (modalId == this.modalid) {
        if (this.branch) {
          this.form = Object.assign({}, this.branch);
          var botsobj = [];
          var ctx = this;
          this.form.bots.forEach(bot => {
            var b = ctx.bots.find(obj => {
              return obj.id === bot;
            });
            if (b) {
              botsobj.push(b);
            }
          });
          this.form.bots = botsobj;
        } else {
          this.form = this.getDefaultForm();
        }
      }
    });
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
