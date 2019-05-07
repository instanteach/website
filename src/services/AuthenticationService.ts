import * as firebase from 'firebase'
import UserService from './UserService';

class AuthenticationService {
	public static session: any | null = null

	public static async login(email: string, password: string) {
		try {
			firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
			const auth = await firebase.auth()
			const signIn = await auth.signInWithEmailAndPassword(email, password)
			if (signIn.user) {
				AuthenticationService.session = signIn.user
				return true
			}
			else {
				return false
			}
		}
		catch (e) {
			return false
		}
	}

	public static listener() {
		firebase.auth().onAuthStateChanged(user => {	
			(async () => {
				if (user) {
					const u = await UserService.get(user.uid)
					AuthenticationService.session = {
						...user,
						...u
					}
				}
				else {
					AuthenticationService.session = null
				}
			})();
		})
	}

	public static async logout() {
		const auth = await firebase.auth()
		await auth.signOut()
		AuthenticationService.session = null
		
		return AuthenticationService.session
	}
}

export default AuthenticationService