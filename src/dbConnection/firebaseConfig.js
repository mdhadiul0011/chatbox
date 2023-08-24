// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrJMlAW06EqeTXBzTFAJpZfjr1A1fZKeo",
  authDomain: "chatbox-fb622.firebaseapp.com",
  projectId: "chatbox-fb622",
  storageBucket: "chatbox-fb622.appspot.com",
  messagingSenderId: "465312262225",
  appId: "1:465312262225:web:e197765e09000c6de4f070"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;