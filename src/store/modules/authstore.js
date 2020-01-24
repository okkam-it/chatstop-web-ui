import firebase from '@/config/firebase'
import services from '@/config/services'
import axios from "axios";
const state = {
    user: null,
    status: null,
    error: null
};

function createUser(uid, name) {
    var data = {
        uid: uid,
        name: name,
        admin: false
    };
    axios.post(services.CREATE_USER, data)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.message;
        });
}

const actions = {
    setUser({ commit }, payload) {
        commit('setUser', payload)
    },
    setError({ commit }, payload) {
        commit('setError', payload)
    },
    setStatus({ commit }, payload) {
        commit('setStatus', payload)
    },

    signUpAction({ commit }, payload) {
        commit('setStatus', 'loading')
        var email = payload.username + "@fakemail.ie"
        firebase.auth().createUserWithEmailAndPassword(email, payload.password)
            .then((response) => {
                // alert('success')
                // response will have user
                // user will have uid will be updated to the state
                commit('setUser', response.user)
                commit('setStatus', 'success')
                commit('setError', null)
                // create user in stop DB
                createUser(response.user.uid, payload.username);
                /*firebase
                    .database()
                    .ref("users/" + response.user.uid).set({
                        admin: false
                    });*/
            })
            .catch((error) => {
                commit('setStatus', 'failure')
                commit('setError', error.message)
            })
    },

    signInAction: ({ commit }, payload) => {
        commit('setStatus', 'loading')
        var email = payload.username + "@fakemail.ie"
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION) //with LOCAL will be persisted even when the browser window is closed
            .then(function () {
                return firebase.auth().signInWithEmailAndPassword(email, payload.password)
                    .then((response) => {
                        let uid = response.user.uid;
                        axios.get(services.FIND_USER_BY_NAME + payload.username).then(response => {
                            // create user in stop DB if not found
                            if (response.data === '') {
                                createUser(uid, payload.username);
                            }
                        });
                    })
                    .catch((error) => {
                        commit('setStatus', 'failure')
                        commit('setError', error.message)
                    })

            })
            .catch(function (error) {
                // Handle Errors here.
                commit('setStatus', 'failure')
                commit('setError', error.message)
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
    }
    /* eslint-enable */
};

const getters = {
    status(state) {
        return state.status
    },

    user(state) {
        return state.user
    },

    error(state) {
        return state.error
    }
};

const mutations = {
    setUser(state, payload) {
        state.user = payload
    },

    removeUser(state) {
        state.user = null
    },

    setStatus(state, payload) {
        state.status = payload
    },

    setError(state, payload) {
        state.error = payload
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
