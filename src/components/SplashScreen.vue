<template>
  <div class="splash-screen" :class="{'mobile':isMobile}">
    <div>
      <b-img class="logo" alt="stop_logo" :src="logo"></b-img>
      <p class="title" :class="{'mobile':isMobile}">
        <strong>ST</strong><span>op </span>
        <strong>O</strong><span>besity </span>
        <strong>P</strong><span>latform</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SplashScreen",
  data() {
    return {
      logo: require("@/assets/stop_logo_transparent.png")
    };
  },
  props: {},
  methods: {   
  },
  watch: {},
  computed: {}
};
</script>
<style scoped>
.splash-screen {
  width: 100%;
  height: 100vh;
  background-color: #373e48;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f2f2f2;
  font-size: 30px;
  text-align: center;
}

.logo {
  width: 120px;
  margin-bottom: 10px;
}

.title {
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: .15em solid orange; /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: .15em; /* 15em */
  animation: 
    typing 2.0s steps(40, end),
    blink-caret .75s step-end infinite;
}

/* The typing effect */
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: orange; }
}


/** CSS MOBILE */

.title.mobile {
  letter-spacing: .02em;
}

.splash-screen.mobile {
  height: 100%;
}
</style>
