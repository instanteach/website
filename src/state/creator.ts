import ACTIONS from './actions'

import IClassroom from '../interfaces/IClassroom';
import ICollection from '../interfaces/ICollection';
import IMaterial from '../interfaces/IMaterial';
import IUser from '../interfaces/IUser';

export const setUserData = (payload:IUser) => ({
	payload,
	type: ACTIONS.SET_USER
})

export const setUsersList = (payload:IUser[]) => ({
	payload,
	type: ACTIONS.SET_USERS
})

export const setClassrooms = (payload:IClassroom[]) => ({
	payload,
	type: ACTIONS.SET_CLASSROOMS
})

export const addClassroom = (payload:IClassroom) => ({
	payload,
	type: ACTIONS.ADD_CLASSROOM
})

export const editClassroom = (id:string, data:IClassroom) => ({
	payload: {
		data,
		id
	},
	type: ACTIONS.ADD_CLASSROOM
})

export const removeClassroom = (payload:string) => ({
	payload,
	type: ACTIONS.ADD_CLASSROOM
})

export const setDocuments = (payload:ICollection[]) => ({
	payload,
	type: ACTIONS.SET_DOCUMENTS
})

export const setMaterials = (payload:IMaterial[]) => ({
	payload,
	type: ACTIONS.SET_MATERIALS
})

export const addNewMaterial = (payload:IMaterial) => ({
	payload,
	type: ACTIONS.ADD_NEW_MATERIAL
})