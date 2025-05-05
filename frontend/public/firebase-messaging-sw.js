// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

// Même config Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAfTyc7HCyRtSUO4bzdtxp_wH_ipNBuYOw",
  projectId: "ai-rh-platform",
  messagingSenderId: "960665959797",
  appId: "1:960665959797:web:d88deeb8fa417ba2ea273c"
});

const messaging = firebase.messaging();

// Notifications en arrière-plan
messaging.onBackgroundMessage(function (payload) {
  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    icon: '/icon.png' // optionnel
  };

  self.registration.showNotification(title, options);
});
