import * as firebase from 'firebase'

class Firebase {
    public static init() {
        return firebase.initializeApp({
            apiKey: "AIzaSyDJXuzP0Ix1-W6h_U_8N2kqMaYl8IXEgsQ",
            authDomain: "instanteach-7e26e.firebaseapp.com",
            databaseURL: "https://instanteach-7e26e.firebaseio.com",
            messagingSenderId: "88536995293",
            projectId: "instanteach-7e26e",
            storageBucket: "instanteach-7e26e.appspot.com"
        });
    }
}

export default Firebase