import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueAxios from "vue-axios";
import axios from "axios";
import MixinMobileDetection from "@/mixins/mixinMobileDetection";


import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircle, faSearch, faPaperPlane, faUser, faSignOutAlt, faCogs, faCog, faEye, faEyeSlash, faTrash, faUserShield, faFileDownload, faArrowLeft, faRobot, faBars, faFileCsv, faArrowAltCircleDown, faComments, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import Multiselect from "vue-multiselect";

library.add(faCircle, faSearch, faPaperPlane, faUser, faSignOutAlt, faCogs, faCog, faEye, faEyeSlash, faTrash, faUserShield, faFileDownload, faArrowLeft, faRobot, faBars, faFileCsv, faArrowAltCircleDown, faComments, faEllipsisH);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("multiselect", Multiselect);

import clickOutsideDirective from "@/directives/click-outside.js";

Vue.directive("click-outside", clickOutsideDirective);

import BootstrapVue from "bootstrap-vue";
import VueChatScroll from "vue-chat-scroll";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(VueChatScroll);
Vue.use(VueAxios, axios);

Vue.mixin(MixinMobileDetection); 

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  //mixins: [MixinMobileDetection],
  render: h => h(App)
}).$mount("#app");
