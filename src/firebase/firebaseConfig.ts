// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBw6bbu4aohUDwabu_ykvdIcyzx-Ihh-1c",
  authDomain: "socialmediaapp-a204b.firebaseapp.com",
  projectId: "socialmediaapp-a204b",
  storageBucket: "socialmediaapp-a204b.appspot.com",
  messagingSenderId: "946840756987",
  appId: "1:946840756987:web:5eee2721892156a94c865e",
  measurementId: "G-BYGQP5D3JJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app; 
//added firebase config file