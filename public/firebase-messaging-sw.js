// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

const firebaseConfig = {
    apiKey: "AIzaSyDZXCuv-JJ3c-cNNnFpF43UqnIK2SJTcdw",
    authDomain: "push-notification-cf089.firebaseapp.com",
    projectId: "push-notification-cf089",
    storageBucket: "push-notification-cf089.appspot.com",
    messagingSenderId: "891082615648",
    appId: "1:891082615648:web:9755bae85a9ee771540c05",
    measurementId: "G-64874S5PZV"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    };

    new Notification(notificationTitle, notificationOptions);
});
