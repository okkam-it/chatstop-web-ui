import firebase from '@/config/firebase'
const state = {
    user: null,
    status: null,
    error: null
};

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
                    .then(() => {                       
                        

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
