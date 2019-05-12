import * as firebase from 'firebase'
import IUser from '../interfaces/IUser'
import UserService from './UserService'

import {setUserData} from '../state/creator'
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
				await this.ss(userSynchronized)
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
					await this.ss(userSynchronized)
				}
				else {
					const newUser:IUser = await UserService.createAccount(signIn.user, platform)
					await this.ss(newUser)
				}
				return true
			}
			return false
		}
		catch (e) {
			console.log(e)
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
					console.log(user)
					const userSynchronized:IUser = await UserService.syncAccountWithProvider(signIn.user, platform)
					await this.ss(userSynchronized)
				}
				else {
					const newUser:IUser = await UserService.createAccount(signIn.user, platform)
					await this.ss(newUser)
				}
				return true
			}
			return false
		}
		catch (e) {
			console.log(e)
			return false
		}
	}

	public static listener()
	{
		firebase.auth().onAuthStateChanged(user => {	
			(async () => {
				if (user) {
					const u:IUser = await UserService.get(user.uid)
					await this.ss(u)
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

		return AuthenticationService.session
	}

	public static async logout()
	{
		const auth = await firebase.auth()
		await auth.signOut()
		localStorage.clear()
		sessionStorage.clear()
		AuthenticationService.session = null
		
		return true
	}

	private static ss(user:IUser): void
	{	
		if(user) {
			store.dispatch(setUserData(user))
			localStorage.setItem('user', JSON.stringify(user))
		}
	}
}

export default AuthenticationService