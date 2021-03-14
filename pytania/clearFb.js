const firebase = require("firebase");
const utils = require("./utils");
// Required for side-effects
require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDh1BGdWgL764-ai7SZ29XQYSlxNvmoK3M",
  authDomain: "aplikacja-ca164.firebaseapp.com",
  projectId: "aplikacja-ca164"
  });




var db = firebase.firestore();




utils.deleteAll(db,'categories')

