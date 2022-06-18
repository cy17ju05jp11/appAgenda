import firebase from 'firebase/app';
import'firebase/auth';
import 'firebase/database';

let firebaseConfig = {
    apiKey: "AIzaSyBJTbIncD4pYLu_a3DMhv6Pmrx6ST4BhzU",
    authDomain: "apptarefas-2564d.firebaseapp.com",
    databaseURL: "https://apptarefas-2564d-default-rtdb.firebaseio.com",
    projectId: "apptarefas-2564d",
    storageBucket: "apptarefas-2564d.appspot.com",
    messagingSenderId: "53391298946",
    appId: "1:53391298946:web:d0957990e06c54cb407f9b",
    measurementId: "G-ZW9SDE3LJ4"
  };

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
  }

  export default firebase;