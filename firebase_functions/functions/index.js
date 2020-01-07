const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase)
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/*exports.addUserToDb = functions.auth.user().onCreate((user, context) => {
    console.log("Added new user: " + user.uid)
    console.log(JSON.stringify(context))
    return admin.database().ref("/users").child(user.uid).set({
        admin: false,
        username: user.email
    })
})*/

exports.removeUserFromDb = functions.auth.user().onDelete((user) => {
    /*var ref = admin.database().ref("/users")
    ref.once("value", function(snapshot) {
        if (snapshot.hasChild(user.uid)) {
            console.log("Remove user data: " + user.uid)
            return ref.child(user.uid).remove()
        }
        return 0;
    });*/

    var ref = admin.database().ref("/users/" + user.uid);
    // console.log("Remove user data: " + user.uid)
    return ref.remove()
    /* .then(function () {
         console.log("Remove user data: " + user.uid)
         return 0;
     })
     .catch(function (error) {
         console.log("Remove " + user.uid + " failed: " + error.message)
         return 0;
     });*/
})

/*exports.removeUserFromAuth = functions.database.ref('/users/{userid}')
    .onWrite((change, context) => {
        // Only edit data when it is first created.
        
        // Exit when the data is deleted.
        if (!change.after.exists()) {
            console.log("Deleted user: " + context.params.userid)
            return admin.auth().deleteUser(context.params.userid);
        }
        return null;
    });*/


/*exports.removeUserFromAuth = functions.database.ref('/users/{userid}')
    .onDelete((snap, context) => {
        //if (snap) {
            // admin.auth().deleteUser(context.params.userid);
            console.log("Deleted user: " + context.params.userid)
            console.log(JSON.stringify(snap))
        //}
        //return 0;
    });*/



exports.removeUserFromAuth = functions.database.ref('/users/{userid}')
    .onDelete((snap, context) => {
        //console.log("Deleted user: " + context.params.userid)
        return admin.auth().deleteUser(context.params.userid);
    });

