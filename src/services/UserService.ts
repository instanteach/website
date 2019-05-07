import * as firebase from 'firebase'
// import uid from 'uid'

class UserService {
	public static async getAllUsers()
	{
		const users:object[] = []
		const database = firebase.firestore()
		const documents = await database.collection('users').get()
		await documents.docs.map((doc:any) => users.push(doc.data()))
		
		return users
	}
	
	public static async get(uid:string)
	{
		const database = firebase.firestore()
		const document = await database.collection('users').doc(uid).get()
		const user = await document.data()
		
		return user
	}

	public static async createAccount(data:any)
	{
		const response = {userId:"", error:""}
		const auth = firebase.auth()
		try {
			const sign = await auth.createUserWithEmailAndPassword(data.email, data.password)
			if(sign.user) {
				const database = firebase.firestore()
				await database.collection('users').doc(sign.user.uid).set({
					avatar: 'http://www.redfarmoquimicos.mx/wp-content/uploads/2016/10/USER.png',
					email: data.email,
					isAdmin: false,
					name: data.name,
					uid: sign.user.uid
				})

				response.userId = sign.user.uid
			}
		}
		catch(e) {
			response.error = e.message
		}
		
		return response
	}
}

export default UserService