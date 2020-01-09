<template>
  <b-modal v-model="state" hide-footer :title="getModalTitle()" :id="modalid">
    <b-form ref="form" @submit="onSubmit" @reset="onReset" v-if="showForm">
      <b-form-group label="Bot Name:">
        <b-form-input v-model.trim="form.name" required placeholder="Enter name"></b-form-input>
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
            <b-form-input v-model.trim="form.address.ip" required placeholder="ip e.g. xxx.x.x.x:xxxx"></b-form-input>
          </b-col>
          <b-col cols="4">
            <b-form-input
              id="input-2"
              v-model.trim="form.address.port"
              required
              placeholder="port e.g. xxxx"
            ></b-form-input>
          </b-col>
        </b-row>
        <!-- <b-form-input id="input-2" v-model="form['api-url']" required placeholder="e.g. http://xxx.x.x.x:xxxx/api/bot-response"></b-form-input>-->
      </b-form-group>

      <b-form-group label="API Address">
        <b-form-input
          v-model="form.address.api"
          required
          placeholder="API address e.g. /getResponse/"
        ></b-form-input>
      </b-form-group>

      <b-form-group>
        <!--<b-form-checkbox v-model="form.available">Available</b-form-checkbox>-->
        <!--<b-form-checkbox v-model="form.hidden">Hidden</b-form-checkbox>
        <b-form-checkbox v-model="form.hidden">Hidden</b-form-checkbox>-->
        <b-form-radio v-model="form.showTo" value="None">Hidden</b-form-radio>
        <b-form-radio v-model="form.showTo" value="Admin">Show only to admin</b-form-radio>
        <b-form-radio v-model="form.showTo" value="All">Show to all users</b-form-radio>
      </b-form-group>

      <b-button class="save-button background-primary-color" type="submit">Save Bot</b-button>
      <div class="error-box" v-if="msg_error">
        <p>{{msg_error}}</p>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import firebase from "../../../config/firebase";
export default {
  name: "BotModal",
  data() {
    return {
      modalid: "modal-bot",
      state: false,
      showForm: true,
      form: this.getDefaultForm(),
      msg_error: null
    };
  },
  props: {
    bot: {
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
        showTo: "None",
        address: {
          ip: "",
          port: "",
          api: "/chatstop/bot_request/"
        }
      };
    },
    clearFormValues() {
      var api = this.form.address.api.trim();
      var start = 0;
      var end = api.length;

      if (api.charAt(start) == "/") {
        start++;
      }
      if (api.charAt(end - 1) == "/") {
        end--;
      }
      this.form.address.api = api.substring(start, end);
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
        created: Date(),
        lastEdit: Date(),
        typing: false,
        showTo: this.form.showTo || "None",
        //"api-url": this.form["api-url"],
        address: this.form.address,
        available: false
      };

      let newData = firebase
        .database()
        .ref("bots")
        .push();
      newData.set(data, function(error) {
        if (error) {
          this.msg_error = error.message;
        } else {
          ctx.closeModal();
        }
      });
    },
    saveEditedBot() {
      var ctx = this;
      var data = this.form;
      var id = this.form.id;
      delete data.id;
      data.lastEdit = Date();
      firebase
        .database()
        .ref("bots/" + id)
        .set(data, function(error) {
          if (error) {
            this.msg_error = error.message;
          } else {
            ctx.closeModal();
          }
        });
    }
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
      //this.$refs.form.reset();
      //console.log(modalId + " -- " + this.modalid)
      if (modalId == this.modalid) {
        if (this.bot) {
          this.form = Object.assign({}, this.bot);
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
