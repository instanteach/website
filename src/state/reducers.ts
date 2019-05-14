import ACTIONS from './actions'

import IClassroom from 'src/interfaces/IClassroom'
import IDocument from 'src/interfaces/IDocument';
import IMaterial from 'src/interfaces/IMaterial';
import IUser from 'src/interfaces/IUser';

interface IAction {
	type:string
	payload:any
}

const initUser = {
	displayName: "",
	email: "",
	emailVerified: false,
	isAdmin: false,
	photoURL: "",
	uid: ""
}

export default {
	classrooms: (state:IClassroom[]=[], action:IAction) => {
		switch(action.type) {
			case ACTIONS.SET_CLASSROOMS:
				return action.payload
			case ACTIONS.ADD_CLASSROOM:
				return state.concat(action.payload)
			case ACTIONS.EDIT_CLASSROOM:
				return state.filter(classroom => classroom.id !== action.payload.id).concat(action.payload.data)
			case ACTIONS.REMOVE_CLASSROOM:
				return state.filter(classroom => classroom.id !== action.payload)
			default:
				return state
		}
	},
	documents: (state:IDocument[]=[], action:IAction) => {
		switch(action.type) {
			case ACTIONS.SET_DOCUMENTS:
				return action.payload
			case ACTIONS.ADD_DOCUMENT:
				return action.payload
			default:
				return state
		}
	},
	materials: (state:IMaterial[]=[], action:IAction) => {
		switch(action.type) {
			case ACTIONS.SET_MATERIALS:
				return action.payload
			case ACTIONS.ADD_NEW_MATERIAL:
				return state.concat(action.payload)
			default:
				return state
		}
	},
	session: (state:any =localStorage.getItem('session') ? JSON.parse(localStorage.session) : null, action:IAction) => {
		switch(action.type) {
			case ACTIONS.SET_SESSION:
				return action.payload
			default:
				return state
		}
	},
	user: (state:IUser=localStorage.user ? JSON.parse(localStorage.user) : initUser, action:IAction) => {
		switch(action.type) {
			case ACTIONS.SET_USER:
				return action.payload
			default:
				return state
		}
	},
	users: (state:IUser[]=[], action:IAction) => {
		switch(action.type) {
			case ACTIONS.SET_USERS:
				return action.payload
			default:
				return state
		}
	}
}