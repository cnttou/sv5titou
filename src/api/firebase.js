import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCEVtGYAdr8N1LpJfV-L5RQ0rYrmN8kC1o',
    authDomain: 'sv5titou.firebaseapp.com',
    projectId: 'sv5titou',
    storageBucket: 'sv5titou.appspot.com',
    messagingSenderId: '489533321856',
    appId: '1:489533321856:web:223851645bed42d07eac65',
};

firebase.initializeApp(firebaseConfig);


export default firebase;