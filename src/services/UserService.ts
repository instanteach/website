import * as firebase from 'firebase'
import IUser from '../interfaces/IUser';
import store from '../state/store';

interface IUpdateUser {
	displayName: string
	email: string
	password?: string
	provider?: string
	createnWith?: string
}

class UserService {
	public static async getAllUsers()
	{
		const users:object[] = []
		const database = firebase.firestore()
		const documents = await database.collection('users').get()
		await documents.docs.map((doc:any) => users.push(doc.data()))
		
		return users
	}
	
	public static async get(uid:string): Promise<any>
	{
		const database = firebase.firestore()
		const users = await database.collection('users').doc(uid).get()
		const user = await users.data()
		
		return user
	}
	
	public static async getByEmail(email:string)
	{
		const users:object[] = []
		const database = firebase.firestore()
		const query = await database.collection('users').where('publicEmail', '==', email).get()
		await query.docs.map((doc:any) => users.push(doc.data()))
		
		return users.length>0 ? users[0] : null
	}

	public static async register(data:any)
	{
		const response = {userId:"", error:"", ok: false}
		const auth = firebase.auth()
		try {
			const sign = await auth.createUserWithEmailAndPassword(data.email, data.password)
			if(sign.user) {
				await UserService.createAccount({...sign.user, displayName: data.displayName})
				response.userId = sign.user.uid
				response.ok = true
			}
		}
		catch(e) {
			response.error = e.message
		}
		
		return response
	}

	public static async createAccount(data:any, createnWith:string="none"): Promise<any>
	{
		const database = firebase.firestore()
		const prevUser = await database.collection('users').where('email', '==', data.email).get()
		
		if(prevUser.docs.length > 0) {
			return
		}

		const user = {
			createnWith,
			displayName: data.displayName,
			email: data.email,
			emailVerified: data.emailVerified ? data.emailVerified : false,
			isAdmin: false,
			photoURL: createnWith === "none" ? 'http://www.redfarmoquimicos.mx/wp-content/uploads/2016/10/USER.png' : data.photoURL,
			publicEmail: data.email,
			uid: data.uid,
		}

		await database.collection('users').doc(data.uid).set({
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
			...user,
		})

		return user
	}

	public static async syncAccountWithProvider(data:any, provider:string="none"): Promise<any>
	{
		let response = {};
		const database = firebase.firestore()
		const users = await database.collection('users').where('email', '==', data.email).get()
		
		const userUpdated = {
			displayName: data.displayName,
			emailVerified: data.emailVerified,
			photoURL: data.photoURL,
			provider
		}
		if(users.docs.length > 0) {
			const user = await users.docs[0].data()
			if(provider !== "none") {
				await database.collection('users').doc(user.uid).update({...userUpdated, updatedAt: firebase.firestore.FieldValue.serverTimestamp()})
				response = {...user, ...userUpdated}
			}
			else {
				response = user
			}
		}
		else {
			const newUser = UserService.createAccount(data, provider);
			response = {...newUser, ...userUpdated}
		}

		return response
	}

	public static async update(data:IUpdateUser)
	{
		const storedUser: IUser = store.getState().user
		const response = {user: storedUser, error: "", ok: false}
		response.user = storedUser
		
		try {
			const user = firebase.auth().currentUser

			if(user) {
				const userDB: any = firebase.firestore().collection('users').doc(user.uid)

				if(data.displayName && data.displayName.length > 0) {
					user.updateProfile({
						displayName: data.displayName,
						photoURL: user.photoURL
					})
					userDB.update({
						displayName: data.displayName
					})
					response.user.displayName = data.displayName
				}

				if(data.email && data.email.length > 4) {
					if(storedUser.createnWith === "none") {
						user.updateEmail(data.email)
						userDB.update({
							email: data.email,
							publicEmail: data.email
						})
					}
					else {
						userDB.update({
							publicEmail: data.email
						})
					}
					response.user.email = data.email
				}

				if(data.password && data.password.length > 0) {
					user.updatePassword(data.password)
				}

				response.ok = true
			}
		}
		catch(e) {
			response.error = e
		}

		return response
	}
}

export default UserService