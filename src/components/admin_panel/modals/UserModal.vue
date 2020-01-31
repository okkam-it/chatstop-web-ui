<template>
  <b-modal v-model="state" hide-footer title="Edit user" :id="modalid">
    <b-form ref="form" @submit="onSubmit" @reset="onReset" v-if="showForm">
      <b-form-group label="User account type:">
        <b-form-select v-model="form.admin" :options="options"></b-form-select>
      </b-form-group>

      <b-button class="save-button background-primary-color" type="submit">Save User</b-button>
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
      modalid: "modal-user",
      state: false,
      showForm: true,
      form: this.getDefaultForm(),
      msg_error: null,
      options: [
        { value: false, text: "User" },
        { value: true, text: "Admin" }
      ]
    };
  },
  props: {
    user: {
      type: Object
    }
  },
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
      this.saveUser();
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
        admin: false
      };
    },

    saveUser() {
      var ctx = this;
      var data = {
        admin: this.form.admin,
        username: this.user.username
      };

      var url = services.UPDATE_USER;
      url = url.replace("{userId}", this.user.id);
      this.axios
        .put(url, data)
        .then(function() {
          this.$emit("update");
          ctx.closeModal();
        })
        .catch(e => {
          this.msg_error = e.message;
        });
    }
  },
  watch: {
    user() {
      if (this.user) {
        this.form = Object.assign({}, this.user);
      } else {
        this.form = this.getDefaultForm();
      }
    }
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
        if (this.user) {
          this.form = Object.assign({}, this.user);
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
