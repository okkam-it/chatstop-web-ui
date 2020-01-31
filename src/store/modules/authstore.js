import firebase from "@/config/firebase";
import services from "@/config/services";
import axios from "axios";
const state = {
  user: null,
  status: null,
  error: null
};

function createUser(uid, username, email) {
  var data = {
    uid: uid,
    username: username,
    email: email,
    // TODO: set it to false
    admin: true
  };
  return data;
}

const actions = {
  setUser({ commit }, payload) {
    commit("setUser", payload);
  },
  setError({ commit }, payload) {
    commit("setError", payload);
  },
  setStatus({ commit }, payload) {
    commit("setStatus", payload);
  },

  signUpAction({ commit, dispatch }, payload) {
    commit("setStatus", "loading");
    var email = payload.username + "@fakemail.ie";
    firebase.auth().createUserWithEmailAndPassword(email, payload.password)
      .then((response) => {
        // create user in stop DB
        let user = createUser(response.user.uid, payload.username, email);
        dispatch("createDbUserIfNotFound", user);
      })
      .catch((error) => {
        commit("setStatus", "failure");
        commit("setError", error.message);
      });
  },

  signInAction: ({ commit, dispatch }, payload) => {
    commit("setStatus", "loading");
    var email = payload.username + "@fakemail.ie";
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION) //with LOCAL will be persisted even when the browser window is closed
      .then(function() {
        return firebase.auth().signInWithEmailAndPassword(email, payload.password)
          .then((response) => {
            let user = createUser(response.user.uid, payload.username, email);
            dispatch("createDbUserIfNotFound", user);
          });
      })
      .catch((error) => {
        commit("setStatus", "failure");
        commit("setError", error.message);
      })
      .catch(function(error) {
        // Handle Errors here.
        commit("setStatus", "failure");
        commit("setError", error.message);
      });

  },
  /* eslint-disable */
    signOutAction({ commit }) {
        firebase.auth().signOut()
            .then((response) => {
                commit('setUser', null)
                commit('setStatus', 'success')
                commit('setError', null)
            })
            .catch((error) => {
                commit('setStatus', 'failure')
                commit('setError', error.message)
            })
    },
    createDbUserIfNotFound({ commit }, user_data) {
        axios.post(services.CREATE_USER, user_data)
            .then(response => {
                commit('setStatus', 'success')
                commit('setError', null)
                return response;
            })
            .catch(error => {
                commit('setStatus', 'failure')
                commit('setError', error.message)
            });
    }
    /* eslint-enable */
};

const getters = {
  status(state) {
    return state.status;
  },

  user(state) {
    return state.user;
  },

  error(state) {
    return state.error;
  }
};

const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },

  removeUser(state) {
    state.user = null;
  },

  setStatus(state, payload) {
    state.status = payload;
  },

  setError(state, payload) {
    state.error = payload;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
