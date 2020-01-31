<template>
  <b-modal
    v-if="alertvalues"
    v-model="state"
    :title="alertvalues.title"
  >
    <div>
      <b-alert
        variant="danger"
        show
      >
        {{ alertvalues.body }}
      </b-alert>
    </div>
    <template v-slot:modal-footer="{ ok, cancel }">
      <b-button
        variant="secondary"
        @click="cancel()"
      >
        {{ alertvalues.cancelText }}
      </b-button>
      <b-button
        variant="danger"
        @click="confirm()"
      >
        {{ alertvalues.confirmText }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: "AlertModal",
  props: {
    alertvalues: {
      default: function() {
        return [];
      },
      type: Object
    }
    /*bot: {
      type: Object
    }*/
  },
  data() {
    return {
      state: false
    };
  },
  watch: {},
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
  mounted() {},
  methods: {
    show() {
      this.state = true;
    },
    closeModal() {
      this.state = false;
    },
    confirm() {
      this.$emit("confirm");
      this.state = false;
    }
  }
};
</script>
<style scoped>
</style>
