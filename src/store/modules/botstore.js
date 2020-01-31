const state = {
  selectedBot: null,
  selectedBranch: null,
  adminPage: false
};

const actions = {
  setSelectedBot: (context, id) => {
    context.commit("selectBot", id);
  },
  setSelectedBranch: (context, id) => {
    context.commit("selectBranch", id);
  },
  setAdminPage: (context, id) => {
    context.commit("adminOpened", id);
  }
};

const getters = {
  selectedBot: state => state.selectedBot,
  selectedBranch: state => state.selectedBranch,
  adminPage: state => state.adminPage
};

const mutations = {
  selectBot(state, payload) {
    state.adminPage = false;
    if (payload) {
      state.selectedBot = payload;
    } else {
      state.selectedBot = null;
    }

  },
  selectBranch(state, payload) {
    state.adminPage = false;
    state.selectedBranch = payload;
  },
  adminOpened(state, payload) {
    state.selectedBot = null;
    state.selectedBranch = null;
    state.adminPage = payload;
  }
};


export default {
  state,
  getters,
  actions,
  mutations
};