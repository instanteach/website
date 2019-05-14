import IDocument from "./IDocument";

export default interface IMaterial {
	id:string
	classroomId:string
	materialId:string
	isActive:boolean
	isNew:boolean
	userId: string
	document?: IDocument
}