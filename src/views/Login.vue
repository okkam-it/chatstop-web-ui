<template>
  <div class="background">
    <div class="box box-login">
      <p>Log into ChatStop</p>
      <span @click="goToSignup()">Or Create Account</span>
      <!--<div v-if="status==='loading'">loading</div>-->
      <b-form ref="form_login" @submit="onSubmit" @reset="onReset" v-if="show" class="form-login">
        <b-form-group>
          <b-form-input
            id="username"
            v-model.trim="form_login.username"
            type="text"
            required
            placeholder="Username"
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input
            type="password"
            id="password"
            v-model.trim="form_login.password"
            required
            placeholder="Password"
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" class="login-button background-primary-color">Login</b-button>
        <div class="error-box" v-if="msg_error"><p>{{msg_error}}</p></div>
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
  name: "Login",
  data() {
    return {
      form_login: { username: "", password: "" },
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
  },
  watch: {
    error() {
      if(this.error && this.error.length) {
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
      this.login();
      // alert(JSON.stringify(this.form_login))

      // this.reset()
    },
    onReset(evt) {
      evt.preventDefault();
      this.form_login.username = "";
      this.form_login.password = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    login() {
      this.$store.dispatch("signInAction", this.form_login);
    },
    reset() {
      this.$refs.form_login.reset();
    },
    goToSignup() {
      this.$router.push({ name: 'Signup' }) 
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

.error-box p{
  font-size: 14px;
  margin-top:5px;
  color: #ff0000;
}
</style>
