import * as firebase from 'firebase'

import IDocument from '../interfaces/IDocument'

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

	public static async request(data:any)
	{
		const response = {materialId:"", error:""}
		try {
			const database = firebase.firestore()
			const material = await database.collection('materials').add({
				category: data.category
				// TODO: Fill fields
			})

			response.materialId = material.id
		}
		catch(e) {
			response.error = e.message
		}
		
		return response
	}

	public static async assign(classroomId:string, data:IDocument) {
		const response = {materialId:"", data:{...data, materialId: data.id, classroomId}, error:""}
		try {
			const database = firebase.firestore()
			const material = await database.collection('materials').add({
				classroomId,
				materialId: data.id
			})

			response.materialId = material.id
		}
		catch(e) {
			response.error = e.message
		}

		return response
	}
}

export default MaterialService