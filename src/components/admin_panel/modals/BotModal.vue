<template>
  <b-modal
    :id="modalid"
    v-model="state"
    hide-footer
    :title="getModalTitle()"
  >
    <b-form
      v-if="showForm"
      ref="form"
      @submit="onSubmit"
      @reset="onReset"
    >
      <b-form-group label="Bot Name:">
        <b-form-input
          v-model.trim="form.name"
          required
          placeholder="Enter name"
        />
      </b-form-group>

      <b-form-group label="Server IP and port">
        <!--<b-input-group>
        <b-form-input id="input-2" v-model="form['api-url']" required placeholder="ip e.g. xxx.x.x.x:xxxx"></b-form-input>
        <template v-slot:append>
     <b-form-input id="input-2" v-model="form['api-url']" required placeholder="port e.g. xxxx"></b-form-input>
       
    </template>
        </b-input-group>-->

        <b-row>
          <b-col cols="8">
            <b-form-input
              v-model.trim="form.address.ip"
              required
              placeholder="ip e.g. xxx.x.x.x:xxxx"
            />
          </b-col>
          <b-col cols="4">
            <b-form-input
              id="input-2"
              v-model.trim="form.address.port"
              required
              placeholder="port e.g. xxxx"
            />
          </b-col>
        </b-row>
        <!-- <b-form-input id="input-2" v-model="form['api-url']" required placeholder="e.g. http://xxx.x.x.x:xxxx/api/bot-response"></b-form-input>-->
      </b-form-group>

      <b-form-group label="API Path">
        <b-form-input
          v-model="form.address.path"
          required
          placeholder="API path e.g. /getResponse/"
        />
      </b-form-group>

      <b-form-group>
        <!--<b-form-checkbox v-model="form.available">Available</b-form-checkbox>-->
        <!--<b-form-checkbox v-model="form.hidden">Hidden</b-form-checkbox>
        <b-form-checkbox v-model="form.hidden">Hidden</b-form-checkbox>-->
        <b-form-radio
          v-model="form.showTo"
          value="NONE"
        >
          Hidden
        </b-form-radio>
        <b-form-radio
          v-model="form.showTo"
          value="ADMIN"
        >
          Show only to admin
        </b-form-radio>
        <b-form-radio
          v-model="form.showTo"
          value="ALL"
        >
          Show to all users
        </b-form-radio>
      </b-form-group>

      <b-button
        class="save-button background-primary-color"
        type="submit"
      >
        Save Bot
      </b-button>
      <div
        v-if="msg_error"
        class="error-box"
      >
        <p>{{ msg_error }}</p>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import services from "@/config/services";
export default {
  name: "BotModal",
  props: {
    bot: {
      default: function() {
        return {};
      },
      type: Object
    }
  },
  data() {
    return {
      modalid: "modal-bot",
      state: false,
      showForm: true,
      form: this.getDefaultForm(),
      msg_error: null
    };
  },
  watch: {
    /*bot() {
      if (this.bot) {
        this.form = Object.assign({}, this.bot);
      } else {
        this.form = this.getDefaultForm();
      }
    }*/
  },
  /*computed: {
    form() {
      return this.bot || {
        name: "",
        // description: "",
        created: null,
        typing: false,
        hidden: false,
        "api-url": null,
        available: false
      }
    }
  },*/
  mounted() {
    this.$root.$on("bv::modal::show", (bvEvent, modalId) => {
      if (modalId == this.modalid) {
        if (this.bot) {
          this.form = Object.assign({}, this.bot);
        } else {
          this.form = this.getDefaultForm();
        }
      }
    });
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
    getModalTitle() {
      if (this.form.id) {
        return "Edit Bot";
      } else {
        return "Create new Bot";
      }
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.saveBot();
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
        showTo: "NONE",
        address: {
          ip: "",
          port: "",
          path: "/chatstop/bot_request/"
        }
      };
    },
    clearFormValues() {
      var api = this.form.address.path.trim();
      var start = 0;
      var end = api.length;

      if (api.charAt(start) == "/") {
        start++;
      }
      if (api.charAt(end - 1) == "/") {
        end--;
      }
      this.form.address.path = api.substring(start, end);
      this.form.address.ip = this.form.address.ip
        .replace("http://", "")
        .replace("https://", "");
    },
    saveBot() {
      this.clearFormValues();
      if (this.form.id) {
        this.saveEditedBot();
      } else {
        this.saveNewBot();
      }
    },
    saveNewBot() {
      var ctx = this;
      var data = {
        name: this.form.name,
        // description: "",
        address: this.form.address,
        showTo: this.form.showTo || "NONE",
        available: false
      };
      this.axios
        .post(services.CREATE_BOT, data)
        .then(response => {
          this.$emit("update");
          response.data;
          ctx.closeModal();
        })
        .catch(e => {
          this.msg_error = e.message;
        });
    },
    saveEditedBot() {
      var ctx = this;
      var data = this.form;
      var id = this.form.id;
      data.lastEdit = Date();
      var url = services.UPDATE_BOT;
      url = url.replace("{botId}", id);
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
