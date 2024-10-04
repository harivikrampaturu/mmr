// firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAbWQ1PU1DkofzwHfCuC0QbYsziBdM6A_s',
  authDomain: 'mmr-maintenance.firebaseapp.com',
  projectId: 'mmr-maintenance',
  storageBucket: 'mmr-maintenance.appspot.com',
  messagingSenderId: '9194866333',
  appId: '1:9194866333:web:733de2095d5c601767f674',
  measurementId: 'G-H6XVQQDC6B'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
