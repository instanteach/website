import * as firebase from 'firebase'
import IUser from '../interfaces/IUser'
import UserService from './UserService'

import {destroySession, setSessionData, setUserData} from '../state/creator'
import store from '../state/store'

class AuthenticationService {
	public static session: any | null = null

	public static async login(email: string, password: string)
	{
		try {
			firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
			const auth = await firebase.auth()
			const signIn:any = await auth.signInWithEmailAndPassword(email, password)
			if (signIn.user) {
				const userSynchronized:IUser = await UserService.syncAccountWithProvider(signIn.user)
				AuthenticationService.session = signIn.user
				await this.ss(userSynchronized, signIn.user)
				return true
			}
			return false
		}
		catch (e) {
			return false
		}
	}

	public static async loginWithFacebook()
	{
		const platform = 'facebook'
		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
		try {
			const provider = new firebase.auth.FacebookAuthProvider()
			const signIn:any = await firebase.auth().signInWithPopup(provider)
			if(signIn.user) {
				AuthenticationService.session = signIn.user
				const user:any = await UserService.getByEmail(signIn.user.email)
				if(user) {
					const userSynchronized:IUser = await UserService.syncAccountWithProvider(signIn.user, platform)
					await this.ss(userSynchronized, signIn.user)
				}
				else {
					const newUser:IUser = await UserService.createAccount(signIn.user, platform)
					await this.ss(newUser, signIn.user)
				}
				return true
			}
			return false
		}
		catch (e) {
			return false
		}
	}

	public static async loginWithGoogle()
	{
		const platform = 'google'
		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
		try {
			const provider = new firebase.auth.GoogleAuthProvider()
			const signIn:any = await firebase.auth().signInWithPopup(provider)
			if(signIn.user) {
				AuthenticationService.session = signIn.user
				const user:any = await UserService.getByEmail(signIn.user.email)
				if(user) {
					const userSynchronized:IUser = await UserService.syncAccountWithProvider(signIn.user, platform)
					await this.ss(userSynchronized, signIn.user)
				}
				else {
					const newUser:IUser = await UserService.createAccount(signIn.user, platform)
					await this.ss(newUser, signIn.user)
				}
				return true
			}
			return false
		}
		catch (e) {
			return false
		}
	}

	public static async recoveryPassword(email:string)
	{
		const response = {ok:false, error:""}
		try {
			const auth = firebase.auth()
			await auth.sendPasswordResetEmail(email)
			response.ok = true
		}
		catch(e) {
			response.error = e.message
		}

		return response
	}

	public static listener()
	{
		let session
		// const firebaseSession = firebase.auth().currentUser
		// console.log(firebaseSession)
		firebase.auth().onAuthStateChanged(user => {	
			(async () => {
				if (user) {
					const u:IUser = await UserService.get(user.uid)
					session = {
						emailVerified: user.emailVerified,
						photoURL: user.photoURL,
						refreshToken: user.refreshToken,
						...u,
						uid: user.uid
					}
					await this.ss(u, session)
					AuthenticationService.session = session
				}
				else {
					this.logout()
				}
			})();
		})

		return session
	}

	public static async logout()
	{
		const auth = await firebase.auth()
		await auth.signOut()
		store.dispatch(destroySession())
		localStorage.clear()
		sessionStorage.clear()
		AuthenticationService.session = null
		
		return true
	}

	private static ss(user:IUser, session=null): void
	{	
		const sessionState = store.getState().session
		if(user) {
			store.dispatch(setUserData(user))
			store.dispatch(setSessionData(session))
			localStorage.setItem('user', JSON.stringify(user))
			localStorage.setItem('session', JSON.stringify(session))
		}
		if(session && sessionState === null) {
			store.dispatch(setSessionData(session))
			localStorage.setItem('session', JSON.stringify(session))
		}
	}
}

export default AuthenticationService