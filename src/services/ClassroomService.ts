import * as firebase from 'firebase'
import IClassroom from 'src/interfaces/IClassroom';

class ClassroomService {
	public static async getAll()
	{
		const classrooms:object[] = []
		const database = firebase.firestore()
		const documents = await database.collection('classrooms').get()
		await documents.docs.map((doc:any) => classrooms.push({...doc.data(), id: doc.id}))
		
		return classrooms
	}
	
	public static async get(uid:string)
	{
		const database = firebase.firestore()
		const document = await database.collection('classrooms').doc(uid).get()
		const classroom = await document.data()
		
		return {...classroom, userId: classroom ? classroom.userId : null, id: document.id}
	}

	public static async getByUserId(uid:string)
	{
		const classrooms:IClassroom[] = []
		const database = firebase.firestore()
		const documents = await database.collection('classrooms').where('userId', '==', uid).get()
		await documents.docs.map((document: any) => classrooms.push({...document.data(), id: document.id}))
		
		return classrooms
	}

	public static async getByCurrentUser()
	{
		const currentUser = firebase.auth().currentUser
		return currentUser ? await ClassroomService.getByUserId(currentUser.uid) : []
	}

	public static async create(data:any)
	{
		const response = {classroomId:"", data: {}, error:"", ok: false}
		try {
			const database = firebase.firestore()
			const seed = {
				age: data.age,
				days: data.days,
				level: data.level,
				name: data.name,
				students: data.students,
				thumbnail: data.thumbnail,
				time: data.time,
				userId: data.userId
			}
			const classroom = await database.collection('classrooms').add(seed)

			response.classroomId = classroom.id
			response.ok = true
			response.data = {
				...seed,
				id: classroom.id
			}
		}
		catch(e) {
			console.log(e)
			response.error = e.message
		}
		
		return response
	}

	public static async update(uid:string, data:any)
	{
		const response = {classroomId:"", data: {}, error:"", ok: false}
		try {
			const database = firebase.firestore()
			const seed = {
				age: data.age,
				days: data.days,
				level: data.level,
				name: data.name,
				students: data.students,
				thumbnail: data.thumbnail,
				time: data.time
			}

			const classroom = await database.collection('classrooms').doc(uid)
			classroom.update(seed)

			response.classroomId = uid
			response.ok = true
			response.data = {
				...seed,
				id: uid
			}
		}
		catch(e) {
			response.error = e.message
		}

		return response
	}

	public static async remove(classroomId:string)
	{
		const response = {ok: false, error: ""}
		
		try {
			const currentUser = firebase.auth().currentUser
			const classroom = await ClassroomService.get(classroomId)
			
			if(currentUser && classroom && currentUser.uid === classroom.userId) {
				const database = firebase.firestore()
				const requests = await database.collection('requests').where('classroomId', '==', classroomId).get()
				const materials = await database.collection('materials').where('classroomId', '==', classroomId).get()

				await requests.docs.map(request => {
					(async () => {
						const batch = database.batch()
						batch.delete(request.ref)
						return batch.commit()
					})()
				})
				
				await materials.docs.map(material => {
					(async () => {
						const batch = database.batch()
						batch.delete(material.ref)
						return batch.commit()
					})()
				})

				await database.collection('classrooms').doc(classroomId).delete()

				response.ok = true
			}
			else {
				response.error = "Forbidden. You must be the classroom owner"
			}
		}
		catch(e) {
			response.error = e.message
		}

		return response
	}
}

export default ClassroomService