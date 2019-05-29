import * as firebase from 'firebase'


const firebaseConfig = {
	apiKey: "AIzaSyDJXuzP0Ix1-W6h_U_8N2kqMaYl8IXEgsQ",
	authDomain: "instanteach-7e26e.firebaseapp.com",
	databaseURL: "https://instanteach-7e26e.firebaseio.com",
	messagingSenderId: "88536995293",
	projectId: "instanteach-7e26e",
	storageBucket: "instanteach-7e26e.appspot.com"
}

/*
const firebaseConfig = {
	apiKey: "AIzaSyAgsJDZbAchpue10NtOrLvRGARbaa6y_xA",
	appId: "1:183832750286:web:d104ca356a1dc492",
	authDomain: "instanteach-dev.firebaseapp.com",
	databaseURL: "https://instanteach-dev.firebaseio.com",
	messagingSenderId: "183832750286",
  projectId: "instanteach-dev",
  storageBucket: "instanteach-dev.appspot.com"  
};
*/

const firebaseSettings = {
	timestampsInSnapshots: true
}

class Firebase {
	public static init() {
		firebase.initializeApp(firebaseConfig);
		const firestore = firebase.firestore();
		return firestore.settings(firebaseSettings);
	}
}

export default Firebase