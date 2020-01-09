<template>
  <div id="app">
    <!--<div class="toolbar">
      <div class="toolbar-item">
        <p><b-img :src="logo" class="logo"/></p>
      </div>
      <div class="toolbar-item text-right" v-if="user">
        <p>
          <span>USERNAME</span>
          <span>
            <font-awesome-icon class="fa-signout" icon="sign-out-alt" />
          </span>
        </p>
      </div>
    </div>-->
    <div class="content" :class="{ 'mobile' : isMobile}">
      <sidebar v-if="user && !isLoading" key="sidebar" />
      <transition-group name="fade-long" class="full-width">
        <splash-screen v-if="isLoading" key="splash-screen"></splash-screen>
        <router-view key="router-view" class="router-view" />
      </transition-group>
    </div>
  </div>
</template>

<script>
import SplashScreen from "@/components/SplashScreen";
import Sidebar from "@/components/sidebar/Sidebar";

export default {
  name: "app",
  components: {
    SplashScreen,
    Sidebar
  },
  data() {
    return {
      isLoading: true,
      logo: require("@/assets/stop_logo_transparent.png"),
      height: 0
      /*window: {
        width: 0,
        height: 0
      }*/
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }    
  },
  watch: {
    user() {
      /*if (!this.isLoading) {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }*/
    }
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }    
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.full-width {
  width: 100%;
}

.toolbar {
  height: 60px;
  width: 100%;
  background-color: #16191d;
  border-bottom: 0.3px solid #e6e6e6;
  color: #f2f2f2;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
}

.toolbar p {
  line-height: 60px;
  margin-bottom: 0;
  font-weight: bold;
}

.toolbar .toolbar-item {
  display: inline-block;
  width: 50%;
  padding-left: 30px;
  padding-right: 30px;
}
.toolbar .toolbar-item.text-right {
  text-align: right;
}

.content {
  /*margin-top: 60px;*/
  display: flex;
  width: 100%;
}

.content.mobile {
  height: 100%;
}

.logo {
  height: 25px;
}
</style>

<style>
/** multiselect custom style */
.multiselect__tag {
  background: #4f94c2;
}

.multiselect__tag-icon {
  color: #373e48;
}

.multiselect__tag-icon:hover {
  background: #4f94c2;
}

.multiselect__tag-icon::after {
  color: #373e48;
}

.multiselect__option--highlight {
  background: #f9f9f9;
  color: #373e48;
}

.multiselect__option--selected {
  color: #4f94c2;
}

.multiselect__option--selected.multiselect__option--highlight {
  background: #f2f2f2;
  color: #4f94c2;
}
</style>



<style>
#app {
  background-color: #373e48;
  height: 100%;
}

.primary-color {
  color: #4f94c2 !important;
}

.background-primary-color {
  background-color: #4f94c2 !important;
}

.fade-long-enter-active,
.fade-long-leave-active {
  transition: opacity 0.4s;
}
.fade-long-enter, .fade-long-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #cccccc;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cccccc;
}
::-webkit-scrollbar-thumb:active {
  background: #cccccc;
}
::-webkit-scrollbar-track {
  background: transparent;
  border: 0px none #ffffff;
  border-radius: 0px;
}
::-webkit-scrollbar-track:hover {
  background: transparent;
}
::-webkit-scrollbar-track:active {
  background: transparent;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
