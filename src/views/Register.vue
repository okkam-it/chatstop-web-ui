<template>
  <div class="background">
    <div class="box box-login">
      <p>Create a new ChatStop account</p>
      <span @click="goToLogin()">Or Login</span>
      <!--<div v-if="status==='loading'">loading</div>-->
      <b-form
        v-if="show"
        ref="form_signup"
        autocomplete="off"
        class="form-login"
        @submit="onSubmit"
        @reset="onReset"
      >
        <b-form-group>
          <b-form-input
            id="new-username"
            v-model.trim="form_signup.username"
            autocomplete="off"
            type="text"
            required
            placeholder="Username"
          />
        </b-form-group>
        <b-form-group>
          <b-form-input
            id="new-password"
            v-model.trim="form_signup.password"
            type="password"
            autocomplete="off"
            required
            placeholder="Password"
          />
        </b-form-group>
        <b-form-group>
          <b-form-input
            id="new-password"
            v-model.trim="form_signup.confirm_password"
            type="password"
            autocomplete="off"
            required
            placeholder="Password"
          />
        </b-form-group>
        <b-button type="submit" class="login-button background-primary-color">Sign up</b-button>
        <div v-if="msg_error" class="error-box">
          <p>{{ msg_error }}</p>
        </div>
      </b-form>
    </div>
  </div>
  <!--<b-row class="background">
    <b-col cols="12">      
      <b-jumbotron>
        <b-form @submit="onSubmit">
          <b-form-group>
            <b-form-input
              id="nickname"
              v-model.trim="login.nickname"
              placeholder="Enter your nickname"
            ></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary" :disabled="!login.nickname">Login</b-button>
        </b-form>
      </b-jumbotron>
    </b-col>
  </b-row>-->
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      form_signup: { username: "", password: "", confirm_password: "" },
      show: true,
      msg_error: null
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    },
    status() {
      return this.$store.getters.status;
    }
    /*passwordValidation() {
        return this.form_signup.password.length > 6 && this.form_signup.confirm_password.length>6 && this.form_signup.password === this.form_signup.confirm_password
      }*/
  },
  watch: {
    error() {
      if (this.error && this.error.length) {
        this.msg_error = this.error.replace("email address", "username");
      }
    }

    /*user (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/chat')
        }
      }*/
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();

      if (this.form_signup.password === this.form_signup.confirm_password) {
        this.signup();
      } else {
        this.msg_error = "Passwords don't match.";
      }

      // alert(JSON.stringify(this.form_login))

      // this.reset()
    },
    onReset(evt) {
      evt.preventDefault();
      this.form_signup.username = "";
      this.form_signup.password = "";
      this.form_signup.confirm_password = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    signup() {
      this.$store.dispatch("signUpAction", this.form_signup);
    },
    reset() {
      this.$refs.form_signup.reset();
    },
    goToLogin() {
      this.$router.push({ name: "Login" });
    }
  }
};
</script>
<style scoped>
.background {
  background-color: #373e48;
  height: calc(100vh - 0px);
  margin-left: 0;
  margin-right: 0;
}

.box {
  background-color: #f9f9f9;
  width: 500px;
  /*height: 600px;*/
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  padding: 3%;
  padding-bottom: calc(3% + 20px);
  position: absolute; /*it can be fixed too*/
  position: absolute;
  left: 50%;
  top: 45%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  margin: auto;

  /*this to solve "the content will not be cut when the window is smaller than the content": */
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  text-align: center;
}

.box-login p {
  font-size: 22px;
  margin-bottom: 2px;
}

.box-login span {
  font-size: 15px;
  text-decoration: underline;
  color: #808080;
  cursor: pointer;
}

.login-button {
  width: 100%;
}

.form-login {
  margin-top: 30px;
}

.error-box {
}

.error-box p {
  font-size: 14px;
  margin-top: 5px;
  color: #ff0000;
}
</style>
