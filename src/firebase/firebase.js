// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDZXCuv-JJ3c-cNNnFpF43UqnIK2SJTcdw",
  authDomain: "push-notification-cf089.firebaseapp.com",
  projectId: "push-notification-cf089",
  storageBucket: "push-notification-cf089.appspot.com",
  messagingSenderId: "891082615648",
  appId: "1:891082615648:web:9755bae85a9ee771540c05",
  measurementId: "G-64874S5PZV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
