import axios from 'axios'
import * as firebase from 'firebase'

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
		const classrooms:object[] = []
		const database = firebase.firestore()
		const documents = await database.collection('classrooms').where('userId', '==', uid).get()
		await documents.docs.map(document => classrooms.push({...document.data(), id: document.id}))
		
		return classrooms
	}

	public static async create(data:any)
	{
		const response = {classroomId:"", error:""}
		try {
			const unsplash = await axios.get('https://api.unsplash.com/photos/random?client_id=7f06954a12ef973f0d64c9c3f1fa1bf39d8cebfbdb97dfa436c9bbf83badb903&orientation=landscape')
			const thumbnail = unsplash.data.urls.thumb
			const database = firebase.firestore()
			const classroom = await database.collection('classrooms').add({
				age: data.age,
				grammarSkill: 0,
				name: data.name,
				readingSkill: 0,
				students: data.students,
				thumbnail,
				userId: data.userId,
				vocabularySkill: 0,
				writingSkill: 0,			
			})

			response.classroomId = classroom.id
		}
		catch(e) {
			response.error = e.message
		}
		
		return response
	}
}

export default ClassroomService