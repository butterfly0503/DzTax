const firebase = require("firebase");
const cats = require("./categoryList");

require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyDh1BGdWgL764-ai7SZ29XQYSlxNvmoK3M",
    authDomain: "aplikacja-ca164.firebaseapp.com",
    projectId: "aplikacja-ca164"
  });



var db = firebase.firestore();




let categories = cats.categories

categories.forEach(function(obj) {
    db.collection("categories").add({
        id: obj.id,
        name: obj.name,
        questions: obj.quoestions
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
});