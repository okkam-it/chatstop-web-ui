const state = {
    selectedBot: null,
    adminPage: false
};

const actions = {
    setSelectedBot: (context, id) => {
        context.commit("selectBot", id);
    },
    setAdminPage: (context, id) => {
        context.commit("adminOpened", id);
    }
};

const getters = {
    selectedBot: state => state.selectedBot,
    adminPage: state => state.adminPage        
  };

const mutations = {
    selectBot(state, payload) {
        state.adminPage = false 
        state.selectedBot = payload
    },
    adminOpened(state, payload) {
        state.selectedBot = null
        state.adminPage = payload        
    }
};


export default {
    state,
    getters,
    actions,
    mutations
};