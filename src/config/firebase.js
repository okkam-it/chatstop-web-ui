import * as firebase from 'firebase';
import store from '../store'
import router from '../router'

const config = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    // storageBucket: "YOUR_STORAGE_BUCKET"
  }; 

  firebase.initializeApp(config);

  firebase.auth().onAuthStateChanged(user => {   
    //store.dispatch("setUser", user);
    store.dispatch("setSelectedBot", null);
    if (user !== null && user !== undefined) {
      // router.push('/chat')
      firebase.database().ref('users').once('value', function (snapshot) {
        if (snapshot.hasChild(user.uid)) {
          if(snapshot.child(user.uid).val().admin == true) {
            user["admin"] = true            
          }          
          store.dispatch("setUser", user);
          store.dispatch('setStatus', 'success')
          store.dispatch('setError', null) 

          router.push({ name: 'ChatRoom' })
          
        } else {
          firebase
            .database()
            .ref("users/" + user.uid).set({
              admin: false,
              username: user.email 
            }, function (error) {
              if (error) {
                // The write failed...
                alert("Errore")
              } else {
                store.dispatch("setUser", user);
                store.dispatch('setStatus', 'success')
                store.dispatch('setError', null)

                router.push({ name: 'ChatRoom' })
               
    
              }
            });
          }
          });
          
    } else {
      // router.push('/login')
      if(router.currentRoute.matched.some(({ name }) => name !== 'Login')) {
        router.push({ name: 'Login' }) 
      }
      
    }   
  });

  export default firebase;