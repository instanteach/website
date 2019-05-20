import * as firebase from 'firebase'

import IDocument from '../interfaces/IDocument'
import ClassroomService from './ClassroomService';

const orderByCreatedAtDesc = (a, b) => (
	b.data().createdAt.seconds - a.data().createdAt.seconds
)
const orderByDateAsc = (a, b) => (
	a.date - b.date
)

class MaterialService {
	public static async getAll()
	{
		const materials:object[] = []
		const database = firebase.firestore()
		const documents = await database.collection('materials').get()
		await documents.docs.map((doc:any) => materials.push({...doc.data(), id: doc.id}))
		
		return materials
	}
	
	public static async get(uid:string)
	{
		const database = firebase.firestore()
		const document = await database.collection('materials').doc(uid).get()
		const material = await document.data()
		
		return {...material, id: document.id}
	}

	public static async getByClassroomId(uid:string)
	{
		const materials:object[] = []
		const database = firebase.firestore()
		const documents = await database.collection('materials').where('classroomId', '==', uid).get()
		await documents.docs.map(document => materials.push({...document.data(), id: document.id}))
		
		return materials
	}

	public static async analytics(classroomId:string)
	{
		const dataset:object[] = []
		const response = {classroomId, data:dataset, ok:false, error:""}
		try {
			const database = firebase.firestore()
			const requests:any = await database.collection('requests').where('classroomId', '==', classroomId).get()

			await requests.docs.sort(orderByCreatedAtDesc).map((request, index) => {
				if(index <= 9) {
					const {createdAt, grammar, listening, reading, speaking, vocabulary, writing} = request.data()
					const general = Number((grammar + listening + reading + speaking + vocabulary + writing) / 6)
					const timestamp = Number(createdAt.seconds * 1000)
					const date = new Date(timestamp)
					const day = date.getDate()
					const month = date.getMonth() + 1
					const year = date.getFullYear()

					dataset.push({
						createdAt: `${day}/${month}/${year}`,
						date,
						general,
						grammar,
						listening,
						reading,
						speaking,
						vocabulary,
						writing
					})

					if(dataset.length >= 3) {
						response.data = dataset.sort(orderByDateAsc)
						response.ok = true
					}
					else if(dataset.length > 0 && dataset.length < 3) {
						response.error = 'There are data, but is insufficient to analyze them'
					}
					else {
						response.error = 'There isn\'t data'
					}
				}
			})
		}
		catch(e) {
			response.error = e.message
		}

		return response
	}

	public static async request(data:any)
	{
		const response = {requestId:"", error:"", ok: false}
		try {
			const currentUser: any = firebase.auth().currentUser
			if(currentUser) {
				const classroom: any = await ClassroomService.get(data.classroom)
				const database = firebase.firestore()
				const req = await database.collection('requests').add({
					age: classroom.age,
					classroomId: classroom.id,
					createdAt: firebase.firestore.FieldValue.serverTimestamp(),
					grammar: Number(data.grammar),
					level: classroom.level,
					listening: Number(data.listening),
					reading: Number(data.reading),
					speaking: Number(data.speaking),
					students: classroom.students,
					time: classroom.time,
					topic: data.topic,
					type: data.type,
					userId: currentUser.uid,
					vocabulary: Number(data.vocabulary),
					writing: Number(data.writing)
				})

				response.requestId = req.id
				response.ok = true
			}
			else {
				response.error = "Forbidden. You have to sign in."
			}
		}
		catch(e) {
			response.error = "Ups! Has occurred an error 😢"
		}
		
		return response
	}

	public static async submitOnGoogleSpreadsheet(data:any)
	{
		const currentUser: any = firebase.auth().currentUser
		if(currentUser) {
			const classroom: any = await ClassroomService.get(data.classroom)
			const googleSpreadsheetURI = 'https://script.google.com/macros/s/AKfycbykSlpEasveRRzvEzQBUuwmaUT2ScwBqaPW9ktw2RXOwzXY1x0v/exec'
			const formContent = new FormData()
			formContent.append('classroom', classroom.name)
			formContent.append('user', currentUser.displayName)
			formContent.append('email', currentUser.email)
			formContent.append('students', classroom.students)
			formContent.append('age', classroom.age)
			formContent.append('level', classroom.level)
			formContent.append('time', classroom.time)
			formContent.append('days', classroom.days)
			formContent.append('type', data.type)
			formContent.append('topic', data.topic)
			formContent.append('speaking', data.speaking)
			formContent.append('writing', data.writing)
			formContent.append('listening', data.listening)
			formContent.append('reading', data.reading)
			formContent.append('grammar', data.grammar)
			formContent.append('vocabulary', data.vocabulary)
			formContent.append('url', `https://instanteach-dev.web.app/classroom/${classroom.id}`)

			const response = await fetch(googleSpreadsheetURI, {body: formContent, method: 'POST'})

			if(response.ok) {
				return true
			}

			return false
		}

		return false
	}

	public static async assign(classroomId:string, userId:string, data:IDocument) {
		const response = {materialId:"", data:{classroomId, document: data, isNew: true, materialId: data.id, userId}, error:""}
		try {
			const database = firebase.firestore()
			const material = await database.collection('materials').add({
				classroomId,
				isNew: true,
				materialId: data.id,
				userId
			})

			response.materialId = material.id
		}
		catch(e) {
			response.error = e.message
		}

		return response
	}

	public static async read(materialId)
	{
		const response = {materialId:"", error:"", ok: false}
		try {
			const database = firebase.firestore()
			const material = await database.collection('materials').doc(materialId)
			if(material) {
				material.update({
					isNew: false
				})
				response.materialId = materialId
				response.ok = true
			}
		}
		catch (e) {
			response.error = e
		}

		return response
	}
}

export default MaterialService